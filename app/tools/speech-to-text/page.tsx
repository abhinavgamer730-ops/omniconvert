import { Metadata } from 'next';
import SpeechToTextClient from './client';
import { generateToolMetadata } from '@/lib/seo-config';
import SeoHead from '@/components/SeoHead';
import ToolSeoSection from '@/components/ToolSeoSection';

export const metadata: Metadata = generateToolMetadata('speech-to-text');

export default function SpeechToTextPage() {
  return (
    <>
      <SeoHead toolId="speech-to-text" />
      <SpeechToTextClient />
          <ToolSeoSection toolId="speech-to-text" />
    </>
  );
}
