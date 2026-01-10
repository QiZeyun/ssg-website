/**
 * 结构化数据组件（JSON-LD）
 * 用于在页面中嵌入结构化数据，提升 SEO
 */

interface StructuredDataProps {
  data: Record<string, unknown>;
}

export function StructuredData({ data }: StructuredDataProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
