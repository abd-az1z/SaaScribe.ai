import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// This matcher targets all URLs under /dashboard, like /dashboard, /dashboard/settings, /dashboard/anything
const isDashboardRoute = createRouteMatcher(['/dashboard(.*)']);

export default clerkMiddleware(async (auth, req) => {
  if (isDashboardRoute(req)) {
    // Only dashboard routes are protected
    await auth.protect();
  }
});

export const config = {
  matcher: [
    '/((?!.*\\..*|_next).*)',  // applies to all app routes except static and internal files
    '/',                       // root
    '/(api|trpc)(.*)',         // API routes
  ],
};