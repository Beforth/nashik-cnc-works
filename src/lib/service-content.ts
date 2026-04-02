import { prisma } from './db';

export async function getServices() {
  try {
    const services = await prisma.service.findMany({
      orderBy: { sortOrder: 'asc' },
    });
    return services;
  } catch (error) {
    console.error('Failed to fetch services:', error);
    return [];
  }
}
