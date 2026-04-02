import { prisma } from './db';

export async function getSiteSettings() {
  try {
    const settings = await prisma.siteSettings.findUnique({
      where: { id: 'site-settings' },
    });
    return settings;
  } catch (error) {
    console.error('Failed to fetch site settings:', error);
    return null;
  }
}

export async function getHeroImages() {
  try {
    const images = await prisma.heroImage.findMany({
      orderBy: { sortOrder: 'asc' },
    });
    return images;
  } catch (error) {
    console.error('Failed to fetch hero images:', error);
    return [];
  }
}
