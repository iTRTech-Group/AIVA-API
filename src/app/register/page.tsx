"use client";

import Link from "next/link";

import { useFormState, useFormStatus } from "react-dom";
import { registerUser } from "../actions/register";

const initialState = {
  message: "",
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400"
    >
      {pending ? "Criando conta..." : "Criar Conta"}
    </button>
  );
}

export default function RegisterPage() {
  const [state, formAction] = useFormState(registerUser, initialState);

  return (
    <div className="flex items-center justify-center min-h-screen bg-dark">
      <div className="p-8 bg-gray-900 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Registro</h1>

        <form action={formAction} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Nome Completo"
            required
            className="w-full px-4 py-2 border rounded-md"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            className="w-full px-4 py-2 border rounded-md"
          />
          <input
            type="password"
            name="password"
            placeholder="Senha"
            required
            className="w-full px-4 py-2 border rounded-md"
          />

          {state?.message && (
            <p className="text-red-500 text-sm">{state.message}</p>
          )}

          <SubmitButton />
        </form>

        <p className="text-center mt-4 text-sm">
          Já tem uma conta?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            Faça login
          </Link>
        </p>
      </div>
    </div>
  );
}
