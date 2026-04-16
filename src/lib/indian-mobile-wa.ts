import { COMPANY } from '@/src/constants';

/** 10-digit local mobile for `https://wa.me/91…` (handles +91, spaces, leading 0). */
export function indianMobileDigitsForWaMe(raw?: string | null): string {
  const parse = (s: string) => {
    let d = s.replace(/\D/g, '');
    if (d.length >= 12 && d.startsWith('91')) d = d.slice(2);
    if (d.length === 11 && d.startsWith('0')) d = d.slice(1);
    if (d.length > 10) d = d.slice(-10);
    return d;
  };

  const candidate = ((raw ?? '').trim() || COMPANY.phone).trim();
  const d = parse(candidate);
  if (d.length === 10 && !/^0+$/.test(d)) return d;
  return parse(COMPANY.phone);
}
