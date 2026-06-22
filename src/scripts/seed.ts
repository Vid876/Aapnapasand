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

const PRODUCTS = [
  {
    name: "Classic Oxford Cotton Shirt",
    category: "shirts",
    gender: "men" as const,
    price: 1299,
    compareAtPrice: 1999,
    description: "Premium Oxford cotton shirt with a relaxed fit. Perfect for both casual and semi-formal occasions. Features a button-down collar and chest pocket.",
    shortDescription: "Premium Oxford cotton with relaxed fit",
    images: [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b00?w=800&q=80",
      "https://images.unsplash.com/photo-1602810318383-0e00344e1f7e?w=800&q=80",
    ],
    isFeatured: true,
    rating: 4.5,
    reviewCount: 128,
  },
  {
    name: "Slim Fit Denim Jeans",
    category: "jeans",
    gender: "men" as const,
    price: 1899,
    compareAtPrice: 2499,
    description: "Stretch denim jeans with a modern slim fit. Comfortable all-day wear with a classic 5-pocket design.",
    shortDescription: "Stretch denim with modern slim fit",
    images: [
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80",
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80",
    ],
    isFeatured: true,
    rating: 4.3,
    reviewCount: 89,
  },
  {
    name: "Premium Cotton T-Shirt",
    category: "t-shirts",
    gender: "men" as const,
    price: 599,
    compareAtPrice: 899,
    description: "100% premium combed cotton t-shirt. Soft, breathable, and durable. Available in multiple colors.",
    shortDescription: "100% premium combed cotton",
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
    ],
    isFeatured: true,
    rating: 4.7,
    reviewCount: 256,
  },
  {
    name: "Linen Casual Shirt",
    category: "shirts",
    gender: "men" as const,
    price: 1499,
    description: "Breathable linen shirt perfect for Indian summers. Relaxed fit with roll-up sleeve option.",
    shortDescription: "Breathable linen for Indian summers",
    images: [
      "https://images.unsplash.com/photo-1602810318383-0e00344e1f7e?w=800&q=80",
    ],
    rating: 4.2,
    reviewCount: 45,
  },
  {
    name: "Chino Trousers",
    category: "pants",
    gender: "men" as const,
    price: 1599,
    compareAtPrice: 2199,
    description: "Classic chino trousers in stretch cotton twill. Versatile enough for office or weekend.",
    shortDescription: "Stretch cotton twill chinos",
    images: [
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=80",
    ],
    isFeatured: true,
    rating: 4.4,
    reviewCount: 67,
  },
  {
    name: "Bomber Jacket",
    category: "jackets",
    gender: "men" as const,
    price: 2999,
    compareAtPrice: 3999,
    description: "Stylish bomber jacket with ribbed cuffs and hem. Lightweight nylon shell with quilted lining.",
    shortDescription: "Lightweight nylon bomber jacket",
    images: [
      "https://images.unsplash.com/photo-1551028718-00167b16eac5?w=800&q=80",
    ],
    rating: 4.6,
    reviewCount: 34,
  },
  {
    name: "Embroidered Kurta",
    category: "kurtas",
    gender: "men" as const,
    price: 1799,
    compareAtPrice: 2499,
    description: "Elegant cotton kurta with subtle embroidery. Perfect for festivals and celebrations.",
    shortDescription: "Cotton kurta with subtle embroidery",
    images: [
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&q=80",
    ],
    isFeatured: true,
    rating: 4.8,
    reviewCount: 112,
  },
  {
    name: "Floral Summer Dress",
    category: "dresses",
    gender: "women" as const,
    price: 2199,
    compareAtPrice: 2999,
    description: "Beautiful floral print dress in lightweight fabric. A-line silhouette with adjustable straps.",
    shortDescription: "Floral print A-line summer dress",
    images: [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80",
    ],
    isFeatured: true,
    rating: 4.5,
    reviewCount: 78,
  },
  {
    name: "Silk Blend Saree",
    category: "sarees",
    gender: "women" as const,
    price: 3999,
    compareAtPrice: 5499,
    description: "Elegant silk blend saree with zari border. Comes with matching blouse piece.",
    shortDescription: "Silk blend with zari border",
    images: [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80",
    ],
    isFeatured: true,
    rating: 4.9,
    reviewCount: 56,
  },
  {
    name: "Casual Crop Top",
    category: "tops",
    gender: "women" as const,
    price: 799,
    compareAtPrice: 1199,
    description: "Trendy crop top in soft jersey fabric. Perfect pairing with high-waist jeans or skirts.",
    shortDescription: "Soft jersey crop top",
    images: [
      "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=800&q=80",
    ],
    rating: 4.3,
    reviewCount: 92,
  },
  {
    name: "High-Waist Palazzo",
    category: "pants",
    gender: "women" as const,
    price: 1299,
    description: "Flowy palazzo pants with elastic waistband. Comfortable and stylish for any occasion.",
    shortDescription: "Flowy palazzo with elastic waist",
    images: [
      "https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=800&q=80",
    ],
    rating: 4.1,
    reviewCount: 38,
  },
  {
    name: "Anarkali Suit Set",
    category: "ethnic-wear",
    gender: "women" as const,
    price: 3499,
    compareAtPrice: 4999,
    description: "Stunning Anarkali suit with dupatta. Intricate embroidery on georgette fabric.",
    shortDescription: "Georgette Anarkali with embroidery",
    images: [
      "https://images.unsplash.com/photo-1583391733981-5c3d0c0c0b0a?w=800&q=80",
    ],
    isFeatured: true,
    rating: 4.7,
    reviewCount: 43,
  },
];

function generateVariants() {
  const sizes = ["S", "M", "L", "XL"];
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
      description: `Shop ${cat.name} collection at Aapnapasand`,
    });
    categoryMap[cat.slug] = category._id;
  }

  console.log("Seeding products...");
  for (const prod of PRODUCTS) {
    const variants = generateVariants();
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
    email: "admin@aapnapasand.com",
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
      description: "Flat ₹200 off",
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
  console.log("  Admin: admin@aapnapasand.com / admin123");
  console.log("  Customer: customer@example.com / customer123");
  console.log("\nCoupons: WELCOME10 (10% off), FLAT200 (₹200 off)");

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
