import React, { useState } from 'react';
import JSZip from 'jszip';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
// Vite workaround: set workerSrc from CDN
(pdfjsLib as any).GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@5.2.133/build/pdf.worker.min.js';

export default function PDFToJPG() {
  const [file, setFile] = useState<File | null>(null);
  const [previews, setPreviews] = useState<string[]>([]);
  const [zipUrl, setZipUrl] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
    setPreviews([]);
    setZipUrl(null);
    setError(null);
  };

  const renderPDF = async () => {
    if (!file) return;
    setProcessing(true);
    setError(null);
    setPreviews([]);
    setZipUrl(null);
    try {
      const pdfjs = pdfjsLib as any;
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = async () => {
        const pdf = await pdfjs.getDocument({ data: reader.result }).promise;
        const pagePreviews: string[] = [];
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 1.5 });
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          await page.render({ canvasContext: ctx, viewport }).promise;
          const jpgData = canvas.toDataURL('image/jpeg', 0.9);
          pagePreviews.push(jpgData);
        }
        setPreviews(pagePreviews);
      };
    } catch {
      setError('Could not process this PDF.');
    } finally {
      setProcessing(false);
    }
  };

  const downloadAll = async () => {
    const zip = new JSZip();
    previews.forEach((img, idx) => {
      zip.file(`page-${idx + 1}.jpg`, img.split(',')[1], { base64: true });
    });
    const blob = await zip.generateAsync({ type: 'blob' });
    setZipUrl(URL.createObjectURL(blob));
  };

  return (
    <div className="max-w-xl mx-auto bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4 text-center text-[#f14d5d]">PDF to JPG</h2>
      <p className="text-gray-600 mb-6 text-center">Convert PDF pages to JPG images, instantly in your browser. No uploads, no privacy risk.</p>
      <input
        type="file"
        accept="application/pdf"
        onChange={handleUpload}
        className="mb-4 block w-full text-sm text-gray-700 file:bg-[#f14d5d] file:text-white file:rounded file:px-3 file:py-1 file:border-0"
      />
      <button
        className="w-full bg-[#f14d5d] text-white py-3 rounded font-medium text-lg shadow hover:bg-[#d73746] transition disabled:opacity-50 disabled:cursor-not-allowed mb-2"
        disabled={!file || processing}
        onClick={renderPDF}
      >{processing ? 'Processing...' : 'Convert to JPG'}</button>
      {error && <div className="text-red-500 py-2 text-center">{error}</div>}
      {previews.length > 0 && (
        <>
          <div className="mt-6 grid grid-cols-2 gap-4">
            {previews.map((img, idx) => (
              <div key={idx} className="flex flex-col items-center gap-2">
                <img src={img} alt={`Page ${idx + 1}`} className="rounded shadow mb-2" style={{ maxWidth: 160, maxHeight: 220 }} />
                <a href={img} download={`page-${idx+1}.jpg`} className="text-[#f14d5d] underline text-xs">Download JPG</a>
              </div>
            ))}
          </div>
          <button
            className="block w-full bg-green-500 hover:bg-green-600 text-white rounded py-3 mt-6 text-lg font-medium"
            onClick={downloadAll}
          >Download All as ZIP</button>
          {zipUrl && <a href={zipUrl} download="pdf-images.zip" className="block mt-3 text-center text-sm text-[#f14d5d] underline">Download ZIP</a>}
        </>
      )}
    </div>
  );
}
