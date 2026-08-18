"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Search, ShieldCheck, UserRound } from "lucide-react";
import { formatPrice } from "@/lib/utils";

type Customer = { _id: string; name: string; email: string; phone?: string; emailVerifiedAt?: string; lastLoginAt?: string; loginCount: number; signupSource: string; addressCount: number; wishlistCount: number; orderCount: number; totalSpent: number; createdAt: string };

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const loadCustomers = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page) });
    if (search.trim()) params.set("search", search.trim());
    const response = await fetch(`/api/admin/customers?${params}`, { cache: "no-store" });
    const data = await response.json();
    setCustomers(data.customers || []); setPages(data.pagination?.pages || 1); setTotal(data.pagination?.total || 0); setLoading(false);
  }, [page, search]);
  useEffect(() => { const timer = window.setTimeout(loadCustomers, 250); return () => window.clearTimeout(timer); }, [loadCustomers]);

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">Customer directory</p><h1 className="mt-2 text-2xl font-bold text-gray-900">Registered Customers</h1><p className="mt-1 text-sm text-gray-500">{total} customer profiles with verified-email and activity details.</p></div>
        <label className="relative block w-full sm:max-w-sm"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={17} /><input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Search name, email or phone" className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100" /></label>
      </div>
      <div className="mt-6 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto"><table className="w-full min-w-[1050px] text-left text-sm"><thead className="border-b border-gray-100 bg-gray-50 text-xs uppercase tracking-wide text-gray-500"><tr><th className="p-4">Customer</th><th className="p-4">Contact</th><th className="p-4">Verified</th><th className="p-4">Activity</th><th className="p-4">Orders</th><th className="p-4">Saved</th><th className="p-4">Joined</th></tr></thead>
          <tbody>{customers.map((customer) => <tr key={customer._id} className="border-b border-gray-50 align-top hover:bg-gray-50/70">
            <td className="p-4"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-brand-800"><UserRound size={18} /></span><div><p className="font-semibold text-gray-900">{customer.name}</p><p className="mt-1 text-xs capitalize text-gray-500">{customer.signupSource?.replace("-", " ") || "customer"}</p></div></div></td>
            <td className="p-4"><a href={`mailto:${customer.email}`} className="font-medium text-brand-700 hover:underline">{customer.email}</a><p className="mt-1 text-xs text-gray-500">{customer.phone || "No phone added"}</p></td>
            <td className="p-4">{customer.emailVerifiedAt ? <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700"><ShieldCheck size={13} /> Email verified</span> : <span className="text-xs text-amber-700">Not verified</span>}</td>
            <td className="p-4"><p className="font-medium text-gray-800">{customer.loginCount || 0} logins</p><p className="mt-1 text-xs text-gray-500">{customer.lastLoginAt ? `Last: ${new Date(customer.lastLoginAt).toLocaleString("en-IN")}` : "No login recorded"}</p></td>
            <td className="p-4"><p className="font-semibold">{customer.orderCount} orders</p><p className="mt-1 text-xs text-gray-500">{formatPrice(customer.totalSpent || 0, "USD")}</p></td>
            <td className="p-4"><p>{customer.wishlistCount} wishlist</p><p className="mt-1 text-xs text-gray-500">{customer.addressCount} addresses</p></td>
            <td className="p-4 text-xs text-gray-500">{new Date(customer.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</td>
          </tr>)}</tbody></table></div>
        {loading ? <p className="p-8 text-center text-sm text-gray-500">Loading customers...</p> : null}{!loading && !customers.length ? <p className="p-8 text-center text-sm text-gray-500">No customers found.</p> : null}
      </div>
      <div className="mt-5 flex items-center justify-end gap-2"><button disabled={page <= 1} onClick={() => setPage((value) => value - 1)} className="inline-flex items-center gap-1 rounded-lg border bg-white px-3 py-2 text-sm disabled:opacity-40"><ChevronLeft size={15} /> Previous</button><span className="px-3 text-sm text-gray-500">Page {page} of {pages}</span><button disabled={page >= pages} onClick={() => setPage((value) => value + 1)} className="inline-flex items-center gap-1 rounded-lg border bg-white px-3 py-2 text-sm disabled:opacity-40">Next <ChevronRight size={15} /></button></div>
    </div>
  );
}
