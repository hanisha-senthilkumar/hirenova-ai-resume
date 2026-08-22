import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

/**
 * Downloads a clean, professional PDF report of the match analysis.
 */
export const downloadPdfReport = async (elementId = 'match-report-container', filename = 'HireNova_Match_Report.pdf') => {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Report container element not found.');
  }

  try {
    // Capture report container with high resolution scaling
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pdfWidth - 20; // 10mm margins
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 10;

    // Add first page
    pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;

    // Add extra pages if report is long
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    pdf.save(filename);
    return true;
  } catch (err) {
    console.error('PDF export error:', err);
    throw new Error('Unable to generate the report PDF. Please try again.');
  }
};

/**
 * Triggers native browser print dialog
 */
export const printReport = () => {
  window.print();
};
