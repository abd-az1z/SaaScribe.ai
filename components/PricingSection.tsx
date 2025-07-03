"use client";

import { Check, Zap, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

type ButtonVariant = "default" | "outline" | "secondary" | "ghost" | "link" | "destructive" | null | undefined;

export default function PricingSection() {
  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white via-[#f8fafc] to-[#e0f2fe]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#00f2fe] via-[#4facfe] to-[#00f2fe] bg-clip-text text-transparent mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Choose the perfect plan for your needs. Start for free, upgrade when you&apos;re ready.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-8 max-w-5xl mx-auto">
          {/* Free Plan */}
          <div className="group relative rounded-3xl bg-white/80 backdrop-blur-sm border border-white/20 p-8 shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900 group-hover:bg-gradient-to-r group-hover:from-[#00f2fe] group-hover:to-[#4facfe] group-hover:bg-clip-text group-hover:text-transparent transition-all">
                  Free
                </h3>
                <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 bg-opacity-30">
                  <Check className="w-6 h-6 text-blue-500" />
                </span>
              </div>
              <p className="mt-2 text-gray-600">Perfect for trying out our basic features</p>
              <p className="mt-6">
                <span className="text-5xl font-bold bg-gradient-to-r from-[#00f2fe] to-[#4facfe] bg-clip-text text-transparent">
                  $0
                </span>
                <span className="text-lg font-medium text-gray-500">/month</span>
              </p>
            </div>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Up to 3 PDFs only</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">3-4 questions per PDF</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">5 page limit per file</span>
              </li>
            </ul>
            
            <Button
              className="w-full py-6 text-lg font-semibold transition-all duration-300 transform hover:scale-[1.02] shadow-lg bg-white border-2 border-gray-200 text-gray-800 hover:bg-gray-50"
              variant="outline"
            >
              Get Started
            </Button>
          </div>

          {/* Pro Plan */}
          <div className="group relative rounded-3xl bg-white/80 backdrop-blur-sm border border-white/20 p-8 shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ring-2 ring-[#00f2fe] ring-offset-4 ring-offset-white/50">
            <div className="absolute top-10 right-22">
              <span className="inline-flex items-center rounded-full bg-gradient-to-r from-[#00f2fe] to-[#4facfe] px-4 py-1.5 text-sm font-semibold text-white shadow-lg">
                <Sparkles className="mr-1.5 h-4 w-4" />
                Most Popular
              </span>
            </div>
            
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900 group-hover:bg-gradient-to-r group-hover:from-[#00f2fe] group-hover:to-[#4facfe] group-hover:bg-clip-text group-hover:text-transparent transition-all">
                  Pro
                </h3>
                <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-[#00f2fe] to-[#4facfe] bg-opacity-30">
                  <Zap className="w-6 h-6 text-[#4facfe]" />
                </span>
              </div>
              <p className="mt-2 text-gray-600">For power users who need more</p>
              <p className="mt-6">
                <span className="text-5xl font-bold bg-gradient-to-r from-[#00f2fe] to-[#4facfe] bg-clip-text text-transparent">
                  $5.99
                </span>
                <span className="text-lg font-medium text-gray-500">/month</span>
              </p>
            </div>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Up to 30 PDFs</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Upto 100 questions per PDF</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Ability to delete PDFs</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Advance analytics</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Priority support</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Full power of AI Chat with Memory Recall</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Early access to new features</span>
              </li>
            </ul>
            
            <Button
              className="w-full py-6 text-lg font-semibold transition-all duration-300 transform hover:scale-[1.02] shadow-lg bg-gradient-to-r from-[#00f2fe] to-[#4facfe] hover:from-[#4facfe] hover:to-[#00f2fe] text-white"
              variant="default"
            >
              Upgrade Now
            </Button>
          </div>
        </div>
        
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-4">Need a custom plan for your team?</p>
          <Button
            variant="outline"
            className="group border-2 border-gray-200 bg-white/50 backdrop-blur-sm px-8 py-6 text-lg font-medium text-gray-700 hover:bg-white hover:border-[#4facfe] transition-all hover:shadow-lg"
            onClick={() => window.location.href = '/aboutus'}
          >
            <span className="bg-gradient-to-r from-[#00f2fe] to-[#4facfe] bg-clip-text text-transparent">
              Contact Sales
            </span>
            <svg
              className="ml-2 h-5 w-5 text-[#4facfe] group-hover:translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
}
