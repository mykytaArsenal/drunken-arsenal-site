export const locales = ['en', 'es', 'de', 'fr', 'ru'] as const;
export type ILocale = (typeof locales)[number];

export const defaultLocale: ILocale = 'en';

export const localeNames: Record<ILocale, string> = {
  en: 'English',
  es: 'Español',
  de: 'Deutsch',
  fr: 'Français',
  ru: 'Русский',
};

export const localeFlags: Record<ILocale, string> = {
  en: '🇺🇸',
  es: '🇪🇸',
  de: '🇩🇪',
  fr: '🇫🇷',
  ru: '🇷🇺',
};
