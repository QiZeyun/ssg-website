import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { generateMetadataFromPath, getPricingConfig } from '@/dataService';
import { t, isSupportedLocale } from '@/i18n';
import { PricingTable } from '@/components/PricingTable';

interface PricingPageProps {
  params: Promise<{ locale: string }>;
}

/**
 * 生成定价页面的 SEO Metadata
 * 
 * @see https://nextjs.org/docs/app/api-reference/functions/generate-metadata
 */
export async function generateMetadata({ params }: PricingPageProps): Promise<Metadata> {
  const { locale } = await params;
  const basePath = `/${locale}/pricing`;
  
  // 尝试获取定价页面的 SEO 配置，如果没有则使用默认配置
  try {
    return generateMetadataFromPath(basePath);
  } catch {
    return {
      title: t(locale, 'pricing.title'),
      description: t(locale, 'pricing.subtitle'),
    };
  }
}

export default async function PricingPage({ params }: PricingPageProps) {
  const { locale } = await params;
  
  if (!isSupportedLocale(locale)) {
    notFound();
  }

  try {
    const config = await getPricingConfig(locale);

    return (
      <main className="min-h-screen bg-gray-50">
        <PricingTable config={config} locale={locale} />
      </main>
    );
  } catch (error) {
    console.error('Failed to load pricing config:', error);
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t(locale, 'pricing.loadError.title')}
          </h1>
          <p className="text-gray-600">
            {t(locale, 'pricing.loadError.description')}
          </p>
        </div>
      </main>
    );
  }
}
