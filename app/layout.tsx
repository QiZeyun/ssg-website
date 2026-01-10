import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { getGlobalSeoConfig } from '@/lib/seo';

const inter = Inter({ subsets: ['latin'] });

export async function generateMetadata(): Promise<Metadata> {
  const globalConfig = await getGlobalSeoConfig();
  const baseUrl = globalConfig.siteUrl;
  
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
      url: '/',
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
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
