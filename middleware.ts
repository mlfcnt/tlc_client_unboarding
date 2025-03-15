import {clerkMiddleware, createRouteMatcher} from "@clerk/nextjs/server";
import {NextResponse} from "next/server";

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher(["/sign-in(.*)"]);

// This middleware configures Clerk to handle authentication
export default clerkMiddleware(async (auth, req) => {
  const {userId} = await auth();
  const path = req.nextUrl.pathname;

  // Redirect root path to sign-in
  if (path === "/") {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  // Allow access to role-pending page for authenticated users
  if (path === "/role-pending" && userId) {
    return NextResponse.next();
  }

  // For public routes, allow access without authentication
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // For protected routes, check authentication
  if (!userId) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  return NextResponse.next();
});

export const config = {
  // Protects all routes, including api/trpc.
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
