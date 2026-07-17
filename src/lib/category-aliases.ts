/** Categories that are intentionally presented as one storefront category. */
export const CATEGORY_ALIASES = {
  "bandana-sets": "bandanas",
} as const;

export const MERGED_CATEGORY_SLUGS = Object.keys(CATEGORY_ALIASES) as Array<
  keyof typeof CATEGORY_ALIASES
>;

export function getCanonicalCategorySlug(slug: string) {
  return CATEGORY_ALIASES[slug as keyof typeof CATEGORY_ALIASES] ?? slug;
}
