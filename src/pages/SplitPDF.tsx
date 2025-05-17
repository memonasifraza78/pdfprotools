import type React from 'react';
import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';

export default function SplitPDF() {
  const [file, setFile] = useState<File|null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [splitUrl, setSplitUrl] = useState<string|null>(null);
  const [error, setError] = useState<string|null>(null);
  const [loading, setLoading] = useState(false);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    setSplitUrl(null);
    setError(null);
    if (f) {
      setFile(f);
      try {
        const arr = await f.arrayBuffer();
        const pdf = await PDFDocument.load(arr);
        setPageCount(pdf.getPageCount());
        setSelectedPages([]);
      } catch {
        setError('Not a valid PDF.');
      }
    }
  };

  const handleCheck = (pg: number) => {
    setSelectedPages(pages => pages.includes(pg)
      ? pages.filter(n => n !== pg)
      : [...pages, pg]);
  };

  const splitPDF = async () => {
    if (!file || selectedPages.length === 0) return;
    setLoading(true);
    setError(null);
    setSplitUrl(null);
    try {
      const arr = await file.arrayBuffer();
      const srcDoc = await PDFDocument.load(arr);
      const newDoc = await PDFDocument.create();
      const copied = await newDoc.copyPages(srcDoc, selectedPages.map(n => n-1));
      copied.forEach(pg => newDoc.addPage(pg));
      const bytes = await newDoc.save();
      const blob = new Blob([bytes], { type: 'application/pdf' });
      setSplitUrl(URL.createObjectURL(blob));
    } catch {
      setError('Could not split PDF.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4 text-center text-[#f14d5d]">Split PDF</h2>
      <p className="text-gray-600 mb-6 text-center">Select a PDF, choose the pages you want, and download a split copy. 100% free and private in your browser!</p>
      <input
        type="file"
        accept="application/pdf"
        onChange={handleFile}
        className="mb-4 block w-full text-sm text-gray-700 file:bg-[#f14d5d] file:text-white file:rounded file:px-3 file:py-1 file:border-0"
      />
      {pageCount > 0 && (
        <div className="mb-6">
          <p className="mb-1 font-semibold text-sm">Select pages to include:</p>
          <div className="flex flex-wrap gap-2">
            {Array(pageCount).fill(0).map((_, i) => (
              <label key={i} className={`flex items-center gap-1 px-2 py-1 rounded cursor-pointer border ${selectedPages.includes(i+1) ? 'bg-[#f14d5d] text-white border-[#f14d5d]' : 'bg-gray-100 border-gray-300 text-gray-800'}`}>
                <input
                  type="checkbox"
                  className="accent-[#f14d5d]"
                  checked={selectedPages.includes(i+1)}
                  onChange={() => handleCheck(i+1)}
                />
                {i+1}
              </label>
            ))}
          </div>
        </div>
      )}
      {file && pageCount > 0 && (
        <button
          onClick={splitPDF}
          disabled={selectedPages.length === 0 || loading}
          className="w-full bg-[#f14d5d] text-white py-3 rounded font-medium text-lg shadow hover:bg-[#d73746] transition disabled:opacity-50 disabled:cursor-not-allowed mb-2">
          {loading ? 'Splitting...' : 'Split PDF'}
        </button>
      )}
      {error && <div className="text-red-500 py-2 text-center">{error}</div>}
      {splitUrl && (
        <a
          href={splitUrl}
          download={`split.pdf`}
          className="block text-center bg-green-500 text-white py-2 rounded mt-4 hover:bg-green-600 transition"
        >
          Download Split PDF
        </a>
      )}
    </div>
  );
}
