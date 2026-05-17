'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { BRAND } from '@/lib/i18n/brand';

export const AboutUs = () => {
  const t = useTranslations();
  const [showImage, setShowImage] = useState(false);

  return (
    <section
      id="about"
      className="relative overflow-hidden py-16 md:py-20 bg-paper"
    >
      <div className="max-w-5xl mx-auto px-6 sm:px-10 flex flex-col gap-12">
        <div className="flex items-end gap-6">
          <div className="phase-number">01</div>
          <div>
            <div className="tag-line">// brand</div>
            <h2 className="font-display text-3xl md:text-4xl leading-none text-ink">
              {t('home.whoWeAreTitle')}
            </h2>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          <div className="pop-card p-6 space-y-3">
            <div className="font-stamp text-xs uppercase tracking-wider opacity-60">
              {t('home.missionTitle')}
            </div>
            <p className="leading-relaxed">
              {t('home.aboutUs1', { brand: BRAND })}
            </p>
          </div>

          <div className="pop-card p-6 space-y-3">
            <div className="font-stamp text-xs uppercase tracking-wider opacity-60">
              {t('home.whatWeBringTitle')}
            </div>
            <p className="leading-relaxed">{t('home.aboutUs2')}</p>
          </div>

          <div className="pop-card p-6 space-y-3">
            <div className="font-stamp text-xs uppercase tracking-wider opacity-60">
              {t('home.ourPromiseTitle')}
            </div>
            <p className="leading-relaxed">
              {t('home.aboutUs3', { brand: BRAND })}
            </p>
          </div>
        </div>

        <div className="stripes-warning p-1">
          <div className="bg-ink p-5 flex items-center gap-4 flex-wrap text-cream">
            <span className="font-display text-xl text-amber">
              {t('home.missionTitle')}:
            </span>
            <span className="font-display text-2xl">
              {t('home.missionText')}
            </span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-10 items-center justify-between">
          <div className="pop-card-dark p-6 max-w-md">
            <div className="font-stamp text-xs uppercase tracking-wider text-amber mb-2">
              // {t('home.ourPromiseTitle')}
            </div>
            <p className="leading-relaxed text-cream-warm">
              {t('home.ourPromiseText')}
            </p>
          </div>

          <div className="flex flex-col items-center gap-4">
            <p className="font-stamp text-sm uppercase tracking-[0.15em] text-ink">
              {t('home.readyForSomeFun')}
            </p>

            <Button
              size="lg"
              variant="primary"
              onClick={() => setShowImage((prev) => !prev)}
            >
              {t('home.yesCommander')}
            </Button>

            <p className="font-stamp text-xs text-ink/60 text-center max-w-xs">
              {t('home.designatedDriverNote')}
            </p>
          </div>
        </div>

        <div
          className={`pointer-events-none flex justify-center transform transition-all duration-700 ease-out ${
            showImage ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          <Image
            src="/grenade-cheers.png"
            alt="Cheers to a tactical evening"
            width={160}
            height={80}
            className="max-w-24 md:max-w-full"
          />
        </div>
      </div>
    </section>
  );
};
