import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { COMPANY } from '@/src/constants';
import { getProfileCmsBundle } from '@/src/lib/cms-cache';
import './profile-card.css';

export async function generateMetadata(): Promise<Metadata> {
  const { settings: s } = await getProfileCmsBundle();
  const title = s?.companyName?.trim() || COMPANY.siteFullName;
  const gst = s?.gstin?.trim() || COMPANY.gstin;
  return {
    title,
    description: `${title} — job work, machined components, turning, milling & CNC. GST ${gst}.`,
  };
}

export default function ProfileLayout({ children }: { children: ReactNode }) {
  return children;
}
