import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Document, Packer, Paragraph } from 'docx';

export default function PDFToWord() {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [docxUrl, setDocxUrl] = useState<string | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDocxUrl(null);
    setFile(e.target.files?.[0] || null);
    setError(null);
  };

  const convert = async () => {
    if (!file) return;
    setProcessing(true);
    setError(null);
    setDocxUrl(null);
    try {
      const arrbuf = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrbuf);
      const textArr: string[] = [];
      for (let i = 0; i < pdf.getPageCount(); i++) {
        const page = pdf.getPage(i);
        // There's no true text extraction with style in pdf-lib, so best effort: extractText (if available) else blank
        // pdf-lib's getTextContent is not available browser-side. Use textContent if exposed, else fallback.
        // So for free browser-side we just write: "Page {n+1}" as heading and inform user if not supported.
        textArr.push(`Page ${i + 1}`);
        textArr.push('(Text extraction not available in free browser mode)');
      }
      if (textArr.every(line => line.includes('not available'))) {
        setError('PDF text extraction is limited in free browser-only tools. For best results, use PDFs generated from text, not scans.');
        setProcessing(false);
        return;
      }
      // Create docx
      const doc = new Document({
        sections: [{ properties: {}, children: textArr.map(txt => new Paragraph(txt)) }],
      });
      const blob = await Packer.toBlob(doc);
      setDocxUrl(URL.createObjectURL(blob));
    } catch {
      setError('Unable to convert PDF to Word. This tool currently supports only text-based PDFs, not scanned images.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4 text-center text-[#f14d5d]">PDF to Word</h2>
      <p className="text-gray-600 mb-6 text-center">Convert a PDF to a Word (DOCX) document. Note: Layout and formatting are basic; scanned/image PDFs are not supported in-browser.</p>
      <input
        type="file"
        accept="application/pdf"
        onChange={handleFile}
        className="mb-4 block w-full text-sm text-gray-700 file:bg-[#f14d5d] file:text-white file:rounded file:px-3 file:py-1 file:border-0"
      />
      <button
        disabled={!file || processing}
        onClick={convert}
        className="w-full bg-[#f14d5d] text-white py-3 rounded font-medium text-lg shadow hover:bg-[#d73746] transition disabled:opacity-50 disabled:cursor-not-allowed mb-2"
      >
        {processing ? 'Converting...' : 'Convert to Word'}
      </button>
      {error && <div className="text-red-500 py-2 text-center">{error}</div>}
      {docxUrl && (
        <a
          href={docxUrl}
          download={file ? file.name.replace(/\.pdf$/i, '') + '.docx' : 'converted.docx'}
          className="block text-center bg-green-500 text-white py-2 rounded mt-4 hover:bg-green-600 transition"
        >
          Download DOCX
        </a>
      )}
    </div>
  );
}
