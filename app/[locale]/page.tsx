import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { generateMetadataFromPath } from '@/dataService';
import { t, isSupportedLocale, type SupportedLocale } from '@/i18n';
import { Footer } from '@/components/Footer';

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

/**
 * 生成首页的 SEO Metadata
 * 
 * @see https://nextjs.org/docs/app/api-reference/functions/generate-metadata
 */
export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  return generateMetadataFromPath(`/${locale}`);
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  
  if (!isSupportedLocale(locale)) {
    notFound();
  }

  return (
    <main className="min-h-screen">
      <section className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            {t(locale, 'home.title')}
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            {t(locale, 'home.subtitle')}
          </p>
          <div className="space-x-4">
            <Link
              href={`/${locale}/about`}
              className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
            >
              {t(locale, 'common.learnMore')}
            </Link>
            <Link
              href={`/${locale}/contact`}
              className="inline-block border-2 border-primary-600 text-primary-600 px-6 py-3 rounded-lg hover:bg-primary-50 transition-colors"
            >
              {t(locale, 'common.contactUs')}
            </Link>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">{t(locale, 'home.feature1.title')}</h2>
            <p className="text-gray-600">{t(locale, 'home.feature1.description')}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">{t(locale, 'home.feature2.title')}</h2>
            <p className="text-gray-600">{t(locale, 'home.feature2.description')}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">{t(locale, 'home.feature3.title')}</h2>
            <p className="text-gray-600">{t(locale, 'home.feature3.description')}</p>
          </div>
        </div>
      </section>

      <Footer locale={locale as SupportedLocale} />
    </main>
  );
}
