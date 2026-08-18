"use client";

import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, SlidersHorizontal, X } from "lucide-react";
import { ProductCard } from "@/components/products/ProductCard";
import { Button } from "@/components/ui/Button";
import { COLORS, FABRICS, SIZES } from "@/lib/constants";
import type { Category, Product } from "@/types";

type ShopFilters = {
  gender: string;
  categories: string[];
  sort: string;
  minPrice: string;
  maxPrice: string;
  sizes: string[];
  colors: string[];
  fabrics: string[];
  minRating: string;
  search: string;
  featured: string;
};

type CategoryOption = Pick<Category, "name" | "slug" | "productCount">;

type FilterPanelProps = {
  categoryOptions: CategoryOption[];
  filters: ShopFilters;
  onClear: () => void;
  onScalarChange: (key: string, value: string) => void;
  onListToggle: (key: "category" | "size" | "color" | "fabric", value: string) => void;
};

function readList(searchParams: URLSearchParams, key: string) {
  return searchParams
    .getAll(key)
    .flatMap((value) => value.split(","))
    .map((value) => value.trim())
    .filter(Boolean);
}

function FilterPanel({
  categoryOptions,
  filters,
  onClear,
  onScalarChange,
  onListToggle,
}: FilterPanelProps) {
  return (
    <div className="space-y-7">
      <fieldset>
        <legend className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-[#173f4f]">
          Category
        </legend>
        <div className="max-h-64 space-y-2.5 overflow-y-auto pr-2 [scrollbar-color:#a9b4aa_transparent] [scrollbar-width:thin]">
          {categoryOptions.map((category) => (
            <label
              key={category.slug}
              className="flex cursor-pointer items-start gap-2.5 text-sm leading-5 text-stone-700"
            >
              <input
                type="checkbox"
                checked={filters.categories.includes(category.slug)}
                onChange={() => onListToggle("category", category.slug)}
                className="mt-1 accent-[#173f4f]"
              />
              <span className="flex min-w-0 flex-1 items-start justify-between gap-2">
                <span className="break-words">{category.name}</span>
                <span className="shrink-0 rounded-full bg-stone-100 px-2 py-0.5 text-xs tabular-nums text-stone-500">
                  {category.productCount ?? 0}
                </span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-[#173f4f]">
          Size
        </legend>
        <div className="flex max-h-48 flex-wrap gap-2 overflow-y-auto pr-1">
          {SIZES.map((size) => {
            const selected = filters.sizes.includes(size);
            return (
              <button
                type="button"
                key={size}
                onClick={() => onListToggle("size", size)}
                aria-pressed={selected}
                className={`rounded-md border px-3 py-1.5 text-xs transition-colors ${
                  selected
                    ? "border-[#173f4f] bg-[#173f4f] text-white"
                    : "border-stone-300 bg-white hover:border-[#b87811]"
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-[#173f4f]">
          Fabric
        </legend>
        <div className="space-y-2">
          {FABRICS.map((fabric) => (
            <label key={fabric} className="flex cursor-pointer items-center gap-2 text-sm text-stone-700">
              <input
                type="checkbox"
                checked={filters.fabrics.includes(fabric)}
                onChange={() => onListToggle("fabric", fabric)}
                className="accent-[#173f4f]"
              />
              {fabric}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-[#173f4f]">
          Color
        </legend>
        <div className="flex flex-wrap gap-2.5">
          {COLORS.map((color) => {
            const selected = filters.colors.includes(color.name);
            return (
              <button
                type="button"
                key={color.name}
                onClick={() => onListToggle("color", color.name)}
                aria-label={`Filter by ${color.name}`}
                aria-pressed={selected}
                title={color.name}
                className={`h-8 w-8 rounded-full border-2 shadow-sm transition-transform ${
                  selected
                    ? "scale-110 border-[#b87811] ring-2 ring-[#b87811]/25"
                    : "border-white ring-1 ring-stone-300 hover:scale-105"
                }`}
                style={{ backgroundColor: color.hex }}
              />
            );
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-[#173f4f]">
          Rating
        </legend>
        <div className="grid gap-2">
          {[5, 4, 3].map((rating) => (
            <label key={rating} className="flex cursor-pointer items-center gap-2 text-sm text-stone-700">
              <input
                type="radio"
                name="minRating"
                checked={filters.minRating === String(rating)}
                onChange={() => onScalarChange("minRating", String(rating))}
                className="accent-[#173f4f]"
              />
              {rating} stars &amp; up
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-[#173f4f]">
          Price Range
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            min="0"
            inputMode="numeric"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(event) => onScalarChange("minPrice", event.target.value)}
            className="min-w-0 rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-[#173f4f] focus:ring-2 focus:ring-[#173f4f]/10"
          />
          <input
            type="number"
            min="0"
            inputMode="numeric"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(event) => onScalarChange("maxPrice", event.target.value)}
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

function getPaginationPages(current: number, total: number) {
  const visibleCount = Math.min(10, total);
  const start = Math.min(
    Math.max(1, current - Math.floor(visibleCount / 2)),
    Math.max(1, total - visibleCount + 1)
  );
  return Array.from({ length: visibleCount }, (_, index) => start + index);
}

function ShopContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();
  const filters = useMemo<ShopFilters>(() => {
    const params = new URLSearchParams(queryString);
    return {
      gender: params.get("gender") || "",
      categories: readList(params, "category"),
      sort: params.get("sort") || "newest",
      minPrice: params.get("minPrice") || "",
      maxPrice: params.get("maxPrice") || "",
      sizes: readList(params, "size"),
      colors: readList(params, "color"),
      fabrics: readList(params, "fabric"),
      minRating: params.get("minRating") || "",
      search: params.get("search") || "",
      featured: params.get("featured") || "",
    };
  }, [queryString]);
  const currentPage = Math.max(1, Number(searchParams.get("page")) || 1);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState<CategoryOption[]>([]);

  const navigate = useCallback(
    (mutate: (params: URLSearchParams) => void, resetPage = true) => {
      const params = new URLSearchParams(queryString);
      mutate(params);
      if (resetPage) params.delete("page");
      const nextQuery = params.toString();
      router.push(nextQuery ? `/shop?${nextQuery}` : "/shop", { scroll: false });
    },
    [queryString, router]
  );

  const updateScalar = useCallback(
    (key: string, value: string) => {
      navigate((params) => {
        if (value) params.set(key, value);
        else params.delete(key);
      });
    },
    [navigate]
  );

  const toggleList = useCallback(
    (key: "category" | "size" | "color" | "fabric", value: string) => {
      navigate((params) => {
        const current = readList(params, key);
        const next = current.includes(value)
          ? current.filter((item) => item !== value)
          : [...current, value];
        params.delete(key);
        next.forEach((item) => params.append(key, item));
      });
    },
    [navigate]
  );

  const clearFilters = useCallback(() => {
    const params = new URLSearchParams();
    if (filters.search) params.set("search", filters.search);
    router.push(params.size ? `/shop?${params}` : "/shop", { scroll: false });
  }, [filters.search, router]);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");

    const params = new URLSearchParams(queryString);
    if (!params.has("page")) params.set("page", "1");

    fetch(`/api/products?${params}`, {
      cache: "no-store",
      signal: controller.signal,
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Unable to load products");
        return data;
      })
      .then((data) => {
        setProducts(data.products || []);
        setTotalPages(Math.max(1, data.pagination?.pages || 1));
        setTotalProducts(data.pagination?.total || 0);
      })
      .catch((fetchError) => {
        if (fetchError instanceof DOMException && fetchError.name === "AbortError") return;
        setProducts([]);
        setTotalProducts(0);
        setError(fetchError instanceof Error ? fetchError.message : "Unable to load products");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [queryString]);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/categories", { cache: "no-store", signal: controller.signal })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Unable to load categories");
        return data;
      })
      .then((data) => {
        if (!Array.isArray(data.categories)) return;
        setCategoryOptions(
          data.categories
            .filter((category: Category) => (category.productCount ?? 0) > 0)
            .map((category: Category) => ({
              name: category.name,
              slug: category.slug,
              productCount: category.productCount ?? 0,
            }))
        );
      })
      .catch((fetchError) => {
        if (!(fetchError instanceof DOMException && fetchError.name === "AbortError")) {
          console.error("Category filter fetch failed:", fetchError);
        }
      });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    setFiltersOpen(false);
  }, [queryString]);

  const catalogTotal =
    categoryOptions.reduce(
      (sum, category) => sum + (category.productCount ?? 0),
      0
    ) || totalProducts;
  const activeFilterCount =
    filters.categories.length +
    filters.sizes.length +
    filters.colors.length +
    filters.fabrics.length +
    Number(Boolean(filters.minRating)) +
    Number(Boolean(filters.minPrice || filters.maxPrice));
  const paginationPages = getPaginationPages(currentPage, totalPages);

  const goToPage = (page: number) => {
    navigate((params) => params.set("page", String(page)), false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="container-app overflow-x-clip py-8 lg:py-12">
      <div className="mb-5 flex min-w-0 flex-col gap-5 border-b border-stone-200 pb-5 sm:mb-8 sm:flex-row sm:items-end sm:justify-between sm:pb-7">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#b87811]">
            Artisan collections
          </p>
          <h1 className="font-display text-4xl font-bold text-stone-950 lg:text-5xl">
            Shop
          </h1>
          {filters.search ? (
            <p className="mt-1 text-gray-500">Results for “{filters.search}”</p>
          ) : !loading ? (
            <p className="mt-2 text-sm text-stone-500">
              {totalProducts} handcrafted products
            </p>
          ) : null}
        </div>

        <div className="grid w-full min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-2 sm:w-auto sm:gap-3">
          <select
            value={filters.sort}
            onChange={(event) => updateScalar("sort", event.target.value)}
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
            onClick={() => setFiltersOpen(true)}
            className="flex min-h-11 shrink-0 items-center gap-2 rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm sm:px-4 lg:hidden"
          >
            <SlidersHorizontal size={16} />
            <span>Filters{activeFilterCount ? ` (${activeFilterCount})` : ""}</span>
          </button>
        </div>
      </div>

      {categoryOptions.length > 0 ? (
        <div className="-mx-4 mb-6 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:-mx-6 sm:px-6 lg:hidden [&::-webkit-scrollbar]:hidden">
          <div className="flex w-max gap-2">
            <button
              type="button"
              onClick={() => navigate((params) => params.delete("category"))}
              className={`whitespace-nowrap rounded-full border px-3 py-2 text-xs font-medium transition-colors ${
                !filters.categories.length
                  ? "border-[#173f4f] bg-[#173f4f] text-white"
                  : "border-stone-300 bg-white text-stone-700"
              }`}
            >
              All <span className="ml-1 opacity-70">{catalogTotal}</span>
            </button>
            {categoryOptions.map((category) => {
              const selected = filters.categories.includes(category.slug);
              return (
                <button
                  type="button"
                  key={category.slug}
                  onClick={() => toggleList("category", category.slug)}
                  aria-pressed={selected}
                  className={`whitespace-nowrap rounded-full border px-3 py-2 text-xs font-medium transition-colors ${
                    selected
                      ? "border-[#173f4f] bg-[#173f4f] text-white"
                      : "border-stone-300 bg-white text-stone-700"
                  }`}
                >
                  {category.name}{" "}
                  <span className="ml-1 opacity-70">{category.productCount ?? 0}</span>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      <div className="grid min-w-0 gap-7 lg:grid-cols-[220px_minmax(0,1fr)] xl:grid-cols-[240px_minmax(0,1fr)] xl:gap-9">
        <aside className="hidden min-w-0 self-start rounded-2xl border border-stone-200 bg-[#fbfaf7]/95 p-5 shadow-[0_10px_32px_rgba(23,63,79,0.05)] lg:sticky lg:top-28 lg:block">
          <FilterPanel
            categoryOptions={categoryOptions}
            filters={filters}
            onClear={clearFilters}
            onScalarChange={updateScalar}
            onListToggle={toggleList}
          />
        </aside>

        {filtersOpen ? (
          <div className="fixed inset-0 z-[70] lg:hidden">
            <button
              type="button"
              className="absolute inset-0 bg-black/50"
              onClick={() => setFiltersOpen(false)}
              aria-label="Close filters"
            />
            <div className="absolute bottom-0 right-0 top-0 w-[min(88vw,22rem)] overflow-y-auto bg-[#fbfaf7] p-5 shadow-2xl sm:p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Filters</h2>
                <button type="button" onClick={() => setFiltersOpen(false)} aria-label="Close filters">
                  <X size={20} />
                </button>
              </div>
              <FilterPanel
                categoryOptions={categoryOptions}
                filters={filters}
                onClear={clearFilters}
                onScalarChange={updateScalar}
                onListToggle={toggleList}
              />
            </div>
          </div>
        ) : null}

        <div className="min-w-0">
          {loading ? (
            <div className="grid w-full min-w-0 grid-cols-[repeat(2,minmax(0,1fr))] gap-3 sm:gap-4 md:grid-cols-3 lg:gap-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="min-w-0 animate-pulse">
                  <div className="aspect-[4/3] rounded-2xl bg-stone-200" />
                  <div className="mt-3 h-4 w-3/4 rounded bg-gray-200" />
                  <div className="mt-2 h-4 w-1/2 rounded bg-gray-200" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-16 text-center">
              <p className="text-lg font-semibold text-red-800">Products could not be loaded</p>
              <p className="mt-2 text-sm text-red-700">{error}</p>
              <Button onClick={() => router.refresh()} variant="outline" className="mt-5 bg-white">
                Try Again
              </Button>
            </div>
          ) : products.length === 0 ? (
            <div className="py-20 text-center">
              <p className="mb-4 text-lg text-gray-500">No products found</p>
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

              {totalPages > 1 ? (
                <nav className="mt-12 flex flex-wrap items-center justify-center gap-2" aria-label="Product pages">
                  <button
                    type="button"
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="inline-flex h-10 items-center gap-1 rounded-lg border border-stone-300 bg-white px-3 text-sm font-medium text-stone-700 transition hover:border-[#173f4f] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronLeft size={16} /> Previous
                  </button>
                  {paginationPages.map((page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() => goToPage(page)}
                      aria-current={currentPage === page ? "page" : undefined}
                      className={`h-10 min-w-10 rounded-lg px-2 text-sm font-medium transition-colors ${
                        currentPage === page
                          ? "bg-[#173f4f] text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className="inline-flex h-10 items-center gap-1 rounded-lg border border-stone-300 bg-white px-3 text-sm font-medium text-stone-700 transition hover:border-[#173f4f] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next <ChevronRight size={16} />
                  </button>
                </nav>
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ShopClient() {
  return (
    <Suspense fallback={<div className="container-app py-12 text-center">Loading...</div>}>
      <ShopContent />
    </Suspense>
  );
}
