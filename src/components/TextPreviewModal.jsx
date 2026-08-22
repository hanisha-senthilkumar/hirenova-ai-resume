import React, { useState } from 'react';
import { X, Copy, Check, FileText } from 'lucide-react';
import './TextPreviewModal.css';

const TextPreviewModal = ({ isOpen, onClose, text, fileName }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    if (text) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="preview-modal-overlay animate-fade-in" onClick={onClose}>
      <div className="preview-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="preview-modal-header">
          <div className="preview-title-group">
            <div className="preview-icon-wrapper">
              <FileText size={20} />
            </div>
            <div>
              <h3 className="preview-modal-title">Extracted Resume Text</h3>
              <p className="preview-modal-sub">{fileName || 'Uploaded Resume'}</p>
            </div>
          </div>
          <button className="preview-close-btn" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <div className="preview-modal-body">
          <pre className="preview-text-content">{text}</pre>
        </div>

        <div className="preview-modal-footer">
          <button
            className={`btn ${copied ? 'btn-copied' : 'btn-secondary'} btn-copy`}
            onClick={handleCopy}
          >
            {copied ? (
              <>
                <Check size={16} />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy size={16} />
                <span>Copy Text</span>
              </>
            )}
          </button>

          <button className="btn btn-primary btn-close-modal" onClick={onClose}>
            <span>Close</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TextPreviewModal;
