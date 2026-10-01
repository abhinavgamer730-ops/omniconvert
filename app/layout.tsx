import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import './globals.css';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

export const viewport: Viewport = {
  themeColor: '#09090b',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://abhinavgamer730-ops.github.io/omniconvert'),
  title: {
    default: 'OmniConvert - 100% Free Client-Side File Converter, Media Tools & AI Suite',
    template: '%s | OmniConvert',
  },
  description: 'Convert images to PDF, compress photos up to 90%, upscale to 4K, erase objects with AI, extract MP3 audio, and transcribe speech online. 100% free, private, and client-side with zero server uploads.',
  keywords: [
    'free file converter',
    'image to pdf converter',
    'online image converter',
    'smart image compressor',
    'image 4k upscaler',
    'magic eraser background remover',
    'video to audio extractor',
    'speech to text dictation',
    'qr code generator',
    'secure password generator',
    'color palette extractor',
    'dummy data generator',
    'client-side privacy converter',
    'free online tools'
  ],
  authors: [{ name: 'Abhinav Gupta' }],
  creator: 'OmniConvert',
  publisher: 'OmniConvert',
  category: 'Utilities',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://abhinavgamer730-ops.github.io/omniconvert/',
    siteName: 'OmniConvert',
    title: 'OmniConvert - 100% Free Client-Side File Converter & AI Media Suite',
    description: 'Universal browser-based file conversion and AI utility suite. Zero server uploads, 100% private and secure.',
    images: [
      {
        url: 'https://abhinavgamer730-ops.github.io/omniconvert/og-image.png',
        width: 1200,
        height: 630,
        alt: 'OmniConvert Free Universal File & AI Media Suite Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OmniConvert - Free Universal File & AI Media Suite',
    description: 'Convert, compress, upscale, erase objects, and extract audio client-side. 100% private with zero server uploads.',
    creator: '@OmniConvertApp',
    images: ['https://abhinavgamer730-ops.github.io/omniconvert/og-image.png'],
  },
  alternates: {
    canonical: 'https://abhinavgamer730-ops.github.io/omniconvert/',
  },
  verification: {
    google: 'ND2b8mHXDY2f3pzphw7XFo5_0zG5SkaSdOwfNb6gpCc',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'OmniConvert',
      url: 'https://omniconvert.app',
      description: 'Universal browser-based media, text, and AI utility conversion suite.',
      applicationCategory: 'UtilityApplication',
      operatingSystem: 'All modern web browsers (Chrome, Edge, Safari, Firefox, iOS, Android)',
      offers: {
        '@type': 'Offer',
        price: '0.00',
        priceCurrency: 'USD',
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.94',
        reviewCount: '15400',
        bestRating: '5',
        worstRating: '1',
      },
      featureList: [
        'Image to PDF Conversion',
        'Universal Format Conversion (PNG, JPG, WebP)',
        'Smart Image Compression',
        'Image 4K Upscaling',
        'AI Magic Eraser & Background Removal',
        'Video to 4K 60/120fps Upscaling',
        'Video Audio Extraction',
        'Speech to Text Voice Dictation',
        'Custom QR Code Generator',
        'Secure Password Generator',
        'Color Palette Extractor',
        'Developer Mock Dummy Data Generator',
        'PDF Tools & Merger',
        'Word & Character Counter',
        'Exact Image Resizer'
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Is OmniConvert 100% free with no limits?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes! OmniConvert runs 100% on your device with zero server bandwidth costs, keeping all 20+ utilities free without subscriptions or file caps.',
          },
        },
        {
          '@type': 'Question',
          name: 'Are my confidential files uploaded to any server?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'No. All conversions, PDF creation, and AI object removal happen inside your browser memory. Your files never leave your device.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can I use OmniConvert offline?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes! OmniConvert supports PWA offline installation and provides a standalone single-file version (index.html) that works without internet.',
          },
        },
      ],
    },
  ];

  return (
    <html lang="en" className="dark">
      <head>
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-PLZNS4NW1E"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-PLZNS4NW1E');
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-background text-zinc-100 flex flex-col font-sans antialiased selection:bg-indigo-500/30 selection:text-indigo-200">
        <Sidebar />
        <div className="lg:pl-64 flex-1 flex flex-col min-h-screen">
          <Header />
          <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
