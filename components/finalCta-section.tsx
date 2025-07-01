import React from 'react';
import { Button } from './ui/button';
import Link from 'next/link';

const FinalCtaSection = () => {



  return (
    <section className="py-28 px-6 md:px-10 bg-gradient-to-br from-white via-[#f0f9ff] to-[#e0f2fe]">
        <div className="container max-w-full">
          <div className="text-center">
            <div className="bg-white p-12 rounded-3xl border border-gray-100 shadow-xl">
              <h2 className="text-4xl font-bold mb-6 text-gray-800">
                Ready to Transform Your Documents?
              </h2>
              <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
                Join thousands of users who have transformed their document
                processing with AI. Start your free trial today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="max-w-md bg-gradient-to-r from-[#00f2fe] to-[#4facfe] hover:from-[#4facfe] hover:to-[#00f2fe] text-white font-bold text-lg py-6 px-8 rounded-full transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#00f2fe]/40">
                <Link href="/dashboard">Get Started – Free Trial</Link>
                </Button>
                <Button variant="outline" className="max-w-md border-2 border-gray-200 text-gray-700 font-semibold text-lg py-6 px-8 rounded-full transform transition-all duration-300 hover:scale-105 hover:bg-gray-50">
                <Link href="/features">Learn More</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section> 
  );
};

export default FinalCtaSection;
