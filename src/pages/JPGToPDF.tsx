import React, { useState } from 'react';
import { PDFDocument, rgb } from 'pdf-lib';

export default function JPGToPDF() {
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [pdfUrl, setPdfUrl] = useState<string|null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string|null>(null);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputFiles = Array.from(e.target.files || []);
    setFiles(inputFiles);
    setPreviewUrls(inputFiles.map(f => URL.createObjectURL(f)));
    setPdfUrl(null);
    setError(null);
  };

  const createPDF = async () => {
    if (!files.length) return;
    setProcessing(true);
    setPdfUrl(null);
    setError(null);
    try {
      const doc = await PDFDocument.create();
      for (const imgFile of files) {
        const imgData = await imgFile.arrayBuffer();
        let imgEmbed;
        if (imgFile.type === 'image/png') {
          imgEmbed = await doc.embedPng(imgData);
        } else {
          imgEmbed = await doc.embedJpg(imgData);
        }
        const dims = imgEmbed.scale(1);
        const page = doc.addPage([dims.width, dims.height]);
        page.drawImage(imgEmbed, {
          x: 0,
          y: 0,
          width: dims.width,
          height: dims.height
        });
      }
      const bytes = await doc.save();
      const blob = new Blob([bytes], { type: 'application/pdf' });
      setPdfUrl(URL.createObjectURL(blob));
    } catch {
      setError('Could not create PDF. Ensure all files are valid JPG or PNG.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4 text-center text-[#f14d5d]">JPG to PDF</h2>
      <p className="text-gray-600 mb-6 text-center">Upload your images (JPG, PNG), merge them as pages of a single PDF. Fully browser-based, privacy guaranteed.</p>
      <input
        type="file"
        multiple
        accept="image/jpeg, image/png"
        onChange={handleFiles}
        className="mb-4 block w-full text-sm text-gray-700 file:bg-[#f14d5d] file:text-white file:rounded file:px-3 file:py-1 file:border-0"
      />
      {previewUrls.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4 justify-center">
          {previewUrls.map((src, idx) => (
            <img src={src} key={idx} alt={`jpg-preview-${idx}`} className="rounded shadow object-contain" style={{width:60, height:60}} />
          ))}
        </div>
      )}
      <button
        disabled={!files.length || processing}
        onClick={createPDF}
        className="w-full bg-[#f14d5d] text-white py-3 rounded font-medium text-lg shadow hover:bg-[#d73746] transition disabled:opacity-50 disabled:cursor-not-allowed mb-2"
      >
        {processing ? 'Creating PDF...' : 'Convert to PDF'}
      </button>
      {error && <div className="text-red-500 py-2 text-center">{error}</div>}
      {pdfUrl && (
        <a
          href={pdfUrl}
          download="images.pdf"
          className="block text-center bg-green-500 text-white py-2 rounded mt-4 hover:bg-green-600 transition"
        >
          Download PDF
        </a>
      )}
    </div>
  );
}
