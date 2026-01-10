import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { notFound } from 'next/navigation';
import '../globals.css';
import { getGlobalConfig } from '@/configSource/configs/seo';
import { getLocaleConfig, defaultLocale, isSupportedLocale, type SupportedLocale } from '@/i18n';
import { NavigationWrapper } from '@/components/NavigationWrapper';

const inter = Inter({ subsets: ['latin'] });

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return [
    { locale: 'zh' },
    { locale: 'en' },
  ];
}

export async function generateMetadata({ params }: LocaleLayoutProps): Promise<Metadata> {
  const { locale } = await params;
  
  if (!isSupportedLocale(locale)) {
    return {};
  }

  const globalConfig = await getGlobalConfig();
  const baseUrl = globalConfig.siteUrl;
  const localeConfig = getLocaleConfig(locale);
  
  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: globalConfig.siteName,
      template: globalConfig.titleTemplate,
    },
    description: globalConfig.defaultDescription,
    keywords: globalConfig.defaultKeywords,
    authors: globalConfig.authors,
    creator: globalConfig.creator,
    publisher: globalConfig.publisher,
    formatDetection: globalConfig.formatDetection,
    openGraph: {
      ...globalConfig.openGraph,
      locale: localeConfig.code === 'zh' ? 'zh_CN' : 'en_US',
      url: `/${locale}`,
      title: globalConfig.siteName,
      description: globalConfig.defaultDescription,
    },
    twitter: {
      ...globalConfig.twitter,
      title: globalConfig.siteName,
      description: globalConfig.defaultDescription,
      images: [globalConfig.defaultOgImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || globalConfig.verification?.google,
      yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION || globalConfig.verification?.yandex,
      yahoo: process.env.NEXT_PUBLIC_YAHOO_VERIFICATION || globalConfig.verification?.yahoo,
    },
    alternates: {
      languages: {
        'zh': `/${baseUrl}/zh`,
        'en': `/${baseUrl}/en`,
        'x-default': `/${baseUrl}/${defaultLocale}`,
      },
    },
  };
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;
  
  if (!isSupportedLocale(locale)) {
    notFound();
  }

  const localeConfig = getLocaleConfig(locale);

  return (
    <html lang={localeConfig.code} dir={localeConfig.dir}>
      <body className={inter.className}>
        <NavigationWrapper locale={locale as SupportedLocale} />
        {children}
      </body>
    </html>
  );
}
