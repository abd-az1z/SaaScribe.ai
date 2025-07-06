'use client';

import { useState, useEffect, useMemo } from 'react';
import { useUser } from '@clerk/nextjs';
import { collection, query, doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/firebase/firebase';

// Number of PDFs allowed
export const FREE_PLAN_LIMIT = 3;
const PRO_PLAN_MONTHLY_LIMIT = 30; // 30 PDFs per month for Pro users

interface FileData {
  id: string;
  name: string;
  size: number;
  downloadUrl: string;
  uploadedAt?: {
    seconds: number;
    nanoseconds: number;
  };
  fileType?: string;
  createdAt?: {
    toDate: () => Date;
  };
}

export default function useSubsscription() {
  const { user } = useUser();
  const [hasActiveMembership, setHasActiveMembership] = useState<boolean | null>(null);
  const [isOverFileLimit, setIsOverFileLimit] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [files, setFiles] = useState<FileData[]>([]);

  // Check if user has active membership
  useEffect(() => {
    if (!user) return;

    const userRef = doc(db, 'users', user.id);
    const unsubscribe = onSnapshot(userRef, 
      (doc) => {
        if (doc.exists()) {
          setHasActiveMembership(doc.data().hasActiveMembership || false);
          setLoading(false);
        }
      }, 
      (error) => {
        console.error('Error fetching user data:', error);
        setError('Failed to load subscription data');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Load user's files
  useEffect(() => {
    if (!user) return;
    
    const filesRef = collection(db, 'users', user.id, 'files');
    const q = query(filesRef);
    
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const filesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as FileData[];
        setFiles(filesData);
      }, 
      (error) => {
        console.error('Error fetching files:', error);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Calculate monthly uploads and limits
  const { uploadsThisMonth, monthlyLimit } = useMemo(() => {
    if (!files.length) return { uploadsThisMonth: 0, monthlyLimit: hasActiveMembership ? PRO_PLAN_MONTHLY_LIMIT : FREE_PLAN_LIMIT };
    
    if (!hasActiveMembership) {
      return {
        uploadsThisMonth: files.length,
        monthlyLimit: FREE_PLAN_LIMIT
      };
    }

    // For pro users, calculate monthly uploads
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyUploads = files.filter(file => {
      if (!file.uploadedAt?.seconds) return false;
      const uploadDate = new Date(file.uploadedAt.seconds * 1000);
      return uploadDate.getMonth() === currentMonth && 
             uploadDate.getFullYear() === currentYear;
    });

    return {
      uploadsThisMonth: monthlyUploads.length,
      monthlyLimit: PRO_PLAN_MONTHLY_LIMIT
    };
  }, [files, hasActiveMembership]);

  // Update isOverFileLimit based on user's plan
  useEffect(() => {
    if (hasActiveMembership === null) return;
    
    const limit = hasActiveMembership ? PRO_PLAN_MONTHLY_LIMIT : FREE_PLAN_LIMIT;
    const currentUsage = hasActiveMembership ? uploadsThisMonth : files.length;
    
    setIsOverFileLimit(currentUsage >= limit);
  }, [hasActiveMembership, uploadsThisMonth, files.length]);

  return {
    hasActiveMembership,
    isOverFileLimit,
    uploadsThisMonth,
    monthlyLimit,
    loading,
    error,
    fileCount: files.length
  };
}