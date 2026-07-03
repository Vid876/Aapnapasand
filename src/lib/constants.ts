const CATEGORY_SEED_IMAGES = [
  "/uploads/dadf4cf8-da12-4c5c-ba03-991e68a258af.jpg",
  "/uploads/0bc7ea6a-63ec-4f94-b172-cedeeb3e05bb.jpg",
  "/uploads/35b92bf7-8b77-4d97-aa17-08c098563992.jpg",
  "/uploads/81df845a-7e09-4d19-8ec9-d2070af19f80.jpg",
  "/uploads/2cb32606-e0ed-4c52-a7bf-9fdd6c611a46.jpg",
  "/uploads/03cd6105-7d88-47a4-a9bd-71e5f5091c0a.jpg",
] as const;

export const CATEGORIES = [
  { name: "Shirts", slug: "shirts", gender: "men", image: CATEGORY_SEED_IMAGES[5] },
  { name: "T-Shirts", slug: "t-shirts", gender: "men", image: CATEGORY_SEED_IMAGES[5] },
  { name: "Jeans", slug: "jeans", gender: "men", image: CATEGORY_SEED_IMAGES[4] },
  { name: "Pants", slug: "pants", gender: "men", image: CATEGORY_SEED_IMAGES[4] },
  { name: "Trousers", slug: "trousers", gender: "men", image: CATEGORY_SEED_IMAGES[4] },
  { name: "Chinos", slug: "chinos", gender: "men", image: CATEGORY_SEED_IMAGES[4] },
  { name: "Cargo Pants", slug: "cargo-pants", gender: "men", image: CATEGORY_SEED_IMAGES[4] },
  { name: "Joggers", slug: "joggers", gender: "men", image: CATEGORY_SEED_IMAGES[4] },
  { name: "Jackets", slug: "jackets", gender: "men", image: CATEGORY_SEED_IMAGES[4] },
  { name: "Hoodies", slug: "hoodies", gender: "men", image: CATEGORY_SEED_IMAGES[4] },
  { name: "Kurtas", slug: "kurtas", gender: "men", image: CATEGORY_SEED_IMAGES[2] },
  { name: "Dresses", slug: "dresses", gender: "women", image: CATEGORY_SEED_IMAGES[5] },
  { name: "Tops", slug: "tops", gender: "women", image: CATEGORY_SEED_IMAGES[5] },
  { name: "Kurtis", slug: "kurtis", gender: "women", image: CATEGORY_SEED_IMAGES[2] },
  { name: "Sarees", slug: "sarees", gender: "women", image: CATEGORY_SEED_IMAGES[2] },
  { name: "Lehengas", slug: "lehengas", gender: "women", image: CATEGORY_SEED_IMAGES[2] },
  { name: "Salwar Suits", slug: "salwar-suits", gender: "women", image: CATEGORY_SEED_IMAGES[2] },
  { name: "Leggings", slug: "leggings", gender: "women", image: CATEGORY_SEED_IMAGES[5] },
  { name: "Palazzos", slug: "palazzos", gender: "women", image: CATEGORY_SEED_IMAGES[5] },
  { name: "Skirts", slug: "skirts", gender: "women", image: CATEGORY_SEED_IMAGES[5] },
  { name: "Blouses", slug: "blouses", gender: "women", image: CATEGORY_SEED_IMAGES[5] },
  { name: "Dupattas", slug: "dupattas", gender: "women", image: CATEGORY_SEED_IMAGES[2] },
  { name: "Shorts", slug: "shorts", gender: "unisex", image: CATEGORY_SEED_IMAGES[5] },
  { name: "Ethnic Wear", slug: "ethnic-wear", gender: "unisex", image: CATEGORY_SEED_IMAGES[2] },
] as const;

export const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "28", "30", "32", "34", "36", "38"] as const;

export const COLORS = [
  { name: "Black", hex: "#000000" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Navy", hex: "#1e3a5f" },
  { name: "Grey", hex: "#6b7280" },
  { name: "Beige", hex: "#d4c4a8" },
  { name: "Olive", hex: "#556b2f" },
  { name: "Maroon", hex: "#800000" },
  { name: "Blue", hex: "#2563eb" },
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
