"use client";

import { generateEmbeddings } from "@/actions/generateEmbeddings";
import { db, storage } from "@/firebase/firebase";
import { useUser } from "@clerk/nextjs";
import { doc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

export enum StatusText {
  UPLOADING = "Uploading...",
  UPLOADED = "File uploaded successfully",
  SAVING = "Saving file to database...",
  GENERATING = "Generating AI embeddings...",
}

export type Status = StatusText;

function useUpload() {
  const [progress, setProgress] = useState<number | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [fileId, setFileId] = useState<string | null>(null);

  const { user } = useUser();

  const handleUpload = async (file: File) => {
    if (!file || !user) return;

    const fileToUploadTo = uuidv4();
    const storageRef = ref(storage, `users/${user.id}/files/${fileToUploadTo}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const percent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setStatus(StatusText.UPLOADING);
        setProgress(percent);
      },
      (error) => {
        console.error("Error uploading file", error);
      },
      async () => {
        try {
          // ✅ Set fileId BEFORE any redirect-triggering status
          setFileId(fileToUploadTo);
          setStatus(StatusText.UPLOADED);

          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);

          setStatus(StatusText.SAVING);

          await setDoc(doc(db, "users", user.id, "files", fileToUploadTo), {
            name: file.name,
            size: file.size,
            type: file.type,
            downloadUrl,
            ref: uploadTask.snapshot.ref.fullPath,
            createdAt: new Date(),
          });

          setStatus(StatusText.GENERATING);

          // Optional: generate embeddings
          await generateEmbeddings(fileToUploadTo);
        } catch (error) {
          console.error("Error in upload completion:", error);
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

