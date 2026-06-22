"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Search, Pencil } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchProducts = async (q = "") => {
    setLoading(true);
    const params = q ? `?search=${encodeURIComponent(q)}` : "";
    const res = await fetch(`/api/admin/products${params}`);
    const data = await res.json();
    setProducts(data.products || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts(search);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Deactivate "${name}"?`)) return;
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    fetchProducts(search);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 px-4 py-2 bg-brand-900 text-white text-sm font-medium rounded-lg hover:bg-brand-800"
        >
          <Plus size={16} /> Add Product
        </Link>
      </div>

      <form onSubmit={handleSearch} className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg bg-white"
        />
      </form>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <p className="p-8 text-center text-gray-500">Loading...</p>
        ) : products.length === 0 ? (
          <p className="p-8 text-center text-gray-500">No products found</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-100 bg-gray-50">
                <th className="p-4 font-medium">Product</th>
                <th className="p-4 font-medium">Price</th>
                <th className="p-4 font-medium">Stock</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-14 rounded overflow-hidden bg-gray-100 shrink-0">
                        <Image src={product.images[0]} alt="" fill className="object-cover" sizes="48px" />
                      </div>
                      <div>
                        <p className="font-medium line-clamp-1">{product.name}</p>
                        <p className="text-xs text-gray-500 capitalize">{product.gender}</p>
                      </div>
                    </div>
                  </td>
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
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
