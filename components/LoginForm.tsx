"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // In a real app, these would be environment variables
    // This is just for demonstration
    if (role === "admin" && username === "admin" && password === "admin123") {
      router.push("/admin/dashboard");
    } else if (
      role === "sales" &&
      username === "ventas" &&
      password === "ventas123"
    ) {
      router.push("/sales/dashboard");
    } else {
      setError("Nombre de usuario o contraseña incorrectos");
    }
  };

  // Define colors based on role
  const getButtonColor = () => {
    return role === "admin"
      ? "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
      : "bg-green-600 hover:bg-green-700 focus:ring-green-500";
  };

  return (
    <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
      {error && (
        <div className="p-3 text-sm text-red-700 bg-red-100 rounded-md">
          {error}
        </div>
      )}

      <div>
        <label
          htmlFor="role"
          className="block text-sm font-medium text-gray-700"
        >
          Rol
        </label>
        <select
          id="role"
          name="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="admin">Administrador</option>
          <option value="sales">Ventas</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="username"
          className="block text-sm font-medium text-gray-700"
        >
          Nombre de usuario
        </label>
        <input
          id="username"
          name="username"
          type="text"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <button
          type="submit"
          className={`flex justify-center w-full px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${getButtonColor()}`}
        >
          Iniciar sesión
        </button>
      </div>
    </form>
  );
}
