import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Sparkles } from "lucide-react";

interface AdminAuthShellProps {
  title: string;
  subtitle: string;
  switchText: string;
  switchHref: string;
  switchLabel: string;
  children: React.ReactNode;
}

export function AdminAuthShell({
  title,
  subtitle,
  switchText,
  switchHref,
  switchLabel,
  children,
}: AdminAuthShellProps) {
  return (
    <main className="admin-auth-bg relative isolate min-h-screen overflow-hidden px-4 py-8 text-white sm:px-6">
      <div className="admin-auth-grid" />

      <section className="relative z-10 mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center gap-10 lg:grid-cols-[1fr_460px]">
        <div className="hidden lg:block">
          <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white/85 backdrop-blur">
            <ShieldCheck size={18} />
            Admin portal
          </div>
          <h1 className="max-w-xl font-display text-5xl font-bold leading-tight">
            Manage BOHOBLOCKPRINTED with a calm, focused workspace.
          </h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-white/75">
            Products, orders, offers, reviews, and categories stay behind an admin-only login.
          </p>
          <div className="mt-10 grid max-w-lg grid-cols-3 gap-3">
            {["Secure", "Simple", "Fast"].map((item) => (
              <div key={item} className="rounded-lg border border-white/15 bg-white/10 p-4 backdrop-blur">
                <Sparkles className="mb-3 text-amber-200" size={18} />
                <p className="text-sm font-semibold">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full rounded-[28px] border border-white/25 bg-white/95 p-6 text-gray-900 shadow-2xl shadow-black/25 backdrop-blur sm:p-8">
          <div className="mb-8 text-center">
            <Link href="/" className="mx-auto mb-5 flex h-16 w-24 items-center justify-center rounded-2xl bg-brand-50">
              <Image
                src="/Logo.png"
                alt="BOHOBLOCKPRINTED"
                width={96}
                height={48}
                className="object-contain"
                style={{ height: "48px", width: "auto" }}
                priority
              />
            </Link>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-600">Admin access</p>
            <h2 className="mt-2 font-display text-3xl font-bold text-gray-950">{title}</h2>
            <p className="mt-2 text-sm text-gray-500">{subtitle}</p>
          </div>

          {children}

          <p className="mt-6 text-center text-sm text-gray-500">
            {switchText}{" "}
            <Link href={switchHref} className="font-semibold text-brand-700 hover:text-brand-900">
              {switchLabel}
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}

