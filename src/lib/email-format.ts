/** Same shape as server-side check in `smtp.ts` (keep in sync). */
const EMAIL_FORMAT_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmailFormat(s: string): boolean {
  return EMAIL_FORMAT_RE.test(s.trim());
}
