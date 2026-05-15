export const currencies = ['USD', 'EUR'] as const;
export type Currency = (typeof currencies)[number];

export const defaultCurrency: Currency = 'USD';

export const currencySymbols: Record<Currency, string> = {
  USD: '$',
  EUR: '€',
};

export const currencyNames: Record<Currency, string> = {
  USD: 'US Dollar',
  EUR: 'Euro',
};

// Conversion rates (in production, these would come from an API)
export const conversionRates: Record<Currency, number> = {
  USD: 1,
  EUR: 0.92, // 1 USD = 0.92 EUR (approximate)
};

export function convertPrice(priceInUSD: number, currency: Currency): number {
  return priceInUSD * conversionRates[currency];
}

export function formatPrice(priceInUSD: number, currency: Currency): string {
  const convertedPrice = convertPrice(priceInUSD, currency);
  const symbol = currencySymbols[currency];

  return `${symbol}${convertedPrice.toFixed(2)}`;
}
