import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/db';
import {
  isSmtpConfigured,
  isValidEmail,
  sendEnquiryNotificationEmail,
} from '@/src/lib/smtp';
import { COMPANY } from '@/src/constants';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_LEN = {
  name: 200,
  phone: 40,
  email: 254,
  material: 120,
  qty: 40,
  message: 10_000,
};

function parseBody(raw: unknown) {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const name = typeof o.name === 'string' ? o.name.trim() : '';
  const phone = typeof o.phone === 'string' ? o.phone.trim() : '';
  const email = typeof o.email === 'string' ? o.email.trim() : '';
  const material = typeof o.material === 'string' ? o.material.trim() : '';
  const qty = typeof o.qty === 'string' ? o.qty.trim() : String(o.qty ?? '').trim();
  const requirements = typeof o.requirements === 'string' ? o.requirements.trim() : '';
  return { name, phone, email, material, qty, requirements };
}

function buildDbMessage(parts: {
  material: string;
  qty: string;
  requirements: string;
}): string {
  const lines: string[] = [];
  if (parts.material) lines.push(`Material: ${parts.material}`);
  if (parts.qty) lines.push(`Estimated quantity: ${parts.qty}`);
  if (parts.requirements) lines.push('', 'Detailed requirements:', parts.requirements);
  const msg = lines.join('\n').trim();
  return msg.length > 0 ? msg.slice(0, MAX_LEN.message) : 'Enquiry from website (no extra details).';
}

export async function POST(req: Request) {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const parsed = parseBody(raw);
  if (!parsed) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  let { name, phone, email, material, qty, requirements } = parsed;

  name = name.slice(0, MAX_LEN.name);
  phone = phone.slice(0, MAX_LEN.phone);
  email = email.slice(0, MAX_LEN.email);
  material = material.slice(0, MAX_LEN.material);
  qty = qty.slice(0, MAX_LEN.qty);
  requirements = requirements.slice(0, MAX_LEN.message);

  if (!name || !phone || !email) {
    return NextResponse.json(
      { error: 'Name, phone, and email are required.' },
      { status: 400 },
    );
  }
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
  }

  const message = buildDbMessage({ material, qty, requirements });
  const subject = `${COMPANY.siteFullName} — ${name}`.slice(0, 200);

  try {
    await prisma.enquiry.create({
      data: {
        name,
        phone,
        email,
        subject,
        message,
      },
    });
  } catch (e) {
    console.error('[POST /api/enquiry] database', e);
    return NextResponse.json(
      { error: 'Could not save your enquiry. Please try again or call us directly.' },
      { status: 500 },
    );
  }

  if (!isSmtpConfigured()) {
    return NextResponse.json({ ok: true, emailSent: false }, { status: 201 });
  }

  try {
    await sendEnquiryNotificationEmail({
      name,
      phone,
      email,
      material,
      qty,
      requirements,
    });
    return NextResponse.json({ ok: true, emailSent: true }, { status: 201 });
  } catch (e) {
    console.error('[POST /api/enquiry] SMTP', e);
    return NextResponse.json(
      {
        ok: true,
        emailSent: false,
        warning:
          'Your enquiry was saved, but we could not send the email notification. Our team will still follow up.',
      },
      { status: 201 },
    );
  }
}
