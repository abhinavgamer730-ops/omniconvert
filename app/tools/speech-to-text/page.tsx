import { Metadata } from 'next';
import SpeechToTextClient from './client';
import { generateToolMetadata } from '@/lib/seo-config';
import SeoHead from '@/components/SeoHead';

export const metadata: Metadata = generateToolMetadata('speech-to-text');

export default function SpeechToTextPage() {
  return (
    <>
      <SeoHead toolId="speech-to-text" />
      <SpeechToTextClient />
    </>
  );
}
