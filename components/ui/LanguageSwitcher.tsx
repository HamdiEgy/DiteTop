
import React from 'react';
import { useLanguage } from '../../hooks/useLanguage';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };

  return (
    <button
      onClick={toggleLanguage}
      className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-text-primary hover:bg-gray-100 transition-colors"
    >
      {language === 'ar' ? 'EN' : 'ع'}
    </button>
  );
};

export default LanguageSwitcher;