'use client';

import { useState, type FormEvent } from 'react';
import { err, ok, type Result } from '@/dataService/result';
import { AppError } from '@/dataService/errors';
import { useTranslation } from '@/i18n';
import type { SupportedLocale } from '@/i18n';

interface ContactFormProps {
  locale: SupportedLocale;
}

type ContactFormData = {
  name: string;
  email: string;
  message: string;
};

async function submitContactForm(data: ContactFormData): Promise<Result<void, AppError>> {
  try {
    // 这里可以调用 API 提交表单
    // const response = await fetch('/api/contact', { ... });

    // 模拟 API 调用
    await new Promise((resolve) => setTimeout(resolve, 1000));
    void data;

    return ok(undefined);
  } catch (cause) {
    return err(
      new AppError({
        code: 'CONTACT_FORM_SUBMIT_FAILED',
        message: 'Failed to submit contact form',
        cause,
      })
    );
  }
}

export function ContactForm({ locale }: ContactFormProps) {
  const t = useTranslation(locale);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    const result = await submitContactForm(formData);

    if (result.ok) {
      setSubmitStatus('success');
      setFormData({ name: '', email: '', message: '' });
      setIsSubmitting(false);
      return;
    }

    setSubmitStatus('error');
    console.error(result.error);
    setIsSubmitting(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          {t('contact.form.name')}
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder={t('contact.form.name')}
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          {t('contact.form.email')}
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder={t('contact.form.email')}
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
          {t('contact.form.message')}
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={6}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder={t('contact.form.message')}
        />
      </div>

      {submitStatus === 'success' && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
          {t('contact.form.success')}
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          {t('contact.form.error')}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? t('contact.form.sending') : t('contact.form.send')}
      </button>
    </form>
  );
}
