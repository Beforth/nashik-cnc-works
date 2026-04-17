/**
 * Whether POST /api/profile-view should increment the counter.
 * Only official production traffic should count (see OFFICIAL_SITE_HOSTS, VERCEL_ENV, NODE_ENV).
 */
export function normalizedRequestHostname(hostHeader: string | null): string {
  if (!hostHeader) return '';
  return hostHeader.trim().toLowerCase().split(':')[0] ?? '';
}

export function shouldIncrementOfficialProfileView(hostname: string): boolean {
  const hosts = process.env.OFFICIAL_SITE_HOSTS?.trim();
  if (hosts) {
    const allowed = new Set(
      hosts
        .split(',')
        .map((h) => h.trim().toLowerCase())
        .filter(Boolean),
    );
    return hostname.length > 0 && allowed.has(hostname);
  }

  if (process.env.VERCEL === '1') {
    return process.env.VERCEL_ENV === 'production';
  }

  if (process.env.NODE_ENV !== 'production') {
    return false;
  }

  if (
    !hostname ||
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname.endsWith('.local')
  ) {
    return false;
  }

  return true;
}
