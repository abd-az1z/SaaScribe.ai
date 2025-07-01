"use client";

import useUpload, { StatusText } from "@/hooks/useUpload";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import {
  FileText,
  Upload,
  Loader2,
  Rocket,
  Check,
} from "lucide-react";

function FileUploader() {
  const { progress, status, fileId, handleUpload } = useUpload();
  const router = useRouter();

  useEffect(() => {
    if (fileId) {
      router.push(`/dashboard/files/${fileId}`);
    }
  }, [fileId, router]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      await handleUpload(file);
    }
  }, [handleUpload]);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isFocused,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: { "application/pdf": [".pdf"] },
  });

  const statusIcons: { [key in StatusText]: JSX.Element } = {
    [StatusText.UPLOADING]: <Loader2 className="animate-spin h-6 w-6 text-blue-500" />,
    [StatusText.UPLOADED]: <Check className="h-6 w-6 text-green-500" />,
    [StatusText.SAVING]: <Rocket className="h-6 w-6 text-yellow-500" />,
    [StatusText.GENERATING]: <Upload className="h-6 w-6 text-purple-500" />,
  };

  const uploadInProgress = status !== null && progress !== null && progress < 100;

  return (
    <div className="w-full space-y-4 sm:space-y-6">
      {/* Upload Progress Bar */}
      {uploadInProgress && (
        <div className="space-y-2">
          <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#00f2fe] to-[#4facfe] h-2.5 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            {status && statusIcons[status]}
            <span>{status}</span>
          </div>
        </div>
      )}

      {/* Dropzone UI */}
      {!uploadInProgress && (
        <div
          {...getRootProps()}
          className={`
            group relative border-2 border-dashed rounded-xl sm:rounded-2xl p-6 md:p-8 text-center
            cursor-pointer transition-all duration-300 flex flex-col items-center justify-center
            ${isFocused || isDragAccept
              ? "border-[#00f2fe] bg-gradient-to-br from-[#00f2fe]/10 to-[#4facfe]/10"
              : isDragReject
              ? "border-red-400 bg-red-50"
              : "border-gray-300 hover:border-[#00f2fe] hover:bg-gradient-to-br hover:from-[#00f2fe]/5 hover:to-[#4facfe]/5"
            }
          `}
        >
          <input {...getInputProps()} />

          <div className={`flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl
            text-2xl transition-all duration-300
            ${isDragActive
              ? "bg-gradient-to-br from-[#00f2fe] to-[#4facfe] text-white"
              : "bg-gradient-to-br from-[#00f2fe]/20 to-[#4facfe]/20 text-[#00f2fe]"
            }`}>
            {isDragActive ? <Upload className="h-8 w-8" /> : <FileText className="h-8 w-8" />}
          </div>

          <div className="space-y-2 mt-4">
            <h3 className={`text-xl sm:text-2xl font-bold transition-all duration-300 ${
              isDragActive ? "text-[#00f2fe]" : "text-gray-800 group-hover:text-[#00f2fe]"
            }`}>
              {isDragActive ? "Drop your PDF here" : "Drag & drop your PDF here"}
            </h3>

            <p className="text-sm text-gray-600">
              or <span className="text-[#00f2fe] font-semibold">click to browse</span>
            </p>
            <p className="text-xs text-gray-500">Only PDF files are supported</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default FileUploader;
