/** Pure helper — safe to import from Client Components (no `next/cache`). */
export function profileTopBarKicker(companyName: string, address: string): string {
  const fromName = companyName.split(',').slice(1).join(',').trim();
  if (fromName.length > 0) return fromName;
  const parts = address
    .split(',')
    .map((p) => p.trim())
    .filter(Boolean);
  if (parts.length >= 2) return parts.slice(-2).join(', ');
  return 'Nashik, Maharashtra';
}
