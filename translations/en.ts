/**
 * 英文翻译
 * 此文件必须遵循 zh.ts 中定义的键结构
 */

import type { TranslationDictionary } from './index';

// 使用类型约束确保结构与中文翻译一致（值类型为 string，不要求与中文相同）
export const en: TranslationDictionary = {
  nav: {
    home: 'Home',
    about: 'About',
    pricing: 'Pricing',
    contact: 'Contact',
  },
  common: {
    learnMore: 'Learn More',
    getStarted: 'Get Started',
    contactUs: 'Contact Us',
    language: 'Language',
    author: 'Author',
    lastUpdated: 'Last Updated',
    companyName: 'Your Company Name',
    allRightsReserved: 'All rights reserved',
  },
  footer: {
    company: 'Company',
    legal: 'Legal',
    privacyPolicy: 'Privacy Policy',
    termsOfService: 'Terms of Service',
    followUs: 'Follow Us',
    socialMediaLinks: 'Social media links',
  },
  home: {
    title: 'Welcome to Your Company',
    subtitle: 'We provide innovative solutions for your business needs. Explore our services and discover how we can help you succeed.',
    feature1: {
      title: 'Feature 1',
      description: 'Description of your first feature or service.',
    },
    feature2: {
      title: 'Feature 2',
      description: 'Description of your second feature or service.',
    },
    feature3: {
      title: 'Feature 3',
      description: 'Description of your third feature or service.',
    },
  },
  contact: {
    title: 'Contact Us',
    subtitle: 'Have a question or want to work with us? Fill out the form below and we\'ll get back to you as soon as possible.',
    form: {
      name: 'Name',
      email: 'Email',
      message: 'Message',
      send: 'Send Message',
      sending: 'Sending...',
      success: 'Thank you for your message! We\'ll get back to you soon.',
      error: 'Something went wrong. Please try again later.',
    },
    otherWays: 'Other Ways to Reach Us',
    email: 'Email',
    phone: 'Phone',
    address: 'Address',
    emailAddress: 'contact@example.com',
    phoneNumber: '+1 (555) 123-4567',
    addressDetail: '123 Business St, City, State 12345',
  },
  pricing: {
    title: 'Pricing',
    subtitle: 'Choose the plan that fits your needs',
    monthly: 'Monthly',
    yearly: 'Yearly',
    save: 'Save',
    perMonth: '/month',
    perMonthYearly: '/month (billed yearly)',
    yearlyLabel: 'Yearly',
    yearlyBilled: 'Yearly',
    savePercent: 'Save {{percent}}%',
    getStarted: 'Get Started',
    faq: {
      title: 'Frequently Asked Questions',
    },
    loadError: {
      title: 'Failed to load pricing',
      description: 'Please check the configuration or try again later.',
    },
  },
};
