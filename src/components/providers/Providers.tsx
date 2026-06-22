"use client";

import { SessionProvider } from "next-auth/react";
import { LocaleHtmlSync } from "@/components/providers/LocaleHtmlSync";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <LocaleHtmlSync />
      {children}
    </SessionProvider>
  );
}
