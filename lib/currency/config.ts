export const currencies = ['USD'] as const;
export type ICurrency = (typeof currencies)[number];

export const defaultCurrency: ICurrency = 'USD';

export const currencySymbols: Record<ICurrency, string> = {
  USD: '$',
};

// Conversion rates (in production, these would come from an API)
export const conversionRates: Record<ICurrency, number> = {
  USD: 1,
};

export function convertPrice(priceInUSD: number, currency: ICurrency): number {
  return priceInUSD * conversionRates[currency];
}

export function formatPrice(priceInUSD: number, currency: ICurrency): string {
  const convertedPrice = convertPrice(priceInUSD, currency);
  const symbol = currencySymbols[currency];

  return `${symbol}${convertedPrice.toFixed(2)}`;
}
