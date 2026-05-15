'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { MenuIcon, ShoppingCartIcon, UserIcon, XIcon } from './icons';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from './language-switcher';
import { CurrencySwitcher } from './currency-switcher';
import type { Currency } from '@/lib/currency/config';
import { AnimatedLink } from '@/components/shared/animatedLink';

interface NavigationProps {
  currency?: Currency;
}

export function Navigation({ currency = 'USD' }: NavigationProps) {
  const t = useTranslations();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cartResponse, authResponse] = await Promise.all([
          fetch('/api/cart/count'),
          fetch('/api/auth/status'),
        ]);

        if (cartResponse.ok) {
          const data = await cartResponse.json();
          setCartCount(data.count || 0);
        }

        if (authResponse.ok) {
          const data = await authResponse.json();
          setIsSignedIn(data.isSignedIn || false);
        }
      } catch (error) {
        console.error('[v0] Error fetching data:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="sticky top-0 z-50 border-b bg-chart-2">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-3 items-center h-16 gap-4">
          <Link href="/">
            <Image src="/logo-letters.png" alt="Logo" width={60} height={32} />
          </Link>

          <div className="hidden md:flex justify-center gap-6">
            <AnimatedLink href="/#products">{t('nav.products')}</AnimatedLink>
            <AnimatedLink href="/how-to-play">
              {t('nav.howToPlay')}
            </AnimatedLink>
            <AnimatedLink href="/about">{t('nav.about')}</AnimatedLink>
          </div>

          <div className="flex items-center justify-end gap-2">
            <div className="hidden md:flex items-center gap-2">
              <LanguageSwitcher />
              <CurrencySwitcher currentCurrency={currency} />
            </div>

            <Button variant="ghost" size="icon" asChild>
              <Link href={isSignedIn ? '/account' : '/sign-in'}>
                <UserIcon className="h-5 w-5" />
              </Link>
            </Button>

            <Button variant="ghost" size="icon" asChild className="relative">
              <Link href="/cart">
                <ShoppingCartIcon className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <XIcon className="h-5 w-5" />
              ) : (
                <MenuIcon className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t py-4 space-y-3 flex flex-col items-center">
            <Link
              href="/#products"
              className="block px-4 py-2 text-sm font-medium hover:bg-muted rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('nav.products')}
            </Link>
            <Link
              href="/how-to-play"
              className="block px-4 py-2 text-sm font-medium hover:bg-muted rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('nav.howToPlay')}
            </Link>
            <Link
              href="/about"
              className="block px-4 py-2 text-sm font-medium hover:bg-muted rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('nav.about')}
            </Link>
            <div className="flex items-center gap-2 px-4 pt-2 border-t">
              <LanguageSwitcher />
              <CurrencySwitcher currentCurrency={currency} />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
