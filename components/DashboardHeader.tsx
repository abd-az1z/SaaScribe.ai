import { SignedIn, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "./ui/button";
import Image from "next/image";
import logo from "@/public/SaaScribelogo.png";
import { FiUploadCloud, FiFileText, FiZap } from "react-icons/fi";

const DashboardHeader = () => {
  return (
    <header className="w-full bg-white shadow-md py-4 px-6 flex items-center justify-between border-b border-gray-200">
      <div className="flex items-center gap-4">
        <Link href="/" className="flex  items-center">
          <Image src={logo} className="w-16 h-16" alt="SaaScribe.ai" />
          <span className="text-2xl/1   font-semibold text-[#00f2fe]">
            SaaScribe.ai
          </span>
        </Link>
      </div>

      <SignedIn>
        <nav className="flex items-center gap-4">
          <Button
            asChild
            className="hidden md:flex gap-2 text-white bg-gradient-to-r from-[#00f2fe] to-[#4facfe] hover:from-[#4facfe] transition-all duration-300 hover:scale-105 hover:to-[#00f2fe]"
          >
            <Link href="/dashboard/upgrade">
              <FiZap className="w-5 h-5" />
              Upgrade
            </Link>
          </Button>

          <Button
            asChild
            className="border-2 border-gray-200 bg-white text-gray-700 hidden md:flex transform transition-all duration-300 hover:scale-105 hover:bg-gray-200"
          >
            <Link href="/dashboard/document">
              <FiFileText className="w-5 h-5" />
              Documents
            </Link>
          </Button>

          <Button
            asChild
            className="border-2 border-gray-200 bg-white text-gray-700 hidden md:flex transform transition-all duration-300 hover:scale-105 hover:bg-gray-200"
          >
            <Link href="/dashboard/upload">
              <FiUploadCloud className="w-5 h-5" />
              Upload
            </Link>
          </Button>

          <UserButton afterSignOutUrl="/" />
        </nav>
      </SignedIn>
    </header>
  );
};

export default DashboardHeader;
