import { prisma } from './db';

export async function getGalleryItems() {
  try {
    const items = await prisma.galleryItem.findMany({
      orderBy: { sortOrder: 'asc' },
    });
    return items;
  } catch (error) {
    console.error('Failed to fetch gallery items:', error);
    return [];
  }
}
