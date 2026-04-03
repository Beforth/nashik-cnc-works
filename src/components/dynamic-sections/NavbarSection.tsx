'use client';

import Navbar from '@/src/components/Navbar';

export type NavbarSectionProps = {
  settings?: any;
};

export default function NavbarSection({ settings }: NavbarSectionProps) {
  return <Navbar settings={settings} />;
}
