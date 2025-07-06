"use client";

import { useState, useEffect } from 'react';
import { useUser } from "@clerk/nextjs";
import { db } from "@/firebase/firebase";
import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { format } from 'date-fns';
import Link from 'next/link';
import { FileText, Clock, Loader2, FileSearch, Eye, Trash2, Download, CheckCircle2, Zap, FileDown } from 'lucide-react';
import { toast } from "sonner";
import useSubsscription from "@/hooks/useSubsscription";
import { Progress } from "./ui/progress";
import { cn } from "@/lib/utils";

interface Document {
  id: string;
  name: string;
  fileType?: string;
  createdAt?: {
    toDate: () => Date;
  };
  downloadUrl: string;
  size: number;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 MB';
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(2)} MB`;
}

export default function Documents() {
  const { user } = useUser();
  const { hasActiveMembership, isOverFileLimit } = useSubsscription();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  // Calculate document limits and usage
  const maxDocuments = hasActiveMembership ? 30 : 3;
  const usedSpace = documents.reduce((total, doc) => total + (doc.size || 0), 0);
  const storageLimit = 100 * 1024 * 1024; // 100MB in bytes
  const spacePercentage = Math.min(100, (usedSpace / storageLimit) * 100);

  // Fetch documents on mount
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, `users/${user.id}/files`),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Document[];
      setDocuments(docs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleDeleteDocument = async (docId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;

    try {
      setDeletingId(docId);
      await deleteDoc(doc(db, `users/${user.id}/files/${docId}`));
      toast.success('Document deleted successfully');
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Failed to delete document');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Plan</p>
              <h3 className="text-2xl font-bold text-gray-900">
                {hasActiveMembership ? 'Pro' : 'Free'}
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                {hasActiveMembership ? '30 documents/month' : '3 documents/month'}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100">
              <Zap className="w-6 h-6 text-blue-500" />
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Documents</p>
              <h3 className="text-2xl font-bold text-gray-900">
                {documents.length} <span className="text-base font-normal text-gray-500">/ {maxDocuments}</span>
              </h3>
              <div className="mt-2">
                <Progress 
                  value={(documents.length / maxDocuments) * 100} 
                  className="h-2 bg-gray-100"
                  indicatorClassName={cn(
                    documents.length >= maxDocuments 
                      ? 'bg-red-500' 
                      : 'bg-gradient-to-r from-blue-400 to-blue-600'
                  )}
                />
              </div>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100">
              <FileText className="w-6 h-6 text-purple-500" />
            </div>
          </div>
          <p className="mt-3 text-sm text-gray-600">
            {documents.length >= maxDocuments 
              ? 'You\'ve reached your document limit' 
              : `${maxDocuments - documents.length} documents remaining`}
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Storage Used</p>
              <h3 className="text-2xl font-bold text-gray-900">
                {(usedSpace / (1024 * 1024)).toFixed(2)} MB
              </h3>
              <div className="mt-2">
                <Progress 
                  value={spacePercentage} 
                  className="h-2 bg-gray-100"
                  indicatorClassName={cn(
                    spacePercentage >= 90 
                      ? 'bg-yellow-500' 
                      : 'bg-gradient-to-r from-green-400 to-green-600'
                  )}
                />
              </div>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-br from-green-50 to-green-100">
              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
          </div>
          <p className="mt-3 text-sm text-gray-600">
            {spacePercentage.toFixed(1)}% of 100 MB used
          </p>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Your Documents</h1>
            <div className="flex items-center mt-2">
              <p className="text-gray-600">
                {documents.length} {documents.length === 1 ? 'document' : 'documents'} • {formatFileSize(usedSpace)} used
              </p>
              {hasActiveMembership ? (
                <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded-full flex items-center">
                  <CheckCircle2 className="w-3 h-3 mr-1" /> Active
                </span>
              ) : (
                <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-800 rounded-full">
                  Free Tier
                </span>
              )}
            </div>
          </div>
          <div className="flex space-x-3">
            <Link
              href="/dashboard/upload"
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                isOverFileLimit 
                  ? "bg-gray-400 cursor-not-allowed" 
                  : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              }`}
              onClick={(e) => {
                if (isOverFileLimit) {
                  e.preventDefault();
                  toast.error(
                    hasActiveMembership 
                      ? "You've reached your monthly document limit. New uploads will be available next month."
                      : "Free plan is limited to 3 documents. Upgrade to PRO for more."
                  );
                }
              }}
            >
              <FileDown className="mr-2 h-4 w-4" />
              Upload Document
            </Link>
            {!hasActiveMembership && (
              <Link
                href="/pricing"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Zap className="mr-2 h-4 w-4 text-yellow-500" />
                Upgrade to Pro
              </Link>
            )}
          </div>
        </div>

        {documents.length === 0 ? (
          <div className="text-center py-12">
            <FileSearch className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No documents</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by uploading a new document.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {documents.map((document) => {
              const uploadDate = document.createdAt?.toDate();
              const isRecent = uploadDate && Date.now() - uploadDate.getTime() < 7 * 24 * 60 * 60 * 1000;

              return (
                <div
                  key={document.id}
                  className="group relative bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{document.name}</p>
                        <div className="flex items-center mt-1 text-xs text-gray-500">
                          <span>{formatFileSize(document.size)}</span>
                          <span className="mx-1">•</span>
                          <span>{document.fileType?.toUpperCase() || 'PDF'}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <a
                          href={document.downloadUrl}
                          download={document.name}
                          onClick={(e) => e.stopPropagation()}
                          className="p-1.5 text-gray-400 hover:text-blue-600 rounded-full hover:bg-blue-50"
                          title="Download"
                        >
                          <Download className="h-4 w-4" />
                        </a>
                        <button
                          onClick={(e) => handleDeleteDocument(document.id, e)}
                          disabled={deletingId === document.id}
                          className={`p-1.5 rounded-full ${
                            hasActiveMembership
                              ? 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                              : 'text-gray-300 cursor-not-allowed'
                          }`}
                          title={hasActiveMembership ? 'Delete' : 'Upgrade to delete'}
                        >
                          {deletingId === document.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {uploadDate && (
                      <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center">
                          <Clock className="h-3.5 w-3.5 mr-1" />
                          <span>Uploaded {format(uploadDate, 'MMM d, yyyy')}</span>
                        </div>
                        {isRecent && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            New
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all opacity-0 group-hover:opacity-100 p-4">
                    <Link
                      href={`/dashboard/files/${document.id}`}
                      className="w-full max-w-[180px] text-center"
                    >
                      <span className="inline-flex items-center justify-center w-full px-3 py-1.5 rounded-full bg-white text-sm font-medium text-gray-900 shadow-sm hover:bg-gray-50 transition-colors">
                        <Eye className="h-4 w-4 mr-1.5" />
                        View Document
                      </span>
                    </Link>
                    <a
                      href={document.downloadUrl}
                      download={document.name}
                      className="w-full max-w-[180px] text-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span className="inline-flex items-center justify-center w-full px-3 py-1.5 rounded-full bg-white text-sm font-medium text-blue-600 shadow-sm hover:bg-blue-50 transition-colors">
                        <Download className="h-4 w-4 mr-1.5" />
                        Download
                      </span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};