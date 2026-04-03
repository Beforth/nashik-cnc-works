import HomePage from '@/src/components/HomePage';
import { getSiteSettings, getHeroImages } from '@/src/lib/site-content';
import { getServices } from '@/src/lib/service-content';
import { getGalleryItems } from '@/src/lib/gallery-content';
import { getMergedGalleryItems } from '@/src/lib/gallery-display';
import { getInfrastructureItems } from '@/src/lib/infrastructure-content';
import { getIndustryItems } from '@/src/lib/industry-content';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const [settings, heroImages, services, galleryRaw, infrastructureItems, industryItems] = await Promise.all([
    getSiteSettings(),
    getHeroImages(),
    getServices(),
    getGalleryItems(),
    getInfrastructureItems(),
    getIndustryItems(),
  ]);
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
