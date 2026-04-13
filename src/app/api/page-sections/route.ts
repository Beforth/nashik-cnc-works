import { NextResponse } from 'next/server';
import { getDefaultPageLayoutResponse } from '@/src/lib/page-layout-default';
import { getPageSectionsCmsBundle } from '@/src/lib/cms-cache';
import { getMergedGalleryItems } from '@/src/lib/gallery-display';

/**
 * Layout API for DynamicPage. Injects live DB content into sections.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');

  const body = getDefaultPageLayoutResponse();
  const { heroImages, settings, galleryRaw } = await getPageSectionsCmsBundle();
  const galleryItems = getMergedGalleryItems(galleryRaw);

  const nav = body.sections.find((s) => s.componentType === 'NAVBAR_SECTION');
  if (nav) {
    nav.componentProps = { ...(nav.componentProps || {}), settings };
  }

  const hero = body.sections.find((s) => s.componentType === 'HERO_SECTION');
  if (hero) {
    hero.componentProps = {
      ...(hero.componentProps || {}),
      settings,
      heroImages,
      ...(slug ? { citySlug: slug } : {}),
    };
  }

  const gallery = body.sections.find((s) => s.componentType === 'GALLERY_GRID');
  if (gallery) {
    gallery.componentProps = {
      ...(gallery.componentProps || {}),
      settings,
      galleryItems,
    };
  }

  return NextResponse.json(body);
}
