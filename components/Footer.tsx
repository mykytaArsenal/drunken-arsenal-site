import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { IubendaPolicyLink } from '@/components/IubendaPolicyLink';

export async function Footer() {
  const t = await getTranslations();

  return (
    <footer className="relative overflow-hidden bg-olive-deep text-cream mt-16">
      <div className="panel-divider" />
      <div className="halftone-bg absolute inset-0 opacity-20 pointer-events-none" />

      <div className="relative container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="space-y-4 md:col-span-1">
            <div className="font-display-shade text-3xl leading-none">
              Drunken
              <br />
              Arsenal
            </div>
            <p className="font-stamp text-sm text-cream-warm leading-relaxed">
              {t('footer.tagline')}
            </p>
            <div className="inline-block stamp text-xs">18+ Only</div>
          </div>

          <div className="space-y-3">
            <h4 className="font-display text-base text-amber tracking-wider">
              {t('footer.shop')}
            </h4>
            <ul className="space-y-2 font-stamp text-sm">
              <li>
                <Link
                  href="/#products"
                  className="text-cream-warm hover:text-amber transition-colors"
                >
                  · {t('footer.allProducts')}
                </Link>
              </li>
              <li>
                <Link
                  href="/#products"
                  className="text-cream-warm hover:text-amber transition-colors"
                >
                  · {t('footer.bundles')}
                </Link>
              </li>
              <li>
                <Link
                  href="/#products"
                  className="text-cream-warm hover:text-amber transition-colors"
                >
                  · {t('footer.accessories')}
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-display text-base text-amber tracking-wider">
              {t('footer.support')}
            </h4>
            <ul className="space-y-2 font-stamp text-sm">
              <li>
                <Link
                  href="/how-to-play"
                  className="text-cream-warm hover:text-amber transition-colors"
                >
                  · {t('nav.howToPlay')}
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-cream-warm hover:text-amber transition-colors"
                >
                  · {t('footer.faq')}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-cream-warm hover:text-amber transition-colors"
                >
                  · {t('footer.contact')}
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping"
                  className="text-cream-warm hover:text-amber transition-colors"
                >
                  · {t('footer.shipping')}
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-display text-base text-amber tracking-wider">
              {t('footer.legal')}
            </h4>
            <ul className="space-y-2 font-stamp text-sm">
              <li>
                <IubendaPolicyLink
                  href="https://www.iubenda.com/privacy-policy/20021284"
                  title={t('footer.privacy')}
                  className="text-cream-warm hover:text-amber transition-colors"
                >
                  · {t('footer.privacy')}
                </IubendaPolicyLink>
              </li>
              <li>
                <IubendaPolicyLink
                  href="https://www.iubenda.com/privacy-policy/20021284/cookie-policy"
                  title={t('footer.cookies')}
                  className="text-cream-warm hover:text-amber transition-colors"
                >
                  · {t('footer.cookies')}
                </IubendaPolicyLink>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-cream-warm hover:text-amber transition-colors"
                >
                  · {t('footer.terms')}
                </Link>
              </li>
              <li>
                <Link
                  href="/returns"
                  className="text-cream-warm hover:text-amber transition-colors"
                >
                  · {t('footer.returns')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t-2 border-amber/30 flex flex-col sm:flex-row justify-between gap-4 font-stamp text-xs text-cream-warm/70">
          <p className="tracking-wider">
            &copy; {new Date().getFullYear()} Drunken Arsenal.{' '}
            {t('footer.rights')}
          </p>
          <p className="tracking-[0.2em] text-amber">
            // EXPLOSIVE FUN! · v0.1 · 2026
          </p>
        </div>
      </div>
    </footer>
  );
}
