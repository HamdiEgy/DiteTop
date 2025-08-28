
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { translations } from '../translations';

type Language = 'ar' | 'en';
type TranslationKey = keyof typeof translations.ar;

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey) => string;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('ar');

  useEffect(() => {
    const html = document.documentElement;
    html.lang = language;
    html.dir = language === 'ar' ? 'rtl' : 'ltr';
    html.classList.toggle('rtl', language === 'ar');
    html.classList.toggle('ltr', language === 'en');
  }, [language]);
  
  const t = useCallback((key: TranslationKey): string => {
      return translations[language][key] || translations['en'][key];
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
