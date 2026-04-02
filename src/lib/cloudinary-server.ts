import { v2 as cloudinary } from 'cloudinary';

const MAX_BYTES = 8 * 1024 * 1024;

function configure(): void {
  const cloud_name = process.env.CLOUDINARY_CLOUD_NAME;
  const api_key = process.env.CLOUDINARY_API_KEY;
  const api_secret = process.env.CLOUDINARY_API_SECRET;
  if (!cloud_name || !api_key || !api_secret) {
    throw new Error('Cloudinary env vars are not set');
  }
  cloudinary.config({ cloud_name, api_key, api_secret });
}

export function isCloudinaryConfigured(): boolean {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET,
  );
}

/** Upload image buffer; returns HTTPS URL. */
export async function uploadServiceImage(buffer: Buffer, mimetype: string): Promise<string> {
  if (buffer.length > MAX_BYTES) {
    throw new Error('File too large (max 8 MB)');
  }
  if (!mimetype.startsWith('image/')) {
    throw new Error('Only image uploads are allowed');
  }

  configure();

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'karan-engineers/services',
        resource_type: 'image',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif'],
      },
      (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        if (!result?.secure_url) {
          reject(new Error('Upload failed'));
          return;
        }
        resolve(result.secure_url);
      },
    );
    stream.end(buffer);
  });
}
