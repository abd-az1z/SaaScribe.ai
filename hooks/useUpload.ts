"use client";

import { db, storage } from "@/firebase/firebase";
import { useUser } from "@clerk/nextjs";
import { doc, setDoc, collection, getDocs } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { generateEmbeddings } from "@/actions/generateEmbeddings";
import { toast } from "sonner";
import { useSubscription } from "./useSubscription";

export enum StatusText {
  UPLOADING = "Uploading file...",
  UPLOADED = "File uploaded successfully",
  SAVING = "Saving file to database...",
  GENERATING = "Generating AI embeddings, This will only take few seconds...",
}

export type Status = StatusText[keyof StatusText];

function useUpload() {
  const [progress, setProgress] = useState<number | null>(null);
  const [fileId, setFileId] = useState<string | null>(null);
  const [status, setStatus] = useState<Status | null>(null);
  const { user } = useUser();
  const { hasActiveMembership, loading: subscriptionLoading } = useSubscription();

  const handleUpload = async (file: File) => {
    if (!file || !user) return;

    // Use free tier limits as fallback if subscription is still loading
    // This prevents blocking uploads while subscription loads
    const isPro = subscriptionLoading ? false : hasActiveMembership;
    const maxFiles = isPro ? 30 : 3;

    console.log("[useUpload] subscriptionLoading:", subscriptionLoading, "hasActiveMembership:", hasActiveMembership, "maxFiles:", maxFiles);
    const filesRef = collection(db, "users", user.id, "files");
    const filesSnapshot = await getDocs(filesRef);
    const currentFileCount = filesSnapshot.size;

    if (currentFileCount >= maxFiles) {
      toast.error(
        `You've reached your file limit (${maxFiles} files). ${
          hasActiveMembership ? '' : 'Upgrade to Pro for up to 30 files!'
        }`,
        {
          action: hasActiveMembership ? undefined : {
            label: 'Upgrade',
            onClick: () => {
              window.location.href = '/dashboard/upgrade';
            },
          },
        }
      );
      return;
    }

    // Check file type
    if (!file.type.includes('pdf')) {
      toast.error('Only PDF files are supported');
      return;
    }

    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    const fileIdToUploadTo = uuidv4();

    const storageRef = ref(
      storage,
      `users/${user.id}/files/${fileIdToUploadTo}`
    );

    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const percent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setStatus(StatusText.UPLOADING);
        setProgress(percent);
      },
      (error) => {
        console.error("Error uploading file", error);
      },
      async () => {
        try {
          setStatus(StatusText.UPLOADING);

          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);

          setStatus(StatusText.SAVING);
          await setDoc(doc(db, "users", user.id, "files", fileIdToUploadTo), {
            name: file.name,
            size: file.size,
            type: file.type,
            downloadUrl: downloadUrl,
            ref: uploadTask.snapshot.ref.fullPath,
            createdAt: new Date(),
          });
          
          setStatus(StatusText.GENERATING);
          
          // Add timeout for embeddings generation
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Embeddings generation timed out')), 60000)
          );
          
          // Race the embeddings generation against the timeout
          await Promise.race([
            generateEmbeddings(fileIdToUploadTo),
            timeoutPromise
          ]);
          
          setFileId(fileIdToUploadTo);
          toast.success('File uploaded and processed successfully');
        } catch (error) {
          console.error('Error during upload process:', error);
          toast.error(error instanceof Error ? error.message : 'Failed to process file');
          // Reset states on error
          setProgress(null);
          setStatus(null);
        }
      }
    );
  };
  return {
    progress,
    status,
    fileId,
    handleUpload,
  };
}

export default useUpload;
