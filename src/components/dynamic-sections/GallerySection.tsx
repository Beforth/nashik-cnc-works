'use client';

import JobsGallerySection from '@/src/components/JobsGallerySection';
import { getMergedGalleryItems } from '@/src/lib/gallery-display';

export type GallerySectionProps = {
  settings?: { phone?: string };
  galleryItems?: {
    id?: string;
    title: string;
    category: string;
    imageUrl: string;
    linkUrl?: string | null;
  }[];
};

export default function GallerySection({ settings, galleryItems }: GallerySectionProps) {
  const items = getMergedGalleryItems(galleryItems);
  return <JobsGallerySection items={items} settings={settings} />;
}
