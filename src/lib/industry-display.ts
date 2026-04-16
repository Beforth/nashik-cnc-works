import { INDUSTRIES } from '@/src/constants';

export type DbIndustryAdminRow = {
  id: string;
  name: string;
  iconKey: string;
  sortOrder: number;
};

/** Admin editor row: persisted DB row or a catalog sector not yet stored (`_isNew`). */
export type AdminIndustryEditorRow = DbIndustryAdminRow & {
  _isNew?: boolean;
  _clientId?: string;
};

/**
 * DB rows first (sort order preserved), then catalog entries whose names are not already in the DB
 * so the admin list shows every sector that can appear on the site (same idea as Jobs Gallery admin).
 */
export function mergeCatalogIntoDbIndustryAdminRows(dbRows: DbIndustryAdminRow[]): AdminIndustryEditorRow[] {
  const sorted = [...dbRows].sort((a, b) => a.sortOrder - b.sortOrder);
  const seen = new Set(sorted.map((d) => d.name.trim().toLowerCase()));
  let nextOrder = sorted.reduce((m, r) => Math.max(m, r.sortOrder), -1) + 1;
  const extras: AdminIndustryEditorRow[] = [];

  INDUSTRIES.forEach((item, index) => {
    const key = item.name.trim().toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    extras.push({
      id: '',
      name: item.name,
      iconKey: item.iconKey,
      sortOrder: nextOrder++,
      _isNew: true,
      _clientId: `catalog-${index}`,
    });
  });

  return [...sorted, ...extras];
}
