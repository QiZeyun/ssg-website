import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { generateMetadataFromPath } from '@/configSource/seo';
import { t, isSupportedLocale } from '@/i18n';
import { getDefaultPricingDataSource } from '@/configSource/configs/pricing';
import { PricingTable } from '@/components/PricingTable';

interface PricingPageProps {
  params: Promise<{ locale: string }>;
}

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
    const pricingDataSource = getDefaultPricingDataSource();
    const config = await pricingDataSource.getPricingConfig(locale);

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
            价格配置加载失败
          </h1>
          <p className="text-gray-600">
            请检查配置文件或稍后重试。
          </p>
        </div>
      </main>
    );
  }
}
