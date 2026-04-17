import React, { createContext, useCallback, useContext, useState } from "react";

type Lang = "ar" | "en";

interface LanguageContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (ar: string, en: string) => string;
  isRTL: boolean;
  toggleLang: () => void;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: "ar",
  setLang: () => {},
  t: (ar) => ar,
  isRTL: true,
  toggleLang: () => {},
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ar");

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
  }, []);

  const toggleLang = useCallback(() => {
    setLang(lang === "ar" ? "en" : "ar");
  }, [lang, setLang]);

  const t = useCallback((ar: string, en: string) => (lang === "ar" ? ar : en), [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, isRTL: lang === "ar", toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
