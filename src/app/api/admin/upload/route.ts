import { NextResponse } from 'next/server';
import { uploadServiceMedia, isCloudinaryConfigured } from '@/src/lib/cloudinary-server';
import { requireAdminSession } from '@/src/lib/require-admin';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function guessMimeType(file: Blob, filename: string | undefined): string {
  if (file.type && file.type !== 'application/octet-stream') {
    return file.type;
  }
  const n = (filename || '').toLowerCase();
  if (n.endsWith('.jpg') || n.endsWith('.jpeg')) return 'image/jpeg';
  if (n.endsWith('.png')) return 'image/png';
  if (n.endsWith('.webp')) return 'image/webp';
  if (n.endsWith('.gif')) return 'image/gif';
  if (n.endsWith('.avif')) return 'image/avif';
  if (n.endsWith('.mp4')) return 'video/mp4';
  if (n.endsWith('.webm')) return 'video/webm';
  if (n.endsWith('.ogg') || n.endsWith('.ogv')) return 'video/ogg';
  if (n.endsWith('.mov')) return 'video/quicktime';
  return 'application/octet-stream';
}

export async function POST(request: Request) {
  const unauthorized = await requireAdminSession();
  if (unauthorized) return unauthorized;

  if (!isCloudinaryConfigured()) {
    return NextResponse.json(
      { error: 'Cloudinary is not configured. Set CLOUDINARY_* in .env.' },
      { status: 503 },
    );
  }

  try {
    const form = await request.formData();
    const file = form.get('file');
    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: 'Missing file' }, { status: 400 });
    }

    const name = file instanceof File ? file.name : undefined;
    const buffer = Buffer.from(await file.arrayBuffer());
    const mimetype = guessMimeType(file, name);
    const url = await uploadServiceMedia(buffer, mimetype);
    return NextResponse.json({ url });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Upload failed';
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
