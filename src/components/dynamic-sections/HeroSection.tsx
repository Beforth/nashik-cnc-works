'use client';

import Hero from '@/src/components/Hero';
import { CITIES } from '@/src/constants';

export type HeroSectionProps = {
  citySlug?: string;
  settings?: any;
  heroImages?: any[];
};

export default function HeroSection({ citySlug, settings, heroImages }: HeroSectionProps) {
  const city = CITIES.find((c) => c.slug === citySlug) || CITIES[0];
  return <Hero city={city} settings={settings} heroImages={heroImages} />;
}
