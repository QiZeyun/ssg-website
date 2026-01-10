'use client';

import { Navigation } from './Navigation';
import type { SupportedLocale } from '@/lib/i18n';
import { usePathname } from 'next/navigation';

interface NavigationWrapperProps {
  locale: SupportedLocale;
}

export function NavigationWrapper({ locale }: NavigationWrapperProps) {
  const pathname = usePathname();
  return <Navigation locale={locale} currentPath={pathname || `/${locale}`} />;
}
