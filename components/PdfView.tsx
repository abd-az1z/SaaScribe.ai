"use client";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { Document, Page, pdfjs } from "react-pdf";
import { useState } from "react";
import { Button } from "./ui/button";
import {
  FiDownload,
  FiTrash2,
  FiChevronLeft,
  FiChevronRight,
  FiZoomIn,
  FiZoomOut,
} from "react-icons/fi";
import { toast } from "sonner";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { useRouter } from "next/navigation";

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

interface PdfViewProps {
  url: string;
  fileData: {
    name: string;
    fileType: string;
  };
  docId: string;
  userId: string;
  hasActiveMembership: boolean;
}

function PdfView({ url, fileData, docId, userId, hasActiveMembership }: PdfViewProps) {
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDownload = async () => {
    if (!url) return;
    setIsDownloading(true);
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch file");
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = window.document.createElement("a");
      link.href = blobUrl;
      link.download = fileData.name || "document.pdf";
      link.click();
      URL.revokeObjectURL(blobUrl);
    } catch {
      toast.error("Failed to download file");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDelete = async () => {
    if (!hasActiveMembership) {
      toast.error("Upgrade to Pro to delete documents", {
        action: { label: "Upgrade", onClick: () => router.push("/dashboard/upgrade") },
      });
      return;
    }
    if (!docId || !userId) return;

    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, "users", userId, "files", docId));
      toast.success("Document deleted");
      router.push("/dashboard");
    } catch {
      toast.error("Failed to delete document");
      setIsDeleting(false);
    }
  };

  if (!url) {
    return (
      <div className="flex flex-col w-full h-full bg-white/95 items-center justify-center">
        <div className="w-8 h-8 border-4 border-t-[#00f2fe] border-gray-200 rounded-full animate-spin" />
        <p className="mt-3 text-sm text-gray-500">Loading document…</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full bg-white/95 backdrop-blur-sm border-r border-white/20 shadow-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-evenly gap-2 bg-white/95 p-1.5 sm:p-2 border-b border-gray-100">
        <div className="flex items-center space-x-2 max-w-[50%] sm:max-w-[60%]">
          <h3 className="font-semibold text-gray-800 truncate text-sm sm:text-base">
            {fileData.name}
          </h3>
        </div>

        <div className="flex items-center space-x-1.5 sm:space-x-2">
          <Button
            disabled={pageNumber === 1}
            onClick={() => setPageNumber(pageNumber - 1)}
            variant="outline"
            size="sm"
            className="text-gray-700 border-gray-200 hover:bg-gray-50 h-8 w-8 p-0 sm:h-9 sm:w-auto sm:px-3"
          >
            <FiChevronLeft className="w-4 h-4 sm:mr-1" />
            <span className="hidden sm:inline">Prev</span>
          </Button>
          <p className="text-xs sm:text-sm text-gray-500 px-1">
            {pageNumber} / {numPages ?? "…"}
          </p>
          <Button
            disabled={pageNumber === numPages}
            onClick={() => {
              if (numPages && pageNumber < numPages) setPageNumber(pageNumber + 1);
            }}
            variant="outline"
            size="sm"
            className="text-gray-700 border-gray-200 hover:bg-gray-50 h-8 w-8 p-0 sm:h-9 sm:w-auto sm:px-3"
          >
            <span className="hidden sm:inline">Next</span>
            <FiChevronRight className="w-4 h-4 sm:ml-1" />
          </Button>
          <div className="h-6 w-px bg-gray-300 mx-1" />
          <Button
            variant="outline"
            size="sm"
            onClick={() => setScale(Math.max(0.5, scale - 0.1))}
            className="text-gray-700 border-gray-200 hover:bg-gray-50 h-8 w-8 p-0 sm:h-9 sm:w-auto sm:px-3"
          >
            <FiZoomOut className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setScale(Math.min(3, scale + 0.1))}
            className="text-gray-700 border-gray-200 hover:bg-gray-50 h-8 w-8 p-0 sm:h-9 sm:w-auto sm:px-3"
          >
            <FiZoomIn className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* PDF Display */}
      <div className="w-full flex-1 flex items-start justify-center overflow-auto bg-gradient-to-br from-white via-[#f8fafc] to-[#e0f2fe] p-2 custom-scrollbar">
        {pdfError ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <p className="text-red-500 font-medium mb-2">Failed to load PDF</p>
            <p className="text-sm text-gray-500">{pdfError}</p>
          </div>
        ) : (
          <Document
            file={url}
            className="w-full md:px-10"
            onLoadSuccess={({ numPages }) => {
              setNumPages(numPages);
              setPdfError(null);
            }}
            onLoadError={(error) => {
              console.error("PDF load error:", error.message);
              setPdfError(error.message);
            }}
            loading={
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-8 h-8 border-4 border-t-[#00f2fe] border-gray-200 rounded-full animate-spin" />
                <p className="mt-3 text-sm text-gray-500">Loading PDF…</p>
              </div>
            }
          >
            <Page
              pageNumber={pageNumber}
              scale={scale}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              onRenderError={(err) => console.warn(`Page ${pageNumber} render error`, err)}
            />
          </Document>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="bg-white/95 border-t border-gray-200/50 p-1.5 sm:p-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="text-xs sm:text-sm text-gray-600 truncate">
            <p>{fileData.fileType || "PDF"} • {numPages ? `${numPages} page${numPages > 1 ? "s" : ""}` : ""}</p>
          </div>
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              disabled={isDownloading}
              className="text-gray-700 border-gray-200 hover:bg-gray-50 h-8 px-2 sm:px-3 text-xs sm:text-sm"
            >
              <FiDownload className="w-3.5 h-3.5 sm:mr-1" />
              <span className="hidden sm:inline">{isDownloading ? "Downloading…" : "Download"}</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-red-600 border-red-200 hover:bg-red-50 h-8 px-2 sm:px-3 text-xs sm:text-sm"
            >
              <FiTrash2 className="w-3.5 h-3.5 sm:mr-1" />
              <span className="hidden sm:inline">
                {isDeleting ? "Deleting…" : hasActiveMembership ? "Delete" : "Delete (Pro)"}
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PdfView;
