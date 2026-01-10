'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation, type SupportedLocale, localeConfigs, supportedLocales } from '@/lib/i18n';

interface LanguageSwitcherProps {
  locale: SupportedLocale;
  currentPath: string;
}

export function LanguageSwitcher({ locale, currentPath }: LanguageSwitcherProps) {
  const t = useTranslation(locale);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 从当前路径中提取基础路径（去除语言前缀）
  // 动态匹配支持的语言代码，支持未来添加更多语言
  const localePattern = supportedLocales.join('|');
  const basePath = currentPath.replace(new RegExp(`^/(${localePattern})`), '') || '/';

  // 点击外部关闭下拉菜单
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen]);

  // ESC 键关闭下拉菜单
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [isOpen]);

  const currentLocaleConfig = localeConfigs[locale];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1.5 md:space-x-2 px-2.5 md:px-3 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-all duration-200 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 shadow-sm hover:shadow"
        aria-label={t('common.language')}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className="hidden md:inline text-gray-600">{t('common.language')}:</span>
        <span className="font-semibold text-primary-600">
          {currentLocaleConfig.nativeName}
        </span>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 flex-shrink-0 ${
            isOpen ? 'transform rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50 max-h-64 overflow-auto">
          {supportedLocales.map((loc) => {
            const isActive = loc === locale;
            const targetPath = `/${loc}${basePath === '/' ? '' : basePath}`;
            const localeConfig = localeConfigs[loc];

            return (
              <Link
                key={loc}
                href={targetPath}
                onClick={() => setIsOpen(false)}
                className={`flex items-center px-4 py-2.5 text-sm transition-colors first:rounded-t-lg last:rounded-b-lg ${
                  isActive
                    ? 'bg-primary-50 text-primary-600 font-semibold'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                aria-label={`Switch to ${localeConfig.name}`}
                aria-current={isActive ? 'page' : undefined}
              >
                <span className="flex-1 font-medium">{localeConfig.nativeName}</span>
                <span className="text-xs text-gray-400 ml-2 hidden sm:inline">{localeConfig.name}</span>
                {isActive && (
                  <svg
                    className="w-4 h-4 text-primary-600 ml-2 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
