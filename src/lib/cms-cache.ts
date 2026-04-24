import { unstable_cache, revalidatePath, revalidateTag } from 'next/cache';
import { getSiteSettings, getHeroImages } from './site-content';
import { getServices } from './service-content';
import { getGalleryItems } from './gallery-content';
import { getInfrastructureItems } from './infrastructure-content';
import { getIndustryItems } from './industry-content';

/** Tag for all public CMS read caches (home, gallery, page-sections API). */
export const CMS_PUBLIC_CACHE_TAG = 'cms-public';

/** How long cached CMS bundles stay fresh between manual invalidations. */
const REVALIDATE_SECONDS = 60;

const loadHomeCmsBundle = unstable_cache(
  async () => {
    const [settings, heroImages, services, galleryRaw, infrastructureItems, industryItems] =
      await Promise.all([
        getSiteSettings(),
        getHeroImages(),
        getServices(),
        getGalleryItems(),
        getInfrastructureItems(),
        getIndustryItems(),
      ]);
    return { settings, heroImages, services, galleryRaw, infrastructureItems, industryItems };
  },
  ['home-cms-bundle-v1'],
  { revalidate: REVALIDATE_SECONDS, tags: [CMS_PUBLIC_CACHE_TAG] },
);

export async function getHomeCmsBundle() {
  return loadHomeCmsBundle();
}

/** Profile page only needs settings + services + gallery — avoids hero / industry / infra queries. */
const loadProfileCmsBundle = unstable_cache(
  async () => {
    const [settings, services, galleryRaw] = await Promise.all([
      getSiteSettings(),
      getServices(),
      getGalleryItems(),
    ]);
    return { settings, services, galleryRaw };
  },
  ['profile-cms-bundle-v1'],
  { revalidate: REVALIDATE_SECONDS, tags: [CMS_PUBLIC_CACHE_TAG] },
);

export async function getProfileCmsBundle() {
  return loadProfileCmsBundle();
}

const loadGalleryPageCmsBundle = unstable_cache(
  async () => {
    const [settings, galleryRaw] = await Promise.all([getSiteSettings(), getGalleryItems()]);
    return { settings, galleryRaw };
  },
  ['gallery-page-cms-v1'],
  { revalidate: REVALIDATE_SECONDS, tags: [CMS_PUBLIC_CACHE_TAG] },
);

export async function getGalleryPageCmsBundle() {
  return loadGalleryPageCmsBundle();
}

const loadPageSectionsCmsBundle = unstable_cache(
  async () => {
    const [heroImages, settings, galleryRaw] = await Promise.all([
      getHeroImages(),
      getSiteSettings(),
      getGalleryItems(),
    ]);
    return { heroImages, settings, galleryRaw };
  },
  ['page-sections-cms-v1'],
  { revalidate: REVALIDATE_SECONDS, tags: [CMS_PUBLIC_CACHE_TAG] },
);

export async function getPageSectionsCmsBundle() {
  return loadPageSectionsCmsBundle();
}

/**
 * Call after admin (or API) mutations that affect the public site.
 * Revalidates the `unstable_cache` tag and the root layout so home, /gallery, /profile, and /[slug] pick up new gallery (and other CMS) data without waiting for the 60s TTL.
 */
export function revalidatePublicCmsCache() {
  revalidateTag(CMS_PUBLIC_CACHE_TAG);
  revalidatePath('/', 'layout');
}
