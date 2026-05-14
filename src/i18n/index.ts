import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import tr from './tr.json';
import en from './en.json';

const STORAGE_KEY = 'landx:locale';

const stored = (typeof localStorage !== 'undefined' && localStorage.getItem(STORAGE_KEY)) || 'tr';

void i18n
  .use(initReactI18next)
  .init({
    resources: {
      tr: { translation: tr },
      en: { translation: en }
    },
    lng: stored,
    fallbackLng: 'tr',
    interpolation: { escapeValue: false }
  });

export function setLocale(locale: 'tr' | 'en'): void {
  i18n.changeLanguage(locale);
  if (typeof localStorage !== 'undefined') localStorage.setItem(STORAGE_KEY, locale);
  document.documentElement.lang = locale;
}

export default i18n;
