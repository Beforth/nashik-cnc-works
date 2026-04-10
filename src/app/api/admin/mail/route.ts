import { NextResponse } from 'next/server';
import {
  getDefaultMailTo,
  isSmtpConfigured,
  sendMailMessage,
} from '@/src/lib/smtp';
import { requireAdminSession } from '@/src/lib/require-admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_SUBJECT = 300;
const MAX_TEXT = 100_000;
const MAX_HTML = 500_000;

/**
 * GET — admin only. Returns whether SMTP env is set (no secrets exposed).
 */
export async function GET() {
  const unauthorized = await requireAdminSession();
  if (unauthorized) return unauthorized;
  return NextResponse.json({ configured: isSmtpConfigured() });
}

/**
 * POST — admin only. Send an email via configured SMTP.
 *
 * Body JSON:
 * - subject (required, string)
 * - text (optional) and/or html (optional) — at least one required
 * - to (optional) — defaults to ENQUIRY_TO_EMAIL or site contact inbox
 * - replyTo (optional)
 */
export async function POST(req: Request) {
  const unauthorized = await requireAdminSession();
  if (unauthorized) return unauthorized;

  if (!isSmtpConfigured()) {
    return NextResponse.json(
      { error: 'SMTP is not configured. Set SMTP_HOST, SMTP_USER, SMTP_PASSWORD, and SMTP_FROM in the environment.' },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const o = body && typeof body === 'object' ? (body as Record<string, unknown>) : null;
  if (!o) {
    return NextResponse.json({ error: 'Expected a JSON object' }, { status: 400 });
  }

  const subject = typeof o.subject === 'string' ? o.subject.trim() : '';
  const text = typeof o.text === 'string' ? o.text : undefined;
  const html = typeof o.html === 'string' ? o.html : undefined;
  const replyTo = typeof o.replyTo === 'string' ? o.replyTo.trim() : undefined;
  const toRaw = typeof o.to === 'string' ? o.to.trim() : '';
  const to = toRaw.length > 0 ? toRaw : getDefaultMailTo();

  if (!subject) {
    return NextResponse.json({ error: 'subject is required' }, { status: 400 });
  }
  if (subject.length > MAX_SUBJECT) {
    return NextResponse.json(
      { error: `subject must be at most ${MAX_SUBJECT} characters` },
      { status: 400 },
    );
  }
  if (text !== undefined && text.length > MAX_TEXT) {
    return NextResponse.json(
      { error: `text must be at most ${MAX_TEXT} characters` },
      { status: 400 },
    );
  }
  if (html !== undefined && html.length > MAX_HTML) {
    return NextResponse.json(
      { error: `html must be at most ${MAX_HTML} characters` },
      { status: 400 },
    );
  }

  try {
    await sendMailMessage({
      to,
      subject,
      text,
      html,
      replyTo,
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Failed to send email';
    console.error('[POST /api/admin/mail]', e);
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
