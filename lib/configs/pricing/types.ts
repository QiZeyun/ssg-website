/**
 * 产品价格配置类型定义
 */

/**
 * 产品权益/功能项
 */
export interface PricingFeature {
  /** 功能名称 */
  name: string;
  /** 是否包含此功能 */
  included: boolean;
  /** 是否推荐（高亮显示） */
  highlighted?: boolean;
}

/**
 * 产品版本/套餐
 */
export interface PricingTier {
  /** 版本 ID */
  id: string;
  /** 版本名称 */
  name: string;
  /** 版本描述 */
  description?: string;
  /** 价格（月付，单位：元/美元） */
  price: {
    /** 月付价格 */
    monthly: number;
    /** 年付价格（可选） */
    yearly?: number;
    /** 货币单位 */
    currency: 'CNY' | 'USD' | 'EUR';
  };
  /** 是否推荐（默认套餐） */
  recommended?: boolean;
  /** 是否热销 */
  popular?: boolean;
  /** 价格标签（如 "免费"、"限时优惠" 等） */
  badge?: string;
  /** 权益列表 */
  features: PricingFeature[];
  /** 按钮文字 */
  buttonText?: string;
  /** 按钮链接 */
  buttonLink?: string;
}

/**
 * 产品价格配置
 */
export interface PricingConfig {
  /** 产品名称 */
  productName: string;
  /** 产品描述 */
  description?: string;
  /** 定价周期选项 */
  billingCycle?: 'monthly' | 'yearly' | 'both';
  /** 版本列表 */
  tiers: PricingTier[];
  /** 常见问题（可选） */
  faq?: Array<{
    question: string;
    answer: string;
  }>;
}

/**
 * 多语言产品价格配置
 */
export interface LocalizedPricingConfig {
  [locale: string]: PricingConfig;
}
