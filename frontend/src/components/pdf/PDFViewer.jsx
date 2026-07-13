import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { API_URL } from '../../constants/index.js';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function PDFViewer({ url }) {
  const apiBase = API_URL.replace(/\/api$/, '');
  const fileUrl = url?.startsWith('/') ? `${apiBase}${url}` : url;

  const [numPages, setNumPages] = useState(null);
  const [page, setPage] = useState(1);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);

  if (!url) return null;

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="shrink-0 flex items-center gap-1 px-3 py-2 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex-wrap">
        {/* Page nav */}
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="btn-ghost w-7 h-7 p-0 rounded-lg disabled:opacity-30"
        >
          <ChevronLeft size={15} />
        </button>
        <span className="text-xs font-medium text-gray-600 dark:text-gray-400 px-1 min-w-[60px] text-center">
          {page} / {numPages ?? '—'}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(numPages ?? 1, p + 1))}
          disabled={page === numPages}
          className="btn-ghost w-7 h-7 p-0 rounded-lg disabled:opacity-30"
        >
          <ChevronRight size={15} />
        </button>

        <div className="w-px h-4 bg-gray-200 dark:bg-gray-700 mx-1" />

        {/* Zoom */}
        <button
          onClick={() => setScale((s) => Math.max(0.5, +(s - 0.2).toFixed(1)))}
          disabled={scale <= 0.5}
          className="btn-ghost w-7 h-7 p-0 rounded-lg disabled:opacity-30"
        >
          <ZoomOut size={15} />
        </button>
        <span className="text-xs font-medium text-gray-600 dark:text-gray-400 min-w-[40px] text-center">
          {Math.round(scale * 100)}%
        </span>
        <button
          onClick={() => setScale((s) => Math.min(2.5, +(s + 0.2).toFixed(1)))}
          disabled={scale >= 2.5}
          className="btn-ghost w-7 h-7 p-0 rounded-lg disabled:opacity-30"
        >
          <ZoomIn size={15} />
        </button>

        <div className="w-px h-4 bg-gray-200 dark:bg-gray-700 mx-1" />

        {/* Rotate */}
        <button
          onClick={() => setRotation((r) => (r + 90) % 360)}
          className="btn-ghost w-7 h-7 p-0 rounded-lg"
        >
          <RotateCw size={15} />
        </button>
      </div>

      {/* PDF content */}
      <div className="flex-1 overflow-auto flex justify-center bg-gray-100 dark:bg-gray-950 p-3">
        <Document
          file={fileUrl}
          onLoadSuccess={({ numPages }) => { setNumPages(numPages); setPage(1); }}
          loading={<Spinner />}
          error={<ErrorMsg />}
        >
          <div style={{ transform: `rotate(${rotation}deg)`, display: 'inline-block' }}>
            <Page
              pageNumber={page}
              scale={scale}
              renderTextLayer
              renderAnnotationLayer
              className="shadow-lg"
            />
          </div>
        </Document>
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <div className="flex items-center justify-center py-16 text-gray-400 dark:text-gray-600 text-sm gap-2">
      <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      Loading PDF...
    </div>
  );
}

function ErrorMsg() {
  return (
    <div className="flex items-center justify-center py-16 text-red-500 dark:text-red-400 text-sm">
      Failed to load PDF
    </div>
  );
}
