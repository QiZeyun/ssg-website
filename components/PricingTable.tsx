'use client';

import { useState } from 'react';
import type { PricingConfig } from '@/configSource/configs/pricing/types';
import { PricingCard } from './PricingCard';
import { useTranslation } from '@/i18n';

interface PricingTableProps {
  config: PricingConfig;
  locale: string;
}

export function PricingTable({ config, locale }: PricingTableProps) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const t = useTranslation(locale);

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {config.productName}
        </h1>
        {config.description && (
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {config.description}
          </p>
        )}
      </div>

      {/* Billing Cycle Toggle */}
      {config.billingCycle === 'both' && (
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-md font-semibold transition-colors ${
                billingCycle === 'monthly'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {t('pricing.monthly')}
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2 rounded-md font-semibold transition-colors ${
                billingCycle === 'yearly'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {t('pricing.yearly')}
            </button>
          </div>
        </div>
      )}

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {config.tiers.map((tier) => (
          <PricingCard
            key={tier.id}
            tier={tier}
            billingCycle={billingCycle}
            locale={locale}
          />
        ))}
      </div>

      {/* FAQ */}
      {config.faq && config.faq.length > 0 && (
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            {t('pricing.faq.title')}
          </h2>
          <div className="space-y-6">
            {config.faq.map((item, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {item.question}
                </h3>
                <p className="text-gray-600">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
