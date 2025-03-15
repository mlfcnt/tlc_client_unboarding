"use client";

import {useState, useEffect} from "react";
import {useUser} from "@clerk/nextjs";
import {useRouter} from "next/navigation";

interface User {
  id: string;
  emailAddresses: Array<{emailAddress: string}>;
  firstName?: string | null;
  lastName?: string | null;
  role?: string;
}

export default function AdminDashboard() {
  const {user, isLoaded, isSignedIn} = useUser();
  const router = useRouter();
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
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

    // Fetch all users and pending users
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const [pendingResponse, allUsersResponse] = await Promise.all([
          fetch("/api/users/pending"),
          fetch("/api/users"),
        ]);

        if (!pendingResponse.ok || !allUsersResponse.ok) {
          throw new Error("Failed to fetch users");
        }

        const [pendingData, allUsersData] = await Promise.all([
          pendingResponse.json(),
          allUsersResponse.json(),
        ]);

        setPendingUsers(pendingData.users);
        setAllUsers(allUsersData.users);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (isLoaded && isSignedIn) {
      fetchUsers();
    }
  }, [isLoaded, isSignedIn, user?.publicMetadata?.role, router]);

  const approveUser = async (userId: string, role: "admin" | "sales") => {
    try {
      const response = await fetch("/api/users/pending", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          targetUserId: userId,
          role,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update user role");
      }

      // Refresh the pending users list
      const updatedUsers = pendingUsers.filter((user) => user.id !== userId);
      setPendingUsers(updatedUsers);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const response = await fetch("/api/users", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          targetUserId: userId,
          role: newRole,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update user role");
      }

      // Refresh both user lists
      const [pendingResponse, allUsersResponse] = await Promise.all([
        fetch("/api/users/pending"),
        fetch("/api/users"),
      ]);

      if (!pendingResponse.ok || !allUsersResponse.ok) {
        throw new Error("Failed to refresh user lists");
      }

      const [pendingData, allUsersData] = await Promise.all([
        pendingResponse.json(),
        allUsersResponse.json(),
      ]);

      setPendingUsers(pendingData.users);
      setAllUsers(allUsersData.users);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  if (!isLoaded || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Cargando...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Panel de Administración</h1>

      {/* Pending Users Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Usuarios Pendientes</h2>

        {pendingUsers.length === 0 ? (
          <p className="text-gray-500">
            No hay usuarios pendientes de aprobación.
          </p>
        ) : (
          <div className="space-y-4">
            {pendingUsers.map((pendingUser) => (
              <div
                key={pendingUser.id}
                className="border rounded-lg p-4 flex items-center justify-between"
              >
                <div>
                  <p className="font-medium">
                    {pendingUser.firstName} {pendingUser.lastName}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {pendingUser.emailAddresses[0]?.emailAddress}
                  </p>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => approveUser(pendingUser.id, "sales")}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  >
                    Aprobar como Ventas
                  </button>
                  <button
                    onClick={() => approveUser(pendingUser.id, "admin")}
                    className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
                  >
                    Aprobar como Admin
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* All Users Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Todos los Usuarios</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rol
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {allUsers.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {user.firstName} {user.lastName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {user.emailAddresses[0]?.emailAddress}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={user.role || "pending"}
                      onChange={(e) => updateUserRole(user.id, e.target.value)}
                      className={`px-2 py-1 text-sm font-semibold rounded border
                        ${
                          user.role === "admin"
                            ? "border-purple-200 bg-purple-50 text-purple-800"
                            : user.role === "sales"
                            ? "border-blue-200 bg-blue-50 text-blue-800"
                            : "border-gray-200 bg-gray-50 text-gray-800"
                        }`}
                    >
                      <option value="pending">Pendiente</option>
                      <option value="sales">Ventas</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
