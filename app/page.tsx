"use client";

import { Button } from "@/components/ui/button";
import FeaturesSection from "@/components/features-section";
import HowItWorksSection from "@/components/HowItWorksSection";
import PricingSection from "@/components/PricingSection";
import FinalCtaSection from "@/components/finalCta-section";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import useSubsscription from "@/hooks/useSubsscription";
import { FiCheckCircle } from "react-icons/fi";

export default function Home() {
  const { isLoaded: isUserLoaded } = useUser();
  const { hasActiveMembership, loading: subscriptionLoading } = useSubsscription();
  const isLoading = !isUserLoaded || subscriptionLoading;

  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-br from-white via-[#f0f9ff] to-[#e0f2fe]">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center py-28 px-6 md:px-10 bg-gradient-to-br from-white via-[#f0f9ff] to-[#e0f2fe]">
        <div className="container px-4">
          <div className="flex flex-col items-center text-center gap-10">
            <div className="space-y-8 max-w-4xl mx-auto">
              <h1 className="text-6xl font-bold tracking-tighter sm:text-7xl md:text-8xl">
                <div>
                  <div className="flex flex-col items-center">
                    <span className="block bg-gradient-to-r from-[#00f2fe] via-[#4facfe] to-[#00f2fe] bg-clip-text text-transparent animate-gradient">
                      SaaScribe.ai
                    </span>
                  </div>
                </div>
              </h1>
              <div>
                <p className="text-2xl sm:text-3xl text-gray-800 leading-relaxed">
                  {isLoading ? (
                    <span className="animate-pulse">Loading your membership status...</span>
                  ) : hasActiveMembership ? (
                    <>
                      Welcome back, <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">PRO Member</span>! 
                      Enjoy your premium features.
                    </>
                  ) : (
                    <>
                      Transform your PDFs into intelligent conversations with{" "}
                      <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#00f2fe] to-[#4facfe]">
                        AI-powered
                      </span>{" "}
                      document understanding.
                    </>
                  )}
                </p>
              </div>
              <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
                {isLoading ? (
                  <div className="h-[60px] w-48 bg-gray-200 rounded-full animate-pulse"></div>
                ) : hasActiveMembership ? (
                  <div className="flex flex-col items-center gap-2">
                    <Button asChild className="max-w-md bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold text-lg py-6 px-8 rounded-full transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/40">
                      <Link href="/dashboard">Go to Dashboard</Link>
                    </Button>
                    <div className="flex items-center gap-2 text-sm text-purple-600">
                      <FiCheckCircle className="w-4 h-4" />
                      <span>PRO Member Benefits Active</span>
                    </div>
                  </div>
                ) : (
                  <>
                    <Button asChild className="max-w-md bg-gradient-to-r from-[#00f2fe] to-[#4facfe] hover:from-[#4facfe] hover:to-[#00f2fe] text-white font-bold text-lg py-6 px-8 rounded-full transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#00f2fe]/40">
                      <Link href="/dashboard">Get Started – Free Trial</Link>
                    </Button>
                    <Button asChild
                      variant="outline"
                      className="max-w-md border-2 border-gray-200 text-gray-700 font-semibold text-lg py-6 px-8 rounded-full transform transition-all duration-300 hover:scale-105 hover:bg-white/50"
                    >
                      <Link href="/features">Learn More</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <FeaturesSection />

      {/* How It Works Section */}
      <HowItWorksSection />

      {/* Pricing Section */}
      <PricingSection />

      {/* Final CTA Section - Only show for non-PRO members */}
      {!isLoading && !hasActiveMembership && <FinalCtaSection />}
    </main>
  );
}
