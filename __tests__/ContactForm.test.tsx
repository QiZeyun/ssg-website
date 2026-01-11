import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContactForm } from '@/components/ContactForm';
import { t } from '@/i18n';

describe('ContactForm', () => {
  it('submits successfully and resets the form', async () => {
    jest.useFakeTimers();
    const locale = 'en';
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    render(<ContactForm locale={locale} />);

    await user.type(screen.getByLabelText(t(locale, 'contact.form.name')), 'Alice');
    await user.type(screen.getByLabelText(t(locale, 'contact.form.email')), 'alice@example.com');
    await user.type(screen.getByLabelText(t(locale, 'contact.form.message')), 'Hello');

    await user.click(screen.getByRole('button', { name: t(locale, 'contact.form.send') }));
    expect(screen.getByRole('button', { name: t(locale, 'contact.form.sending') })).toBeDisabled();

    await act(async () => {
      jest.advanceTimersByTime(1000);
    });

    expect(screen.getByText(t(locale, 'contact.form.success'))).toBeInTheDocument();
    expect(screen.getByLabelText(t(locale, 'contact.form.name'))).toHaveValue('');
    expect(screen.getByLabelText(t(locale, 'contact.form.email'))).toHaveValue('');
    expect(screen.getByLabelText(t(locale, 'contact.form.message'))).toHaveValue('');

    jest.useRealTimers();
  });
});

