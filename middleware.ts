import { clerkMiddleware } from '@clerk/nextjs/server';
 
// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/clerk-middleware for more information about configuring your middleware
export default clerkMiddleware();
 
export const config = {
  matcher: [
    // Skip all internal paths (_next, images, etc.)
    '/((?!_next/image|_next/static|favicon.ico).*)',
    // Include all paths
    '/',
  ],
};