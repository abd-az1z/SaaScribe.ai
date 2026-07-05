'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface UploadZoneProps {
    onUploadComplete: (data: any) => void;
}

export function UploadZone({ onUploadComplete }: UploadZoneProps) {
    const [isUploading, setIsUploading] = useState(false);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (!file) return;

        if (file.type !== 'application/pdf') {
            toast.error('Please upload a PDF file');
            return;
        }

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Upload failed');
            }

            const data = await response.json();
            toast.success('Analysis complete!');
            onUploadComplete(data);
        } catch (error) {
            console.error(error);
            toast.error('Something went wrong during upload/analysis');
        } finally {
            setIsUploading(false);
        }
    }, [onUploadComplete]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'application/pdf': ['.pdf'] },
        maxFiles: 1,
        disabled: isUploading
    });

    return (
        <div
            {...getRootProps()}
            className={`
        border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors
        ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
        ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
      `}
        >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center justify-center gap-4">
                {isUploading ? (
                    <>
                        <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
                        <p className="text-sm text-gray-500">Analyzing contract...</p>
                    </>
                ) : (
                    <>
                        <div className="p-4 bg-gray-100 rounded-full">
                            <Upload className="h-6 w-6 text-gray-600" />
                        </div>
                        <div>
                            <p className="font-medium text-gray-900">Click to upload or drag and drop</p>
                            <p className="text-sm text-gray-500 mt-1">PDF (max 10MB)</p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
