"use client";

import { SignedIn, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "./ui/button";
import Image from "next/image";
import logo from "@/public/SaaScribelogo.png";
import { FiUploadCloud, FiFileText, FiZap, FiPlus, FiHome } from "react-icons/fi";
import { useState, useEffect, useTransition } from "react";
import useSubsscription from "@/hooks/useSubsscription";
import { createStripePortal } from "@/actions/createStripePortal";

const DashboardHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { hasActiveMembership } = useSubsscription();
  const [isPending, startTransition] = useTransition();

  // Handle scroll for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`w-full bg-white shadow-md py-3 px-4 sm:py-4 sm:px-6 flex items-center justify-between fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'shadow-lg' : 'shadow-md'
      }`}
    >
      <div className="flex items-center w-full justify-between">
        <Link href="/" className="flex items-center" onClick={() => setIsMenuOpen(false)}>
          <Image 
            src={logo} 
            className="w-12 h-12 sm:w-16 sm:h-16" 
            alt="SaaScribe.ai" 
            priority
          />
          <span className="text-xl sm:text-2xl font-semibold text-[#00f2fe] ml-2 sm:ml-3">
            SaaScribe.ai
          </span>
        </Link>

        <SignedIn>
          <div className="flex items-center gap-4">
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-3 lg:gap-4">
              <Button
                onClick={(e) => {
                  if (hasActiveMembership) {
                    e.preventDefault();
                    startTransition(async () => {
                      try {
                        const portalUrl = await createStripePortal();
                        if (portalUrl) {
                          window.location.href = portalUrl;
                        }
                      } catch (error) {
                        console.error('Error redirecting to portal:', error);
                      }
                    });
                  }
                }}
                asChild={!hasActiveMembership}
                disabled={isPending}
                className={`gap-2 text-white whitespace-nowrap ${
                  hasActiveMembership
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 cursor-pointer'
                    : 'bg-gradient-to-r from-[#00f2fe] to-[#4facfe] hover:from-[#4facfe] hover:to-[#00f2fe]'
                } transition-all duration-300 relative overflow-hidden`}
              >
                {hasActiveMembership ? (
                  <div className="flex items-center gap-2 px-4 py-2">
                    {isPending ? (
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    ) : null}
                    <FiZap className={`w-4 h-4 sm:w-5 sm:h-5 ${isPending ? 'opacity-50' : ''}`} />
                    <span className={isPending ? 'opacity-50' : ''}>PRO</span>
                  </div>
                ) : (
                  <Link href="/dashboard/upgrade">
                    <FiZap className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Upgrade</span>
                  </Link>
                )}
              </Button>

              <Button
                asChild
                variant="outline"
                className="gap-2 border-2 border-gray-200 bg-white text-gray-700 hover:bg-gray-100 hover:border-gray-300 whitespace-nowrap"
              >
                <Link href="/dashboard">
                  <FiFileText className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Documents</span>
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="gap-2 border-2 border-gray-200 bg-white text-gray-700 hover:bg-gray-100 hover:border-gray-300 whitespace-nowrap"
              >
                <Link href="/dashboard/upload">
                  <FiUploadCloud className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Upload</span>
                </Link>
              </Button>
            </nav>

            {/* Mobile Icons */}
            <div className="md:hidden flex items-center -gap-2">
              <Link 
                href="/dashboard/upload" 
                className="p-2 rounded-md text-[#00f2fe] hover:bg-gray-100 transition-colors"
                aria-label="Upload"
              >
                <FiPlus className="w-5 h-5" />
              </Link>
              <Link 
                href={hasActiveMembership ? '#' : '/dashboard/upgrade'}
                onClick={async (e) => {
                  if (hasActiveMembership) {
                    e.preventDefault();
                    startTransition(async () => {
                      try {
                        const portalUrl = await createStripePortal();
                        if (portalUrl) {
                          window.location.href = portalUrl;
                        }
                      } catch (error) {
                        console.error('Error redirecting to portal:', error);
                      }
                    });
                  }
                }}
                className={`p-2 rounded-md flex-col justify-center items-center transition-colors relative overflow-hidden ${
                  hasActiveMembership ? 'text-purple-500' : 'text-[#00f2fe]'
                } hover:bg-gray-100 ${isPending ? 'pointer-events-none' : ''}`}
                aria-label={hasActiveMembership ? 'Manage Subscription' : 'Upgrade'}
              >
                {isPending && (
                  <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
                    <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
                <FiZap className={`w-5 h-5 ${isPending ? 'opacity-50' : ''}`} />
                <span className={`text-[12px] ${isPending ? 'opacity-50' : ''}`}>
                  {hasActiveMembership ? 'PRO' : 'Upgrade'}
                </span>
              </Link>
            </div>

            {/* User Button */}
            <div className="">
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </SignedIn>
      </div>
    </header>
  );
};

export default DashboardHeader;
