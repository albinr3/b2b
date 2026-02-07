'use server';

import { prisma } from '@/lib/prisma';
import { setAdminSession, verifyPassword } from '@/lib/admin-auth';
import { redirect } from 'next/navigation';

type ActionResult = {
  ok: boolean;
  message: string;
};

export async function loginAction(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const email = String(formData.get('email') || '').trim().toLowerCase();
  const password = String(formData.get('password') || '');

  if (!email || !password) {
    return { ok: false, message: 'Ingresa correo y contraseña.' };
  }

  const user = await prisma.adminUser.findUnique({
    where: { email },
  });

  if (!user || !verifyPassword(password, user.passwordHash)) {
    return { ok: false, message: 'Correo o contraseña incorrectos.' };
  }

  await setAdminSession({ id: user.id, email: user.email });
  redirect('/admin');
}
