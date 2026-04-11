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

/** Row shape returned by `/api/admin/gallery` (Prisma `GalleryItem`). */
export type DbGalleryAdminRow = {
  id: string;
  title: string;
  imageUrl: string;
  category: string;
  linkUrl: string | null;
  sortOrder: number;
};

/** Admin editor row: persisted DB row or a catalog-only card not yet stored (`_isNew`). */
export type AdminGalleryEditorRow = DbGalleryAdminRow & {
  _isNew?: boolean;
  _clientId?: string;
};

/**
 * Admin Jobs Gallery should mirror the public section: DB rows first, then catalog cards
 * whose titles are not in the DB (same rule as `getMergedGalleryItems`). Catalog-only rows
 * are marked `_isNew` so Save runs POST and persists them.
 */
export function mergeCatalogIntoDbGalleryAdminRows(dbRows: DbGalleryAdminRow[]): AdminGalleryEditorRow[] {
  const sorted = [...dbRows].sort((a, b) => a.sortOrder - b.sortOrder);
  const seen = new Set(sorted.map((d) => d.title.trim().toLowerCase()));
  let nextOrder = sorted.reduce((m, r) => Math.max(m, r.sortOrder), -1) + 1;
  const extras: AdminGalleryEditorRow[] = [];

  GALLERY_ITEMS.forEach((item, index) => {
    const key = item.title.trim().toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    extras.push({
      id: '',
      title: item.title,
      category: item.category,
      imageUrl: item.src,
      linkUrl: item.href,
      sortOrder: nextOrder++,
      _isNew: true,
      _clientId: `catalog-${index}`,
    });
  });

  return [...sorted, ...extras];
}
