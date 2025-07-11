'use client';

import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const ChatToFilePage = dynamic(
  () => import('./ChatToFilePage'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }
);

export default function Page() {
  const searchParams = useSearchParams();
  const [params, setParams] = useState<{ id: string } | null>(null);
  
  useEffect(() => {
    const id = window.location.pathname.split('/').pop();
    if (id) {
      setParams({ id });
    }
  }, [searchParams]);
  
  if (!params) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return <ChatToFilePage params={params} />;
}
