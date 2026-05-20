import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'es', 'de', 'fr', 'ru'] as const,
  defaultLocale: 'en',
  localePrefix: 'never',
});

export type ILocale = (typeof routing.locales)[number];

export function isLocale(value: string): value is ILocale {
  return routing.locales.some((l) => l === value);
}
