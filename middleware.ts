import {clerkMiddleware} from "@clerk/nextjs/server";
import {NextResponse} from "next/server";

// This middleware configures Clerk to handle authentication
export default clerkMiddleware(async (auth, req) => {
  const {userId} = await auth();
  const path = req.nextUrl.pathname;

  // Allow access to sign-in page without authentication
  if (path === "/sign-in") {
    return NextResponse.next();
  }

  // Redirect to sign-in if not authenticated
  if (!userId) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  // If authenticated and trying to access root, redirect to appropriate dashboard
  if (path === "/") {
    // For now, redirect to role-pending, the page itself will handle further redirection
    return NextResponse.redirect(new URL("/role-pending", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
