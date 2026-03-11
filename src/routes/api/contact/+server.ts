/**
 * API de contacto — envía el formulario por email con Resend.
 * Requiere: RESEND_API_KEY y CONTACT_TO_EMAIL en .env
 * Nota: con adapter-static este endpoint no existe en producción; usa
 * PUBLIC_CONTACT_FORM_URL (Formspree, etc.) o despliega con adapter-node.
 */
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const CONTACT_TO = process.env.CONTACT_TO_EMAIL || 'g.prado@externia.ai';

export const POST: RequestHandler = async ({ request }) => {
  if (!RESEND_API_KEY) {
    return json(
      { ok: false, error: 'Servidor sin configurar (RESEND_API_KEY)' },
      { status: 503 }
    );
  }

  let body: { nombre?: string; email?: string; empresa?: string; mensaje?: string };
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: 'Cuerpo inválido' }, { status: 400 });
  }

  const { nombre = '', email = '', empresa = '', mensaje = '' } = body;
  const name = String(nombre).trim();
  const from = String(email).trim();
  const company = String(empresa).trim();
  const message = String(mensaje).trim();

  if (!from || !message) {
    return json({ ok: false, error: 'Faltan email o mensaje' }, { status: 400 });
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'Contacto Web <onboarding@resend.dev>',
        to: [CONTACT_TO],
        reply_to: from,
        subject: `Contacto Externia${name ? ` — ${name}` : ''}`,
        html: `
          <p><strong>Nombre:</strong> ${escapeHtml(name) || '—'}</p>
          <p><strong>Email:</strong> ${escapeHtml(from)}</p>
          <p><strong>Empresa:</strong> ${escapeHtml(company) || '—'}</p>
          <p><strong>Mensaje:</strong></p>
          <pre style="white-space: pre-wrap; font-family: inherit;">${escapeHtml(message)}</pre>
        `.trim()
      })
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return json(
        { ok: false, error: (data as { message?: string }).message || 'Error al enviar' },
        { status: res.status >= 500 ? 502 : 400 }
      );
    }
    return json({ ok: true });
  } catch (e) {
    console.error('[api/contact]', e);
    return json({ ok: false, error: 'Error de servidor' }, { status: 500 });
  }
};

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
