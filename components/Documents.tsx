'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { format } from 'date-fns';
import { FileText, Clock, Loader2, FileSearch, Eye, Trash2, Download, CheckCircle2, Zap } from 'lucide-react';
import { toast } from "sonner";
import { Progress } from "./ui/progress";
import { cn } from "@/lib/utils";
import Link from 'next/link';

export interface Document {
  id: string;
  name: string;
  fileType?: string;
  createdAt?: Date | string | { toDate: () => Date };
  downloadUrl: string;
  size: number;
  userId: string;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 MB';
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(2)} MB`;
}

interface DocumentsProps {
  initialDocuments?: Document[];
  hasActiveMembership: boolean;
  isOverFileLimit: boolean;
  userId: string;
  maxDocuments: number;
  usedSpace: number;
  storageLimit: number;
}

export default function Documents({ 
  initialDocuments = [], 
  hasActiveMembership, 
  isOverFileLimit, 
  userId,
  maxDocuments,
  usedSpace,
  storageLimit
}: DocumentsProps) {
  const [documents, setDocuments] = useState<Document[]>(initialDocuments);
  const [loading, setLoading] = useState(!initialDocuments.length);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  const spacePercentage = useMemo(() => 
    Math.min(100, (usedSpace / storageLimit) * 100)
  , [usedSpace, storageLimit]);

  // Type guard for Firestore Timestamp
  interface FirestoreTimestamp {
    toDate: () => Date;
    // Add other properties of Firestore Timestamp if needed
  }

  // Helper function to safely convert Firestore timestamp to Date
  const toDate = (dateInput: unknown): Date | null => {
    if (!dateInput) return null;
    
    try {
      if (dateInput instanceof Date) {
        return dateInput;
      } else if (typeof dateInput === 'string') {
        const date = new Date(dateInput);
        return isNaN(date.getTime()) ? null : date;
      } else if (dateInput && 
                typeof dateInput === 'object' && 
                'toDate' in dateInput && 
                typeof (dateInput as FirestoreTimestamp).toDate === 'function') {
        return (dateInput as FirestoreTimestamp).toDate();
      }
    } catch (error) {
      console.error('Error converting to date:', error);
    }
    
    return null;
  };
  


  const handleDeleteDocument = useCallback(async (docId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!userId) return;

    try {
      setDeletingId(docId);
      // Optimistic UI update
      setDocuments(prev => prev.filter(doc => doc.id !== docId));
      
      const { deleteDoc, doc } = await import('firebase/firestore');
      const { db } = await import('@/firebase/firebase');
      
      await deleteDoc(doc(db, `users/${userId}/files/${docId}`));
      toast.success('Document deleted successfully');
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Failed to delete document');
      // Revert optimistic update on error
      if (initialDocuments.length) {
        setDocuments(initialDocuments);
      }
    } finally {
      setDeletingId(null);
    }
  }, [userId, initialDocuments]);

  // Only subscribe to real-time updates if we didn't get initial data
  useEffect(() => {
    if (initialDocuments.length > 0) {
      setLoading(false);
      return;
    }

    const setupRealtimeUpdates = async () => {
      const { collection, query, orderBy, onSnapshot, where } = await import('firebase/firestore');
      const { db } = await import('@/firebase/firebase');
      
      const q = query(
        collection(db, `users/${userId}/files`),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const docs = snapshot.docs.map((doc) => ({
          id: doc.id,
          userId,
          ...doc.data(),
        })) as Document[];
        setDocuments(docs);
        setLoading(false);
      });

      return () => unsubscribe();
    };

    if (userId) {
      setupRealtimeUpdates().catch(console.error);
    }
  }, [userId, initialDocuments.length]);

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        {/* Left Side - Heading & Info */}
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Your Documents</h1>
          <div className="flex flex-col sm:flex-row sm:items-center mt-2 gap-2 sm:gap-3">
            <p className="text-gray-600 text-sm sm:text-base">
              {documents.length} {documents.length === 1 ? 'document' : 'documents'} • {formatFileSize(usedSpace)} used
            </p>
            {hasActiveMembership ? (
              <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                <CheckCircle2 className="w-3 h-3 mr-1" /> Active
              </span>
            ) : (
              <span className="inline-block px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-800 rounded-full">
                Free Tier
              </span>
            )}
          </div>
        </div>

        {/* Right Side - Actions */}
        <div className="flex flex-col sm:items-end gap-2 sm:gap-3">
          <Link
            href="/dashboard/upload"
            className={`inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md shadow-sm text-white ${
              isOverFileLimit
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            }`}
            onClick={(e) => {
              if (isOverFileLimit) {
                e.preventDefault();
                toast.error(
                  `You've reached your document limit of ${maxDocuments} documents. Please upgrade to Pro for more.`
                );
              }
            }}
          >
            <Download className="mr-2 h-4 w-4" />
            Upload Document
          </Link>

          {!hasActiveMembership && (
            <p className="text-xs text-gray-500 text-center sm:text-right">
              Free tier limited to {maxDocuments} documents.{" "}
              <Link href="/pricing" className="font-medium text-blue-600 hover:text-blue-500">
                Upgrade to Pro
              </Link>{" "}
              for unlimited documents.
            </p>
          )}
        </div>
      </div>

        {documents.length === 0 ? (
          <div className="text-center py-12">
            <FileSearch className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No documents</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by uploading a new document.
            </p>
            <div className="mt-6">
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
                      `You've reached your document limit of ${maxDocuments} documents. Please upgrade to Pro for more.`
                    );
                  }
                }}
              >
                <Download className="mr-2 h-4 w-4" />
                Upload Document
              </Link>
              {!hasActiveMembership && (
                <p className="mt-2 text-xs text-gray-500">
                  Free tier limited to {maxDocuments} documents.{" "}
                  <Link
                    href="/pricing"
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Upgrade to Pro
                  </Link>{" "}
                  for unlimited documents.
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {documents.map((document) => {
              // Use the component-level formatDisplayDate function

              const uploadDate = toDate(document.createdAt);
              const isRecent = uploadDate && (Date.now() - uploadDate.getTime()) < 7 * 24 * 60 * 60 * 1000;

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

                  <div className="border-t border-gray-100 mt-3 pt-3">
                    <div className="flex items-center justify-between">
                      <Link
                        href={`/dashboard/files/${document.id}`}
                        className="inline-flex items-center text-sm text-gray-600 hover:text-blue-600 px-2 py-1 rounded hover:bg-blue-50"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Eye className="h-4 w-4 mr-1.5" />
                        View
                      </Link>
                      <a
                        href={document.downloadUrl}
                        download={document.name}
                        className="inline-flex items-center text-sm text-gray-600 hover:text-blue-600 px-2 py-1 rounded hover:bg-blue-50"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Download className="h-4 w-4 mr-1.5" />
                        Download
                      </a>
                    </div>
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