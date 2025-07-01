"use client";

import { generateEmbeddings } from "@/actions/generateEmbeddings";
import { db, storage } from "@/firebase/firebase";
import { useUser } from "@clerk/nextjs";
import { doc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

export enum StatusText {
  UPLOADING = "Uploading...",
  UPLOADED = "File uploaded successfully",
  SAVING = "Saving file to database...",
  GENERATING = "Generating AI embeddings...",
}

export type Status = StatusText[keyof StatusText];

function useUpload() {
  const [progress, setProgress] = useState<number | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  // const [fileId, setFileId] = useState<Status | null>(null);
  const [fileId, setFileId] = useState<string | null>(null);

  const { user } = useUser();
  const router = useRouter();

  const handleUpload = async (file: File) => {
    if (!file || !user) return;

    // TODO FREE/PAID CHECK LIMITATION

    const fileIdToUploadTo = uuidv4(); // example : j819298421892r0fche09190u

    // TODO UPLOAD FILE TO FIREBASE STORAGE and also a reference to the database
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
        setStatus(StatusText.UPLOADED);
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

        // generate AI embeddings..
        await generateEmbeddings(fileIdToUploadTo, user.id)

        setFileId(fileIdToUploadTo);

      }
    );
  };
  return { handleUpload, progress, status, fileId };
}

export default useUpload;
