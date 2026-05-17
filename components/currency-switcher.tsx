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
      <SelectTrigger className="max-w-30 gap-2">
        <DollarSignIcon className="h-4 w-4" />
        <SelectValue />
      </SelectTrigger>

      <SelectContent className="bg-chart-2">
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
