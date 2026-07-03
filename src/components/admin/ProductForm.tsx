"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { COLORS, SIZES } from "@/lib/constants";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { calculateDiscount } from "@/lib/utils";
import { isValidStoredImage } from "@/lib/image-utils";
import type { Category, ProductVariant } from "@/types";

type ProductVariantForm = Omit<ProductVariant, "stock" | "price"> & {
  stock: string;
  price?: string;
};

const DEFAULT_VARIANT: ProductVariantForm = {
  size: "M",
  color: "Black",
  colorHex: "#000000",
  sku: "",
  stock: "10",
  price: "",
};

export interface ProductFormData {
  name: string;
  description: string;
  shortDescription?: string;
  price: string;
  compareAtPrice?: string;
  category: string;
  subcategory?: string;
  gender: string;
  brand?: string;
  specifications: string[];
  variants: ProductVariantForm[];
  isFeatured: boolean;
  isActive: boolean;
  images: string[];
}

const productFormSchema = z.object({
  name: z.string().min(2, "Product name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  shortDescription: z.string().optional(),
  price: z
    .string()
    .min(1, "Selling price is required")
    .refine((value) => !Number.isNaN(parseFloat(value)) && parseFloat(value) >= 0, "Enter a valid selling price"),
  compareAtPrice: z
    .string()
    .optional()
    .refine(
      (value) => !value || (!Number.isNaN(parseFloat(value)) && parseFloat(value) >= 0),
      "Enter a valid original price"
    ),
  category: z.string().min(1, "Category is required"),
  subcategory: z.string().optional(),
  gender: z.enum(["men", "women", "kids", "unisex"]),
  brand: z.string().optional(),
  specifications: z.array(z.string().min(1, "Enter a valid specification")).optional(),
  variants: z
    .array(
      z.object({
        size: z.string().min(1),
        color: z.string().min(1),
        colorHex: z.string().optional(),
        sku: z.string().min(1),
        stock: z
          .string()
          .min(1, "Stock is required")
          .refine((value) => Number.isInteger(Number(value)) && Number(value) >= 0, "Stock must be a whole number"),
        price: z
          .string()
          .optional()
          .refine(
            (value) => !value || (!Number.isNaN(parseFloat(value)) && parseFloat(value) >= 0),
            "Enter a valid variant price"
          ),
      })
    )
    .min(1, "Add at least one product variant"),
  isFeatured: z.boolean(),
  isActive: z.boolean(),
  images: z.array(z.string().refine(isValidStoredImage, "Invalid image URL")).min(1, "Upload at least one image"),
});

interface ProductFormProps {
  initialData?: Partial<ProductFormData>;
  onSubmit: (data: ProductFormData) => Promise<void>;
  submitLabel?: string;
  backHref?: string;
  title?: string;
}

export function ProductForm({
  initialData,
  onSubmit,
  submitLabel = "Save Product",
  backHref = "/admin/products",
  title = "Add Product",
}: ProductFormProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [serverError, setServerError] = useState("");

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      shortDescription: initialData?.shortDescription || "",
      price: initialData?.price || "",
      compareAtPrice: initialData?.compareAtPrice || "",
      category: initialData?.category || "",
      subcategory: initialData?.subcategory || "",
      gender: initialData?.gender || "men",
      brand: initialData?.brand || "Aapnapasand",
      specifications: initialData?.specifications || [],
      variants:
        initialData?.variants?.length
          ? initialData.variants.map((variant) => ({
              ...variant,
              price: variant.price?.toString() || "",
              stock: variant.stock.toString(),
            }))
          : [{ ...DEFAULT_VARIANT, sku: `SKU-${Date.now()}` }],
      isFeatured: initialData?.isFeatured ?? false,
      isActive: initialData?.isActive ?? true,
      images: initialData?.images || [],
    },
  });

  const variantFieldArray = useFieldArray({ control, name: "variants" as const });
  const specifications = watch("specifications") || [];

  useEffect(() => {
    fetch("/api/admin/categories")
      .then((res) => res.json())
      .then((data) => setCategories((data.categories || []).filter((category: Category) => category.isActive)));
  }, []);

  const watchImages = watch("images");

  const watchPrice = watch("price");
  const watchCompareAtPrice = watch("compareAtPrice");
  const price = parseFloat(watchPrice) || 0;
  const mrp = watchCompareAtPrice ? parseFloat(watchCompareAtPrice) : 0;
  const discount = mrp > price ? calculateDiscount(price, mrp) : 0;

  const addVariant = () => {
    variantFieldArray.append({ ...DEFAULT_VARIANT, sku: `SKU-${Date.now()}-${variantFieldArray.fields.length}` });
  };

  const removeVariant = (index: number) => {
    if (variantFieldArray.fields.length <= 1) return;
    variantFieldArray.remove(index);
  };

  const addSpecification = () => {
    setValue("specifications", [...specifications, ""], { shouldValidate: true });
  };

  const removeSpecification = (index: number) => {
    const nextSpecs = [...specifications];
    nextSpecs.splice(index, 1);
    setValue("specifications", nextSpecs, { shouldValidate: true });
  };

  const onSubmitForm = async (data: ProductFormData) => {
    setServerError("");
    try {
      await onSubmit(data);
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "Something went wrong");
    }
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <Link href={backHref} className="text-sm text-brand-600 hover:underline">
          &larr; Back to products
        </Link>
        <h1 className="text-2xl font-bold mt-2">{title}</h1>
        <p className="text-sm text-gray-500 mt-1">
          Add or update product details, inventory, and images from the admin dashboard.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
        {(serverError || Object.keys(errors).length > 0) && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl">
            {serverError || "Please review the highlighted fields and try again."}
          </div>
        )}

        <section className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="text-lg font-semibold mb-4">1. Product Images</h2>
          <ImageUpload
            images={watchImages || []}
            onChange={(nextImages) => setValue("images", nextImages, { shouldValidate: true })}
          />
          {errors.images && (
            <p className="mt-2 text-sm text-red-600">{errors.images.message}</p>
          )}
        </section>

        <section className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
          <h2 className="text-lg font-semibold">2. Product Details</h2>

          <div>
            <label className="block text-sm font-medium mb-1.5">Product Name *</label>
            <input
              {...register("name")}
              placeholder="Classic Oxford Cotton Shirt"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
            {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Short Description</label>
            <input
              {...register("shortDescription")}
              placeholder="Brief tagline shown on product card"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Full Description *</label>
            <textarea
              {...register("description")}
              rows={5}
              placeholder="Describe fabric, fit, care instructions, occasion, etc."
              className="w-full px-4 py-3 border border-gray-200 rounded-lg resize-y"
            />
            <p className="text-xs text-gray-400 mt-1">{(watch("description") || "").length} characters (min 10)</p>
            {errors.description && <p className="mt-2 text-sm text-red-600">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Category *</label>
              <select
                {...register("category")}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg"
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
              {errors.category && <p className="mt-2 text-sm text-red-600">{errors.category.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Subcategory</label>
              <input
                {...register("subcategory")}
                placeholder="Optional subcategory"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Brand</label>
              <input
                {...register("brand")}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Gender *</label>
              <select
                {...register("gender")}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg"
              >
                <option value="men">Men</option>
                <option value="women">Women</option>
                <option value="kids">Kids</option>
                <option value="unisex">Unisex</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium">Specifications</label>
              <button
                type="button"
                onClick={addSpecification}
                className="text-sm text-brand-600 hover:underline"
              >
                + Add spec
              </button>
            </div>
            {specifications.map((spec, index) => (
              <div key={`${spec}-${index}`} className="flex gap-3 items-center">
                <input
                  {...register(`specifications.${index}` as const)}
                  placeholder="e.g. 100% cotton, Machine wash cold"
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeSpecification(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
          <h2 className="text-lg font-semibold">3. Price & Offer</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Selling Price (₹) *</label>
              <input
                {...register("price")}
                type="number"
                min="0"
                placeholder="1299"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-lg font-semibold"
              />
              {errors.price && <p className="mt-2 text-sm text-red-600">{errors.price.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">MRP / Original Price (₹)</label>
              <input
                {...register("compareAtPrice")}
                type="number"
                min="0"
                placeholder="1999"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg"
              />
              {errors.compareAtPrice && (
                <p className="mt-2 text-sm text-red-600">{errors.compareAtPrice.message}</p>
              )}
              <p className="text-xs text-gray-400 mt-1">Set higher than selling price to show discount</p>
            </div>
          </div>

          {discount > 0 && (
            <div className="flex items-center gap-4 p-4 bg-green-50 border border-green-200 rounded-xl">
              <span className="text-2xl font-bold text-green-600">{discount}% OFF</span>
              <div className="text-sm text-green-700">
                <p>Customer saves ₹{mrp - price}</p>
                <p className="line-through text-green-600/60">MRP ₹{mrp}</p>
              </div>
            </div>
          )}
        </section>

        <section className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">4. Size, Color & Stock</h2>
            <button
              type="button"
              onClick={addVariant}
              className="text-sm text-brand-600 font-medium hover:underline"
            >
              + Add variant
            </button>
          </div>

          <div className="space-y-2">
            <div className="grid grid-cols-5 gap-2 text-xs font-medium text-gray-500 px-3">
              <span>Size</span>
              <span>Color</span>
              <span>Stock</span>
              <span>Price</span>
              <span className="col-span-1">SKU</span>
            </div>
            {variantFieldArray.fields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-5 gap-2 p-3 bg-gray-50 rounded-lg items-center">
                <select
                  {...register(`variants.${index}.size` as const)}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
                >
                  {SIZES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <select
                  {...register(`variants.${index}.color` as const)}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
                >
                  {COLORS.map((c) => (
                    <option key={c.name} value={c.name}>{c.name}</option>
                  ))}
                </select>
                <input
                  {...register(`variants.${index}.stock` as const)}
                  type="number"
                  min="0"
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
                />
                <input
                  {...register(`variants.${index}.price` as const)}
                  type="number"
                  min="0"
                  placeholder="Optional"
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
                />
                <div className="flex gap-2 items-center">
                  <input
                    {...register(`variants.${index}.sku` as const)}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
                  />
                  {variantFieldArray.fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeVariant(index)}
                      className="px-2 text-red-500 hover:bg-red-50 rounded-lg text-sm"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="text-lg font-semibold mb-4">5. Settings</h2>
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                {...register("isFeatured")}
                className="w-4 h-4 accent-brand-600"
              />
              <span className="text-sm font-medium">Featured on homepage</span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                {...register("isActive")}
                className="w-4 h-4 accent-brand-600"
              />
              <span className="text-sm font-medium">Active (visible in store)</span>
            </label>
          </div>
        </section>

        <div className="flex gap-4 sticky bottom-4 bg-gray-100/80 backdrop-blur p-4 rounded-xl border border-gray-200">
          <Link
            href={backHref}
            className="px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium hover:bg-white transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 py-3 bg-brand-900 text-white font-semibold rounded-lg hover:bg-brand-800 disabled:opacity-50 transition-colors"
          >
            {isSubmitting ? "Saving..." : submitLabel}
          </button>
        </div>
      </form>
    </div>
  );
}
