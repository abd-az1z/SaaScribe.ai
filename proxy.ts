import { clerkMiddleware } from '@clerk/nextjs/server';

// Next.js 16 uses proxy.ts instead of middleware.ts
// See https://nextjs.org/docs/messages/middleware-to-proxy
// Clerk middleware handles authentication for protected routes
// See https://clerk.com/docs/references/nextjs/clerk-middleware

export const proxy = clerkMiddleware();

export const config = {
  matcher: [
    // Skip all internal paths (_next, images, etc.)
    '/((?!_next/image|_next/static|favicon.ico).*)',
    // Include all paths
    '/',
  ],
};
