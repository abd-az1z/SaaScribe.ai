"use client";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { Document, Page, pdfjs } from "react-pdf";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import {
  FiDownload,
  FiTrash2,
  FiShare2,
  FiEdit,
  FiChevronLeft,
  FiChevronRight,
  FiZoomIn,
  FiZoomOut,
} from "react-icons/fi";

// Set up the correct worker source

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfViewProps {
  url: string;
  fileData: {
    name: string;
    fileType: string;
  };
}

function PdfView({ url, fileData }: PdfViewProps) {
  const [file, setFile] = useState<Blob | null>(null);
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1);

  useEffect(() => {
    const fetchFile = async () => {
      const response = await fetch(url);
      const file = await response.blob();
      setFile(file);
    };
    fetchFile();
  }, [url]);

  return (
    <div className="flex flex-col w-full h-full bg-white/95 backdrop-blur-sm border-r border-white/20 shadow-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-evenly gap-2 bg-white/95 p-1.5 sm:p-2 border-b border-gray-200/50 ">
        <div className="flex items-center space-x-2 max-w-[60%] sm:max-w-[70%]">
          <h3 className="font-semibold text-gray-800 truncate text-sm sm:text-base">
            {fileData.name}
          </h3>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-500 hover:bg-gray-100/50 p-1.5"
          >
            <FiEdit className="w-4 h-4" />
          </Button>
        </div>

        {/* zoom in & out */}
        <div className="flex items-center  space-x-1.5 sm:space-x-2">
          <Button
            disabled={pageNumber === 1}
            onClick={() => {
              setPageNumber(pageNumber - 1);
            }}
            variant="outline"
            size="sm"
            className="text-gray-700 border-gray-200 hover:bg-gray-50 h-8 w-8 p-0 sm:h-9 sm:w-auto sm:px-3"
          >
            <FiChevronLeft className="w-4 h-4 sm:mr-1" />
            <span className="hidden sm:inline">Prev</span>
          </Button>
          <p className="text-xs flex sm:text-sm text-gray-500 px-1">
            {pageNumber} {""}
            <span className="text-xs sm:text-sm text-gray-500 px-1">
              / {numPages}
            </span>
          </p>

          <Button
            disabled={pageNumber === numPages}
            onClick={() => {
              if (numPages) {
                if (pageNumber < numPages) {
                  setPageNumber(pageNumber + 1);
                }
              }
            }}
            variant="outline"
            size="sm"
            className="text-gray-700 border-gray-200 hover:bg-gray-50 h-8 w-8 p-0 sm:h-9 sm:w-auto sm:px-3"
          >
            <span className="hidden sm:inline">Next</span>
            <FiChevronRight className="w-4 h-4 sm:ml-1" />
          </Button>
          <div className="h-6 w-px bg-gray-300 mx-1"></div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setScale(scale - 0.1);
            }}
            className="text-gray-700 border-gray-200 hover:bg-gray-50 h-8 w-8 p-0 sm:h-9 sm:w-auto sm:px-3"
          >
            <FiZoomOut className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setScale(scale + 0.1);
            }}
            className="text-gray-700 border-gray-200 hover:bg-gray-50 h-8 w-8 p-0 sm:h-9 sm:w-auto sm:px-3"
          >
            <FiZoomIn className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* PDF Display */}
      <div className="w-full flex items-center justify-center max-h-[calc(100vh-200px)] sm:max-h-[calc(100vh-220px)] bg-gradient-to-br from-white via-[#f8fafc] to-[#e0f2fe] border border-gray-200/50 rounded-lg shadow-inner overflow-hidden">
        <div className="w-full h-full  overflow-auto p-2 custom-scrollbar ">
          {file && (
            <Document
              className="w-full h-full md:px-10"
              file={file}
              onLoadSuccess={({ numPages }) => setNumPages(numPages)}
              onLoadError={(error) => console.error("Load error:", error.message)}
              onSourceError={(error) => console.error("Source error:", error.message)}
            >
              <Page pageNumber={pageNumber} scale={scale}
              renderTextLayer={false}
              onRenderError={(err) => console.warn(`Failed to render page ${pageNumber}`, err)}
              renderAnnotationLayer={false}
               />
            </Document>
          )}
        </div>
      </div>

      {/* File Info and Actions */}
      <div className="bg-white/95 border-t border-gray-200/50 p-1.5 sm:p-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="text-xs sm:text-sm text-gray-600 truncate">
            <p>{fileData.fileType} • Estimated size (in MB)</p>
          </div>
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="text-gray-700 border-gray-200 hover:bg-gray-50 h-8 px-2 sm:px-3 text-xs sm:text-sm"
            >
              <FiDownload className="w-3.5 h-3.5 sm:mr-1" />
              <span className="hidden sm:inline">Download</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-gray-700 border-gray-200 hover:bg-gray-50 h-8 px-2 sm:px-3 text-xs sm:text-sm"
            >
              <FiShare2 className="w-3.5 h-3.5 sm:mr-1" />
              <span className="hidden sm:inline">Share</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-red-600 border-red-200 hover:bg-red-50 h-8 px-2 sm:px-3 text-xs sm:text-sm"
            >
              <FiTrash2 className="w-3.5 h-3.5 sm:mr-1" />
              <span className="hidden sm:inline">Delete</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PdfView;
