export type CurrencyCode = "INR" | "USD";

export interface ProductVariant {
  size: string;
  color: string;
  colorHex?: string;
  sku: string;
  stock: number;
  price?: number;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  compareAtPrice?: number;
  currency?: CurrencyCode;
  images: string[];
  category: Category | string;
  gender: "men" | "women" | "kids" | "unisex";
  brand?: string;
  subcategory?: string;
  specifications?: string[];
  tags: string[];
  variants: ProductVariant[];
  totalStock: number;
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  gender: "men" | "women" | "kids" | "unisex";
  isActive: boolean;
  productCount?: number;
}

export interface CartItem {
  productId: string;
  name: string;
  image: string;
  slug: string;
  price: number;
  currency?: CurrencyCode;
  quantity: number;
  size: string;
  color: string;
}

export interface Review {
  _id: string;
  product: string;
  userName: string;
  rating: number;
  title?: string;
  comment: string;
  createdAt: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  items: {
    product: string;
    name: string;
    image: string;
    quantity: number;
    size: string;
    color: string;
    price: number;
    currency?: CurrencyCode;
  }[];
  shippingAddress: {
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
  };
  subtotal: number;
  shippingCost: number;
  discount: number;
  tax: number;
  total: number;
  currency?: CurrencyCode;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  trackingNumber?: string;
  createdAt: string;
}

export interface ProductFilters {
  category?: string;
  gender?: string;
  minPrice?: number;
  maxPrice?: number;
  size?: string;
  color?: string;
  sort?: string;
  search?: string;
  page?: number;
  limit?: number;
}
