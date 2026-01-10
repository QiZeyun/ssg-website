import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { notFound } from 'next/navigation';
import '../globals.css';
import { getGlobalConfig } from '@/dataService';
import { getLocaleConfig, defaultLocale, isSupportedLocale, supportedLocales, type SupportedLocale } from '@/i18n';
import { NavigationWrapper } from '@/components/NavigationWrapper';

const inter = Inter({ subsets: ['latin'] });

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return supportedLocales.map((locale) => ({ locale }));
}

/**
 * 生成布局级别的全局 SEO Metadata
 * 
 * @see https://nextjs.org/docs/app/api-reference/functions/generate-metadata
 */
export async function generateMetadata({ params }: LocaleLayoutProps): Promise<Metadata> {
  const { locale } = await params;
  
  if (!isSupportedLocale(locale)) {
    return {};
  }

  const globalConfig = await getGlobalConfig();
  const baseUrl = globalConfig.siteUrl;
  const localeConfig = getLocaleConfig(locale);
  
  // 将 locale 代码转换为 OpenGraph locale 格式
  // 映射规则：zh -> zh_CN, en -> en_US, 其他保持原样
  const ogLocaleMap: Record<SupportedLocale, string> = {
    zh: 'zh_CN',
    en: 'en_US',
  };
  const ogLocale = ogLocaleMap[localeConfig.code] || localeConfig.code;
  
  // 构建多语言替代链接
  const alternatesLanguages: Record<string, string> = {
    'x-default': `${baseUrl}/${defaultLocale}`,
  };
  for (const loc of supportedLocales) {
    alternatesLanguages[loc] = `${baseUrl}/${loc}`;
  }
  
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
      locale: ogLocale,
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
      languages: alternatesLanguages,
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
