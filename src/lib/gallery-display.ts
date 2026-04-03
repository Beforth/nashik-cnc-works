import { GALLERY_ITEMS } from '@/src/constants';

/** Shape used by Jobs Gallery cards on the site */
export type GalleryCardItem = {
  id?: string;
  title: string;
  category: string;
  imageUrl: string;
  linkUrl?: string | null;
};

/**
 * Shows every DB item first (sort order preserved), then adds static catalog entries
 * whose titles are not already present so the section never drops legacy demos when the DB is partial.
 */
export function getMergedGalleryItems(
  dbItems: GalleryCardItem[] | null | undefined,
): GalleryCardItem[] {
  const staticItems: GalleryCardItem[] = GALLERY_ITEMS.map((item) => ({
    title: item.title,
    category: item.category,
    imageUrl: item.src,
    linkUrl: item.href,
  }));

  if (!dbItems?.length) {
    return staticItems;
  }

  const seen = new Set(dbItems.map((d) => d.title.trim().toLowerCase()));
  const extra = staticItems.filter((s) => !seen.has(s.title.trim().toLowerCase()));
  return [...dbItems, ...extra];
}
