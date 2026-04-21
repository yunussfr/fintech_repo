"use client"
// lib/i18n/LanguageContext.tsx

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react"
import { translations, type Language, type Translations } from "./translations"

// ── Types ─────────────────────────────────────────────────────────────────────

interface LanguageContextValue {
  language: Language
  setLanguage: (lang: Language) => void
  /** Type-safe nested key getter: t("assets.modal.title") */
  t: (key: string) => string
}

// ── Context ───────────────────────────────────────────────────────────────────

const LanguageContext = createContext<LanguageContextValue>({
  language: "tr",
  setLanguage: () => {},
  t: (key) => key,
})

// ── Provider ──────────────────────────────────────────────────────────────────

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageSate] = useState<Language>("tr")

  // localStorage'dan dili yükle (sadece client'ta)
  useEffect(() => {
    const saved = localStorage.getItem("financeai-language") as Language | null
    if (saved && (saved === "tr" || saved === "en")) {
      setLanguageSate(saved)
    }
  }, [])

  const setLanguage = useCallback((lang: Language) => {
    setLanguageSate(lang)
    localStorage.setItem("financeai-language", lang)
  }, [])

  /**
   * Nokta notasyonlu anahtar ile çeviri döndürür.
   * Örn: t("assets.modal.title") → "Yeni Varlık Ekle"
   */
  const t = useCallback(
    (key: string): string => {
      const dict = translations[language] as Record<string, unknown>
      const parts = key.split(".")
      let current: unknown = dict

      for (const part of parts) {
        if (current === null || typeof current !== "object") return key
        current = (current as Record<string, unknown>)[part]
      }

      return typeof current === "string" ? current : key
    },
    [language]
  )

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useLanguage() {
  return useContext(LanguageContext)
}
