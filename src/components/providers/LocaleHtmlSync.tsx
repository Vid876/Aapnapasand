"use client";

import { useEffect } from "react";
import { useTranslation } from "@/store/localeStore";

export function LocaleHtmlSync() {
  const locale = useTranslation().locale;

  useEffect(() => {
    document.documentElement.lang = locale === "hi" ? "hi" : "en";
  }, [locale]);

  return null;
}
