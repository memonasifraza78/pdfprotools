import React, { useState } from 'react';
import mammoth from 'mammoth';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export default function WordToPDF() {
  const [file, setFile] = useState<File|null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string|null>(null);
  const [pdfUrl, setPdfUrl] = useState<string|null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPdfUrl(null);
    setError(null);
    setFile(e.target.files?.[0] || null);
  };

  const convert = async () => {
    if (!file) return;
    setProcessing(true);
    setError(null);
    setPdfUrl(null);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const { value: html } = await mammoth.convertToHtml({ arrayBuffer });
      // Render simple HTML to PDF: strip tags, newlines to force plain multiline text PDF
      const doc = await PDFDocument.create();
      const page = doc.addPage([595, 842]);
      const font = await doc.embedFont(StandardFonts.Helvetica);
      const lines = html.replace(/<[^>]+>/g, '').replace(/\r/g, '').split(/\n|<br\s*\/?>(?![^<]*<)/i);
      let y = 800;
      for (const line of lines) {
        if (y < 60) break; // single page only, for now
        page.drawText(line.trim(), {
          x: 40,
          y,
          size: 12,
          font,
          color: rgb(0,0,0)
        });
        y -= 20;
      }
      const pdfBytes = await doc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setPdfUrl(URL.createObjectURL(blob));
    } catch {
      setError('Unable to convert DOCX to PDF. Only .docx files with simple formatting supported.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4 text-center text-[#f14d5d]">Word to PDF</h2>
      <p className="text-gray-600 mb-6 text-center">Convert your DOCX files into PDFs with a single click. Supports most simple documents. 100% browser-based and private.</p>
      <input
        type="file"
        accept=".docx"
        onChange={handleFile}
        className="mb-4 block w-full text-sm text-gray-700 file:bg-[#f14d5d] file:text-white file:rounded file:px-3 file:py-1 file:border-0"
      />
      <button
        disabled={!file || processing}
        onClick={convert}
        className="w-full bg-[#f14d5d] text-white py-3 rounded font-medium text-lg shadow hover:bg-[#d73746] transition disabled:opacity-50 disabled:cursor-not-allowed mb-2"
      >
        {processing ? 'Converting...' : 'Convert to PDF'}
      </button>
      {error && <div className="text-red-500 py-2 text-center">{error}</div>}
      {pdfUrl && (
        <a
          href={pdfUrl}
          download={file ? file.name.replace(/\.docx$/i, '') + '.pdf' : 'converted.pdf'}
          className="block text-center bg-green-500 text-white py-2 rounded mt-4 hover:bg-green-600 transition"
        >
          Download PDF
        </a>
      )}
    </div>
  );
}
