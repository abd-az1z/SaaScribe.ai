'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase/firebase';
import ChatWithPdf from '@/components/ChatWithPdf';
import PdfView from '@/components/PdfView';

interface ChatToFilePageProps {
  params: {
    id: string;
  };
}

export default function ChatToFilePage({ params }: ChatToFilePageProps) {
  const { id: docId } = params;
  const { userId } = useAuth();
  const router = useRouter();
  const [url, setUrl] = useState<string>('');
  const [fileData, setFileData] = useState<{ name: string; fileType: string }>({ 
    name: 'Document', 
    fileType: 'PDF' 
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId || !docId) {
      router.push('/dashboard');
      return;
    }

    const fetchFile = async () => {
      try {
        const docRef = doc(db, 'users', userId, 'files', docId);
        const docSnap = await getDoc(docRef);
        
        if (!docSnap.exists()) {
          throw new Error('Document not found');
        }

        const data = docSnap.data();
        if (!data?.downloadUrl) {
          throw new Error('No download URL found');
        }

        setUrl(data.downloadUrl);
        setFileData({
          name: data.name || 'Document',
          fileType: data.fileType || 'PDF'
        });
      } catch (err) {
        console.error('Error fetching file:', err);
        setError('Failed to load document');
      } finally {
        setLoading(false);
      }
    };

    fetchFile();
  }, [userId, docId, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="h-full pt-26 px-2 sm:px-0">
      <div className="flex flex-col lg:flex-row h-full bg-gradient-to-br from-white via-[#f8fafc] to-[#e0f2fe] overflow-hidden">
        {/* PDF Viewer Section - Left */}
        <div className="w-full lg:w-1/2 flex flex-col bg-white/95 backdrop-blur-sm border-b lg:border-b-0 lg:border-r border-gray-200/50 shadow-sm lg:shadow-lg">
          <PdfView url={url} fileData={fileData} />
        </div>

        {/* Chat Section - Right */}
        <div className="w-full lg:w-1/2 flex flex-col bg-white/95 lg:bg-white/90 backdrop-blur-sm shadow-sm lg:shadow-lg overflow-hidden">
          <ChatWithPdf id={docId} />
        </div>
      </div>
    </div>
  );
}
