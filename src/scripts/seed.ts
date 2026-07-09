import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { connectDB } from "../lib/db";
import { Category } from "../models/Category";
import { Product } from "../models/Product";
import { User } from "../models/User";
import { Coupon } from "../models/Coupon";
import { Review } from "../models/Review";
import { CATEGORIES, COLORS } from "../lib/constants";
import { slugify } from "../lib/utils";

const PRODUCT_SEED_IMAGES = [
  "/uploads/28e9410f-0bcc-4ebd-b6d5-9df582f27720.jpg",
  "/uploads/9ed8c9c0-4cb0-41aa-8461-128f1ae0843b.jpg",
  "/uploads/b9727a78-e585-4a3c-b912-819f3a348ba9.jpg",
  "/uploads/5c120738-2c71-4ffc-b4c7-bd5e538832e1.jpg",
  "/uploads/b71cf9f4-66cf-4689-a5d4-009f550ed2f7.jpg",
  "/uploads/b1d6c86a-7b4f-4848-83f3-f57d25654b33.jpg",
  "/uploads/30ef945d-0d6b-4c19-8ad0-888cb12d149e.jpg",
  "/uploads/805b0cdc-5323-40fd-a383-802163946237.jpg",
  "/uploads/302aaa5c-c270-4c91-bf78-20eb8fa1c274.jpg",
  "/uploads/e94e9dce-cde7-4e62-bbd6-167b068f2d59.jpg",
  "/uploads/70ee3188-1734-42ab-95a4-60cb868174a2.jpg",
  "/uploads/b810d379-b724-458c-a6c4-20fb82cec7e3.jpg",
] as const;

const PRODUCTS = [
  {
    name: "Indigo Hand Block Print Duvet Cover",
    category: "duvet-covers",
    gender: "unisex" as const,
    price: 4299,
    compareAtPrice: 5499,
    description: "Hand block printed cotton duvet cover made for layered bedrooms, guest rooms, and boutique hospitality spaces.",
    shortDescription: "Hand block printed cotton duvet cover",
    images: [PRODUCT_SEED_IMAGES[0], PRODUCT_SEED_IMAGES[1]],
    isFeatured: true,
    rating: 4.5,
    reviewCount: 128,
    specifications: ["100% cotton", "Hand block printed", "Made in India", "Cold gentle wash"],
  },
  {
    name: "Jaipur Block Print Bed Sheet",
    category: "bed-sheets",
    gender: "unisex" as const,
    price: 2499,
    compareAtPrice: 3199,
    description: "Soft cotton bed sheet with a Jaipur-inspired hand block print for everyday bedrooms and gifting.",
    shortDescription: "Soft block printed cotton bed sheet",
    images: [PRODUCT_SEED_IMAGES[2], PRODUCT_SEED_IMAGES[3]],
    isFeatured: true,
    rating: 4.3,
    reviewCount: 89,
    specifications: ["Cotton fabric", "Hand block printed", "Queen and king sizes", "Shade dry recommended"],
  },
  {
    name: "Printed Pillow Cover Pair",
    category: "pillow-covers",
    gender: "unisex" as const,
    price: 899,
    compareAtPrice: 1299,
    description: "Pair of hand block printed pillow covers that add artisan color to bedding, sofas, and guest rooms.",
    shortDescription: "Pair of hand block printed pillow covers",
    images: [PRODUCT_SEED_IMAGES[4]],
    isFeatured: true,
    rating: 4.7,
    reviewCount: 256,
    specifications: ["Cotton shell", "Set of 2", "Envelope closure", "Handmade variation expected"],
  },
  {
    name: "Hand Block Print Curtain Panel",
    category: "curtains",
    gender: "unisex" as const,
    price: 1899,
    description: "Cotton curtain panel with a hand block printed repeat for bedrooms, studios, and relaxed interiors.",
    shortDescription: "Printed cotton curtain panel",
    images: [PRODUCT_SEED_IMAGES[5]],
    rating: 4.2,
    reviewCount: 45,
    specifications: ["Cotton fabric", "Single panel", "Rod pocket finish", "Custom sizes on request"],
  },
  {
    name: "Cotton Block Print Napkin Set",
    category: "napkins",
    gender: "unisex" as const,
    price: 999,
    compareAtPrice: 1399,
    description: "Set of cotton hand block printed napkins for layered tables, events, gifting, and restaurants.",
    shortDescription: "Set of hand block printed cotton napkins",
    images: [PRODUCT_SEED_IMAGES[6]],
    isFeatured: true,
    rating: 4.4,
    reviewCount: 67,
    specifications: ["Set of 4", "Cotton fabric", "Reusable table linen", "Cold wash separately"],
  },
  {
    name: "Floral Block Print Tablecloth",
    category: "tablecloths",
    gender: "unisex" as const,
    price: 2199,
    compareAtPrice: 2899,
    description: "Hand block printed cotton tablecloth for dining rooms, festive hosting, weddings, and boutique events.",
    shortDescription: "Hand block printed cotton tablecloth",
    images: [PRODUCT_SEED_IMAGES[7]],
    rating: 4.6,
    reviewCount: 34,
    specifications: ["Cotton table linen", "Hand block printed", "Multiple table sizes", "Made in India"],
  },
  {
    name: "Jaipur Block Print Table Runner",
    category: "table-runners",
    gender: "unisex" as const,
    price: 1199,
    compareAtPrice: 1599,
    description: "Printed cotton table runner for layered dining, gifting, events, and seasonal tablescapes.",
    shortDescription: "Printed cotton table runner",
    images: [PRODUCT_SEED_IMAGES[8]],
    isFeatured: true,
    rating: 4.8,
    reviewCount: 112,
    specifications: ["Cotton runner", "Hand block printed", "Dining and event use", "Shade dry recommended"],
  },
  {
    name: "Relaxed Cotton Block Print Kaftan",
    category: "kaftans",
    gender: "women" as const,
    price: 2199,
    compareAtPrice: 2999,
    description: "Breathable cotton kaftan with a relaxed hand block printed silhouette for resort, lounge, and travel wear.",
    shortDescription: "Relaxed hand block printed cotton kaftan",
    images: [PRODUCT_SEED_IMAGES[9]],
    isFeatured: true,
    rating: 4.5,
    reviewCount: 78,
    specifications: ["Cotton fabric", "Relaxed fit", "Hand block printed", "Easy resort wear"],
  },
  {
    name: "Block Print Cotton Sarong",
    category: "sarongs",
    gender: "women" as const,
    price: 1299,
    compareAtPrice: 1799,
    description: "Lightweight block print sarong for beach styling, travel, gifting, and warm-weather layering.",
    shortDescription: "Lightweight printed cotton sarong",
    images: [PRODUCT_SEED_IMAGES[10]],
    isFeatured: true,
    rating: 4.9,
    reviewCount: 56,
    specifications: ["Cotton fabric", "One size wrap", "Hand block printed", "Travel friendly"],
  },
  {
    name: "Printed Beach Cover-Up",
    category: "beach-cover-ups",
    gender: "women" as const,
    price: 1899,
    compareAtPrice: 2499,
    description: "Soft hand block printed beach cover-up for resort wear, poolside layering, and relaxed travel.",
    shortDescription: "Hand block printed beach cover-up",
    images: [PRODUCT_SEED_IMAGES[11]],
    rating: 4.3,
    reviewCount: 92,
    specifications: ["Cotton fabric", "Relaxed silhouette", "Hand block printed", "Cold gentle wash"],
  },
  {
    name: "Quilted Block Print Tote Bag",
    category: "quilted-tote-bags",
    gender: "unisex" as const,
    price: 1499,
    description: "Soft quilted cotton tote bag with hand block printed fabric for markets, travel, gifting, and daily carry.",
    shortDescription: "Quilted hand block print cotton tote",
    images: [PRODUCT_SEED_IMAGES[2]],
    rating: 4.1,
    reviewCount: 38,
    specifications: ["Quilted cotton", "Hand block printed", "Everyday carry", "Boutique gift item"],
  },
  {
    name: "Block Print Fabric by Yard",
    category: "block-print-fabric-by-yard",
    gender: "unisex" as const,
    price: 699,
    compareAtPrice: 899,
    description: "Hand block printed cotton fabric by yard for designers, makers, small brands, and custom textile projects.",
    shortDescription: "Hand block printed cotton fabric by yard",
    images: [PRODUCT_SEED_IMAGES[8]],
    isFeatured: true,
    rating: 4.7,
    reviewCount: 43,
    specifications: ["Sold by yard", "Cotton fabric", "Hand block printed", "Custom orders welcome"],
  },
];

function generateVariants(categorySlug: string) {
  const sizeMap: Record<string, string[]> = {
    "duvet-covers": ["Twin", "Queen", "King"],
    "bed-sheets": ["Twin", "Queen", "King"],
    "pillow-covers": ["OS"],
    "curtains": ["OS", "Custom"],
    "napkins": ["OS"],
    "tablecloths": ["4 Seater", "6 Seater", "8 Seater"],
    "table-runners": ["OS"],
    "kaftans": ["S", "M", "L", "XL"],
    "sarongs": ["OS"],
    "beach-cover-ups": ["S", "M", "L", "XL"],
    "quilted-tote-bags": ["OS"],
    "block-print-fabric-by-yard": ["1 Yard", "2 Yard"],
  };
  const sizes = sizeMap[categorySlug] || ["OS"];
  const colors = COLORS.slice(0, 4);
  const variants = [];

  for (const size of sizes) {
    for (const color of colors) {
      variants.push({
        size,
        color: color.name,
        colorHex: color.hex,
        sku: `${slugify(size)}-${slugify(color.name)}-${Math.random().toString(36).substring(2, 6)}`,
        stock: Math.floor(Math.random() * 20) + 5,
      });
    }
  }

  return variants;
}

async function seed() {
  console.log("Connecting to database...");
  await connectDB();

  console.log("Clearing existing data...");
  await Promise.all([
    Category.deleteMany({}),
    Product.deleteMany({}),
    User.deleteMany({}),
    Coupon.deleteMany({}),
    Review.deleteMany({}),
  ]);

  console.log("Seeding categories...");
  const categoryMap: Record<string, mongoose.Types.ObjectId> = {};
  for (const cat of CATEGORIES) {
    const category = await Category.create({
      name: cat.name,
      slug: cat.slug,
      gender: cat.gender,
      image: cat.image,
      description: `Shop ${cat.name} collection at BOHOBLOCKPRINTED`,
    });
    categoryMap[cat.slug] = category._id;
  }

  console.log("Seeding products...");
  for (const prod of PRODUCTS) {
    const variants = generateVariants(prod.category);
    const totalStock = variants.reduce((sum, v) => sum + v.stock, 0);

    await Product.create({
      ...prod,
      slug: slugify(prod.name),
      category: categoryMap[prod.category],
      variants,
      totalStock,
      tags: [prod.category, prod.gender, "new"],
    });
  }

  console.log("Seeding admin user...");
  const hashedPassword = await bcrypt.hash("admin123", 12);
  const admin = await User.create({
    name: "Admin",
    email: "admin@bohoblockprinted.com",
    password: hashedPassword,
    role: "admin",
  });

  const customerPassword = await bcrypt.hash("customer123", 12);
  await User.create({
    name: "Demo Customer",
    email: "customer@example.com",
    password: customerPassword,
    role: "customer",
  });

  console.log("Seeding coupons...");
  await Coupon.create([
    {
      code: "WELCOME10",
      description: "10% off on your first order",
      discountType: "percentage",
      discountValue: 10,
      minOrderAmount: 500,
      maxDiscount: 500,
    },
    {
      code: "FLAT200",
      description: "Flat INR 200 off",
      discountType: "fixed",
      discountValue: 200,
      minOrderAmount: 1500,
    },
  ]);

  console.log("Seeding sample reviews...");
  const products = await Product.find().limit(3);
  for (const product of products) {
    await Review.create({
      product: product._id,
      user: admin._id,
      userName: "Rahul S.",
      rating: 5,
      title: "Great quality!",
      comment: "Really loved the fabric quality and fit. Will definitely buy again.",
      isApproved: true,
    });
  }

  console.log("\nSeed completed successfully!");
  console.log("\nDemo accounts:");
  console.log("  Admin: admin@bohoblockprinted.com / admin123");
  console.log("  Customer: customer@example.com / customer123");
  console.log("\nCoupons: WELCOME10 (10% off), FLAT200 (INR 200 off)");

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});

