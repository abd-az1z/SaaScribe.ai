"use client";

import DashboardHeader from "@/components/DashboardHeader";
import PricingSection from "@/components/PricingSection";
import { FiCheckCircle, FiShield, FiTrendingUp, FiUsers, FiCode, FiSettings, FiFileText } from "react-icons/fi";
import {Button} from "@/components/ui/button";


export default function FeaturesPage() {
  const features = [
    {
      icon: FiFileText,
      title: "PDF Summarization",
      description: "Upload any PDF document and get instant summaries of key points and important information.",
    },
    {
      icon: FiUsers,
      title: "AI Document Chat",
      description: "Ask questions about your PDFs and get accurate answers powered by advanced AI understanding.",
    },
    {
      icon: FiShield,
      title: "Secure Document Storage",
      description: "Your documents are stored with enterprise-grade security and encryption.",
    },
    {
      icon: FiCheckCircle,
      title: "Smart Analysis",
      description: "AI-powered analysis extracts key insights and patterns from your documents.",
    },
    {
      icon: FiSettings,
      title: "Document Types",
      description: "Supports all major PDF formats including contracts, agreements, financial documents, and more.",
    },
    {
      icon: FiTrendingUp,
      title: "Coming Soon",
      description: "Future updates will include PDF editing, signing, and advanced document management features.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <section className="text-center mb-20">
          <h1 className="text-4xl md:text-5xl font-bold  mb-4 bg-gradient-to-r from-[#00f2fe] to-[#4facfe] bg-clip-text text-transparent">
            Instant PDF Summarization & AI Chat
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Save time and get instant insights from your PDF documents with our AI-powered platform. Upload any PDF and ask questions about its contents - perfect for contracts, agreements, financial documents, and more.
          </p>
        </section>

        {/* Key Features Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-8 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-6">
                <feature.icon className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </section>

        {/* Feature Highlights */}
        <section className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

            {/* Feature Content */}
            <div>
              <h2 className="text-3xl font-bold mb-6 text-gray-800">How It Works</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 p-3 bg-blue-100 rounded-lg">
                    <FiFileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Upload Your PDF</h3>
                    <p className="text-gray-600 mt-2">
                      Easily upload any PDF document - contracts, agreements, financial statements, and more.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 p-3 bg-blue-100 rounded-lg">
                    <FiUsers className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Ask Questions</h3>
                    <p className="text-gray-600 mt-2">
                      Interact with your documents using natural language - ask questions and get accurate answers.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 p-3 bg-blue-100 rounded-lg">
                    <FiShield className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Secure & Private</h3>
                    <p className="text-gray-600 mt-2">
                      Your documents are protected with enterprise-grade security and encryption.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <PricingSection />

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-[#00f2fe] to-[#4facfe] py-16 rounded-2xl mt-16">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4 text-white">Ready to Transform Your Document Workflow?</h2>
              <p className="text-xl text-white/90 mb-8">
                Start your free trial today and experience the power of AI-powered document processing.
              </p>
               <Button className="max-w-md bg-gradient-to-r from-[#00f2fe] to-[#4facfe] hover:from-[#4facfe] hover:to-[#00f2fe] text-white font-bold text-lg py-6 px-8 rounded-full transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#00f2fe]/40">
                                Start Your Free Trial
                              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
