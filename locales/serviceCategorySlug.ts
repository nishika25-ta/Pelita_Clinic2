/** Stable slug for each `SERVICES[].category` (used in translation maps). */
export function serviceCategorySlug(category: string): string {
  return category
    .toLowerCase()
    .replace(/'/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
