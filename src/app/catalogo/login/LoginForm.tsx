'use client';

import { useActionState, useState } from 'react';
import { catalogLoginAction } from './actions';

const initialState = { ok: false, message: '' };

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(catalogLoginAction, initialState);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1">
        <span className="text-xs font-semibold text-[#4b779b]">Código</span>
        <input
          type="text"
          name="code"
          inputMode="numeric"
          required
          className="h-11 rounded-lg border border-[#cfdde8] px-3 text-sm focus:ring-2 focus:ring-[#D00000]/20 focus:border-[#D00000]"
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-xs font-semibold text-[#4b779b]">Contraseña</span>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            inputMode="numeric"
            required
            className="h-11 w-full rounded-lg border border-[#cfdde8] px-3 pr-10 text-sm focus:ring-2 focus:ring-[#D00000]/20 focus:border-[#D00000]"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            <span className="material-symbols-outlined text-[20px]">
              {showPassword ? 'visibility_off' : 'visibility'}
            </span>
          </button>
        </div>
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
        {isPending ? 'Ingresando...' : 'Entrar al catálogo'}
      </button>
    </form>
  );
}
