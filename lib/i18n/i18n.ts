import type { Locale } from './config';
import en from '../../messages/en.json';
import es from '../../messages/es.json';
import de from '../../messages/de.json';
import fr from '../../messages/fr.json';

const translations = {
  en,
  es,
  de,
  fr,
} as const;

export type TranslationKey = keyof typeof translations.en;

export function getTranslations(locale: Locale = 'en') {
  return translations[locale] || translations.en;
}

export function t(
  key: TranslationKey,
  locale: Locale = 'en',
  params?: Record<string, string>
): string {
  const localeTranslations = getTranslations(locale);
  let text = localeTranslations[key] || key;

  if (params) {
    Object.entries(params).forEach(([paramKey, value]) => {
      text = text.replace(`{${paramKey}}`, value);
    });
  }

  return text;
}
