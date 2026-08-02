"use client";

import { SessionProvider } from "next-auth/react";
import { LocaleHtmlSync } from "@/components/providers/LocaleHtmlSync";
import { WishlistSync } from "@/components/providers/WishlistSync";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <LocaleHtmlSync />
      <WishlistSync />
      {children}
    </SessionProvider>
  );
}
