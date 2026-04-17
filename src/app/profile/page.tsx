import { headers } from 'next/headers';
import ProfileDigitalCard from '@/src/components/profile/ProfileDigitalCard';
import { getProfileCmsPayload } from '@/src/lib/profile-cms';

function requestOriginFromHeaders(h: Headers): string {
  const host = h.get('x-forwarded-host')?.split(',')[0]?.trim() || h.get('host')?.trim();
  if (!host) return '';
  const rawProto = h.get('x-forwarded-proto')?.split(',')[0]?.trim();
  const local = /^(localhost|127\.0\.0\.1)(:\d+)?$/i.test(host);
  const proto =
    rawProto === 'http' || rawProto === 'https' ? rawProto : local ? 'http' : 'https';
  return `${proto}://${host}`;
}

export default async function ProfilePage() {
  const [h, cms] = await Promise.all([headers(), getProfileCmsPayload()]);
  const initialOrigin = requestOriginFromHeaders(h);
  return <ProfileDigitalCard cms={cms} initialOrigin={initialOrigin} />;
}
