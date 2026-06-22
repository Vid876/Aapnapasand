"use client";

import { useTranslation } from "@/store/localeStore";
import { Languages } from "lucide-react";

export function LanguageSwitcher() {
  const { locale, setLocale } = useTranslation();

  return (
    <button
      onClick={() => setLocale(locale === "en" ? "hi" : "en")}
      className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold uppercase tracking-wide border border-gray-200 rounded-full hover:bg-gray-50 transition-colors"
      aria-label="Switch language"
    >
      <Languages size={14} />
      {locale === "en" ? "हिं" : "EN"}
    </button>
  );
}
