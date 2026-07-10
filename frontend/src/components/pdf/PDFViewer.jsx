import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { API_URL } from '../../constants/index.js';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize2, RotateCw } from 'lucide-react';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function PDFViewer({ url }) {
  // Ensure absolute URL for PDFs served by backend static route (e.g. '/pdfs/...')
  const apiBase = API_URL.replace(/\/api$/, '');
  const fileUrl = url && url.startsWith('/') ? `${apiBase}${url}` : url;
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  const handlePrevPage = () => {
    setPageNumber(Math.max(1, pageNumber - 1));
  };

  const handleNextPage = () => {
    setPageNumber(Math.min(numPages, pageNumber + 1));
  };

  const handleZoomIn = () => {
    setScale(Math.min(2, scale + 0.2));
  };

  const handleZoomOut = () => {
    setScale(Math.max(0.5, scale - 0.2));
  };

  const handleRotate = () => {
    setRotation((rotation + 90) % 360);
  };

  if (!url) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <p>No PDF available</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-gray-100">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 bg-white px-4 py-3 border-b border-gray-200">
        <button
          onClick={handlePrevPage}
          disabled={pageNumber === 1}
          title="Previous Page"
          className="rounded p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={18} />
        </button>

        <span className="text-sm font-medium text-gray-600">
          {pageNumber} / {numPages || '?'}
        </span>

        <button
          onClick={handleNextPage}
          disabled={pageNumber === numPages}
          title="Next Page"
          className="rounded p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight size={18} />
        </button>

        <div className="border-l border-gray-200 pl-2 ml-2">
          <button
            onClick={handleZoomOut}
            disabled={scale === 0.5}
            title="Zoom Out"
            className="rounded p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ZoomOut size={18} />
          </button>

          <span className="text-sm font-medium text-gray-600 px-2">
            {Math.round(scale * 100)}%
          </span>

          <button
            onClick={handleZoomIn}
            disabled={scale === 2}
            title="Zoom In"
            className="rounded p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ZoomIn size={18} />
          </button>
        </div>

        <div className="border-l border-gray-200 pl-2 ml-2">
          <button
            onClick={handleRotate}
            title="Rotate"
            className="rounded p-2 hover:bg-gray-100 transition-colors"
          >
            <RotateCw size={18} />
          </button>
        </div>
      </div>

      {/* PDF Display */}
      <div className="flex-1 overflow-auto flex items-center justify-center">
          <Document
            file={fileUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={<p className="text-gray-500">Loading PDF...</p>}
          error={<p className="text-red-500">Error loading PDF</p>}
        >
          <div style={{ transform: `rotate(${rotation}deg)`, display: 'inline-block' }}>
            <Page
              pageNumber={pageNumber}
              scale={scale}
              renderTextLayer={true}
              renderAnnotationLayer={true}
            />
          </div>
        </Document>
      </div>
    </div>
  );
}
