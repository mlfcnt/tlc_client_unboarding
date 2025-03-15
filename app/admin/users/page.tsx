"use client";

import {useState, useEffect} from "react";
import Image from "next/image";
import {UserButton, useUser} from "@clerk/nextjs";
import {useRouter} from "next/navigation";
import Link from "next/link";

interface User {
  id: string;
  emailAddress: string;
  firstName?: string | null;
  lastName?: string | null;
  role?: string;
}

export default function AdminUsersPage() {
  const {user, isLoaded, isSignedIn} = useUser();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is loaded and signed in
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
      return;
    }

    // Check if user is an admin
    if (isLoaded && isSignedIn) {
      const role = user?.publicMetadata?.role as string | undefined;
      if (role !== "admin") {
        router.push("/");
        return;
      }
    }

    // Fetch users from Clerk
    const fetchUsers = async () => {
      try {
        setLoading(true);

        // This is a simplified example - in a real app, you would create a backend API
        // that uses the Clerk Admin SDK to fetch users and update metadata
        // For now, we'll just simulate it with a timeout

        setTimeout(() => {
          // Simulated user data
          const mockUsers: User[] = [
            {
              id: user?.id || "admin-user",
              emailAddress:
                user?.emailAddresses[0]?.emailAddress || "admin@example.com",
              firstName: user?.firstName,
              lastName: user?.lastName,
              role: "admin",
            },
            {
              id: "pending-user-1",
              emailAddress: "pending1@example.com",
              firstName: "Pending",
              lastName: "User",
              role: undefined,
            },
            {
              id: "sales-user-1",
              emailAddress: "sales1@example.com",
              firstName: "Sales",
              lastName: "Person",
              role: "sales",
            },
          ];

          setUsers(mockUsers);
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError("Error fetching users");
        setLoading(false);
        console.error(err);
      }
    };

    fetchUsers();
  }, [isLoaded, isSignedIn, user, router]);

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      // In a real app, you would call your backend API to update the user's role
      // For now, we'll just update the local state
      setUsers(users.map((u) => (u.id === userId ? {...u, role: newRole} : u)));

      // Show success message
      alert(`Role updated to ${newRole} for user ${userId}`);
    } catch (err) {
      setError("Error updating user role");
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Cargando usuarios...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="flex items-center justify-between px-4 py-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">
              Gestión de Usuarios
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/admin/dashboard"
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Volver al Panel
            </Link>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main>
        <div className="py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="px-4 py-6 bg-white rounded-lg shadow sm:px-6">
            <h2 className="mb-6 text-xl font-semibold">Usuarios del Sistema</h2>

            {error && (
              <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-md">
                {error}
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                    >
                      Usuario
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                    >
                      Rol Actual
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                    >
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {user.emailAddress}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 text-xs font-semibold leading-5 rounded-full ${
                            user.role === "admin"
                              ? "text-green-800 bg-green-100"
                              : user.role === "sales"
                              ? "text-blue-800 bg-blue-100"
                              : "text-yellow-800 bg-yellow-100"
                          }`}
                        >
                          {user.role || "Pendiente"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleRoleChange(user.id, "admin")}
                            className="text-indigo-600 hover:text-indigo-900"
                            disabled={user.role === "admin"}
                          >
                            Hacer Admin
                          </button>
                          <button
                            onClick={() => handleRoleChange(user.id, "sales")}
                            className="text-blue-600 hover:text-blue-900"
                            disabled={user.role === "sales"}
                          >
                            Hacer Ventas
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 text-sm text-gray-500">
              <p>
                Nota: En una aplicación real, estos cambios actualizarían los
                metadatos de usuario en Clerk.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
