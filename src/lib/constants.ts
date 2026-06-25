export const CATEGORIES = [
  { name: "Shirts", slug: "shirts", gender: "men", image: "https://images.unsplash.com/photo-1596755094514-f87e34085b00?w=600&q=80" },
  { name: "T-Shirts", slug: "t-shirts", gender: "men", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80" },
  { name: "Jeans", slug: "jeans", gender: "men", image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80" },
  { name: "Pants", slug: "pants", gender: "men", image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&q=80" },
  { name: "Trousers", slug: "trousers", gender: "men", image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80" },
  { name: "Chinos", slug: "chinos", gender: "men", image: "https://images.unsplash.com/photo-1506629905607-d9e297d4f5f1?w=600&q=80" },
  { name: "Cargo Pants", slug: "cargo-pants", gender: "men", image: "https://images.unsplash.com/photo-1543076447-215ad9ba6923?w=600&q=80" },
  { name: "Joggers", slug: "joggers", gender: "men", image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&q=80" },
  { name: "Jackets", slug: "jackets", gender: "men", image: "https://images.unsplash.com/photo-1551028718-00167b16eac5?w=600&q=80" },
  { name: "Hoodies", slug: "hoodies", gender: "men", image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80" },
  { name: "Kurtas", slug: "kurtas", gender: "men", image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&q=80" },
  { name: "Dresses", slug: "dresses", gender: "women", image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80" },
  { name: "Tops", slug: "tops", gender: "women", image: "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=600&q=80" },
  { name: "Kurtis", slug: "kurtis", gender: "women", image: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600&q=80" },
  { name: "Sarees", slug: "sarees", gender: "women", image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80" },
  { name: "Lehengas", slug: "lehengas", gender: "women", image: "https://images.unsplash.com/photo-1610173827043-9db50e0d8ef9?w=600&q=80" },
  { name: "Salwar Suits", slug: "salwar-suits", gender: "women", image: "https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=600&q=80" },
  { name: "Leggings", slug: "leggings", gender: "women", image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80" },
  { name: "Palazzos", slug: "palazzos", gender: "women", image: "https://images.unsplash.com/photo-1506629905607-d9e297d4f5f1?w=600&q=80" },
  { name: "Skirts", slug: "skirts", gender: "women", image: "https://images.unsplash.com/photo-1583496661160-fb5886a13d27?w=600&q=80" },
  { name: "Blouses", slug: "blouses", gender: "women", image: "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=600&q=80" },
  { name: "Dupattas", slug: "dupattas", gender: "women", image: "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=600&q=80" },
  { name: "Shorts", slug: "shorts", gender: "unisex", image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=600&q=80" },
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
