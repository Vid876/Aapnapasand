import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProductVariant {
  size: string;
  color: string;
  colorHex?: string;
  sku: string;
  stock: number;
  price?: number;
}

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  category: mongoose.Types.ObjectId;
  subcategory?: string;
  gender: "men" | "women" | "kids" | "unisex";
  brand?: string;
  specifications?: string[];
  tags: string[];
  variants: IProductVariant[];
  totalStock: number;
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductVariantSchema = new Schema<IProductVariant>(
  {
    size: { type: String, required: true },
    color: { type: String, required: true },
    colorHex: { type: String },
    sku: { type: String, required: true },
    stock: { type: Number, required: true, min: 0, default: 0 },
    price: { type: Number },
  },
  { _id: false }
);

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    shortDescription: { type: String },
    price: { type: Number, required: true, min: 0 },
    compareAtPrice: { type: Number, min: 0 },
    images: [{ type: String, required: true }],
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    gender: {
      type: String,
      enum: ["men", "women", "kids", "unisex"],
      default: "unisex",
    },
    brand: { type: String, default: "Aapnapasand" },
    subcategory: { type: String },
    specifications: [{ type: String }],
    tags: [{ type: String }],
    variants: [ProductVariantSchema],
    totalStock: { type: Number, default: 0, min: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0, min: 0 },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

ProductSchema.index({ name: "text", description: "text", tags: "text" });
ProductSchema.index({ category: 1, gender: 1, price: 1 });

export const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);
