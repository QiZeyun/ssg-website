import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { generateMetadataFromPath } from '@/dataService';
import { t, isSupportedLocale } from '@/i18n';

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

      <footer className="bg-gray-800 text-white mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link href={`/${locale}/about`} className="hover:text-primary-400">
                    {t(locale, 'nav.about')}
                  </Link>
                </li>
                <li>
                  <Link href={`/${locale}/contact`} className="hover:text-primary-400">
                    {t(locale, 'nav.contact')}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href={`/${locale}/privacy`} className="hover:text-primary-400">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href={`/${locale}/terms`} className="hover:text-primary-400">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
              <div className="space-y-2">
                <p>Social media links here</p>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center">
            <p>&copy; {new Date().getFullYear()} Your Company Name. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
