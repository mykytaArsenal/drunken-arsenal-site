import { cookies } from 'next/headers';
import { defaultCurrency, currencies, type Currency } from './config';

export async function getCurrency(): Promise<Currency> {
  const cookieStore = await cookies();
  const currencyCookie = cookieStore.get('currency');

  if (currencyCookie && currencies.includes(currencyCookie.value as Currency)) {
    return currencyCookie.value as Currency;
  }

  return defaultCurrency;
}
