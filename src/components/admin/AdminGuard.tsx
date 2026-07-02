"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

const ADMIN_AUTH_ROUTES = new Set(["/admin/login", "/admin/signup"]);

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const isAuthRoute = ADMIN_AUTH_ROUTES.has(pathname);

  useEffect(() => {
    if (status === "loading") return;
    if (isAuthRoute) {
      if (session?.user.role === "admin") {
        router.replace("/admin");
      }
      return;
    }
    if (!session) {
      router.replace("/admin/login");
      return;
    }
    if (session.user.role !== "admin") {
      router.replace("/");
    }
  }, [isAuthRoute, session, status, router]);

  if (isAuthRoute) {
    return <>{children}</>;
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!session || session.user.role !== "admin") {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-6 lg:p-8">{children}</div>
      </div>
    </div>
  );
}
