import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { isLocale, routing } from '@/i18n/routing';
import { getCurrency } from '@/lib/currency/getCurrency';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Toaster } from '@/components/ui/sonner';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';
import { Metadata } from 'next';
import { Russo_One, Oswald, PT_Mono, IBM_Plex_Mono } from 'next/font/google';

const russoOne = Russo_One({
  subsets: ['latin', 'cyrillic'],
  weight: '400',
  variable: '--font-russo',
  display: 'swap',
});

const oswald = Oswald({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-oswald',
  display: 'swap',
});

const ptMono = PT_Mono({
  subsets: ['latin', 'cyrillic'],
  weight: '400',
  variable: '--font-pt-mono',
  display: 'swap',
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-ibm-plex-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Drunken Arsenal — Explosive Fun!',
    template: '%s | Drunken Arsenal',
  },
  description:
    'Drunken Arsenal — military-themed novelty barware & party games. Premium gifting for tactical evenings.',
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const [messages, currency] = await Promise.all([
    getMessages(),
    getCurrency(),
  ]);

  const fontVars = `${russoOne.variable} ${oswald.variable} ${ptMono.variable} ${ibmPlexMono.variable}`;

  return (
    <html lang={locale} className={fontVars}>
      <body>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <Navigation currency={currency} />
          {children}
          <Footer />
          <Toaster />
        </NextIntlClientProvider>
        <Script
          id="iubenda-embed-loader"
          src="https://cdn.iubenda.com/iubenda.js"
          strategy="lazyOnload"
        />
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
