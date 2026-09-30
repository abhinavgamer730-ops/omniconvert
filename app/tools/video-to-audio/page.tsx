import { Metadata } from 'next';
import VideoToAudioClient from './client';
import { generateToolMetadata } from '@/lib/seo-config';
import SeoHead from '@/components/SeoHead';
import ToolSeoSection from '@/components/ToolSeoSection';

export const metadata: Metadata = generateToolMetadata('video-to-audio');

export default function VideoToAudioPage() {
  return (
    <>
      <SeoHead toolId="video-to-audio" />
      <VideoToAudioClient />
          <ToolSeoSection toolId="video-to-audio" />
    </>
  );
}
