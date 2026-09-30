import { Metadata } from 'next';
import YoutubeDownloaderClient from './client';
import { generateToolMetadata } from '@/lib/seo-config';
import SeoHead from '@/components/SeoHead';
import ToolSeoSection from '@/components/ToolSeoSection';

export const metadata: Metadata = generateToolMetadata('youtube-downloader');

export default function YoutubeDownloaderPage() {
  return (
    <>
      <SeoHead toolId="youtube-downloader" />
      <YoutubeDownloaderClient />
          <ToolSeoSection toolId="youtube-downloader" />
    </>
  );
}
