'use client';

import Link from 'next/link';
import { useTranslation, type SupportedLocale, supportedLocales } from '@/i18n';
import { LanguageSwitcher } from './LanguageSwitcher';

interface NavigationProps {
  locale: SupportedLocale;
  currentPath: string;
}

export function Navigation({ locale, currentPath }: NavigationProps) {
  const t = useTranslation(locale);

  const getLocalizedPath = (path: string) => {
    // 确保路径以 / 开头
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    // 移除现有的语言前缀（如果有）
    // 使用动态匹配支持的语言代码，支持未来添加更多语言
    const localePattern = supportedLocales.join('|');
    const pathWithoutLocale = normalizedPath.replace(new RegExp(`^/(${localePattern})`), '') || '/';
    // 返回带语言前缀的路径
    return `/${locale}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`;
  };

  return (
    <header className="bg-white shadow-sm">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link
            href={getLocalizedPath('/')}
            className="text-2xl font-bold text-primary-600"
          >
            Your Company
          </Link>
          
          <div className="flex items-center space-x-4 md:space-x-6">
            {/* Navigation Links */}
            <div className="hidden md:flex space-x-4">
              <Link
                href={getLocalizedPath('/')}
                className="text-gray-700 hover:text-primary-600 transition-colors"
              >
                {t('nav.home')}
              </Link>
              <Link
                href={getLocalizedPath('/about')}
                className="text-gray-700 hover:text-primary-600 transition-colors"
              >
                {t('nav.about')}
              </Link>
              <Link
                href={getLocalizedPath('/pricing')}
                className="text-gray-700 hover:text-primary-600 transition-colors"
              >
                {t('nav.pricing')}
              </Link>
              <Link
                href={getLocalizedPath('/contact')}
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
