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
  indiaMartUrl: 'https://www.indiamart.com/dinesh-eng/',
  tagline:
    'Manufacturer of job work & machined components in Nashik, Maharashtra.',
} as const;

export const CITIES: CityData[] = [
  {
    id: 'nashik',
    name: 'Nashik',
    slug: 'cnc-job-work-nashik',
    title: 'Job Work & Machined Components in Nashik',
    description:
      'Karan Engineers And Fabrication, Nashik — service provider of turning, milling, and CNC machine job work; machined components for power sector, automobile industry, CNC turned parts, bush, and more.',
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

export const SERVICES = [
  {
    id: 'turning',
    icon: '🔧',
    name: 'Turning Machine Job',
    description:
      'CNC and conventional turning job work for shafts, pins, and cylindrical parts as per your drawings.',
  },
  {
    id: 'milling',
    icon: '🔩',
    name: 'Milling Machine Job',
    description:
      'Milling job work for flats, pockets, slots, and prismatic features with repeatable accuracy.',
  },
  {
    id: 'cnc',
    icon: '⚙️',
    name: 'CNC Machine Job',
    description:
      'CNC machining job work for complex profiles and production batches from Nashik.',
  },
  {
    id: 'components',
    icon: '🏗️',
    name: 'Machined Components',
    description:
      'Components for power sector and automobile industry; CNC turned components, bush, clamp shaft, and related parts.',
  },
];

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

export const INDUSTRIES = [
  'Power sector',
  'Automobile industry',
  'CNC turned components',
  'Bush & clamp shaft',
  'Factory / manufacturing',
  'Works contract',
  'Industrial plant & equipment',
  'General engineering',
];

export const STEPS = [
  { num: 1, title: 'Share Drawing', desc: 'Send via WhatsApp, email, IndiaMART enquiry, or our enquiry form.' },
  { num: 2, title: 'Get Quote', desc: 'We review your requirement and respond with scope and pricing.' },
  { num: 3, title: 'Manufacturing', desc: 'Job work and component manufacture as per agreed drawings and schedule.' },
  { num: 4, title: 'Delivery', desc: 'Inspection, packing, and dispatch to your location.' },
];
