import { routing, type ILocale } from '@/i18n/routing';

export type { ILocale };

export const locales = routing.locales;

export const localeNames: Record<ILocale, string> = {
  en: 'English',
  ru: 'Русский',
};

export const localeFlags: Record<ILocale, string> = {
  en: '🇺🇸',
  ru: '🇷🇺',
};
