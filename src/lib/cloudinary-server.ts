import { v2 as cloudinary } from 'cloudinary';

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const MAX_VIDEO_BYTES = 32 * 1024 * 1024;

const ALLOWED_VIDEO_MIMES = new Set(['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime']);

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
  if (buffer.length > MAX_IMAGE_BYTES) {
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

/** Upload short video (e.g. Jobs Gallery). Returns HTTPS URL. */
export async function uploadGalleryVideo(buffer: Buffer, mimetype: string): Promise<string> {
  if (buffer.length > MAX_VIDEO_BYTES) {
    throw new Error('Video is too large (max 32 MB)');
  }
  if (!ALLOWED_VIDEO_MIMES.has(mimetype)) {
    throw new Error('Use MP4, WebM, MOV, or Ogg video');
  }

  configure();

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'karan-engineers/gallery',
        resource_type: 'video',
        allowed_formats: ['mp4', 'mov', 'webm', 'ogv', 'ogg'],
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

/**
 * Admin upload: images (services, hero, etc.) or video (Jobs Gallery).
 * Other admin pages should keep sending images only; gallery sends video or image.
 */
export async function uploadServiceMedia(buffer: Buffer, mimetype: string): Promise<string> {
  if (mimetype.startsWith('image/')) {
    return uploadServiceImage(buffer, mimetype);
  }
  if (mimetype.startsWith('video/') && ALLOWED_VIDEO_MIMES.has(mimetype)) {
    return uploadGalleryVideo(buffer, mimetype);
  }
  throw new Error('Only image and video (MP4, WebM, MOV, Ogg) uploads are allowed');
}
