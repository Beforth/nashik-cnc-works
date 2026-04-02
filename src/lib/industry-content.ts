import { prisma } from './db';

export async function getIndustryItems() {
  try {
    const items = await prisma.industryItem.findMany({
      orderBy: { sortOrder: 'asc' },
    });
    return items;
  } catch (error) {
    console.error('Failed to fetch industry items:', error);
    return [];
  }
}
