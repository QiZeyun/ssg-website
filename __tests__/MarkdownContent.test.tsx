import { render } from '@testing-library/react';
import { MarkdownContent } from '@/components/MarkdownContent';

describe('MarkdownContent', () => {
  it('renders given HTML content', () => {
    const { container } = render(
      <MarkdownContent content="<h1>Hello</h1><p><strong>Bold</strong></p>" />
    );

    expect(container.querySelector('h1')).toHaveTextContent('Hello');
    expect(container.querySelector('strong')).toHaveTextContent('Bold');
  });
});

