'use client';

import Link from 'next/link';
import { useTranslation, type SupportedLocale } from '@/i18n';

interface FooterProps {
  locale: SupportedLocale;
}

export function Footer({ locale }: FooterProps) {
  const t = useTranslation(locale);
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">{t('footer.company')}</h3>
            <ul className="space-y-2">
              <li>
                <Link href={`/${locale}/about`} className="hover:text-primary-400">
                  {t('nav.about')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/contact`} className="hover:text-primary-400">
                  {t('nav.contact')}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">{t('footer.legal')}</h3>
            <ul className="space-y-2">
              <li>
                <Link href={`/${locale}/privacy`} className="hover:text-primary-400">
                  {t('footer.privacyPolicy')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/terms`} className="hover:text-primary-400">
                  {t('footer.termsOfService')}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">{t('footer.followUs')}</h3>
            <div className="space-y-2">
              <p>{t('footer.socialMediaLinks')}</p>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center">
          <p>
            &copy; {currentYear} {t('common.companyName')}. {t('common.allRightsReserved')}.
          </p>
        </div>
      </div>
    </footer>
  );
}
