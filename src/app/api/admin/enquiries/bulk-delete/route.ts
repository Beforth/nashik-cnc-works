import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/db';
import { verifyAdminSessionToken, COOKIE_NAME } from '@/src/lib/admin-auth';
import { cookies } from 'next/headers';

const MAX_IDS = 100;

function parseIds(body: unknown): string[] | null {
  if (!body || typeof body !== 'object') return null;
  const raw = (body as { ids?: unknown }).ids;
  if (!Array.isArray(raw)) return null;
  const ids: string[] = [];
  for (const x of raw) {
    if (typeof x !== 'string' || x.length < 1 || x.length > 64) return null;
    ids.push(x);
    if (ids.length > MAX_IDS) return null;
  }
  if (ids.length === 0) return null;
  return ids;
}

export async function POST(req: Request) {
  const store = await cookies();
  if (!verifyAdminSessionToken(store.get(COOKIE_NAME)?.value)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const ids = parseIds(body);
  if (!ids) {
    return NextResponse.json({ error: `Provide ids: string[] (1–${MAX_IDS})` }, { status: 400 });
  }

  try {
    const result = await prisma.enquiry.deleteMany({ where: { id: { in: ids } } });
    return NextResponse.json({ deleted: result.count });
  } catch (e) {
    console.error('[POST /api/admin/enquiries/bulk-delete]', e);
    return NextResponse.json({ error: 'Bulk delete failed' }, { status: 500 });
  }
}
