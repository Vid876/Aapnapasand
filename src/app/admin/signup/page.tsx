"use client";

import { useState } from "react";
import { signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Lock, Mail, Phone, User } from "lucide-react";
import { AdminAuthShell } from "@/components/admin/AdminAuthShell";
import { Button } from "@/components/ui/Button";

export default function AdminSignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Signup failed");
        setLoading(false);
        return;
      }

      await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });
      await signOut({ redirect: false });
      setMessage("Account created. Ask the owner to approve admin access before logging in.");
      setLoading(false);
      setTimeout(() => router.push("/admin/login"), 1600);
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <AdminAuthShell
      title="Create Account"
      subtitle="Create a profile, then request admin approval."
      switchText="Already approved?"
      switchHref="/admin/login"
      switchLabel="Sign in"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}
        {message && (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {message}
          </div>
        )}

        {[
          { label: "Full Name", key: "name", type: "text", icon: User, autoComplete: "name" },
          { label: "Email", key: "email", type: "email", icon: Mail, autoComplete: "email" },
          { label: "Phone (Optional)", key: "phone", type: "tel", icon: Phone, autoComplete: "tel" },
          { label: "Password", key: "password", type: "password", icon: Lock, autoComplete: "new-password" },
        ].map((field) => {
          const Icon = field.icon;
          const key = field.key as keyof typeof form;
          return (
            <label key={field.key} className="block">
              <span className="mb-1.5 block text-sm font-semibold text-gray-700">{field.label}</span>
              <span className="relative block">
                <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type={field.type}
                  value={form[key]}
                  onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
                  className="w-full rounded-xl border border-gray-200 bg-white px-11 py-3 text-sm outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
                  autoComplete={field.autoComplete}
                  minLength={field.key === "password" ? 6 : undefined}
                  required={field.key !== "phone"}
                />
              </span>
            </label>
          );
        })}

        <Button type="submit" size="lg" className="w-full rounded-xl" isLoading={loading}>
          Create Account
        </Button>
      </form>
    </AdminAuthShell>
  );
}
