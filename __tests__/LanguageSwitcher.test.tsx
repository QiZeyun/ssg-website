import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { t } from '@/i18n';

jest.mock('next/link', () => {
  return {
    __esModule: true,
    default: ({
      href,
      children,
      ...props
    }: {
      href: string;
      children: React.ReactNode;
    }) => (
      <a href={href} {...props}>
        {children}
      </a>
    ),
  };
});

describe('LanguageSwitcher', () => {
  it('opens dropdown and closes with Escape', async () => {
    const locale = 'zh';
    const user = userEvent.setup();

    render(<LanguageSwitcher locale={locale} currentPath="/zh/about" />);

    const button = screen.getByRole('button', { name: t(locale, 'common.language') });
    expect(screen.queryByRole('link', { name: /English/ })).not.toBeInTheDocument();

    await user.click(button);
    const englishLink = screen.getByRole('link', { name: /English/ });
    expect(englishLink).toHaveAttribute('href', '/en/about');

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('link', { name: /English/ })).not.toBeInTheDocument();
  });
});

