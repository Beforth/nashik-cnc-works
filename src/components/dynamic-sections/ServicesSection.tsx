'use client';

import Services from '@/src/components/Services';

export type ServicesSectionProps = {
  initialServices?: any[];
};

export default function ServicesSection({ initialServices }: ServicesSectionProps) {
  return <Services initialServices={initialServices} />;
}
