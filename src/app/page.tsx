import HomePage from '@/src/components/HomePage';
import { getSiteSettings, getHeroImages } from '@/src/lib/site-content';
import { getServices } from '@/src/lib/service-content';
import { getGalleryItems } from '@/src/lib/gallery-content';
import { getMergedGalleryItems } from '@/src/lib/gallery-display';
import { getInfrastructureItems } from '@/src/lib/infrastructure-content';
import { getIndustryItems } from '@/src/lib/industry-content';

/** Always read hero and CMS-backed data from the database (not a stale build snapshot). */
export const dynamic = 'force-dynamic';

export default async function Page() {
  const settings = await getSiteSettings();
  const heroImages = await getHeroImages();
  const services = await getServices();
  const galleryItems = getMergedGalleryItems(await getGalleryItems());
  const infrastructureItems = await getInfrastructureItems();
  const industryItems = await getIndustryItems();
  
  return <HomePage settings={settings} heroImages={heroImages} services={services} galleryItems={galleryItems} infrastructureItems={infrastructureItems} industryItems={industryItems} />;
}
