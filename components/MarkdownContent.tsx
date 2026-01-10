/**
 * Markdown 内容渲染组件
 * 
 * 用于安全地渲染从 Markdown 转换的 HTML 内容
 */

interface MarkdownContentProps {
  /** HTML 内容 */
  content: string;
  /** 额外的 CSS 类名 */
  className?: string;
}

export function MarkdownContent({ content, className = '' }: MarkdownContentProps) {
  return (
    <div
      className={`prose prose-lg max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
