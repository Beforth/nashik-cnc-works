import HomePage from '@/src/components/HomePage';
import { getHomeCmsBundle } from '@/src/lib/cms-cache';
import { getMergedGalleryItems } from '@/src/lib/gallery-display';

/** Always run the page dynamically; CMS payload is cached in `getHomeCmsBundle` (tag `cms-public`). */
export const dynamic = 'force-dynamic';

export default async function Page() {
  const { settings, heroImages, services, galleryRaw, infrastructureItems, industryItems } =
    await getHomeCmsBundle();
  const galleryItems = getMergedGalleryItems(galleryRaw);

  return (
    <HomePage
      settings={settings}
      heroImages={heroImages}
      services={services}
      galleryItems={galleryItems}
      infrastructureItems={infrastructureItems}
      industryItems={industryItems}
    />
  );
}
