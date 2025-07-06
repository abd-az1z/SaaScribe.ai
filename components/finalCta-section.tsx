import React from 'react';
import { Button } from './ui/button';
import Link from 'next/link';
import { useUser } from "@clerk/nextjs";
import useSubsscription from "@/hooks/useSubsscription";
import { CheckCircle2 } from "lucide-react";
import { createStripePortal } from "@/actions/createStripePortal";

const FinalCtaSection = () => {
  const { isLoaded: isUserLoaded } = useUser();
  const { hasActiveMembership, loading: subscriptionLoading } = useSubsscription();
  const isLoading = !isUserLoaded || subscriptionLoading;

  if (isLoading) {
    return (
      <section className="py-28 px-6 md:px-10 bg-gradient-to-br from-white via-[#f0f9ff] to-[#e0f2fe]">
        <div className="container max-w-full">
          <div className="bg-white p-12 rounded-3xl border border-gray-100 shadow-xl">
            <div className="h-10 bg-gray-200 rounded-full w-1/3 mx-auto mb-6 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto mb-8 animate-pulse"></div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="h-14 bg-gray-200 rounded-full w-48 animate-pulse"></div>
              <div className="h-14 bg-gray-200 rounded-full w-48 animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (hasActiveMembership) {
    return (
      <section className="py-28 px-6 md:px-10 bg-gradient-to-br from-white via-[#f0f9ff] to-[#e0f2fe]">
        <div className="container max-w-full">
          <div className="bg-white p-12 rounded-3xl border border-gray-100 shadow-xl">
            <div className="inline-flex items-center justify-center px-6 py-2 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 mb-6">
              <CheckCircle2 className="w-5 h-5 text-purple-600 mr-2" />
              <span className="text-purple-700 font-medium">PRO Member Benefits Active</span>
            </div>
            <h2 className="text-4xl font-bold mb-6 text-gray-800">
              Unlock the Full Power of SaaScribe
            </h2>
            <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
              You&apos;re all set with PRO access! Manage your subscription or dive into advanced features.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={async () => {
                  try {
                    const portalUrl = await createStripePortal();
                    if (portalUrl) window.location.href = portalUrl;
                  } catch (error) {
                    console.error('Error redirecting to portal:', error);
                  }
                }}
                className="max-w-md bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold text-lg py-6 px-8 rounded-full transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/40"
              >
                Manage Subscription
              </Button>
              <Button 
                asChild
                variant="outline" 
                className="max-w-md border-2 border-gray-200 text-gray-700 font-semibold text-lg py-6 px-8 rounded-full transform transition-all duration-300 hover:scale-105 hover:bg-gray-50"
              >
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

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
