/**
 * New admin-created list rows appear first on the site (ascending `sortOrder`).
 * Same rule as hero slides: one less than the current minimum, or `0` if the table is empty.
 */
export async function nextSortOrderForPrepend(
  findFirstAscending: () => Promise<{ sortOrder: number } | null>,
): Promise<number> {
  const first = await findFirstAscending();
  return (first?.sortOrder ?? 0) - 1;
}
