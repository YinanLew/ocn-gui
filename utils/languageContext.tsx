"use client";
import React, { createContext, useState, useContext, useEffect } from "react";
import { Translations } from "@/types";
import enTranslations from "@/lang/en.json";
import cnTranslations from "@/lang/cn.json";

type LanguageContextType = {
  language: string;
  setLanguage: React.Dispatch<React.SetStateAction<string>>;
  translations: Translations;
  loadTranslations: (lang: string) => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [language, setLanguage] = useState<string>("en");
  const [translations, setTranslations] =
    useState<Translations>(enTranslations);

  const loadTranslations = (lang: string) => {
    switch (lang) {
      case "en":
        setTranslations(enTranslations);
        break;
      case "cn":
        setTranslations(cnTranslations);
        break;
      default:
        setTranslations(enTranslations);
        break;
    }
  };

  useEffect(() => {
    loadTranslations(language);
  }, [language]);

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage, translations, loadTranslations }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
