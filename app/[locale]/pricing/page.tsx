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

  // 没有配置时 generateMetadataFromPath 会自动回退到全局默认配置
  // 这里不做 try/catch，保持 fail fast
  return generateMetadataFromPath(basePath, {
    title: t(locale, 'pricing.title'),
    description: t(locale, 'pricing.subtitle'),
  });
}

export default async function PricingPage({ params }: PricingPageProps) {
  const { locale } = await params;
  
  if (!isSupportedLocale(locale)) {
    notFound();
  }

  const config = await getPricingConfig(locale);

  return (
    <main className="min-h-screen bg-gray-50">
      <PricingTable config={config} locale={locale} />
    </main>
  );
}
