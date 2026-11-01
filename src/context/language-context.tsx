"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { LanguageCode, LanguageOption, SUPPORTED_LANGUAGES, TranslationKey } from "@/lib/i18n/types";
import { TRANSLATIONS } from "@/lib/i18n/translations";

interface LanguageContextType {
  lang: LanguageCode;
  setLang: (lang: LanguageCode) => void;
  t: (key: TranslationKey) => string;
  languages: LanguageOption[];
  currentLanguageOption: LanguageOption;
  autoDetectFromCountry: (countryCode?: string) => void;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LanguageCode>(() => {
    if (typeof window === "undefined") return "id";
    try {
      const saved = localStorage.getItem("pingly_lang");
      if (saved && (saved === "id" || saved === "en" || saved === "ja" || saved === "zh" || saved === "es" || saved === "ar")) {
        return saved as LanguageCode;
      }
      // Check browser language
      const navLang = navigator.language.toLowerCase();
      if (navLang.startsWith("id")) return "id";
      if (navLang.startsWith("ja")) return "ja";
      if (navLang.startsWith("zh")) return "zh";
      if (navLang.startsWith("es")) return "es";
      if (navLang.startsWith("ar")) return "ar";
      return "id"; // Default Indonesian as national language
    } catch {
      return "id";
    }
  });

  const setLang = useCallback((newLang: LanguageCode) => {
    setLangState(newLang);
    try {
      localStorage.setItem("pingly_lang", newLang);
      localStorage.setItem("pingly_lang_explicit", "true");
    } catch {}
  }, []);

  const autoDetectFromCountry = useCallback((countryCode?: string) => {
    if (!countryCode || typeof window === "undefined") return;
    try {
      const isExplicit = localStorage.getItem("pingly_lang_explicit");
      if (isExplicit) return; // User already manually chose a language

      const cc = countryCode.toUpperCase();
      if (cc === "ID") {
        setLangState("id");
      } else if (cc === "JP") {
        setLangState("ja");
      } else if (cc === "CN" || cc === "TW" || cc === "HK") {
        setLangState("zh");
      } else if (cc === "ES" || cc === "MX" || cc === "AR" || cc === "CO") {
        setLangState("es");
      } else if (cc === "SA" || cc === "AE" || cc === "EG") {
        setLangState("ar");
      } else {
        setLangState("en");
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  const t = useCallback(
    (key: TranslationKey): string => {
      const dict = TRANSLATIONS[lang] || TRANSLATIONS.id;
      return dict[key] || TRANSLATIONS.en[key] || key;
    },
    [lang]
  );

  const currentLanguageOption =
    SUPPORTED_LANGUAGES.find((l) => l.code === lang) || SUPPORTED_LANGUAGES[0];

  return (
    <LanguageContext.Provider
      value={{
        lang,
        setLang,
        t,
        languages: SUPPORTED_LANGUAGES,
        currentLanguageOption,
        autoDetectFromCountry,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
