import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'OmniConvert - Free Universal Online File & Media Suite',
    short_name: 'OmniConvert',
    description: 'Convert images to PDF, compress photos, upscale to 4K, erase objects, extract audio, and download video streams client-side.',
    start_url: '/',
    display: 'standalone',
    background_color: '#09090b',
    theme_color: '#09090b',
    icons: [
      {
        src: '/icon',
        sizes: 'any',
        type: 'image/png',
      },
    ],
  };
}
