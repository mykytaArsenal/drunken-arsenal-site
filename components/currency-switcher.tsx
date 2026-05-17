'use client';

import { useRouter } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DollarSignIcon } from './icons';
import { currencies, type ICurrency } from '@/lib/currency/config';

export function CurrencySwitcher({
  currentCurrency,
}: {
  currentCurrency: ICurrency;
}) {
  const router = useRouter();

  const changeCurrency = (newCurrency: ICurrency) => {
    document.cookie = `currency=${newCurrency}; path=/; max-age=31536000`;
    router.refresh();
  };

  return (
    <Select
      value={currentCurrency}
      onValueChange={(value) => changeCurrency(value as ICurrency)}
    >
      <SelectTrigger className="h-9 max-w-28 gap-2 border-2 border-cream/30 bg-transparent text-cream font-stamp text-xs uppercase tracking-wider media-hover:hover:border-amber">
        <DollarSignIcon className="h-4 w-4" />
        <SelectValue />
      </SelectTrigger>

      <SelectContent className="bg-cream text-ink border-[3px] border-ink shadow-[6px_6px_0_var(--color-ink)] font-stamp">
        {currencies.map((currency) => (
          <SelectItem key={currency} value={currency}>
            <span className="flex items-center gap-2">
              <span>{currency}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
