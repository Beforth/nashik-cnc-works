import Navbar from '@/src/components/Navbar';
import Footer from '@/src/components/Footer';
import StickyActions from '@/src/components/StickyActions';
import JobsGallerySection from '@/src/components/JobsGallerySection';
import { getGalleryItems } from '@/src/lib/gallery-content';
import { getMergedGalleryItems } from '@/src/lib/gallery-display';
import { getSiteSettings } from '@/src/lib/site-content';

export const dynamic = 'force-dynamic';

export default async function GalleryPage() {
  const [settings, galleryRaw] = await Promise.all([getSiteSettings(), getGalleryItems()]);
  const items = getMergedGalleryItems(galleryRaw);

  return (
    <div className="min-h-screen">
      <Navbar settings={settings} />
      <JobsGallerySection
        items={items}
        settings={settings}
        topPaddingClassName="pt-28 sm:pt-32"
      />
      <Footer />
      <StickyActions />
    </div>
  );
}
