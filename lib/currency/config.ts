export const currencies = ['USD', 'EUR'] as const;
export type ICurrency = (typeof currencies)[number];

export const defaultCurrency: ICurrency = 'USD';

export const currencySymbols: Record<ICurrency, string> = {
  USD: '$',
  EUR: '€',
};

export const currencyNames: Record<ICurrency, string> = {
  USD: 'US Dollar',
  EUR: 'Euro',
};

// Conversion rates (in production, these would come from an API)
export const conversionRates: Record<ICurrency, number> = {
  USD: 1,
  EUR: 0.92, // 1 USD = 0.92 EUR (approximate)
};

export function convertPrice(priceInUSD: number, currency: ICurrency): number {
  return priceInUSD * conversionRates[currency];
}

export function formatPrice(priceInUSD: number, currency: ICurrency): string {
  const convertedPrice = convertPrice(priceInUSD, currency);
  const symbol = currencySymbols[currency];

  return `${symbol}${convertedPrice.toFixed(2)}`;
}
