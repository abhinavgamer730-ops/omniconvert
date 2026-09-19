import { Metadata } from 'next';
import InstagramDownloaderClient from './client';
import { generateToolMetadata } from '@/lib/seo-config';
import SeoHead from '@/components/SeoHead';

export const metadata: Metadata = generateToolMetadata('instagram-downloader');

export default function InstagramDownloaderPage() {
  return (
    <>
      <SeoHead toolId="instagram-downloader" />
      <InstagramDownloaderClient />
    </>
  );
}
