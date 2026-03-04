'use server';

import { setCatalogSession, isValidCatalogLogin } from '@/lib/catalog-auth';
import { redirect } from 'next/navigation';

type ActionResult = {
  ok: boolean;
  message: string;
};

/**
 * Server action del login de catálogo.
 * Valida código + contraseña, crea la sesión y redirige al `callbackUrl`
 * que viene como campo oculto del formulario.
 * Por seguridad, solo acepta callbackUrls que empiecen con "/catalogo"
 * para evitar open redirects a sitios externos.
 */
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

  // Redirigir a la URL original (con query params) o /catalogo como fallback
  const callbackUrl = String(formData.get('callbackUrl') || '').trim();
  const destination =
    callbackUrl && callbackUrl.startsWith('/catalogo') ? callbackUrl : '/catalogo';
  redirect(destination);
}
