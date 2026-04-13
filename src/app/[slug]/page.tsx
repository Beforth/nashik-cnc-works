import HomePage from '@/src/components/HomePage';
import { getHomeCmsBundle } from '@/src/lib/cms-cache';
import { getMergedGalleryItems } from '@/src/lib/gallery-display';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const { settings, heroImages, services, galleryRaw, infrastructureItems, industryItems } =
    await getHomeCmsBundle();
  const galleryItems = getMergedGalleryItems(galleryRaw);

  return (
    <HomePage
      slug={slug}
      settings={settings}
      heroImages={heroImages}
      services={services}
      galleryItems={galleryItems}
      infrastructureItems={infrastructureItems}
      industryItems={industryItems}
    />
  );
}
