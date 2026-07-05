"use client";

import { useRouter } from "next/navigation";
import { ProductForm, type ProductFormData } from "@/components/admin/ProductForm";

export default function NewProductPage() {
  const router = useRouter();

  const handleSubmit = async (data: ProductFormData) => {
    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.name,
        description: data.description,
        shortDescription: data.shortDescription || undefined,
        price: parseFloat(data.price),
        compareAtPrice: data.compareAtPrice ? parseFloat(data.compareAtPrice) : undefined,
        currency: data.currency,
        images: data.images,
        category: data.category,
        gender: data.gender,
        brand: data.brand,
        isFeatured: data.isFeatured,
        isActive: data.isActive,
        variants: data.variants.map((variant) => ({
          ...variant,
          stock: Number(variant.stock),
          price: variant.price ? Number(variant.price) : undefined,
        })),
        tags: [],
      }),
    });

    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.error || "Failed to create product");
    }

    router.push("/admin/products");
  };

  return (
    <ProductForm
      title="Add New Product"
      submitLabel="Create Product"
      onSubmit={handleSubmit}
    />
  );
}
