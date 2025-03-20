import {currentUser, clerkClient as clerk} from "@clerk/nextjs/server";
import Link from "next/link";
import {redirect} from "next/navigation";

export const dynamic = "force-dynamic";

export default async function RolePendingPage() {
  let redirectPath: string | null = null;

  try {
    const user = await currentUser();

    // If no user is found, redirect to sign-in
    if (!user) {
      redirectPath = "/sign-in";
    } else {
      // If user has a role, redirect to appropriate dashboard
      const role = user.publicMetadata?.role as string | undefined;

      if (role === "admin") {
        redirectPath = "/dashboard";
      } else if (role === "sales") {
        redirectPath = "/dashboard";
      } else {
        // User is authenticated but has no role, show pending page
        const clerkClient = await clerk();
        await clerkClient.users.updateUserMetadata(user.id, {
          publicMetadata: {
            role: "sales",
          },
        });
        redirectPath = "/dashboard";
      }
    }
  } catch (error) {
    console.error("Error in Role-pending page:", error);

    // Show detailed error information in development
    const errorMessage =
      process.env.NODE_ENV === "development"
        ? `${error instanceof Error ? error.message : "Unknown error"}`
        : "Ha ocurrido un error. Por favor, intente nuevamente más tarde.";

    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Error de Sistema
            </h1>
            <p className="mt-4 text-gray-600">{errorMessage}</p>
            {process.env.NODE_ENV === "development" && (
              <pre className="mt-4 p-4 bg-gray-100 rounded text-xs overflow-auto max-w-full">
                {error instanceof Error
                  ? error.stack
                  : JSON.stringify(error, null, 2)}
              </pre>
            )}
            <div className="mt-8">
              <Link
                href="/"
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Volver al inicio
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  } finally {
    // Handle redirects after all resources are cleaned up
    if (redirectPath) {
      console.log(`Role-pending page: Executing redirect to ${redirectPath}`);
      redirect(redirectPath);
    }
  }
}
