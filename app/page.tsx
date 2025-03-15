import Image from "next/image";
import Link from "next/link";
import {currentUser} from "@clerk/nextjs/server";
import {redirect} from "next/navigation";

export default async function Home() {
  let redirectPath: string | null = null;

  try {
    // Check if user is already signed in
    console.log("Attempting to get current user...");
    const user = await currentUser();
    console.log(
      "Current user:",
      user ? `User ID: ${user.id}` : "No user found"
    );

    if (user) {
      // If user is signed in, check role and render appropriate content
      const role = user.publicMetadata?.role as string | undefined;
      console.log("User role:", role || "No role assigned");

      if (role === "admin") {
        console.log("Setting redirect to admin dashboard...");
        redirectPath = "/admin/dashboard";
      } else if (role === "sales") {
        console.log("Setting redirect to sales dashboard...");
        redirectPath = "/sales/dashboard";
      } else {
        // No role assigned yet - redirect to pending page
        console.log(
          "No role assigned, setting redirect to role-pending page..."
        );
        redirectPath = "/role-pending";
      }
    }

    // If not signed in, show landing page
    if (!user) {
      console.log("No user signed in, showing landing page");
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
          <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
            <div className="flex flex-col items-center text-center">
              <Image
                src="/logo.png"
                alt="Logo"
                width={150}
                height={150}
                className="mb-4"
                priority
              />
              <h1 className="text-2xl font-bold text-gray-900">
                Bienvenido al Sistema
              </h1>
              <p className="mt-4 text-gray-600">
                Por favor, inicie sesión para acceder a su panel.
              </p>

              <div className="mt-8">
                <Link
                  href="/sign-in"
                  className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
                >
                  Iniciar Sesión
                </Link>
              </div>
            </div>
          </div>
        </div>
      );
    }
  } catch (error) {
    console.error("Error in Home page:", error);

    // Show detailed error information in development
    const errorMessage =
      process.env.NODE_ENV === "development"
        ? `${error instanceof Error ? error.message : "Unknown error"}`
        : "Ha ocurrido un error. Por favor, intente nuevamente más tarde.";

    // Show error page
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
                href="/sign-in"
                className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
              >
                Iniciar Sesión
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  } finally {
    // Handle redirects after all resources are cleaned up
    if (redirectPath) {
      console.log(`Executing redirect to ${redirectPath}`);
      redirect(redirectPath);
    }
  }
}
