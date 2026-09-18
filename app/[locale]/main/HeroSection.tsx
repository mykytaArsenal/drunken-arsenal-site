import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';

export const HeroSection = async () => {
  const t = await getTranslations();

  return (
    <section className="relative overflow-hidden scanlines bg-olive-deep text-cream">
      <div className="absolute inset-0 md:left-1/2">
        <Image
          src="/images/hero-cards.webp"
          alt="Shotwave card decks"
          fill
          preload
          fetchPriority="high"
          quality={50}
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-olive-deep/80 md:bg-olive-deep/50" />
        <div className="hidden md:block absolute inset-0 bg-linear-to-r from-olive-deep via-olive-deep/60 to-transparent" />
      </div>

      <span
        className="hidden md:block absolute top-10 left-12 text-5xl rotate-12 opacity-70 text-rust-bright font-display select-none"
        aria-hidden
      >
        ★
      </span>
      <span
        className="hidden md:block absolute top-16 right-20 text-7xl -rotate-12 opacity-50 text-rust-bright font-display select-none"
        aria-hidden
      >
        ★
      </span>
      <span
        className="hidden md:block absolute bottom-20 left-1/3 text-4xl rotate-45 opacity-40 text-rust-bright font-display select-none"
        aria-hidden
      >
        ★
      </span>

      <div className="relative max-w-5xl mx-auto px-6 sm:px-10 py-12 md:py-28 flex flex-col items-start gap-6">
        <span className="tag-line text-amber">// {t('home.ageWarning')}</span>

        <h1 className="font-display-shade leading-[0.95] text-[clamp(3rem,9vw,7rem)]">
          Drunken
          <br />
          Arsenal
        </h1>

        <span className="font-stamp text-base text-amber tracking-wider">
          // {t('home.taglineNote')}
        </span>

        <p className="max-w-2xl text-lg font-stamp leading-relaxed text-cream-warm">
          {t('home.subtitle')}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 pt-2 self-stretch sm:self-auto">
          <Button size="xl" variant="primary" asChild>
            <Link href="#products">{t('home.shopNow')}</Link>
          </Button>

          <Button size="xl" variant="amber" asChild>
            <Link href="/how-to-play">{t('home.howToPlay')}</Link>
          </Button>
        </div>
      </div>

      <div className="panel-divider" />
    </section>
  );
};
