import { Metadata } from 'next';
import FacebookDownloaderClient from './client';
import { generateToolMetadata } from '@/lib/seo-config';
import SeoHead from '@/components/SeoHead';

export const metadata: Metadata = generateToolMetadata('facebook-downloader');

export default function FacebookDownloaderPage() {
  return (
    <>
      <SeoHead toolId="facebook-downloader" />
      <FacebookDownloaderClient />
    </>
  );
}
