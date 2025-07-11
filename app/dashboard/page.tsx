import { Suspense } from 'react';
import Link from 'next/link';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/firebase/firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import Documents, { Document } from '@/components/Documents';
import { Loader2 } from 'lucide-react';


export const dynamic = 'force-dynamic';

async function getDocuments(userId: string) {
  try {
    const q = query(
      collection(db, 'users', userId, 'files'),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      userId,
      // Convert Firestore timestamp to ISO string for serialization
      createdAt: doc.data().createdAt?.toDate()
    })) as Document[];
  } catch (error) {
    console.error('Error fetching documents:', error);
    return [];
  }
}

async function getUserSubscription() {
  const isPro = true; 
  
  return {
    hasActiveMembership: isPro,
    isOverFileLimit: false,
    maxDocuments: isPro ? 30 : 3,
    usedSpace: 0,
    storageLimit: isPro ? 1024 * 1024 * 1024 : 100 * 1024 * 1024,
    plan: isPro ? 'pro' : 'free'
  };
}

export default async function Dashboard() {
  const session = await auth();
  const userId = session.userId;
  
  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Please sign in to view your documents</p>
      </div>
    );
  }

  const [documents, subscription] = await Promise.all([
    getDocuments(userId),
    getUserSubscription()
  ]);

  
  const formattedDocuments = documents.map(doc => ({
    ...doc,
    createdAt: doc.createdAt instanceof Date ? doc.createdAt : 
              (typeof doc.createdAt === 'string' ? new Date(doc.createdAt) : 
              (doc.createdAt?.toDate ? doc.createdAt.toDate() : new Date()))
  }));

  const usedSpace = formattedDocuments.reduce((total, doc) => total + (doc.size || 0), 0);
  const isOverFileLimit = formattedDocuments.length >= subscription.maxDocuments;

  return (
    <div className="min-h-screen w-full max-w-7xl mx-auto flex md:py-28 py-28 flex-col items-center justify-center pb-2 px-4 sm:py-8 lg:px-8">
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-[#00f2fe] via-[#4facfe] to-[#00f2fe] bg-clip-text text-transparent">
        My Documents
      </h1>
      
      <div className="w-full flex flex-col items-center justify-center flex-1 space-y-6 sm:space-y-8">
        <div className="w-full max-w-4xl">
          <Suspense fallback={
            <div className="flex items-center justify-center min-h-[60vh]">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
          }>
            <Documents 
              initialDocuments={formattedDocuments}
              hasActiveMembership={subscription.hasActiveMembership}
              isOverFileLimit={isOverFileLimit}
              userId={userId}
              maxDocuments={subscription.maxDocuments}
              usedSpace={usedSpace}
              storageLimit={subscription.storageLimit}
            />
          </Suspense>
        </div>
        
        <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg">
          <div className="mt-16 p-8 rounded-2xl bg-gradient-to-br from-white via-[#f8fafc] to-[#e0f2fe] border border-white/20 shadow-xl">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-[#00f2fe] via-[#4facfe] to-[#00f2fe] bg-clip-text text-transparent">
                Ready to unlock more features?
              </h2>
              <p className="text-gray-700 mb-8 text-lg max-w-2xl mx-auto">
                Upgrade to Pro for unlimited documents, advanced analytics, and priority support.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/pricing"
                  className="px-6 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-[#00f2fe] to-[#4facfe] hover:from-[#4facfe] hover:to-[#00f2fe] transition-all shadow-md hover:shadow-lg"
                >
                  Upgrade to Pro
                </Link>
                <Link
                  href="/features"
                  className="px-6 py-3 rounded-lg font-medium text-gray-800 bg-white border border-gray-200 hover:bg-gray-50 transition-all"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}