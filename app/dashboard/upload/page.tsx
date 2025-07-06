import FileUploader from "@/components/FileUploader";
import React from "react";

const UploadPage = () => {
  return (
    <div className="min-h-screen pt-20 w-full bg-gradient-to-br from-white via-[#f8fafc] to-[#e0f2fe]">
      <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-[#00f2fe] via-[#4facfe] to-[#00f2fe] bg-clip-text text-transparent">
            Upload Your Documents
          </h1>
          <p className="text-lg sm:text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
            Upload your PDF documents to start chatting with AI-powered
            insights. Your documents are processed securely and privately.
          </p>
        </div>

        {/* Upload Section */}
        <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl p-6 sm:p-8 lg:p-12">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">
              Ready to Get Started?
            </h2>
            <p className="text-gray-600 text-sm sm:text-base">
              Simply drag and drop your PDF files below or click to browse
            </p>
          </div>

          <FileUploader />
        </div>

        {/* Features Section */}
        <div className="mt-8 sm:mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-white/60 shadow-lg backdrop-blur-sm border border-white/20 rounded-xl p-4 sm:p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-[#00f2fe] to-[#4facfe] rounded-xl mb-3 sm:mb-4 text-white text-lg sm:text-xl mx-auto">
              🔒
            </div>
            <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-2">
              Secure Upload
            </h3>
            <p className="text-xs sm:text-sm text-gray-600">
              Your files are encrypted and processed securely
            </p>
          </div>

          <div className="bg-white/60 shadow-lg backdrop-blur-sm border border-white/20 rounded-xl p-4 sm:p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-[#a18cd1] to-[#fbc2eb] rounded-xl mb-3 sm:mb-4 text-white text-lg sm:text-xl mx-auto">
              ⚡
            </div>
            <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-2">
              Fast Processing
            </h3>
            <p className="text-xs sm:text-sm text-gray-600">
              AI processes your documents in seconds
            </p>
          </div>

          <div className="bg-white/60 shadow-lg backdrop-blur-sm border border-white/20 rounded-xl p-4 sm:p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-[#ff6b6b] to-[#ff8e8e] rounded-xl mb-3 sm:mb-4 text-white text-lg sm:text-xl mx-auto">
              💬
            </div>
            <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-2">
              Smart Chat
            </h3>
            <p className="text-xs sm:text-sm text-gray-600">
              Ask questions and get instant answers
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;