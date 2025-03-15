import {redirect} from "next/navigation";
import {currentUser} from "@clerk/nextjs/server";
import Link from "next/link";

export default async function SalesDashboard() {
  try {
    const user = await currentUser();

    // If not logged in, redirect to sign-in
    if (!user) {
      redirect("/sign-in");
    }

    // Check if user has sales role
    const role = user.publicMetadata?.role as string | undefined;
    if (role !== "sales") {
      // Not a sales person, redirect to appropriate page
      if (role === "admin") {
        redirect("/admin/dashboard");
      } else {
        redirect("/role-pending");
      }
    }

    return (
      <div className="min-h-screen bg-gray-100">
        {/* Main content */}
        <main>
          <div className="py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
            {/* Dashboard content */}
            <div className="px-4 py-6 sm:px-0">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* New client card */}
                <div className="p-6 bg-white rounded-lg shadow">
                  <h2 className="mb-4 text-lg font-medium text-gray-900">
                    Nuevo cliente
                  </h2>
                  <p className="text-gray-600">
                    Registre un nuevo cliente potencial para clases de inglés.
                  </p>
                  <div className="mt-4">
                    <button className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700">
                      Registrar cliente
                    </button>
                  </div>
                </div>

                {/* Test requests card */}
                <div className="p-6 bg-white rounded-lg shadow">
                  <h2 className="mb-4 text-lg font-medium text-gray-900">
                    Solicitar prueba
                  </h2>
                  <p className="text-gray-600">
                    Solicite una prueba de nivel para un cliente.
                  </p>
                  <div className="mt-4">
                    <button className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700">
                      Solicitar
                    </button>
                  </div>
                </div>

                {/* Client status card */}
                <div className="p-6 bg-white rounded-lg shadow">
                  <h2 className="mb-4 text-lg font-medium text-gray-900">
                    Estado de clientes
                  </h2>
                  <p className="text-gray-600">
                    Vea el estado de todos sus clientes en el proceso.
                  </p>
                  <div className="mt-4">
                    <button className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700">
                      Ver clientes
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
