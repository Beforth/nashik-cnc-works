import nodemailer from 'nodemailer';

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

/** Inbox for enquiry notifications (falls back to public contact email). */
export function getEnquiryNotifyEmail(): string {
  const to = process.env.ENQUIRY_TO_EMAIL?.trim();
  if (to) return to;
  return 'mr.dinesheng@gmail.com';
}

export type EnquiryMailPayload = {
  name: string;
  phone: string;
  email: string;
  material: string;
  qty: string;
  requirements: string;
};

export async function sendEnquiryEmail(payload: EnquiryMailPayload): Promise<void> {
  if (!isSmtpConfigured()) {
    throw new Error('SMTP is not configured');
  }

  const port = Number(process.env.SMTP_PORT || '587');
  const secure =
    process.env.SMTP_SECURE === 'true' || process.env.SMTP_SECURE === '1' || port === 465;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST!.trim(),
    port: Number.isFinite(port) && port > 0 ? port : 587,
    secure,
    auth: {
      user: process.env.SMTP_USER!.trim(),
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const to = getEnquiryNotifyEmail();
  const from = process.env.SMTP_FROM!.trim();

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

  await transporter.sendMail({
    from,
    to,
    replyTo: payload.email,
    subject: `Website enquiry — ${payload.name}`.slice(0, 200),
    text,
    html,
  });
}
