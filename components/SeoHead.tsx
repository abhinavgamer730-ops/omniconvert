import React from 'react';
import { generateSchemaJsonLd } from '@/lib/seo-config';

interface SeoHeadProps {
  toolId?: string;
}

export default function SeoHead({ toolId }: SeoHeadProps) {
  const { webAppSchema, breadcrumbSchema, faqSchema } = generateSchemaJsonLd(toolId);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      {breadcrumbSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}
