import { NextResponse } from 'next/server';
import { uploadServiceImage, isCloudinaryConfigured } from '@/src/lib/cloudinary-server';
import { requireAdminSession } from '@/src/lib/require-admin';

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

    const buffer = Buffer.from(await file.arrayBuffer());
    const mimetype = file.type || 'application/octet-stream';
    const url = await uploadServiceImage(buffer, mimetype);
    return NextResponse.json({ url });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Upload failed';
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
