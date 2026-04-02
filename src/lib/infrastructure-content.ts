import { prisma } from './db';

export async function getInfrastructureItems() {
  try {
    const items = await prisma.infrastructureItem.findMany({
      orderBy: { sortOrder: 'asc' },
    });
    return items;
  } catch (error) {
    console.error('Failed to fetch infrastructure items:', error);
    return [];
  }
}
