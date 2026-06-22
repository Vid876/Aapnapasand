"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { translations, type Locale, type TranslationKeys } from "@/i18n/translations";

interface LocaleState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: TranslationKeys;
}

export const useLocaleStore = create<LocaleState>()(
  persist(
    (set) => ({
      locale: "en" as Locale,
      setLocale: (locale) => set({ locale, t: translations[locale] }),
      t: translations.en,
    }),
    {
      name: "aapnapasand-locale",
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.t = translations[state.locale];
        }
      },
    }
  )
);

export function useTranslation() {
  const locale = useLocaleStore((s) => s.locale);
  const t = useLocaleStore((s) => s.t);
  const setLocale = useLocaleStore((s) => s.setLocale);
  return { locale, t, setLocale };
}
