'use client';

import Link from 'next/link';
import { useTranslation, type SupportedLocale, localeConfigs, supportedLocales } from '@/lib/i18n';

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
    const pathWithoutLocale = normalizedPath.replace(/^\/(zh|en)/, '') || '/';
    // 返回带语言前缀的路径
    return `/${locale}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`;
  };

  // 从当前路径中提取基础路径（去除语言前缀）
  const basePath = currentPath.replace(/^\/(zh|en)/, '') || '/';

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
          
          <div className="flex items-center space-x-6">
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
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 hidden sm:inline">{t('common.language')}:</span>
              {supportedLocales.map((loc) => {
                const isActive = loc === locale;
                const targetPath = `/${loc}${basePath === '/' ? '' : basePath}`;

                return (
                  <Link
                    key={loc}
                    href={targetPath}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary-600 text-white'
                        : 'text-gray-600 hover:text-primary-600 hover:bg-gray-100'
                    }`}
                  >
                    {localeConfigs[loc].nativeName}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
