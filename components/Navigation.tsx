'use client';

import Link from 'next/link';
import { useTranslation, type SupportedLocale, addLocalePrefix } from '@/i18n';
import { LanguageSwitcher } from './LanguageSwitcher';

interface NavigationProps {
  locale: SupportedLocale;
  currentPath: string;
}

export function Navigation({ locale, currentPath }: NavigationProps) {
  const t = useTranslation(locale);

  return (
    <header className="bg-white shadow-sm">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link
            href={addLocalePrefix('/', locale)}
            className="text-2xl font-bold text-primary-600"
          >
            {t('common.companyName')}
          </Link>
          
          <div className="flex items-center space-x-4 md:space-x-6">
            {/* Navigation Links */}
            <div className="hidden md:flex space-x-4">
              <Link
                href={addLocalePrefix('/', locale)}
                className="text-gray-700 hover:text-primary-600 transition-colors"
              >
                {t('nav.home')}
              </Link>
              <Link
                href={addLocalePrefix('/about', locale)}
                className="text-gray-700 hover:text-primary-600 transition-colors"
              >
                {t('nav.about')}
              </Link>
              <Link
                href={addLocalePrefix('/pricing', locale)}
                className="text-gray-700 hover:text-primary-600 transition-colors"
              >
                {t('nav.pricing')}
              </Link>
              <Link
                href={addLocalePrefix('/contact', locale)}
                className="text-gray-700 hover:text-primary-600 transition-colors"
              >
                {t('nav.contact')}
              </Link>
            </div>

            {/* Language Switcher */}
            <LanguageSwitcher locale={locale} currentPath={currentPath} />
          </div>
        </div>
      </nav>
    </header>
  );
}
