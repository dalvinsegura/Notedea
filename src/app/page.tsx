"use client";

import { useAuth } from "@/contexts/AuthContext";
import LoginForm from "@/components/LoginForm";

export default function Home() {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Cargando...</div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Notedea</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Bienvenido, {user.email}</span>
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              ¡Hola! Aquí estarán tus ideas
            </h2>
            <p className="text-gray-600">
              Próximamente podrás anotar y mejorar tus ideas con IA.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
