"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Check, ImageIcon, Pencil, Plus, Trash2 } from "lucide-react";
import { ImageUpload } from "@/components/admin/ImageUpload";
import type { Category } from "@/types";

type CategoryFormState = {
  id?: string;
  name: string;
  description: string;
  image: string;
  gender: "men" | "women" | "kids" | "unisex";
  isActive: boolean;
};

const EMPTY_FORM: CategoryFormState = {
  name: "",
  description: "",
  image: "",
  gender: "unisex",
  isActive: true,
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<CategoryFormState>(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const activeCount = useMemo(
    () => categories.filter((category) => category.isActive).length,
    [categories]
  );
  const inactiveCount = useMemo(() => categories.length - activeCount, [activeCount, categories.length]);
  const withImageCount = useMemo(
    () => categories.filter((category) => Boolean(category.image)).length,
    [categories]
  );

  const fetchCategories = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/categories");
    const data = await res.json();
    setCategories(data.categories || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setError("");
  };

  const editCategory = (category: Category) => {
    setForm({
      id: category._id,
      name: category.name,
      description: category.description || "",
      image: category.image || "",
      gender: category.gender,
      isActive: category.isActive,
    });
    setError("");
  };

  const saveCategory = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const endpoint = form.id ? `/api/admin/categories/${form.id}` : "/api/admin/categories";
      const method = form.id ? "PATCH" : "POST";
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          image: form.image,
          gender: form.gender,
          isActive: form.isActive,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to save category");
      }

      resetForm();
      await fetchCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save category");
    } finally {
      setSaving(false);
    }
  };

  const deleteCategory = async (category: Category) => {
    if (!confirm(`Permanently delete "${category.name}"?`)) return;
    setError("");

    const res = await fetch(`/api/admin/categories/${category._id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Failed to delete category");
      return;
    }

    await fetchCategories();
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[0.82fr_1.18fr]">
      <div>
        <h1 className="text-2xl font-bold">Categories</h1>
        <p className="mt-1 text-sm text-gray-500">
          Create website categories with images. These appear on the storefront and product forms.
        </p>

        <div className="mt-5 grid grid-cols-3 gap-3">
          {[
            { label: "Total", value: categories.length },
            { label: "Active", value: activeCount },
            { label: "With image", value: withImageCount },
          ].map((item) => (
            <div key={item.label} className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{item.label}</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">{item.value}</p>
            </div>
          ))}
        </div>

        <form onSubmit={saveCategory} className="mt-6 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between gap-4">
            <h2 className="font-semibold">{form.id ? "Edit category" : "Add category"}</h2>
            {form.id && (
              <button type="button" onClick={resetForm} className="text-sm text-gray-500 hover:text-gray-900">
                Clear
              </button>
            )}
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Category name *</label>
              <input
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                placeholder="Duvet Covers, Napkins, Kaftans..."
                className="mt-2 w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={form.description}
                onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
                rows={3}
                placeholder="Short category copy for the storefront tile or collection page"
                className="mt-2 w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Audience</label>
              <select
                value={form.gender}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, gender: event.target.value as CategoryFormState["gender"] }))
                }
                className="mt-2 w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="unisex">Unisex / Home</option>
                <option value="women">Women / Fashion</option>
                <option value="men">Men</option>
                <option value="kids">Kids</option>
              </select>
            </div>

            <div>
              <ImageUpload
                images={form.image ? [form.image] : []}
                label="Category Image"
                helperText="Used on website category tiles"
                multiple={false}
                onChange={(images) => setForm((prev) => ({ ...prev, image: images[images.length - 1] || "" }))}
              />
            </div>

            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(event) => setForm((prev) => ({ ...prev, isActive: event.target.checked }))}
                className="h-4 w-4 accent-brand-600"
              />
              Active on website
            </label>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand-900 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-800 disabled:opacity-60"
            >
              {form.id ? <Check size={16} /> : <Plus size={16} />}
              {saving ? "Saving..." : form.id ? "Update Category" : "Create Category"}
            </button>
          </div>
        </form>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <h2 className="font-semibold">All categories</h2>
            <p className="mt-1 text-sm text-gray-500">
              {activeCount} active, {inactiveCount} inactive, {withImageCount} with image
            </p>
          </div>
        </div>

        {loading ? (
          <p className="py-12 text-center text-sm text-gray-500">Loading categories...</p>
        ) : categories.length === 0 ? (
          <p className="py-12 text-center text-sm text-gray-500">No categories yet. Add your first category.</p>
        ) : (
          <div className="grid gap-3">
            {categories.map((category) => (
              <div key={category._id} className="flex items-center gap-4 rounded-xl border border-gray-100 p-3">
                <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                  {category.image ? (
                    <Image src={category.image} alt={category.name} fill sizes="64px" className="object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-gray-400">
                      <ImageIcon size={20} />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-medium text-gray-900">{category.name}</h3>
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs capitalize text-gray-600">
                      {category.gender}
                    </span>
                    <span className={`rounded-full px-2 py-0.5 text-xs ${
                      category.isActive ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                    }`}>
                      {category.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <p className="mt-1 truncate text-xs text-gray-500">/{category.slug}</p>
                  {category.description && (
                    <p className="mt-1 line-clamp-1 text-sm text-gray-600">{category.description}</p>
                  )}
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    onClick={() => editCategory(category)}
                    className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100"
                    aria-label={`Edit ${category.name}`}
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteCategory(category)}
                    className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50"
                    aria-label={`Delete ${category.name}`}
                    title="Delete category"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
