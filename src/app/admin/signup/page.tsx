import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { AdminAuthShell } from "@/components/admin/AdminAuthShell";

export default function AdminSignupPage() {
  return (
    <AdminAuthShell
      title="Verified Account Required"
      subtitle="Every new profile must verify its email before admin access can be requested."
      switchText="Already approved?"
      switchHref="/admin/login"
      switchLabel="Sign in"
    >
      <div className="rounded-xl border border-brand-100 bg-brand-50 p-5 text-sm leading-7 text-gray-700">
        <ShieldCheck className="mb-3 text-brand-700" size={24} />
        Create a customer account using the email verification code. After verification, ask the site owner to approve the admin role.
      </div>
      <Link href="/register?callbackUrl=/admin/login" className="mt-5 flex min-h-12 w-full items-center justify-center rounded-xl bg-brand-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-800">
        Create verified account
      </Link>
    </AdminAuthShell>
  );
}
