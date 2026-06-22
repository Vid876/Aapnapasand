export const CATEGORIES = [
  { name: "Shirts", slug: "shirts", gender: "men", image: "https://images.unsplash.com/photo-1596755094514-f87e34085b00?w=600&q=80" },
  { name: "T-Shirts", slug: "t-shirts", gender: "men", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80" },
  { name: "Jeans", slug: "jeans", gender: "men", image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80" },
  { name: "Pants", slug: "pants", gender: "men", image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&q=80" },
  { name: "Jackets", slug: "jackets", gender: "men", image: "https://images.unsplash.com/photo-1551028718-00167b16eac5?w=600&q=80" },
  { name: "Kurtas", slug: "kurtas", gender: "men", image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&q=80" },
  { name: "Dresses", slug: "dresses", gender: "women", image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80" },
  { name: "Tops", slug: "tops", gender: "women", image: "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=600&q=80" },
  { name: "Sarees", slug: "sarees", gender: "women", image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80" },
  { name: "Ethnic Wear", slug: "ethnic-wear", gender: "unisex", image: "https://images.unsplash.com/photo-1583391733981-5c3d0c0c0b0a?w=600&q=80" },
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
