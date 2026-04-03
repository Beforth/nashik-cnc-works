'use client';

import Infrastructure from '@/src/components/Infrastructure';

export type InfrastructureSectionProps = {
  items?: any[];
};

export default function InfrastructureSection({ items }: InfrastructureSectionProps) {
  return <Infrastructure items={items} />;
}
