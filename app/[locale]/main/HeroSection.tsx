'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';

export const HeroSection = () => {
  const t = useTranslations();

  return (
    <div className="relative overflow-hidden min-h-[70vh] flex items-center justify-center">
      <div className="absolute inset-0 -z-10">
        <Image
          src="/heroImage.png"
          alt="Party operation deployed"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/70" />
      </div>

      <div className="flex flex-col items-center justify-center gap-6 z-1 p-16">
        <p className="text-md font-semibold text-center uppercase">
          {t('home.ageWarning')}
        </p>

        <h1 className="text-6xl font-bold text-center font-notable">
          Drunken Arsenal
        </h1>

        <p className="pt-2 text-lg md:text-xl text-muted-foreground text-center">
          {t('home.subtitle')}
        </p>

        <div className="flex flex-wrap justify-center gap-4 pt-2">
          <Button
            size="lg"
            variant="shop"
            className="bg-chart-3 hover:bg-chart-3/80 border-none"
            asChild
          >
            <Link href="#products">{t('home.browseArsenal')}</Link>
          </Button>

          <Button
            size="lg"
            variant="gradient"
            className="bg-chart-4 hover:bg-chart-4/80"
            asChild
          >
            <Link href="/how-to-play">{t('home.howToPlay')}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
