import { 
  Wrench, 
  Settings, 
  Cog, 
  Factory, 
  Zap, 
  Car, 
  Cpu, 
  Layers, 
  Building2, 
  ClipboardCheck, 
  Construction, 
  Dna 
} from 'lucide-react';

export interface CityData {
  id: string;
  name: string;
  slug: string;
  title: string;
  description: string;
}

/** Sourced from IndiaMART profile: https://www.indiamart.com/dinesh-eng/ */
export const COMPANY = {
  gstin: '27AVRPK3981G1Z1',
  gstRegistrationDate: '01-07-2017',
  natureOfBusiness: 'Service Provider and Others',
  legalStatus: 'Proprietorship',
  ceo: 'Dinesh Khairnar',
  annualTurnover: '0 - 40 L',
  yearsOnIndiaMART: '10+',
  jobWorkProductCount: 11,
  machinedComponentCount: 10,
  phone: '9423928362',
  phoneFormatted: '+91 94239 28362',
  /** Hero / contact line (display format) */
  contactPhoneDisplay: '+91-9423928362',
  contactName: 'Mr. Dinesh Khairnar',
  /** Legal / website title (admin, emails, enquiry records). Matches public metadata. */
  siteFullName: 'Karan Engineers & Fabrication, Nashik',
  email: 'mr.dinesheng@gmail.com',
  indiaMartUrl: 'https://www.indiamart.com/dinesh-eng/',
  tagline: 'MIDC Ambad, Nashik, Maharashtra 422010.',
  /** IndiaMART Open Graph / listing summary */
  listingSummary:
    'Job work, machined components & turning machine job — service provider from Nashik, Maharashtra, India.',
  googleMapsUrl:
    'https://www.google.com/maps/place/Karan+Engineers+%26+Fabrication+-+CNC+VMC+MACHINING+Jobwork+Nashik/@19.9597879,73.7467695,1640m/data=!3m1!1e3!4m6!3m5!1s0x3bddeca9b8ef1663:0x1bec7d08fd8b7fec!8m2!3d19.9585443!4d73.7463225!16s%2Fg%2F11f37gyxrq?entry=ttu&g_ep=EgoyMDI2MDMyMy4xIKXMDSoASAFQAw%3D%3D',
} as const;

/** Product photos from IndiaMART listing (5.imimg.com). Source: https://www.indiamart.com/dinesh-eng/ */
export const INDIA_MART_IMAGES = {
  turning: 'https://5.imimg.com/data5/AL/TH/UV/NSDMERP-20762121/20762121-product-1541063333096-500x500.jpg',
  turningAlt: 'https://5.imimg.com/data5/VM/FL/HR/NSDMERP-20762121/20762121-product-1541063340341-500x500.jpg',
  cncTurned: 'https://5.imimg.com/data5/VF/EG/EW/NSDMERP-20762121/20762121-product-1541063345687-500x500.jpg',
  powerSector: 'https://5.imimg.com/data5/RM/AA/MY-20762121/components-for-power-sector-500x500.jpg',
  milling: 'https://5.imimg.com/data5/LK/RX/UB/NSDMERP-20762121/20762121-product-1541063338370-500x500.jpg',
  bush: 'https://5.imimg.com/data5/NV/BI/JM/NSDMERP-20762121/20762121-product-1541063343725-500x500.jpg',
  cncJob: 'https://5.imimg.com/data5/TA/RH/RA/NSDMERP-20762121/20762121-product-1541063342172-500x500.jpg',
  automobile: 'https://5.imimg.com/data5/KU/BL/MY-20762121/components-for-automobile-industry-500x500.jpg',
  clampShaft: 'https://5.imimg.com/data5/UQ/RV/QZ/NSDMERP-20762121/20762121-product-1541063336555-500x500.jpg',
} as const;

export interface GalleryItem {
  src: string;
  title: string;
  category: string;
  href: string;
}

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    src: INDIA_MART_IMAGES.turning,
    title: 'Turning Machine Job',
    category: 'Job work',
    href: 'https://www.indiamart.com/dinesh-eng/job-work.html#20267930655',
  },
  {
    src: INDIA_MART_IMAGES.milling,
    title: 'Milling Machine Job',
    category: 'Job work',
    href: 'https://www.indiamart.com/dinesh-eng/job-work.html#20267931088',
  },
  {
    src: INDIA_MART_IMAGES.cncJob,
    title: 'CNC Machine Job',
    category: 'Job work',
    href: 'https://www.indiamart.com/dinesh-eng/job-work.html#20267931355',
  },
  {
    src: INDIA_MART_IMAGES.cncTurned,
    title: 'CNC Turned Components',
    category: 'Machined components',
    href: 'https://www.indiamart.com/dinesh-eng/machined-components.html#20267931691',
  },
  {
    src: INDIA_MART_IMAGES.powerSector,
    title: 'Components for Power Sector',
    category: 'Machined components',
    href: 'https://www.indiamart.com/dinesh-eng/machined-components.html#12691033355',
  },
  {
    src: INDIA_MART_IMAGES.automobile,
    title: 'Components for Automobile Industry',
    category: 'Machined components',
    href: 'https://www.indiamart.com/dinesh-eng/machined-components.html#12691033212',
  },
  {
    src: INDIA_MART_IMAGES.bush,
    title: 'Bush',
    category: 'Machined components',
    href: 'https://www.indiamart.com/dinesh-eng/machined-components.html#20267931533',
  },
  {
    src: INDIA_MART_IMAGES.clampShaft,
    title: 'Clamp Shaft',
    category: 'Machined components',
    href: 'https://www.indiamart.com/dinesh-eng/machined-components.html#20267930862',
  },
];

/** “Deals in HSN Code” from IndiaMART profile */
export const HSN_CODES: { code: string; description: string }[] = [
  {
    code: '82031000',
    description:
      'Files, rasps, pliers, pincers, metal cutting shears, pipe-cutters, bolt croppers, perforating punches and similar hand tools.',
  },
  {
    code: '82071300',
    description:
      'Interchangeable tools for hand or machine-tools — pressing, stamping, punching, tapping, threading, drilling, milling, turning, etc.',
  },
  {
    code: '98010011',
    description: 'For industrial plant project.',
  },
  {
    code: '72071110',
    description:
      'Semi-finished products of iron or non-alloy steel — rectangular cross-section; electrical quality.',
  },
  {
    code: '82021010',
    description: 'Hand saws; blades for saws of all kinds — metal working hand saws.',
  },
];

export const CITIES: CityData[] = [
  {
    id: 'nashik',
    name: 'Nashik',
    slug: 'cnc-job-work-nashik',
    title: 'Job Work & Machined Components in Nashik',
    description:
      'Karan Engineers & Fabrication, Nashik — service provider of turning, milling, and CNC machine job work; machined components for power sector, automobile industry, CNC turned parts, bush, and more.',
  },
  {
    id: 'pune',
    name: 'Pune',
    slug: 'cnc-job-work-pune',
    title: 'Job Work & Machined Components for Pune',
    description:
      'Precision job work and machined components supplied to engineering and manufacturing customers across Pune and western Maharashtra.',
  },
  {
    id: 'mumbai',
    name: 'Mumbai',
    slug: 'cnc-job-work-mumbai',
    title: 'Job Work & Machined Components for Mumbai',
    description:
      'Reliable machining and fabricated components for industrial buyers in the Mumbai region.',
  },
  {
    id: 'aurangabad',
    name: 'Aurangabad',
    slug: 'vmc-job-work-aurangabad',
    title: 'Job Work & Machined Components for Aurangabad',
    description:
      'Turning, milling, CNC job work and machined parts for Aurangabad’s industrial and automotive supply chain.',
  },
];

/** Public shape matches API / DB; `image` is image URL (alias for older name in codebase). */
export const SERVICES = [
  {
    id: 'turning',
    iconKey: 'Wrench',
    name: 'Turning Machine Job',
    image: INDIA_MART_IMAGES.turning,
    description:
      'CNC and conventional turning job work for shafts, pins, and cylindrical parts as per your drawings.',
  },
  {
    id: 'milling',
    iconKey: 'Cog',
    name: 'Milling Machine Job',
    image: INDIA_MART_IMAGES.milling,
    description:
      'Milling job work for flats, pockets, slots, and prismatic features with repeatable accuracy.',
  },
  {
    id: 'cnc',
    iconKey: 'Settings',
    name: 'CNC Machine Job',
    image: INDIA_MART_IMAGES.cncJob,
    description:
      'CNC machining job work for complex profiles and production batches from Nashik.',
  },
  {
    id: 'components',
    iconKey: 'Factory',
    name: 'Machined Components',
    image: INDIA_MART_IMAGES.powerSector,
    description:
      'Components for power sector and automobile industry; CNC turned components, bush, clamp shaft, and related parts.',
  },
] as const;

export const MACHINES = [
  {
    name: 'Turning machine job work',
    specs: 'Turning machine job for precision cylindrical and turned features.',
  },
  {
    name: 'Milling machine job work',
    specs: 'Milling job work for prismatic components and industrial parts.',
  },
  {
    name: 'CNC machine job work',
    specs: 'CNC machining for complex geometries and repeat production.',
  },
  {
    name: 'Machined components supply',
    specs:
      'Power sector & automobile industry parts; CNC turned components, bush, clamp shaft, and more.',
  },
];

/** `iconKey` matches Prisma seed / `getServiceIcon` — used when merging catalog into admin industries. */
export const INDUSTRIES = [
  { name: 'Power sector', icon: Zap, iconKey: 'Zap' },
  { name: 'Automobile industry', icon: Car, iconKey: 'Car' },
  { name: 'CNC turned components', icon: Cpu, iconKey: 'Cpu' },
  { name: 'Bush & clamp shaft', icon: Layers, iconKey: 'Layers' },
  { name: 'Factory / manufacturing', icon: Factory, iconKey: 'Factory' },
  { name: 'Works contract', icon: ClipboardCheck, iconKey: 'ClipboardCheck' },
  { name: 'Industrial plant & equipment', icon: Building2, iconKey: 'Building2' },
  { name: 'General engineering', icon: Construction, iconKey: 'Construction' },
];

export const STEPS = [
  { num: 1, title: 'Share Drawing', desc: 'Send via WhatsApp, email, IndiaMART enquiry, or our enquiry form.' },
  { num: 2, title: 'Get Quote', desc: 'We review your requirement and respond with scope and pricing.' },
  { num: 3, title: 'Manufacturing', desc: 'Job work and component manufacture as per agreed drawings and schedule.' },
  { num: 4, title: 'Delivery', desc: 'Inspection, packing, and dispatch to your location.' },
];
