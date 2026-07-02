"use client";

import { useState } from "react";
import { getSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Lock, Mail } from "lucide-react";
import { AdminAuthShell } from "@/components/admin/AdminAuthShell";
import { Button } from "@/components/ui/Button";

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid admin email or password");
      setLoading(false);
      return;
    }

    const session = await getSession();
    if (session?.user.role !== "admin") {
      await signOut({ redirect: false });
      setError("Only admin accounts can open this dashboard.");
      setLoading(false);
      return;
    }

    router.replace("/admin");
    router.refresh();
  };

  return (
    <AdminAuthShell
      title="Welcome Back"
      subtitle="Sign in with an approved admin account."
      switchText="Need an account?"
      switchHref="/admin/signup"
      switchLabel="Create request"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-gray-700">Email</span>
          <span className="relative block">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
              className="w-full rounded-xl border border-gray-200 bg-white px-11 py-3 text-sm outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
              autoComplete="email"
              required
            />
          </span>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-gray-700">Password</span>
          <span className="relative block">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
              className="w-full rounded-xl border border-gray-200 bg-white px-11 py-3 text-sm outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
              autoComplete="current-password"
              required
            />
          </span>
        </label>

        <Button type="submit" size="lg" className="w-full rounded-xl" isLoading={loading}>
          Login to Dashboard
        </Button>
      </form>
    </AdminAuthShell>
  );
}
