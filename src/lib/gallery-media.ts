const VIDEO_IN_GALLERY_RE = /\.(mp4|webm|ogg|ogv|mov)(\?|#|\/|$)/i;

/** Public Jobs Gallery: treat URL as video when the path is a video file, or Cloudinary `/video/upload/`. */
export function isGalleryVideoUrl(url: string | null | undefined): boolean {
  if (!url?.trim() || url.startsWith('data:')) return false;
  if (url.includes('/video/upload/')) return true;
  try {
    const path = new URL(url, 'https://example.com').pathname;
    return VIDEO_IN_GALLERY_RE.test(path) || VIDEO_IN_GALLERY_RE.test(url);
  } catch {
    return VIDEO_IN_GALLERY_RE.test(url);
  }
}
