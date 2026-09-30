import { Metadata } from 'next';
import VideoUpscalerClient from './client';
import { generateToolMetadata } from '@/lib/seo-config';
import SeoHead from '@/components/SeoHead';
import ToolSeoSection from '@/components/ToolSeoSection';

export const metadata: Metadata = generateToolMetadata('video-upscaler');

export default function VideoUpscalerPage() {
  return (
    <>
      <SeoHead toolId="video-upscaler" />
      <VideoUpscalerClient />
          <ToolSeoSection toolId="video-upscaler" />
    </>
  );
}
