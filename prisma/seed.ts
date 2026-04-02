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

const HERO_IMAGES = [
  { url: '/hero/machined-flange.png', alt: 'Precision machined metal component', sortOrder: 0 },
  { url: '/hero/lathe-chuck-workpiece.png', alt: 'Metal workpiece in lathe chuck', sortOrder: 1 },
  { url: '/hero/cnc-turning-coolant.png', alt: 'CNC lathe turning with coolant', sortOrder: 2 },
];

const INFRASTRUCTURE = [
  { name: 'Turning machine', specs: 'Precision cylindrical and turned features.', iconKey: 'Wrench', sortOrder: 0 },
  { name: 'Milling machine', specs: 'Prismatic components and industrial parts.', iconKey: 'Settings', sortOrder: 1 },
  { name: 'CNC machine', specs: 'Complex geometries and repeat production.', iconKey: 'Cpu', sortOrder: 2 },
  { name: 'Machined components', specs: 'Power sector & automobile industry parts.', iconKey: 'Factory', sortOrder: 3 },
];

const INDUSTRIES = [
  { name: 'Power sector', iconKey: 'Zap', sortOrder: 0 },
  { name: 'Automobile industry', iconKey: 'Car', sortOrder: 1 },
  { name: 'CNC turned components', iconKey: 'Cpu', sortOrder: 2 },
  { name: 'Bush & clamp shaft', iconKey: 'Layers', sortOrder: 3 },
  { name: 'Factory / manufacturing', iconKey: 'Factory', sortOrder: 4 },
  { name: 'Works contract', iconKey: 'ClipboardCheck', sortOrder: 5 },
  { name: 'Industrial plant & equipment', iconKey: 'Building2', sortOrder: 6 },
  { name: 'General engineering', iconKey: 'Construction', sortOrder: 7 },
];

async function main() {
  // Services
  for (const row of SERVICES) {
    await prisma.service.upsert({
      where: { id: row.id },
      create: row,
      update: row,
    });
  }

  // Site Settings
  await prisma.siteSettings.upsert({
    where: { id: 'site-settings' },
    create: {},
    update: {},
  });

  // Hero Images
  for (const row of HERO_IMAGES) {
    const existing = await prisma.heroImage.findFirst({ where: { url: row.url } });
    if (!existing) await prisma.heroImage.create({ data: row });
  }

  // Infrastructure
  for (const row of INFRASTRUCTURE) {
    const existing = await prisma.infrastructureItem.findFirst({ where: { name: row.name } });
    if (!existing) await prisma.infrastructureItem.create({ data: row });
  }

  // Industries
  for (const row of INDUSTRIES) {
    const existing = await prisma.industryItem.findFirst({ where: { name: row.name } });
    if (!existing) await prisma.industryItem.create({ data: row });
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
