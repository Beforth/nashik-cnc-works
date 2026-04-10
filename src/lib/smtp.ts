import nodemailer from 'nodemailer';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function isSmtpConfigured(): boolean {
  return Boolean(
    process.env.SMTP_HOST?.trim() &&
      process.env.SMTP_USER?.trim() &&
      process.env.SMTP_PASSWORD &&
      process.env.SMTP_FROM?.trim(),
  );
}

/** Default recipient when `to` is omitted (e.g. internal notifications). */
export function getDefaultMailTo(): string {
  return process.env.ENQUIRY_TO_EMAIL?.trim() || 'mr.dinesheng@gmail.com';
}

export function isValidEmail(s: string): boolean {
  return EMAIL_RE.test(s.trim());
}

function createTransport() {
  const port = Number(process.env.SMTP_PORT || '587');
  const secure =
    process.env.SMTP_SECURE === 'true' || process.env.SMTP_SECURE === '1' || port === 465;

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST!.trim(),
    port: Number.isFinite(port) && port > 0 ? port : 587,
    secure,
    auth: {
      user: process.env.SMTP_USER!.trim(),
      pass: process.env.SMTP_PASSWORD,
    },
  });
}

export type SendMailInput = {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  replyTo?: string;
};

/**
 * Send one email using env SMTP. Caller must ensure `isSmtpConfigured()` first.
 */
export async function sendMailMessage(input: SendMailInput): Promise<void> {
  const to = input.to.trim();
  if (!isValidEmail(to)) {
    throw new Error('Invalid recipient email');
  }
  const subject = input.subject.trim();
  if (!subject) {
    throw new Error('Subject is required');
  }
  const text = input.text?.trim();
  const html = input.html?.trim();
  if (!text && !html) {
    throw new Error('Provide text and/or html body');
  }

  let replyTo: string | undefined;
  if (input.replyTo?.trim()) {
    const r = input.replyTo.trim();
    if (!isValidEmail(r)) throw new Error('Invalid replyTo email');
    replyTo = r;
  }

  const transporter = createTransport();
  await transporter.sendMail({
    from: process.env.SMTP_FROM!.trim(),
    to,
    subject: subject.slice(0, 300),
    text: text || undefined,
    html: html || undefined,
    replyTo,
  });
}

export type EnquiryMailPayload = {
  name: string;
  phone: string;
  email: string;
  material: string;
  qty: string;
  requirements: string;
};

/** Notify inbox (ENQUIRY_TO_EMAIL) about a public form submission. */
export async function sendEnquiryNotificationEmail(payload: EnquiryMailPayload): Promise<void> {
  const to = getDefaultMailTo();
  const lines = [
    'New website enquiry',
    '',
    `Name: ${payload.name}`,
    `Phone: ${payload.phone}`,
    `Email: ${payload.email}`,
    payload.material ? `Material: ${payload.material}` : null,
    payload.qty ? `Estimated quantity: ${payload.qty}` : null,
    '',
    'Requirements:',
    payload.requirements || '(none provided)',
  ].filter((line): line is string => line !== null);

  const text = lines.join('\n');
  const html = `<pre style="font-family:system-ui,sans-serif;white-space:pre-wrap">${escapeHtml(text)}</pre>`;

  await sendMailMessage({
    to,
    subject: `Website enquiry — ${payload.name}`.slice(0, 300),
    text,
    html,
    replyTo: payload.email,
  });
}
