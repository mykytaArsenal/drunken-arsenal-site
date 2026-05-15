'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export const AboutUs = () => {
  const t = useTranslations();
  const [showImage, setShowImage] = useState(false);

  return (
    <div id="about" className="relative overflow-hidden py-16 bg-stone-900">
      <div className="max-w-6xl flex flex-col items-center justify-center gap-12 mx-auto">
        <div className="text-center lg:text-left flex flex-col gap-6">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center">
            {t('home.whoWeAreTitle')}
          </h2>

          <div className="space-y-4 text-lg md:text-xl px-4 text-stone-200 leading-relaxed">
            <p>{t('home.aboutUs1')}</p>
            <p>{t('home.aboutUs2')}</p>
            <p>{t('home.aboutUs3')}</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-10 items-center justify-center w-full">
          <div className="grid gap-4 sm:grid-cols-2 max-w-xl">
            <div className="rounded-xl border border-stone-800 p-4 shadow-lg">
              <p className="text-xs font-semibold uppercase text-stone-400 mb-2">
                {t('home.missionTitle')}
              </p>
              <p className="text-sm md:text-base text-stone-200">
                {t('home.missionText')}
              </p>
            </div>

            <div className="rounded-xl border border-stone-800 p-4 shadow-lg">
              <p className="text-xs font-semibold uppercase text-stone-400 mb-2">
                {t('home.whatWeBringTitle')}
              </p>
              <p className="text-sm md:text-base text-stone-200">
                {t('home.whatWeBringText')}
              </p>
            </div>

            <div className="rounded-xl border border-stone-800 p-4 shadow-lg sm:col-span-2">
              <p className="text-xs font-semibold uppercase  text-stone-400 mb-2">
                {t('home.ourPromiseTitle')}
              </p>
              <p className="text-sm md:text-base text-stone-200">
                {t('home.ourPromiseText')}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center lg:items-start gap-4">
            <p className="text-sm md:text-base uppercase text-stone-300">
              {t('home.readyForSomeFun')}
            </p>

            <Button
              size="lg"
              variant="gradient"
              className="bg-chart-1 hover:bg-chart-1/80 px-10"
              onClick={() => setShowImage((prev) => !prev)}
            >
              {t('home.yesCommander')}
            </Button>

            <p className="text-xs md:text-sm text-stone-500 text-center lg:text-left max-w-sm">
              {t('home.designatedDriverNote')}
            </p>
          </div>
        </div>

        <div
          className={`
              absolute inset-x-0 bottom-0
              flex justify-center
              transform transition-all duration-700 ease-out
              ${showImage ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}
            `}
        >
          <Image
            src="/grenade-cheers.png"
            alt="Party operation deployed"
            width={160}
            height={80}
            className="max-w-24 md:max-w-full"
          />
        </div>
      </div>
    </div>
  );
};
