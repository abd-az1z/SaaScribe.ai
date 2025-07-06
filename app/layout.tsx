import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "SaaScribe.ai",
  description: "Chat with your PDFs using AI-powered document intelligence",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
       <body className={`${nunito.variable} font-sans antialiased  flex-col bg-gradient-to-br from-white via-[#f0f9ff] to-[#e0f2fe] text-foreground`}>
          <Toaster/>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}