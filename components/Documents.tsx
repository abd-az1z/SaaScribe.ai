"use client";

import { useState, useEffect } from 'react';
import { useUser } from "@clerk/nextjs";
import { db } from "@/firebase/firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { format } from 'date-fns';
import Link from 'next/link';
import { FileText, Clock, Loader2, FileSearch, StickyNote,Eye } from 'lucide-react';

// <Eye />
interface Document {
  id: string;
  name: string;
  fileType?: string;
  createdAt?: firebase.firestore.Timestamp;
  downloadUrl: string;
  size: number; // Size in bytes
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 MB';
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(2)} MB`;
}

function Documents() {
  const { user } = useUser();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    setLoading(true);
    const q = query(
      collection(db, `users/${user.id}/files`),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const docs: Document[] = [];
      querySnapshot.forEach((doc) => {
        docs.push({
          id: doc.id,
          ...doc.data()
        } as Document);
      });
      setDocuments(docs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Your Documents</h1>
          <p className="mt-2 text-gray-600">
            {documents.length} {documents.length === 1 ? 'document' : 'documents'} in total
          </p>
        </div>
        <Link
          href="/dashboard/upload"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Upload New
        </Link>
      </div>

      {documents.length === 0 ? (
        <div className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20">
          <FileSearch className="mx-auto h-12 w-12 text-[#00f2fe]" />
          <h3 className="mt-2 text-2xl font-bold text-gray-900">No documents found</h3>
          <p className="mt-1 text-lg text-gray-600">
            Get started by uploading your first document.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard/upload"
              className="inline-flex justify-center items-center px-6 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-[#00f2fe] to-[#4facfe] hover:from-[#4facfe] hover:to-[#00f2fe] transition-all shadow-md hover:shadow-lg"
            >
              Upload Document
            </Link>
            <Link
              href="/templates"
              className="inline-flex justify-center items-center px-6 py-3 rounded-lg font-medium text-gray-800 bg-white border border-gray-200 hover:bg-gray-50 transition-all"
            >
              Browse Templates
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {documents.map((doc) => (
            <Link
              key={doc.id}
              href={`/dashboard/files/${doc.id}`}
              className="group relative block bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden"
            >
              <div className="p-6 relative">
                <div className="flex items-center justify-between">
                  <div className="flex-shrink-0 bg-blue-100 p-3 rounded-lg">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {doc.fileType ? doc.fileType.toUpperCase() : 'FILE'}
                  </span>
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600 truncate">
                    {doc.name}
                  </h3>
                  <div className="mt-8 flex items-center justify-between text-sm text-gray-500">
                    <div className="flex  items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="font-medium">
                        {doc.createdAt ? format(doc.createdAt.toDate(), 'MMM d, yyyy') : 'Uploaded recently'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span className="font-medium">
                        {formatFileSize(doc.size)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-600 group-hover:text-blue-700">
                    Start chatting 
                  </span>
                  <div className="text-blue-500 group-hover:translate-x-1 transition-transform">
                    <Eye className='w-4 h-4' />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Documents;