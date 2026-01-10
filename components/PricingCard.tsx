'use client';

import type { PricingTier } from '@/dataService';
import Link from 'next/link';
import { useTranslation } from '@/i18n';

interface PricingCardProps {
  tier: PricingTier;
  billingCycle: 'monthly' | 'yearly';
  locale: string;
}

export function PricingCard({ tier, billingCycle, locale }: PricingCardProps) {
  const t = useTranslation(locale);
  
  const price = billingCycle === 'yearly' && tier.price.yearly !== undefined
    ? tier.price.yearly
    : tier.price.monthly;
  
  const pricePerMonth = billingCycle === 'yearly' && tier.price.yearly !== undefined
    ? Math.round(tier.price.yearly / 12)
    : tier.price.monthly;

  const currencySymbols: Record<string, string> = {
    CNY: '¥',
    USD: '$',
    EUR: '€',
  };

  const currencySymbol = currencySymbols[tier.price.currency] || tier.price.currency;
  const isYearlySavings = billingCycle === 'yearly' && tier.price.yearly !== undefined && tier.price.monthly > 0;
  const savings = isYearlySavings ? Math.round((1 - tier.price.yearly! / (tier.price.monthly * 12)) * 100) : 0;

  return (
    <div
      className={`relative bg-white rounded-lg shadow-lg p-8 ${
        tier.recommended || tier.popular
          ? 'border-2 border-primary-600 transform scale-105'
          : 'border border-gray-200'
      }`}
    >
      {/* Badge */}
      {tier.badge && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <span
            className={`px-4 py-1 rounded-full text-sm font-semibold ${
              tier.recommended || tier.popular
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            {tier.badge}
          </span>
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{tier.name}</h3>
        {tier.description && (
          <p className="text-gray-600 text-sm">{tier.description}</p>
        )}
      </div>

      {/* Price */}
      <div className="text-center mb-8">
        <div className="flex items-baseline justify-center">
          <span className="text-5xl font-bold text-gray-900">
            {currencySymbol}
            {pricePerMonth}
          </span>
          <span className="text-gray-600 text-lg ml-2">
            {billingCycle === 'yearly' 
              ? t('pricing.perMonthYearly')
              : t('pricing.perMonth')
            }
          </span>
        </div>
        {billingCycle === 'yearly' && tier.price.yearly !== undefined && (
          <p className="text-gray-500 text-sm mt-2">
            {t('pricing.yearlyLabel')} {currencySymbol}
            {tier.price.yearly}
            {isYearlySavings && savings > 0 && (
              <span className="text-green-600 font-semibold ml-2">
                {t('pricing.savePercent', { percent: savings })}
              </span>
            )}
          </p>
        )}
      </div>

      {/* Features */}
      <ul className="space-y-4 mb-8">
        {tier.features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <span
              className={`flex-shrink-0 mr-3 ${
                feature.included ? 'text-green-500' : 'text-gray-300'
              }`}
            >
              {feature.included ? (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </span>
            <span
              className={`flex-1 ${
                feature.included
                  ? feature.highlighted
                    ? 'text-gray-900 font-semibold'
                    : 'text-gray-700'
                  : 'text-gray-400 line-through'
              }`}
            >
              {feature.name}
            </span>
          </li>
        ))}
      </ul>

      {/* CTA Button */}
      <Link
        href={tier.buttonLink || '/contact'}
        className={`block w-full text-center py-3 px-6 rounded-lg font-semibold transition-colors ${
          tier.recommended || tier.popular
            ? 'bg-primary-600 text-white hover:bg-primary-700'
            : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
        }`}
      >
        {tier.buttonText || t('pricing.getStarted')}
      </Link>
    </div>
  );
}
