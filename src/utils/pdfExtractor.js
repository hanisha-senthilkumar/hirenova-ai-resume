import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.entry?url';

// Configure worker using local Vite entry with CDN fallback
try {
  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker || `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
} catch (err) {
  console.warn('Vite PDF worker fallback enabled');
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
}

/**
 * Format bytes to human readable string (KB / MB)
 */
export const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

/**
 * Multi-pass raw stream decoder fallback for PDFs with custom font encoding or compressed streams
 */
const extractRawPdfTextFallback = (arrayBuffer) => {
  try {
    const decoder = new TextDecoder('latin1');
    const rawStr = decoder.decode(arrayBuffer);
    
    const textParts = [];

    // Pass 1: Extract literal text strings inside PDF text blocks (Tj and TJ operators)
    const tjRegex = /\(([^()]{2,})\)\s*(?:Tj|TJ|\/)/g;
    let match;
    while ((match = tjRegex.exec(rawStr)) !== null) {
      const textChunk = match[1].replace(/\\([0-9]{3}|[()\\\/])/g, '$1').trim();
      if (textChunk.length > 1 && /[a-zA-Z0-9]/.test(textChunk)) {
        textParts.push(textChunk);
      }
    }

    // Pass 2: If Pass 1 yielded little text, scan for readable ASCII character sequences
    if (textParts.length < 5) {
      const asciiMatches = rawStr.match(/[A-Za-z0-9\s.,@+#\-\/():]{4,}/g) || [];
      const cleanMatches = asciiMatches
        .map((s) => s.trim())
        .filter((s) => s.length >= 4 && /[a-zA-Z]/.test(s) && !s.startsWith('/Font') && !s.startsWith('/Type'));

      if (cleanMatches.length > 0) {
        textParts.push(...cleanMatches);
      }
    }
    
    if (textParts.length > 0) {
      return textParts.join(' ').replace(/\s+/g, ' ').trim();
    }
  } catch (e) {
    console.error('Fallback PDF parser error:', e);
  }
  return '';
};

/**
 * Extracts real text from PDF or TXT resume files
 */
export const extractResumeText = async (file, onProgress) => {
  if (!file) {
    throw new Error('Please select a file to upload.');
  }

  // 10MB file size limit
  const MAX_SIZE = 10 * 1024 * 1024;
  if (file.size > MAX_SIZE) {
    throw new Error('File size is too large. Please upload a smaller resume (max 10MB).');
  }

  const fileName = file.name.toLowerCase();
  const isPdf = fileName.endsWith('.pdf') || file.type === 'application/pdf';
  const isTxt =
    fileName.endsWith('.txt') ||
    fileName.endsWith('.text') ||
    fileName.endsWith('.md') ||
    fileName.endsWith('.rtf') ||
    file.type.startsWith('text/') ||
    file.type === '' ||
    file.type === 'application/octet-stream';

  if (!isPdf && !isTxt) {
    throw new Error('Please upload a PDF or TXT resume.');
  }

  // Handle TXT File
  if (isTxt && !isPdf) {
    onProgress?.('Reading text file...');
    try {
      let text = '';
      if (typeof file.text === 'function') {
        text = await file.text();
      } else {
        text = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.onerror = (e) => reject(e);
          reader.readAsText(file);
        });
      }

      const cleanText = text.replace(/\r\n/g, '\n').replace(/[ \t]+/g, ' ').trim();

      if (!cleanText || cleanText.length === 0) {
        throw new Error('This file appears to be empty.');
      }

      return {
        text: cleanText,
        numPages: 1,
        charCount: cleanText.length,
        fileType: 'TXT',
        fileName: file.name,
        fileSize: file.size
      };
    } catch (err) {
      if (err.message.includes('empty')) throw err;
      throw new Error("We couldn't read this text file. Please try another file.");
    }
  }

  // Handle PDF File
  if (isPdf) {
    onProgress?.('Reading your resume...');
    try {
      const arrayBuffer = await file.arrayBuffer();

      if (!arrayBuffer || arrayBuffer.byteLength === 0) {
        throw new Error('This file appears to be empty.');
      }

      onProgress?.('Extracting text...');

      let extractedText = '';
      let pageCount = 1;

      try {
        // Standard PDF.js document loader without restrictive font disabling
        const loadingTask = pdfjsLib.getDocument({
          data: arrayBuffer,
          cMapUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/cmaps/',
          cMapPacked: true
        });

        const pdfDoc = await loadingTask.promise;
        pageCount = pdfDoc.numPages;

        for (let i = 1; i <= pdfDoc.numPages; i++) {
          const page = await pdfDoc.getPage(i);
          const textContent = await page.getTextContent({ normalizeWhitespace: true });
          const pageStrings = textContent.items
            .map((item) => item.str || item.chars || '')
            .filter(Boolean);
          extractedText += pageStrings.join(' ') + '\n';
        }
      } catch (pdfjsErr) {
        console.warn('PDF.js standard extraction warning, attempting fallback decoder:', pdfjsErr);
      }

      // If PDF.js produced empty/minimal text, run multi-pass stream fallback
      let cleanText = extractedText
        .replace(/\r\n/g, '\n')
        .replace(/[ \t]+/g, ' ')
        .replace(/\n\s*\n+/g, '\n\n')
        .trim();

      if (!cleanText || cleanText.length < 5) {
        const fallbackText = extractRawPdfTextFallback(arrayBuffer);
        if (fallbackText && fallbackText.length > 0) {
          cleanText = fallbackText;
        }
      }

      if (!cleanText || cleanText.length === 0) {
        throw new Error('This PDF does not contain selectable text. Please upload a text-based PDF or TXT resume.');
      }

      onProgress?.('Resume ready');

      return {
        text: cleanText,
        numPages: pageCount,
        charCount: cleanText.length,
        fileType: 'PDF',
        fileName: file.name,
        fileSize: file.size
      };
    } catch (err) {
      console.error('PDF Extraction error:', err);
      if (
        err.message.includes('selectable text') ||
        err.message.includes('empty') ||
        err.message.includes('upload a PDF')
      ) {
        throw err;
      }
      throw new Error("We couldn't extract readable text from this PDF. Try uploading a text-based PDF or TXT resume.");
    }
  }
};


