"use client";

import {useState, useEffect} from "react";
import {useUser} from "@clerk/nextjs";
import {useRouter} from "next/navigation";

interface User {
  id: string;
  emailAddresses: Array<{emailAddress: string}>;
  firstName?: string | null;
  lastName?: string | null;
}

export default function AdminDashboard() {
  const {user, isLoaded, isSignedIn} = useUser();
  const router = useRouter();
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
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

    // Fetch pending users
    const fetchPendingUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/users/pending");
        if (!response.ok) {
          throw new Error("Failed to fetch pending users");
        }
        const data = await response.json();
        setPendingUsers(data.users);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (isLoaded && isSignedIn) {
      fetchPendingUsers();
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

      <div className="bg-white rounded-lg shadow p-6">
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
    </div>
  );
}
