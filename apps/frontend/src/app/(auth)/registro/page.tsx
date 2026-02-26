"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/modules/auth/lib/auth-client";

export default function RegistroPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const result = await authClient.signUp.email({
        name,
        email,
        password,
      });

      if (result.error) {
        setError(result.error.message || "Error al registrarse");
        return;
      }

      router.push("/");
    } catch {
      setError("Error al registrarse. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8 rounded-lg border p-8">
        <div>
          <h2 className="text-center font-bold text-3xl">Crear cuenta</h2>
          <p className="mt-2 text-center text-gray-600 text-sm">
            Regístrate para comenzar
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block font-medium text-sm">
                Nombre
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="mt-1 block w-full rounded-md border px-3 py-2"
                placeholder="Tu nombre"
              />
            </div>

            <div>
              <label htmlFor="email" className="block font-medium text-sm">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 block w-full rounded-md border px-3 py-2"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block font-medium text-sm">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={8}
                className="mt-1 block w-full rounded-md border px-3 py-2"
                placeholder="Mínimo 8 caracteres"
              />
              <p className="mt-1 text-gray-500 text-xs">
                Debe incluir mayúsculas, minúsculas y números
              </p>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Registrando..." : "Registrarse"}
          </button>

          <div className="text-center text-sm">
            <span className="text-gray-600">¿Ya tienes cuenta? </span>
            <a href="/iniciar-sesion" className="text-blue-600 hover:underline">
              Inicia sesión
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
