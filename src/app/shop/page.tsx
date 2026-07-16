"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/products/ProductCard";
import { Button } from "@/components/ui/Button";
import { SlidersHorizontal, X } from "lucide-react";
import { SIZES, COLORS } from "@/lib/constants";
import type { Category, Product } from "@/types";

type ShopFilters = {
  gender: string;
  category: string;
  sort: string;
  minPrice: string;
  maxPrice: string;
  size: string;
  color: string;
  search: string;
  featured: string;
};

type FilterPanelProps = {
  categoryOptions: Pick<Category, "name" | "slug" | "productCount">[];
  filters: ShopFilters;
  onClear: () => void;
  onUpdate: (key: keyof ShopFilters, value: string) => void;
};

function FilterPanel({ categoryOptions, filters, onClear, onUpdate }: FilterPanelProps) {
  return (
    <div className="space-y-7">
      <div>
        <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-[#173f4f]">Category</h3>
        <div className="max-h-64 space-y-2.5 overflow-y-auto pr-2 [scrollbar-color:#a9b4aa_transparent] [scrollbar-width:thin]">
          {categoryOptions.map((cat) => (
            <label key={cat.slug} className="flex cursor-pointer items-start gap-2.5 text-sm leading-5 text-stone-700">
              <input
                type="radio"
                name="category"
                checked={filters.category === cat.slug}
                onChange={() => onUpdate("category", cat.slug)}
                className="mt-1 accent-[#173f4f]"
              />
              <span className="flex min-w-0 flex-1 items-start justify-between gap-2">
                <span className="break-words">{cat.name}</span>
                <span className="shrink-0 rounded-full bg-stone-100 px-2 py-0.5 text-xs tabular-nums text-stone-500">
                  {cat.productCount ?? 0}
                </span>
              </span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-[#173f4f]">Size</h3>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((size) => (
            <button
              type="button"
              key={size}
              onClick={() => onUpdate("size", filters.size === size ? "" : size)}
              className={`rounded-md border px-3 py-1.5 text-xs transition-colors ${
                filters.size === size
                  ? "border-[#173f4f] bg-[#173f4f] text-white"
                  : "border-stone-300 bg-white hover:border-[#b87811]"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-[#173f4f]">Color</h3>
        <div className="flex flex-wrap gap-2.5">
          {COLORS.map((color) => (
            <button
              type="button"
              key={color.name}
              onClick={() => onUpdate("color", filters.color === color.name ? "" : color.name)}
              aria-label={`Filter by ${color.name}`}
              title={color.name}
              className={`h-7 w-7 rounded-full border-2 shadow-sm transition-transform ${
                filters.color === color.name
                  ? "scale-110 border-[#b87811] ring-2 ring-[#b87811]/20"
                  : "border-white ring-1 ring-stone-300 hover:scale-105"
              }`}
              style={{ backgroundColor: color.hex }}
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-[#173f4f]">Price Range</h3>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(event) => onUpdate("minPrice", event.target.value)}
            className="min-w-0 rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-[#173f4f] focus:ring-2 focus:ring-[#173f4f]/10"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(event) => onUpdate("maxPrice", event.target.value)}
            className="min-w-0 rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-[#173f4f] focus:ring-2 focus:ring-[#173f4f]/10"
          />
        </div>
      </div>

      <Button variant="outline" size="sm" onClick={onClear} className="w-full bg-white">
        Clear All Filters
      </Button>
    </div>
  );
}

function ShopContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState<Pick<Category, "name" | "slug" | "productCount">[]>([]);

  const [filters, setFilters] = useState({
    gender: searchParams.get("gender") || "",
    category: searchParams.get("category") || "",
    sort: searchParams.get("sort") || "newest",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    size: "",
    color: "",
    search: searchParams.get("search") || "",
    featured: searchParams.get("featured") || "",
  });

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    params.set("page", currentPage.toString());

    try {
      const res = await fetch(`/api/products?${params}`);
      const data = await res.json();
      setProducts(data.products || []);
      setTotalPages(data.pagination?.pages || 1);
      setTotalProducts(data.pagination?.total || 0);
    } catch {
      setProducts([]);
      setTotalProducts(0);
    } finally {
      setLoading(false);
    }
  }, [filters, currentPage]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.categories) && data.categories.length > 0) {
          setCategoryOptions(
            data.categories.map((category: Category) => ({
              name: category.name,
              slug: category.slug,
              productCount: category.productCount ?? 0,
            }))
          );
        }
      })
      .catch(() => undefined);
  }, []);

  const updateFilter = (key: keyof ShopFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      gender: "",
      category: "",
      sort: "newest",
      minPrice: "",
      maxPrice: "",
      size: "",
      color: "",
      search: "",
      featured: "",
    });
    setCurrentPage(1);
  };

  const catalogTotal =
    categoryOptions.reduce((sum, category) => sum + (category.productCount ?? 0), 0) || totalProducts;

  return (
    <div className="container-app overflow-x-clip py-8 lg:py-12">
      <div className="mb-5 flex min-w-0 flex-col gap-5 border-b border-stone-200 pb-5 sm:mb-8 sm:flex-row sm:items-end sm:justify-between sm:pb-7">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#b87811]">Artisan collections</p>
          <h1 className="font-display text-4xl font-bold text-stone-950 lg:text-5xl">Shop</h1>
          {filters.search && (
            <p className="text-gray-500 mt-1">
              Results for &ldquo;{filters.search}&rdquo;
            </p>
          )}
          {!loading && !filters.search && (
            <p className="mt-2 text-sm text-stone-500">{totalProducts} handcrafted products</p>
          )}
        </div>
        <div className="grid w-full min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-2 sm:w-auto sm:gap-3">
          <select
            value={filters.sort}
            onChange={(e) => updateFilter("sort", e.target.value)}
            aria-label="Sort products"
            className="min-h-11 min-w-0 flex-1 rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-[#173f4f] focus:ring-2 focus:ring-[#173f4f]/10 sm:min-w-44"
          >
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
            <option value="popular">Most Popular</option>
          </select>
          <button
            type="button"
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="flex min-h-11 shrink-0 items-center gap-2 rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm sm:px-4 lg:hidden"
          >
            <SlidersHorizontal size={16} />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {categoryOptions.length > 0 && (
        <div className="-mx-4 mb-6 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:-mx-6 sm:px-6 lg:hidden [&::-webkit-scrollbar]:hidden">
          <div className="flex w-max gap-2">
            <button
              type="button"
              onClick={() => updateFilter("category", "")}
              className={`whitespace-nowrap rounded-full border px-3 py-2 text-xs font-medium transition-colors ${
                !filters.category
                  ? "border-[#173f4f] bg-[#173f4f] text-white"
                  : "border-stone-300 bg-white text-stone-700"
              }`}
            >
              All <span className="ml-1 opacity-70">{catalogTotal}</span>
            </button>
            {categoryOptions.map((category) => (
              <button
                type="button"
                key={category.slug}
                onClick={() => updateFilter("category", category.slug)}
                className={`whitespace-nowrap rounded-full border px-3 py-2 text-xs font-medium transition-colors ${
                  filters.category === category.slug
                    ? "border-[#173f4f] bg-[#173f4f] text-white"
                    : "border-stone-300 bg-white text-stone-700"
                }`}
              >
                {category.name} <span className="ml-1 opacity-70">{category.productCount ?? 0}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="grid min-w-0 gap-7 lg:grid-cols-[220px_minmax(0,1fr)] xl:grid-cols-[240px_minmax(0,1fr)] xl:gap-9">
        <aside className="hidden min-w-0 self-start rounded-2xl border border-stone-200 bg-[#fbfaf7]/95 p-5 shadow-[0_10px_32px_rgba(23,63,79,0.05)] lg:sticky lg:top-28 lg:block">
          <FilterPanel categoryOptions={categoryOptions} filters={filters} onClear={clearFilters} onUpdate={updateFilter} />
        </aside>

        {filtersOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setFiltersOpen(false)} />
            <div className="absolute bottom-0 right-0 top-0 w-[min(86vw,20rem)] overflow-y-auto bg-[#fbfaf7] p-5 shadow-2xl sm:p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Filters</h2>
                <button type="button" onClick={() => setFiltersOpen(false)} aria-label="Close filters">
                  <X size={20} />
                </button>
              </div>
              <FilterPanel categoryOptions={categoryOptions} filters={filters} onClear={clearFilters} onUpdate={updateFilter} />
            </div>
          </div>
        )}

        <div className="min-w-0">
          {loading ? (
            <div className="grid w-full min-w-0 grid-cols-[repeat(2,minmax(0,1fr))] gap-3 sm:gap-4 md:grid-cols-3 lg:gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="min-w-0 animate-pulse">
                  <div className="aspect-[4/5] rounded-2xl bg-stone-200" />
                  <div className="mt-3 h-4 bg-gray-200 rounded w-3/4" />
                  <div className="mt-2 h-4 bg-gray-200 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg mb-4">No products found</p>
              <Button onClick={clearFilters} variant="outline">
                Clear Filters
              </Button>
            </div>
          ) : (
            <>
              <div className="grid w-full min-w-0 grid-cols-[repeat(2,minmax(0,1fr))] gap-3 sm:gap-4 md:grid-cols-3 lg:gap-6">
                {products.map((product, index) => (
                  <ProductCard key={product._id} product={product} priority={index < 3} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-12">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === page
                          ? "bg-brand-900 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="container-app py-12 text-center">Loading...</div>}>
      <ShopContent />
    </Suspense>
  );
}
