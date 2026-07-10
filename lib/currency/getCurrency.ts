import { cookies } from 'next/headers';
import { currencies, defaultCurrency, type ICurrency } from './config';

export async function getCurrency(): Promise<ICurrency> {
  const cookieStore = await cookies();
  const currencyCookie = cookieStore.get('currency');

  if (
    currencyCookie &&
    currencies.includes(currencyCookie.value as ICurrency)
  ) {
    return currencyCookie.value as ICurrency;
  }

  return defaultCurrency;
}
