import { NextRequest, NextResponse } from 'next/server';

type ContactPayload = {
  name?: string;
  email?: string;
  phone?: string;
  province?: string;
  message?: string;
  isDistributor?: boolean;
};

function requiredEnv(name: string) {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing env var: ${name}`);
  }
  return value;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function normalize(payload: ContactPayload) {
  return {
    name: String(payload.name || '').trim(),
    email: String(payload.email || '').trim().toLowerCase(),
    phone: String(payload.phone || '').trim(),
    province: String(payload.province || '').trim(),
    message: String(payload.message || '').trim(),
    isDistributor: Boolean(payload.isDistributor),
  };
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = requiredEnv('RESEND_API_KEY');
    const toEmail = requiredEnv('CONTACT_TO_EMAIL');
    const fromEmail = process.env.CONTACT_FROM_EMAIL?.trim() || 'onboarding@resend.dev';

    let payload: ContactPayload;
    try {
      payload = (await request.json()) as ContactPayload;
    } catch {
      return NextResponse.json({ ok: false, message: 'JSON inválido' }, { status: 400 });
    }

    const data = normalize(payload);

    if (!data.name || !data.email || !data.message) {
      return NextResponse.json(
        { ok: false, message: 'Nombre, correo y mensaje son requeridos.' },
        { status: 400 },
      );
    }

    if (!isValidEmail(data.email)) {
      return NextResponse.json(
        { ok: false, message: 'Correo electrónico inválido.' },
        { status: 400 },
      );
    }

    if (data.message.length < 10 || data.message.length > 5000) {
      return NextResponse.json(
        { ok: false, message: 'El mensaje debe tener entre 10 y 5000 caracteres.' },
        { status: 400 },
      );
    }

    const subject = `Nuevo contacto web - ${data.name}`;
    const safeMessage = escapeHtml(data.message).replace(/\n/g, '<br/>');

    const html = `
      <h2>Nuevo mensaje desde el formulario de contacto</h2>
      <p><strong>Nombre:</strong> ${escapeHtml(data.name)}</p>
      <p><strong>Correo:</strong> ${escapeHtml(data.email)}</p>
      <p><strong>Teléfono:</strong> ${escapeHtml(data.phone || '-')}</p>
      <p><strong>Provincia:</strong> ${escapeHtml(data.province || '-')}</p>
      <p><strong>Distribuidor:</strong> ${data.isDistributor ? 'Sí' : 'No'}</p>
      <hr/>
      <p>${safeMessage}</p>
    `;

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        reply_to: data.email,
        subject,
        html,
      }),
    });

    if (!resendResponse.ok) {
      const details = await resendResponse.text();
      return NextResponse.json(
        { ok: false, message: 'No se pudo enviar el correo.', details },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true, message: 'Mensaje enviado correctamente.' });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: 'Error interno al procesar el contacto.',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
