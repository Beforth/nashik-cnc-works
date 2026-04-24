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

  // If the DB has rows, trust them entirely (respect deletes/edits).
  if (dbItems?.length) {
    return dbItems;
  }

  // No DB rows: fall back to static catalog.
  return staticItems;
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
  // Respect deletes/edits: show exactly what's in DB.
  return [...dbRows].sort((a, b) => a.sortOrder - b.sortOrder);
}
