"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Plus, Search, Pencil, X } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    pages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProducts = useCallback(async (page = 1, q = activeSearch, limit = pagination.limit) => {
    setLoading(true);
    setError("");

    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (q) params.set("search", q);

    try {
      const res = await fetch(`/api/admin/products?${params}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch products");
      }

      setProducts(data.products || []);
      setPagination(data.pagination || { page, limit, total: 0, pages: 1 });
    } catch (err) {
      setProducts([]);
      setError(err instanceof Error ? err.message : "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  }, [activeSearch, pagination.limit]);

  useEffect(() => {
    fetchProducts(pagination.page, activeSearch, pagination.limit);
  }, [activeSearch, fetchProducts, pagination.limit, pagination.page]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, page: 1 }));
    setActiveSearch(search.trim());
  };

  const clearSearch = () => {
    setSearch("");
    setActiveSearch("");
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const goToPage = (page: number) => {
    setPagination((prev) => ({
      ...prev,
      page: Math.min(Math.max(page, 1), Math.max(prev.pages, 1)),
    }));
  };

  const updateLimit = (limit: number) => {
    setPagination((prev) => ({ ...prev, limit, page: 1 }));
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Deactivate "${name}"?`)) return;
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    fetchProducts(pagination.page, activeSearch, pagination.limit);
  };

  const startItem = pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1;
  const endItem = Math.min(pagination.page * pagination.limit, pagination.total);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="mt-1 text-sm text-gray-500">
            {pagination.total} product{pagination.total === 1 ? "" : "s"} added
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 px-4 py-2 bg-brand-900 text-white text-sm font-medium rounded-lg hover:bg-brand-800"
        >
          <Plus size={16} /> Add Product
        </Link>
      </div>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <form onSubmit={handleSearch} className="flex w-full max-w-xl gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by product name or brand..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg bg-white"
            />
            {search && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <button
            type="submit"
            className="rounded-lg bg-brand-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-800"
          >
            Search
          </button>
        </form>

        <label className="flex items-center gap-2 text-sm text-gray-600">
          Show
          <select
            value={pagination.limit}
            onChange={(e) => updateLimit(Number(e.target.value))}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          per page
        </label>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <p className="p-8 text-center text-gray-500">Loading...</p>
        ) : error ? (
          <p className="p-8 text-center text-red-600">{error}</p>
        ) : products.length === 0 ? (
          <p className="p-8 text-center text-gray-500">No products found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-100 bg-gray-50">
                  <th className="p-4 font-medium">Product</th>
                  <th className="p-4 font-medium">Category</th>
                  <th className="p-4 font-medium">Price</th>
                  <th className="p-4 font-medium">Stock</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  const categoryName =
                    product.category && typeof product.category === "object"
                      ? product.category.name
                      : "Uncategorized";

                  return (
                    <tr key={product._id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="p-4 min-w-[280px]">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-14 rounded overflow-hidden bg-gray-100 shrink-0">
                            <Image src={product.images[0]} alt="" fill className="object-cover" sizes="48px" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium line-clamp-1">{product.name}</p>
                            <p className="text-xs text-gray-500 capitalize">{product.gender}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-gray-600">{categoryName}</td>
                      <td className="p-4 font-medium">{formatPrice(product.price)}</td>
                      <td className="p-4">{product.totalStock}</td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            product.isActive ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                          }`}
                        >
                          {product.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/admin/products/${product._id}/edit`}
                            className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
                            aria-label={`Edit ${product.name}`}
                          >
                            <Pencil size={16} />
                          </Link>
                          <button
                            onClick={() => handleDelete(product._id, product.name)}
                            className="text-xs text-red-600 hover:underline"
                          >
                            Deactivate
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 px-4 py-4">
          <p className="text-sm text-gray-500">
            Showing {startItem}-{endItem} of {pagination.total}
            {activeSearch && <span> for &quot;{activeSearch}&quot;</span>}
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => goToPage(pagination.page - 1)}
              disabled={loading || pagination.page <= 1}
              className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-50"
            >
              <ChevronLeft size={16} />
              Prev
            </button>
            <span className="min-w-24 text-center text-sm font-medium text-gray-600">
              Page {pagination.page} of {Math.max(pagination.pages, 1)}
            </span>
            <button
              type="button"
              onClick={() => goToPage(pagination.page + 1)}
              disabled={loading || pagination.page >= pagination.pages}
              className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-50"
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
