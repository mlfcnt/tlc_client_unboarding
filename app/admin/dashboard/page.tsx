import Image from "next/image";
import {UserButton} from "@clerk/nextjs";
import {redirect} from "next/navigation";
import {currentUser} from "@clerk/nextjs/server";
import Link from "next/link";

export default async function AdminDashboard() {
  try {
    const user = await currentUser();

    // If not logged in, redirect to sign-in
    if (!user) {
      redirect("/sign-in");
    }

    // Check if user has admin role
    const role = user.publicMetadata?.role as string | undefined;
    if (role !== "admin") {
      // Not an admin, redirect to appropriate page
      if (role === "sales") {
        redirect("/sales/dashboard");
      } else {
        redirect("/role-pending");
      }
    }

    return (
      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="flex items-center justify-between px-4 py-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="flex items-center">
              <Image
                src="/logo.png"
                alt="Logo"
                width={50}
                height={50}
                className="mr-3"
              />
              <h1 className="text-xl font-bold text-gray-900">
                Panel de Administrador
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {user.emailAddresses[0]?.emailAddress}
              </span>
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </header>

        {/* Main content */}
        <main>
          <div className="py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
            {/* Dashboard content */}
            <div className="px-4 py-6 sm:px-0">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* User Management card */}
                <div className="p-6 bg-white rounded-lg shadow">
                  <h2 className="mb-4 text-lg font-medium text-gray-900">
                    Gestión de Usuarios
                  </h2>
                  <p className="text-gray-600">
                    Administre los roles de los usuarios del sistema.
                  </p>
                  <div className="mt-4">
                    <Link
                      href="/admin/users"
                      className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    >
                      Administrar Usuarios
                    </Link>
                  </div>
                </div>

                {/* Test requests card */}
                <div className="p-6 bg-white rounded-lg shadow">
                  <h2 className="mb-4 text-lg font-medium text-gray-900">
                    Solicitudes de prueba
                  </h2>
                  <p className="text-gray-600">
                    No hay solicitudes de prueba pendientes.
                  </p>
                  <div className="mt-4">
                    <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                      Ver todas
                    </button>
                  </div>
                </div>

                {/* Test results card */}
                <div className="p-6 bg-white rounded-lg shadow">
                  <h2 className="mb-4 text-lg font-medium text-gray-900">
                    Resultados de pruebas
                  </h2>
                  <p className="text-gray-600">
                    No hay resultados de pruebas recientes.
                  </p>
                  <div className="mt-4">
                    <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                      Ver todos
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  } catch (error) {
    console.error("Error:", error);
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Error de Sistema
            </h1>
            <p className="mt-4 text-gray-600">
              Ha ocurrido un error. Por favor, intente nuevamente más tarde.
            </p>
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
