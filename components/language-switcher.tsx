'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  type Locale,
  localeFlags,
  localeNames,
  locales,
} from '@/lib/i18n/config';

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  const changeLocale = (newLocale: Locale) => {
    if (newLocale === locale) return;

    router.replace(pathname, { locale: newLocale });
    router.refresh();
  };

  return (
    <Select
      value={locale}
      onValueChange={(value) => changeLocale(value as Locale)}
    >
      <SelectTrigger className="max-w-60 gap-2" aria-label="Select language">
        <SelectValue />
      </SelectTrigger>

      <SelectContent className="bg-chart-2">
        {locales.map((loc) => (
          <SelectItem key={loc} value={loc}>
            <span className="flex items-center gap-2">
              <span>{localeFlags[loc]}</span>
              <span>{localeNames[loc]}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
