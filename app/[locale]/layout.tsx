import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { type Locale, routing } from '@/i18n/routing';
import { getCurrency } from '@/lib/currency/get-currency';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { Metadata } from 'next';
import { Notable } from 'next/font/google';

const notable = Notable({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-notable',
});

export const metadata: Metadata = {
  title: {
    default: 'Drunken Arsenal',
    template: '%s | Drunken Arsenal',
  },
  description:
    'Drunken Arsenal is a tactical drinking game and gift-ready bar experience for responsible adults.',
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();
  const currency = await getCurrency();

  return (
    <html lang={locale} className={notable.variable}>
      <body>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <Navigation currency={currency} />
          {children}
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
