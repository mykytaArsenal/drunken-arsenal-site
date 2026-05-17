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
  type ILocale,
  localeFlags,
  localeNames,
  locales,
} from '@/lib/i18n/config';

export function LanguageSwitcher() {
  const locale = useLocale() as ILocale;
  const router = useRouter();
  const pathname = usePathname();

  const changeLocale = (newLocale: ILocale) => {
    if (newLocale === locale) return;

    router.replace(pathname, { locale: newLocale });
    router.refresh();
  };

  return (
    <Select
      value={locale}
      onValueChange={(value) => changeLocale(value as ILocale)}
    >
      <SelectTrigger
        className="h-9 max-w-32 gap-2 border-2 border-cream/30 bg-transparent text-cream font-stamp text-xs uppercase tracking-wider data-[placeholder]:text-cream/60 media-hover:hover:border-amber"
        aria-label="Select language"
      >
        <SelectValue />
      </SelectTrigger>

      <SelectContent className="bg-cream text-ink border-[3px] border-ink shadow-[6px_6px_0_var(--color-ink)] font-stamp">
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
