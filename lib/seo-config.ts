import { Metadata } from 'next';
import { TOOLS, ToolDefinition } from './tools-config';

export const SITE_CONFIG = {
  name: 'OmniConvert',
  domain: 'omniconvert.app',
  baseUrl: 'https://omniconvert.app',
  defaultDescription: 'Free online client-side utility suite. Convert images to PDF, compress photos, upscale to 4K, erase objects with AI, extract MP3 audio, transcribe speech, and generate QR codes with 100% data privacy.',
  author: 'OmniConvert Team',
  twitterHandle: '@omniconvert',
};

// Common FAQ item schema for rich Google search snippets
export const GLOBAL_FAQS = [
  {
    question: 'Is OmniConvert 100% free to use?',
    answer: 'Yes! OmniConvert is 100% free with zero registration, subscription fees, or hidden file limits.',
  },
  {
    question: 'Are my files or images uploaded to any server?',
    answer: 'No. All file processing, media conversions, PDF creation, and AI object inpainting occur 100% locally inside your web browser. Your data never leaves your device.',
  },
  {
    question: 'Can I use OmniConvert offline?',
    answer: 'Yes! OmniConvert provides a standalone single-file version (index.html) that works completely offline without an internet connection.',
  },
];

/**
 * Automatically generates Next.js Metadata for any tool by ID or default site homepage.
 */
export function generateToolMetadata(toolId?: string): Metadata {
  const tool = toolId ? TOOLS.find((t) => t.id === toolId) : null;

  if (!tool) {
    return {
      title: `${SITE_CONFIG.name} - Free Universal Client-Side Media, Text & AI Suite`,
      description: SITE_CONFIG.defaultDescription,
      keywords: [
        'image to pdf', 'image converter', 'image compressor', '4k upscaler',
        'magic eraser', 'background remover', 'video to audio', 'speech to text',
        'qr generator', 'password generator', 'color palette extractor', 'dummy data generator',
        'word counter', 'exact image resizer', 'age calculator', 'pdf merger', 'pdf splitter',
        'instagram reel downloader', 'youtube video downloader', 'facebook video downloader'
      ],
      authors: [{ name: SITE_CONFIG.author }],
      alternates: {
        canonical: SITE_CONFIG.baseUrl,
      },
      openGraph: {
        title: `${SITE_CONFIG.name} - Universal Online Utility Suite`,
        description: SITE_CONFIG.defaultDescription,
        url: SITE_CONFIG.baseUrl,
        siteName: SITE_CONFIG.name,
        images: [
          {
            url: `${SITE_CONFIG.baseUrl}/api/og?title=${encodeURIComponent(SITE_CONFIG.name)}&desc=${encodeURIComponent('Universal Client-Side Suite')}`,
            width: 1200,
            height: 630,
            alt: `${SITE_CONFIG.name} Banner`,
          },
        ],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${SITE_CONFIG.name} - Universal Online Utility Suite`,
        description: SITE_CONFIG.defaultDescription,
        images: [`${SITE_CONFIG.baseUrl}/api/og?title=${encodeURIComponent(SITE_CONFIG.name)}`],
      },
      robots: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    };
  }

  const pageTitle = `Free ${tool.name} Online | ${SITE_CONFIG.name}`;
  const pageUrl = `${SITE_CONFIG.baseUrl}${tool.href}`;
  const ogImageUrl = `${SITE_CONFIG.baseUrl}/api/og?title=${encodeURIComponent(tool.name)}&desc=${encodeURIComponent(tool.description)}&cat=${encodeURIComponent(tool.category)}`;

  return {
    title: pageTitle,
    description: tool.description,
    keywords: [
      tool.name.toLowerCase(),
      `${tool.name.toLowerCase()} online`,
      `free ${tool.name.toLowerCase()}`,
      `client side ${tool.id}`,
      tool.category.toLowerCase(),
    ],
    authors: [{ name: SITE_CONFIG.author }],
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: pageTitle,
      description: tool.description,
      url: pageUrl,
      siteName: SITE_CONFIG.name,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${tool.name} - ${SITE_CONFIG.name}`,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: tool.description,
      images: [ogImageUrl],
    },
    robots: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  };
}

/**
 * Automatically generates Schema.org JSON-LD microdata objects.
 */
export function generateSchemaJsonLd(toolId?: string) {
  const tool = toolId ? TOOLS.find((t) => t.id === toolId) : null;
  const pageUrl = tool ? `${SITE_CONFIG.baseUrl}${tool.href}` : SITE_CONFIG.baseUrl;

  const webAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: tool ? `${tool.name} - ${SITE_CONFIG.name}` : SITE_CONFIG.name,
    url: pageUrl,
    description: tool ? tool.description : SITE_CONFIG.defaultDescription,
    applicationCategory: tool ? tool.category : 'UtilityApplication',
    operatingSystem: 'Any Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    featureList: TOOLS.map((t) => t.name),
  };

  const breadcrumbSchema = tool
    ? {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: SITE_CONFIG.baseUrl,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: tool.name,
            item: pageUrl,
          },
        ],
      }
    : null;

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: GLOBAL_FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return {
    webAppSchema,
    breadcrumbSchema,
    faqSchema,
  };
}
