'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { MenuIcon, ShoppingCartIcon, UserIcon, XIcon } from './icons';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from './language-switcher';
import { CurrencySwitcher } from './currency-switcher';
import type { ICurrency } from '@/lib/currency/config';
import { AnimatedLink } from '@/components/shared/animatedLink';

interface INavigationProps {
  currency?: ICurrency;
}

export function Navigation({ currency = 'USD' }: INavigationProps) {
  const t = useTranslations();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

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

    const start = () => {
      if (interval) return;
      fetchData();
      interval = setInterval(fetchData, 5000);
    };

    const stop = () => {
      if (!interval) return;
      clearInterval(interval);
      interval = null;
    };

    const onVisibilityChange = () => {
      if (document.hidden) stop();
      else start();
    };

    if (!document.hidden) start();
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      stop();
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-olive-deep text-cream">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-3 items-center h-16 gap-4">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo-letters.png"
              alt="Drunken Arsenal"
              width={60}
              height={32}
            />
            <span className="hidden sm:block font-stamp text-[0.7rem] tracking-[0.15em] text-amber uppercase">
              // Explosive Fun!
            </span>
          </Link>

          <div className="hidden md:flex justify-center gap-8 font-stamp uppercase tracking-[0.12em] text-xs">
            <AnimatedLink
              href="/#products"
              className="text-cream hover:text-amber"
            >
              {t('nav.products')}
            </AnimatedLink>
            <AnimatedLink
              href="/how-to-play"
              className="text-cream hover:text-amber"
            >
              {t('nav.howToPlay')}
            </AnimatedLink>
            <AnimatedLink href="/about" className="text-cream hover:text-amber">
              {t('nav.about')}
            </AnimatedLink>
          </div>

          <div className="flex items-center justify-end gap-2">
            <div className="hidden md:flex items-center gap-2">
              <LanguageSwitcher />
              <CurrencySwitcher currentCurrency={currency} />
            </div>

            <Button
              variant="ghost"
              size="icon"
              asChild
              className="text-cream media-hover:hover:bg-olive media-hover:hover:text-amber"
            >
              <Link href={isSignedIn ? '/account' : '/sign-in'}>
                <UserIcon className="h-5 w-5" />
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              asChild
              className="relative text-cream media-hover:hover:bg-olive media-hover:hover:text-amber"
            >
              <Link href="/cart">
                <ShoppingCartIcon className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 min-w-5 px-1 border-2 border-ink bg-rust-bright text-cream text-[0.65rem] font-display flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-cream media-hover:hover:bg-olive media-hover:hover:text-amber"
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
          <div className="md:hidden border-t-2 border-amber/30 py-4 space-y-2 flex flex-col items-stretch">
            <Link
              href="/#products"
              className="block px-4 py-2 font-stamp uppercase tracking-[0.12em] text-xs text-cream hover:bg-olive hover:text-amber"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('nav.products')}
            </Link>
            <Link
              href="/how-to-play"
              className="block px-4 py-2 font-stamp uppercase tracking-[0.12em] text-xs text-cream hover:bg-olive hover:text-amber"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('nav.howToPlay')}
            </Link>
            <Link
              href="/about"
              className="block px-4 py-2 font-stamp uppercase tracking-[0.12em] text-xs text-cream hover:bg-olive hover:text-amber"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('nav.about')}
            </Link>
            <div className="flex items-center gap-2 px-4 pt-3 border-t-2 border-amber/30">
              <LanguageSwitcher />
              <CurrencySwitcher currentCurrency={currency} />
            </div>
          </div>
        )}
      </div>

      <div className="panel-divider" />
    </nav>
  );
}
