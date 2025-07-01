import React from "react";

const steps = [
  {
    title: "Upload Your PDF",
    description: "Easily upload your PDF documents through our secure interface.",
    color: "#00f2fe"
  },
  {
    title: "AI Processing",
    description: "Our AI system processes your PDF and creates embeddings for intelligent search.",
    color: "#a18cd1"
  },
  {
    title: "Start Chatting",
    description: "Ask questions about your PDF and get instant, accurate answers.",
    color: "#ff6b6b"
  }
];

export default function HowItWorksSection() {
  return (
    <section className="py-28 px-6 md:px-10 bg-gradient-to-br from-[#e0f2fe] via-[#f0f9ff] to-white">
      <div className="container px-4">
        <h2 className="text-4xl font-bold text-center mb-6 bg-gradient-to-r from-[#00f2fe] via-[#4facfe] to-[#00f2fe] bg-clip-text text-transparent">How It Works</h2>
        <p className="text-center text-gray-700 mb-16 text-lg max-w-2xl mx-auto">
          Get started in minutes with our simple three-step process
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3/4 h-1 bg-gradient-to-r from-[#00f2fe] via-[#a18cd1] to-[#ff6b6b] rounded-full opacity-20"></div>
          </div>
          {steps.map((step, index) => (
            <div key={step.title} className="relative z-10">
              <div className="h-full p-8 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <div
                  className={`flex items-center justify-center w-16 h-16 rounded-2xl mb-6 text-2xl font-bold text-slate-600 ${
                    step.color === "#00f2fe" 
                      ? "bg-gradient-to-br from-[#00f2fe]/30 to-[#00f2fe]/10 border border-[#00f2fe]/30"
                      : step.color === "#a18cd1"
                      ? "bg-gradient-to-br from-[#a18cd1]/30 to-[#a18cd1]/10 border border-[#a18cd1]/30"
                      : "bg-gradient-to-br from-[#ff6b6b]/30 to-[#ff6b6b]/10 border border-[#ff6b6b]/30"
                  }`}
                >
                  {index + 1}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-800">{step.title}</h3>
                <p className="text-gray-700 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}