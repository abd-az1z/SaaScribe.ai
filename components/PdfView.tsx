"use client";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

import { Document, pdfjs, Page } from "react-pdf";
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
  FiFileText,
} from "react-icons/fi";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfViewProps {
  url: string;
  fileData: {
    fileName: string;
    fileType: string;
    size?: number;
    refData?: any;
  };
}

function PdfView({ url, fileData }: PdfViewProps) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [file, setFile] = useState<Blob | null>(null);
  const [scale, setScale] = useState<number>(1);

  // Extract file info from fileData
  const fileName = fileData?.fileName || "Untitled Document";
  const fileSize = fileData?.size
    ? `${(fileData.size / 1024 / 1024).toFixed(2)} MB`
    : "N/A";
  const fileType = fileData?.fileType || "PDF";
  // You can also access refData if needed

  useEffect(() => {
    const fetchFile = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch PDF');
        }
        const file = await response.blob();
        setFile(file);
      } catch (error) {
        console.error('Error fetching PDF:', error);
        setError('Failed to load PDF. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFile();
  }, [url]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }): void => {
    setNumPages(numPages);
  };

  return (
    <div className="flex flex-col w-full h-full bg-white/95 backdrop-blur-sm border-r border-white/20 shadow-lg overflow-hidden">
      {isLoading && (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00f2fe]"></div>
        </div>
      )}
      {error && (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="text-red-500 text-lg mb-2">Error loading PDF</div>
            <div className="text-gray-600 text-sm">{error}</div>
          </div>
        </div>
      )}
      {!isLoading && !error && file && numPages && (
        <>
          {/* PDF Toolbar */}
          <div className="bg-white/95 p-1.5 sm:p-2 border-b border-gray-200/50 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-2 max-w-[60%] sm:max-w-[70%]">
              <h3 className="font-semibold text-gray-800 truncate text-sm sm:text-base">
                {fileData.fileName}
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
            <div className="flex items-center space-x-1.5 sm:space-x-2">
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
              <span className="text-xs sm:text-sm text-gray-500 px-1">
                {pageNumber} of {numPages}
              </span>
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

          {/* PDF Viewer */}
          <div className="flex-1 overflow-auto relative">
            <Document
              file={file}
              onLoadSuccess={onDocumentLoadSuccess}
              loading={
                <div className="flex items-center justify-center min-h-[60vh]">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00f2fe]"></div>
                </div>
              }
              onLoadError={(error: Error) => {
                console.error('PDF loading error:', error);
                setError('Failed to load PDF. Please try again.');
              }}
            >
              <Page
                pageNumber={pageNumber}
                scale={scale}
                renderMode="canvas"
                loading={
                  <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00f2fe]"></div>
                  </div>
                }
              />
            </Document>
          </div>
        </>
      )}
      {/* PDF Toolbar */}
      <div className="bg-white/95 p-1.5 sm:p-2 border-b border-gray-200/50 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2 max-w-[60%] sm:max-w-[70%]">
          <h3 className="font-semibold text-gray-800 truncate text-sm sm:text-base">
            {fileName}
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
        <div className="flex items-center space-x-1.5 sm:space-x-2">
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
          <span className="text-xs sm:text-sm text-gray-500 px-1">
            {pageNumber} of {numPages}
          </span>
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
            onClick={() => setScale((prev) => Math.min(prev + 0.25, 3))}
            variant="outline"
            size="sm"
            className="text-gray-700 border-gray-200 hover:bg-gray-50 h-8 w-8 p-0"
          >
            <FiZoomIn className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => setScale((prev) => Math.max(prev - 0.25, 0.5))}
            variant="outline"
            size="sm"
            className="text-gray-700 border-gray-200 hover:bg-gray-50 h-8 w-8 p-0"
          >
            <FiZoomOut className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* PDF Container */}
      <div className="w-full max-h-[calc(100vh-200px)] sm:max-h-[calc(100vh-220px)] bg-gradient-to-br from-white via-[#f8fafc] to-[#e0f2fe] border border-gray-200/50 rounded-lg shadow-inner overflow-hidden">
        <div className="w-full h-full overflow-auto p-2 custom-scrollbar ">
          {!file ? (
            <div className="text-center p-4 flex flex-col items-center justify-center h-full">
              <div className="w-16 h-16 bg-gradient-to-r from-[#00f2fe] to-[#4facfe] rounded-full flex items-center justify-center mb-4">
                <FiFileText className="w-8 h-8 text-white" />
              </div>
              <p className="text-gray-500 font-medium">{fileName}</p>
              <p className="text-sm text-gray-400 mt-2">
                PDF preview will be shown here
              </p>
            </div>
          ) : (
            <Document
              file={file}
              onLoadSuccess={onDocumentLoadSuccess}
              loading={null}
            >
              <Page
                pageNumber={pageNumber}
                scale={scale}
                renderAnnotationLayer={false}
                renderTextLayer={false}
              />
            </Document>
          )}
        </div>
      </div>

      {/* File Info & Actions */}
      <div className="bg-white/95 border-t border-gray-200/50 p-1.5 sm:p-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="text-xs sm:text-sm text-gray-600 truncate">
            <p>
              {fileSize} • {fileType}
            </p>
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
