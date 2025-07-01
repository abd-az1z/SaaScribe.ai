import React from 'react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
  color: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon, color }) => (
  <div className="group">
    <div className="h-full p-8 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
      <div 
        className={`flex items-center justify-center w-16 h-16 bg-gradient-to-br ${color} rounded-2xl mb-6 text-2xl`}
      >
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-4 text-gray-800 group-hover:bg-gradient-to-r group-hover:from-[#00f2fe] group-hover:to-[#4facfe] group-hover:bg-clip-text group-hover:text-transparent transition-all">
        {title}
      </h3>
      <p className="text-gray-600 text-lg leading-relaxed">{description}</p>
    </div>
  </div>
);

const FeaturesSection = () => {
  const features = [
    {
      title: "AI-Powered PDF Chat",
      description: "Interact with your PDFs using natural language, powered by advanced AI models.",
      icon: "🤖",
      color: "from-[#00f2fe] to-[#4facfe]"
    },
    {
      title: "Secure Authentication",
      description: "Protect your data with secure authentication using Clerk or Firebase Auth.",
      icon: "🔒",
      color: "from-[#ff6b6b] to-[#ff8e8e]"
    },
    {
      title: "Cloud Storage",
      description: "Store and manage your PDFs securely in the cloud with Firebase Storage.",
      icon: "☁️",
      color: "from-[#a18cd1] to-[#fbc2eb]"
    }
  ];

  return (
    <section className="py-28 px-6 md:px-10 bg-gradient-to-br from-white via-[#f8fafc] to-[#e0f2fe]">
      <div className="container px-4">
        <h2 className="text-4xl font-bold text-center mb-6 bg-gradient-to-r from-[#00f2fe] via-[#4facfe] to-[#00f2fe] bg-clip-text text-transparent">
          Why Choose SaaScribe.ai
        </h2>
        <p className="text-center text-gray-700 mb-16 text-lg max-w-2xl mx-auto">
          Experience the future of document interaction with our cutting-edge AI technology
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
