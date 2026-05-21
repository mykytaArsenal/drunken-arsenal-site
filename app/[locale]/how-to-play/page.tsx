import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';
import { PRODUCT_NAME } from '@/lib/i18n/brand';

export const metadata = {
  title: 'How to Play',
  description: 'Learn the rules of Shotwave — the tactical party game',
};

const manuals = [
  {
    code: 'EN',
    title: 'Field Manual',
    subtitle: 'SHOTWAVE Rules',
    cta: 'Open',
    href: '/rules/ShotWave_Rules_EN.html',
  },
  {
    code: 'RU',
    title: 'Полевой устав',
    subtitle: 'Правила SHOTWAVE',
    cta: 'Открыть',
    href: '/rules/ShotWave_Rules_RU.html',
  },
] as const;

export default async function HowToPlayPage() {
  const t = await getTranslations('howToPlay');

  return (
    <div className="min-h-screen py-12 md:py-16 bg-paper">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 space-y-3">
            <span className="tag-line">// operations manual</span>
            <h1 className="font-display text-4xl md:text-6xl text-ink leading-tight">
              {t('title', { productName: PRODUCT_NAME })}
            </h1>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
            {manuals.map(({ code, title, subtitle, cta, href }) => (
              <a
                key={code}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="pop-card aspect-square p-6 md:p-8 flex flex-col justify-between transition-transform media-hover:hover:-translate-y-1 media-hover:hover:-translate-x-1 focus-visible:outline-2 focus-visible:outline-rust-bright focus-visible:outline-offset-2"
              >
                <div className="flex items-start justify-end">
                  <span className="font-display text-4xl md:text-5xl text-ink">
                    {code}
                  </span>
                </div>

                <div className="space-y-2">
                  <h2 className="font-display text-2xl md:text-3xl text-ink uppercase leading-tight">
                    {title}
                  </h2>
                  <p className="font-stamp text-sm md:text-base text-ink/70">
                    {subtitle}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t-2 border-ink pt-4">
                  <span className="font-stamp text-sm uppercase tracking-[0.15em] text-ink">
                    {cta}
                  </span>
                  <span
                    aria-hidden
                    className="font-display text-2xl text-rust-bright"
                  >
                    →
                  </span>
                </div>
              </a>
            ))}
          </div>

          {/*<div className="mt-10 md:mt-12 space-y-4">*/}
          {/*  <div className="text-center space-y-2">*/}
          {/*    <span className="tag-line">// recipes</span>*/}
          {/*    <h2 className="font-display text-2xl md:text-3xl text-ink uppercase leading-tight">*/}
          {/*      Tactical Drink Recipes*/}
          {/*    </h2>*/}
          {/*  </div>*/}
          {/*  <a*/}
          {/*    href="/recipes/ShotWave_Recipe_Manual_EN.pdf"*/}
          {/*    target="_blank"*/}
          {/*    rel="noopener noreferrer"*/}
          {/*    className="pop-card-dark block p-6 md:p-8 transition-transform media-hover:hover:-translate-y-1 media-hover:hover:-translate-x-1 focus-visible:outline-2 focus-visible:outline-amber focus-visible:outline-offset-2"*/}
          {/*  >*/}
          {/*    <div className="flex items-center gap-5">*/}
          {/*      <div className="flex-1 space-y-2">*/}
          {/*        <p className="font-stamp text-[0.7rem] tracking-[0.2em] text-amber uppercase">*/}
          {/*          // EN*/}
          {/*        </p>*/}
          {/*        <h3 className="font-display text-xl md:text-2xl text-cream uppercase leading-tight">*/}
          {/*          Recipe Manual*/}
          {/*        </h3>*/}
          {/*        <p className="font-stamp text-sm md:text-base text-cream-warm">*/}
          {/*          Mission-ready drink recipes for your squad*/}
          {/*        </p>*/}
          {/*      </div>*/}
          {/*      <div className="flex items-center gap-3 border-l-2 border-cream pl-5">*/}
          {/*        <span className="font-stamp text-sm uppercase tracking-[0.15em] text-cream">*/}
          {/*          Open*/}
          {/*        </span>*/}
          {/*        <span*/}
          {/*          aria-hidden*/}
          {/*          className="font-display text-2xl text-amber"*/}
          {/*        >*/}
          {/*          →*/}
          {/*        </span>*/}
          {/*      </div>*/}
          {/*    </div>*/}
          {/*  </a>*/}
          {/*</div>*/}

          <div className="mt-12 text-center">
            <Button size="xl" variant="primary" asChild>
              <Link href="/#products">{t('getArsenal')}</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
