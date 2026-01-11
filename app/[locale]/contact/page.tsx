import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { generateMetadataFromPath } from '@/dataService';
import { t, isSupportedLocale, type SupportedLocale } from '@/i18n';
import { ContactForm } from '@/components/ContactForm';
import { Footer } from '@/components/Footer';

interface ContactPageProps {
  params: Promise<{ locale: string }>;
}

/**
 * 生成联系页面的 SEO Metadata
 * 
 * @see https://nextjs.org/docs/app/api-reference/functions/generate-metadata
 */
export async function generateMetadata({ params }: ContactPageProps): Promise<Metadata> {
  const { locale } = await params;
  return generateMetadataFromPath(`/${locale}/contact`);
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale } = await params;
  
  if (!isSupportedLocale(locale)) {
    notFound();
  }

  return (
    <main className="min-h-screen">
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            {t(locale, 'contact.title')}
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            {t(locale, 'contact.subtitle')}
          </p>

          <ContactForm locale={locale} />

          <div className="mt-12 p-6 bg-gray-50 rounded-lg">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              {t(locale, 'contact.otherWays')}
            </h2>
            <div className="space-y-2 text-gray-700">
              <p>
                <strong>{t(locale, 'contact.email')}:</strong> {t(locale, 'contact.emailAddress')}
              </p>
              <p>
                <strong>{t(locale, 'contact.phone')}:</strong> {t(locale, 'contact.phoneNumber')}
              </p>
              <p>
                <strong>{t(locale, 'contact.address')}:</strong> {t(locale, 'contact.addressDetail')}
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer locale={locale as SupportedLocale} />
    </main>
  );
}
