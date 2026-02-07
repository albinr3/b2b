'use client';

import { useActionState } from 'react';
import { loginAction } from './actions';

const initialState = { ok: false, message: '' };

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1">
        <span className="text-xs font-semibold text-[#4b779b]">Correo</span>
        <input
          type="email"
          name="email"
          autoComplete="email"
          required
          className="h-11 rounded-lg border border-[#cfdde8] px-3 text-sm focus:ring-2 focus:ring-[#D00000]/20 focus:border-[#D00000]"
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-xs font-semibold text-[#4b779b]">Contraseña</span>
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          required
          className="h-11 rounded-lg border border-[#cfdde8] px-3 text-sm focus:ring-2 focus:ring-[#D00000]/20 focus:border-[#D00000]"
        />
      </label>
      {state?.message && (
        <div className={`text-sm ${state.ok ? 'text-green-600' : 'text-red-600'}`}>
          {state.message}
        </div>
      )}
      <button
        type="submit"
        disabled={isPending}
        className="h-11 rounded-lg bg-[#D00000] text-white text-sm font-semibold hover:bg-[#b00000] disabled:opacity-60"
      >
        {isPending ? 'Ingresando...' : 'Ingresar'}
      </button>
    </form>
  );
}
