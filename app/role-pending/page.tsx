import {UserButton} from "@clerk/nextjs";
import {currentUser} from "@clerk/nextjs/server";
import Link from "next/link";
import {redirect} from "next/navigation";

export default async function RolePendingPage() {
  let redirectPath: string | null = null;

  try {
    console.log("Role-pending page: Attempting to get current user...");
    const user = await currentUser();
    console.log(
      "Role-pending page: Current user:",
      user ? `User ID: ${user.id}` : "No user found"
    );

    // If no user is found, redirect to sign-in
    if (!user) {
      console.log(
        "Role-pending page: No user found, setting redirect to sign-in"
      );
      redirectPath = "/sign-in";
    } else {
      // If user has a role, redirect to appropriate dashboard
      const role = user.publicMetadata?.role as string | undefined;
      console.log("Role-pending page: User role:", role || "No role assigned");

      if (role === "admin") {
        console.log(
          "Role-pending page: User is admin, setting redirect to admin dashboard"
        );
        redirectPath = "/dashboard";
      } else if (role === "sales") {
        console.log(
          "Role-pending page: User is sales, setting redirect to sales dashboard"
        );
        redirectPath = "/dashboard";
      } else {
        // User is authenticated but has no role, show pending page
        return (
          <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold text-gray-900">
                  Cuenta Pendiente de Aprobación
                </h1>
                <p className="mt-4 text-gray-600">
                  Su cuenta ha sido creada correctamente, pero necesita ser
                  asignada a un rol por un administrador.
                </p>
                <p className="mt-2 text-gray-600">
                  Por favor, contacte al administrador del sistema para obtener
                  acceso.
                </p>

                <div className="flex items-center justify-center mt-8 space-x-4">
                  <UserButton afterSignOutUrl="/" />
                  <span className="text-sm text-gray-500">
                    {user.emailAddresses[0]?.emailAddress}
                  </span>
                </div>

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
