"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Upload, FileText } from "lucide-react";

const PlaceholderDocument = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push("/dashboard/upload");
  };

  return (
    <div className="space-y-8">
      <div className="group cursor-pointer" onClick={handleClick}>
        <div className="h-full p-8 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
          <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#00f2fe] to-[#4facfe] rounded-2xl mb-6 text-2xl text-white">
            <Upload className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-bold mb-4 text-gray-800 group-hover:bg-gradient-to-r group-hover:from-[#00f2fe] group-hover:to-[#4facfe] group-hover:bg-clip-text group-hover:text-transparent transition-all">
            Upload Your First Document
          </h3>
          <p className="text-gray-600 text-lg leading-relaxed">
            Get started by uploading a PDF to chat with AI-powered insights
          </p>
        </div>
      </div>

      {/* CTA Section */}
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
  );
};

export default PlaceholderDocument;
