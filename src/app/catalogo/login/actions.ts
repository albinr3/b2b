'use server';

import { setCatalogSession, isValidCatalogLogin } from '@/lib/catalog-auth';
import { redirect } from 'next/navigation';

type ActionResult = {
  ok: boolean;
  message: string;
};

export async function catalogLoginAction(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const code = String(formData.get('code') || '').trim();
  const password = String(formData.get('password') || '').trim();

  if (!code || !password) {
    return { ok: false, message: 'Ingresa el código y la contraseña.' };
  }

  if (!isValidCatalogLogin(code, password)) {
    return { ok: false, message: 'Código o contraseña inválidos.' };
  }

  await setCatalogSession(code);
  redirect('/catalogo');
}
