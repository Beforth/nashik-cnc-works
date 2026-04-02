import { config } from 'dotenv';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PrismaClient } from '@prisma/client';

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
// Prefer values from .env over inherited shell env (e.g. old DATABASE_URL=file:./dev.db)
config({ path: join(projectRoot, '.env'), override: true });

const prisma = new PrismaClient();

/** Initial data — mirrors former `SERVICES` in `src/constants.ts` */
const SERVICES = [
  {
    id: 'turning',
    iconKey: 'Wrench',
    name: 'Turning Machine Job',
    imageUrl:
      'https://5.imimg.com/data5/AL/TH/UV/NSDMERP-20762121/20762121-product-1541063333096-500x500.jpg',
    description:
      'CNC and conventional turning job work for shafts, pins, and cylindrical parts as per your drawings.',
    sortOrder: 0,
  },
  {
    id: 'milling',
    iconKey: 'Cog',
    name: 'Milling Machine Job',
    imageUrl:
      'https://5.imimg.com/data5/LK/RX/UB/NSDMERP-20762121/20762121-product-1541063338370-500x500.jpg',
    description:
      'Milling job work for flats, pockets, slots, and prismatic features with repeatable accuracy.',
    sortOrder: 1,
  },
  {
    id: 'cnc',
    iconKey: 'Settings',
    name: 'CNC Machine Job',
    imageUrl:
      'https://5.imimg.com/data5/TA/RH/RA/NSDMERP-20762121/20762121-product-1541063342172-500x500.jpg',
    description: 'CNC machining job work for complex profiles and production batches from Nashik.',
    sortOrder: 2,
  },
  {
    id: 'components',
    iconKey: 'Factory',
    name: 'Machined Components',
    imageUrl:
      'https://5.imimg.com/data5/RM/AA/MY-20762121/components-for-power-sector-500x500.jpg',
    description:
      'Components for power sector and automobile industry; CNC turned components, bush, clamp shaft, and related parts.',
    sortOrder: 3,
  },
];

async function main() {
  for (const row of SERVICES) {
    await prisma.service.upsert({
      where: { id: row.id },
      create: row,
      update: {
        iconKey: row.iconKey,
        name: row.name,
        imageUrl: row.imageUrl,
        description: row.description,
        sortOrder: row.sortOrder,
      },
    });
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
