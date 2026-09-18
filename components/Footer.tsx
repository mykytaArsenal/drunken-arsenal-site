import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { IubendaPolicyLink } from '@/components/IubendaPolicyLink';
import { INSTAGRAM_URL, PRODUCT_NAME, SUPPORT_EMAIL } from '@/lib/i18n/brand';

const LINK_CLASS =
  'inline-block py-2 md:py-0 text-ink/80 hover:text-rust-bright transition-colors';

export async function Footer() {
  const t = await getTranslations();

  return (
    <footer className="relative overflow-hidden bg-cream-warm text-ink">
      <div className="panel-divider" />

      <div className="relative container mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10 md:gap-10">
          <div className="space-y-4 col-span-2 md:col-span-1">
            <div className="font-display-shade text-3xl leading-none">
              Drunken
              <br />
              Arsenal
            </div>
            <p className="font-stamp text-sm text-ink/70 leading-relaxed">
              {t('footer.tagline')}
            </p>
            <div className="inline-block stamp text-xs opacity-100">
              18+ Only
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="font-display text-base text-rust tracking-wider">
              {t('footer.shop')}
            </h2>
            <ul className="md:space-y-2 font-stamp text-sm">
              <li>
                <Link href="/#products" className={LINK_CLASS}>
                  · {PRODUCT_NAME}
                </Link>
              </li>
              <li>
                <Link href="/#coming-soon" className={LINK_CLASS}>
                  · {t('arsenal.title')}
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="font-display text-base text-rust tracking-wider">
              {t('footer.support')}
            </h2>
            <ul className="md:space-y-2 font-stamp text-sm">
              <li>
                <Link href="/how-to-play" className={LINK_CLASS}>
                  · {t('nav.howToPlay')}
                </Link>
              </li>
              <li>
                <a href={`mailto:${SUPPORT_EMAIL}`} className={LINK_CLASS}>
                  · {t('footer.contact')}
                </a>
              </li>
              <li>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={LINK_CLASS}
                >
                  · {t('footer.instagram')}
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-3 col-span-2 md:col-span-1">
            <h2 className="font-display text-base text-rust tracking-wider">
              {t('footer.legal')}
            </h2>
            <ul className="md:space-y-2 font-stamp text-sm">
              <li>
                <IubendaPolicyLink
                  href="https://www.iubenda.com/privacy-policy/20021284"
                  title={t('footer.privacy')}
                  className={LINK_CLASS}
                >
                  · {t('footer.privacy')}
                </IubendaPolicyLink>
              </li>
              <li>
                <IubendaPolicyLink
                  href="https://www.iubenda.com/privacy-policy/20021284/cookie-policy"
                  title={t('footer.cookies')}
                  className={LINK_CLASS}
                >
                  · {t('footer.cookies')}
                </IubendaPolicyLink>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t-2 border-ink/20 flex flex-col sm:flex-row justify-between gap-4 font-stamp text-xs text-ink/70">
          <p className="tracking-wider">
            &copy; {new Date().getFullYear()} Drunken Arsenal.{' '}
            {t('footer.rights')}
          </p>
          <p className="tracking-[0.2em] text-rust">
            // EXPLOSIVE FUN! · v0.1 · 2026
          </p>
        </div>
      </div>
    </footer>
  );
}
