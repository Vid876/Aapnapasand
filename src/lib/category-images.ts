export const CATEGORY_IMAGE_CARDS = [
  { name: "Bandanas", slug: "bandanas", image: "/category-images/bandanas.png" },
  { name: "Canvas Bags", slug: "canvas-bags", image: "/category-images/canvas-bags.png" },
  { name: "Collections", slug: "collections", image: "/category-images/collections.png" },
  { name: "Custom Listings", slug: "custom-listings", image: "/category-images/custom-listings.png" },
  { name: "Duffel Bags", slug: "duffel-bags", image: "/category-images/duffel-bags.png" },
  { name: "Duvet Covers", slug: "duvet-covers", image: "/category-images/duvet-covers.png" },
  { name: "Home Decor", slug: "home-decor", image: "/category-images/home-decor.png" },
  { name: "Jackets & Outerwear", slug: "jackets-outerwear", image: "/category-images/jackets-outerwear.png" },
  { name: "Kaftans", slug: "kaftans", image: "/category-images/kaftans.png" },
  { name: "Linen Bedding Sets", slug: "linen-bedding-sets", image: "/category-images/linen-bedding-sets.png" },
  { name: "Linen Curtains", slug: "linen-curtains", image: "/category-images/linen-curtains.png" },
  { name: "Napkins", slug: "napkins", image: "/category-images/napkins.png" },
  { name: "Quilted Jackets", slug: "quilted-jackets", image: "/category-images/quilted-jackets.png" },
  { name: "Quilts", slug: "quilts", image: "/category-images/quilts.png" },
  { name: "Sarongs", slug: "sarongs", image: "/category-images/sarongs.png" },
  { name: "Tablecloths", slug: "tablecloths", image: "/category-images/tablecloths.png" },
  { name: "Tote Bags", slug: "tote-bags", image: "/category-images/tote-bags.png" },
  { name: "Women Clothing", slug: "women-clothing", image: "/category-images/women-clothing.png" },
  { name: "Wrinkle Duvet Covers", slug: "wrinkle-duvet-covers", image: "/category-images/wrinkle-duvet-covers.png" },
] as const;

export const CATEGORY_IMAGE_BY_SLUG: Record<string, string> = Object.fromEntries(
  CATEGORY_IMAGE_CARDS.map(({ slug, image }) => [slug, image])
);
