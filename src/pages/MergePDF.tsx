import type React from 'react';
import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';

export default function MergePDF() {
  const [files, setFiles] = useState<File[]>([]);
  const [merging, setMerging] = useState(false);
  const [error, setError] = useState<string|null>(null);
  const [mergedUrl, setMergedUrl] = useState<string|null>(null);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
      setMergedUrl(null);
      setError(null);
    }
  };

  const mergePDFs = async () => {
    setMerging(true);
    setError(null);
    setMergedUrl(null);
    try {
      const mergedPdf = await PDFDocument.create();
      for (const file of files) {
        const arr = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arr);
        const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        for (const page of pages) {
          mergedPdf.addPage(page);
        }
      }
      const pdfBytes = await mergedPdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setMergedUrl(URL.createObjectURL(blob));
    } catch (e) {
      setError('Could not merge PDF files. Please ensure all files are valid PDFs.');
    } finally {
      setMerging(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4 text-center text-[#f14d5d]">Merge PDF</h2>
      <p className="text-gray-600 mb-6 text-center">Select two or more PDF files and instantly merge them into a single PDF. 100% free and processed in your browser!</p>
      <input
        type="file"
        multiple
        accept="application/pdf"
        onChange={handleFiles}
        className="mb-4 block w-full text-sm text-gray-700 file:bg-[#f14d5d] file:text-white file:rounded file:px-3 file:py-1 file:border-0"
      />
      {files.length > 0 && (
        <div className="mb-4">
          <p className="font-semibold mb-2">Files:</p>
          <ul className="text-gray-700 text-sm list-disc ml-5">
            {files.map(f => (
              <li key={f.name}>{f.name}</li>
            ))}
          </ul>
        </div>
      )}
      <button
        disabled={files.length < 2 || merging}
        onClick={mergePDFs}
        className="w-full bg-[#f14d5d] text-white py-3 rounded font-medium text-lg shadow hover:bg-[#d73746] transition disabled:opacity-50 disabled:cursor-not-allowed mb-2"
      >
        {merging ? 'Merging...' : 'Merge PDFs'}
      </button>
      {error && <div className="text-red-500 py-2 text-center">{error}</div>}
      {mergedUrl && (
        <a
          href={mergedUrl}
          download="merged.pdf"
          className="block text-center bg-green-500 text-white py-2 rounded mt-4 hover:bg-green-600 transition"
        >
          Download Merged PDF
        </a>
      )}
    </div>
  );
}
