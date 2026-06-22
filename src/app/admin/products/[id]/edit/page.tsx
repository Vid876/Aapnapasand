"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ProductForm, type ProductFormData } from "@/components/admin/ProductForm";
import type { Product } from "@/types";

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.product) setProduct(data.product);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (data: ProductFormData) => {
    const res = await fetch(`/api/admin/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.name,
        description: data.description,
        shortDescription: data.shortDescription || undefined,
        price: parseFloat(data.price),
        compareAtPrice: data.compareAtPrice ? parseFloat(data.compareAtPrice) : null,
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
      }),
    });

    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.error || "Failed to update product");
    }

    router.push("/admin/products");
  };

  if (loading) return <p className="text-gray-500">Loading product...</p>;
  if (!product) return <p className="text-red-500">Product not found</p>;

  return (
    <ProductForm
      title={`Edit: ${product.name}`}
      submitLabel="Save Changes"
      initialData={{
        name: product.name,
        description: product.description,
        shortDescription: product.shortDescription || "",
        price: String(product.price),
        compareAtPrice: product.compareAtPrice ? String(product.compareAtPrice) : "",
        category: typeof product.category === "object" ? product.category._id : product.category,
        gender: product.gender,
        brand: product.brand || "Aapnapasand",
        isFeatured: product.isFeatured,
        isActive: product.isActive,
        variants: product.variants.map((variant) => ({
          ...variant,
          stock: String(variant.stock),
          price: variant.price !== undefined ? String(variant.price) : "",
        })),
        images: product.images,
      }}
      onSubmit={handleSubmit}
    />
  );
}
