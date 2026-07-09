const CATEGORY_SEED_IMAGES = [
  "/uploads/dadf4cf8-da12-4c5c-ba03-991e68a258af.jpg",
  "/uploads/0bc7ea6a-63ec-4f94-b172-cedeeb3e05bb.jpg",
  "/uploads/35b92bf7-8b77-4d97-aa17-08c098563992.jpg",
  "/uploads/81df845a-7e09-4d19-8ec9-d2070af19f80.jpg",
  "/uploads/2cb32606-e0ed-4c52-a7bf-9fdd6c611a46.jpg",
  "/uploads/03cd6105-7d88-47a4-a9bd-71e5f5091c0a.jpg",
] as const;

export const CATEGORIES = [
  { name: "Duvet Covers", slug: "duvet-covers", gender: "unisex", image: CATEGORY_SEED_IMAGES[1] },
  { name: "Bed Sheets", slug: "bed-sheets", gender: "unisex", image: CATEGORY_SEED_IMAGES[0] },
  { name: "Pillow Covers", slug: "pillow-covers", gender: "unisex", image: CATEGORY_SEED_IMAGES[0] },
  { name: "Curtains", slug: "curtains", gender: "unisex", image: CATEGORY_SEED_IMAGES[3] },
  { name: "Napkins", slug: "napkins", gender: "unisex", image: CATEGORY_SEED_IMAGES[2] },
  { name: "Tablecloths", slug: "tablecloths", gender: "unisex", image: CATEGORY_SEED_IMAGES[2] },
  { name: "Table Runners", slug: "table-runners", gender: "unisex", image: CATEGORY_SEED_IMAGES[2] },
  { name: "Kaftans", slug: "kaftans", gender: "women", image: CATEGORY_SEED_IMAGES[5] },
  { name: "Sarongs", slug: "sarongs", gender: "women", image: CATEGORY_SEED_IMAGES[5] },
  { name: "Beach Cover-Ups", slug: "beach-cover-ups", gender: "women", image: CATEGORY_SEED_IMAGES[5] },
  { name: "Bandanas", slug: "bandanas", gender: "unisex", image: CATEGORY_SEED_IMAGES[4] },
  { name: "Quilted Tote Bags", slug: "quilted-tote-bags", gender: "unisex", image: CATEGORY_SEED_IMAGES[4] },
  { name: "Cosmetic Bags", slug: "cosmetic-bags", gender: "unisex", image: CATEGORY_SEED_IMAGES[4] },
  { name: "Duffle Bags", slug: "duffle-bags", gender: "unisex", image: CATEGORY_SEED_IMAGES[4] },
  { name: "Block Print Fabric by Yard", slug: "block-print-fabric-by-yard", gender: "unisex", image: CATEGORY_SEED_IMAGES[1] },
] as const;

export const SIZES = ["OS", "XS", "S", "M", "L", "XL", "XXL", "Twin", "Queen", "King", "1 Yard", "2 Yard"] as const;

export const COLORS = [
  { name: "Black", hex: "#000000" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Indigo", hex: "#1f3f73" },
  { name: "Madder Red", hex: "#9f2f2f" },
  { name: "Sage", hex: "#7f9366" },
  { name: "Mustard", hex: "#c9902e" },
  { name: "Rose", hex: "#cf6f83" },
  { name: "Charcoal", hex: "#2f3437" },
] as const;

export const ORDER_STATUS = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "returned",
] as const;

export type OrderStatus = (typeof ORDER_STATUS)[number];
