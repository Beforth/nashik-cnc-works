import { NextResponse } from 'next/server';
import { persistFeedback } from '@/src/lib/feedback-persistence';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function parseBody(raw: unknown) {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const rating = typeof o.rating === 'string' ? o.rating.trim() : '';
  const name = typeof o.name === 'string' ? o.name.trim() : '';
  const message = typeof o.message === 'string' ? o.message.trim() : '';
  return { rating, name, message };
}

/** Public JSON API (used by the /profile vCard and any external clients). */
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

  const result = await persistFeedback(parsed);
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
