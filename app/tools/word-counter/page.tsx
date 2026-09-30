import { Metadata } from 'next';
import WordCounterClient from './client';
import { generateToolMetadata } from '@/lib/seo-config';
import SeoHead from '@/components/SeoHead';
import ToolSeoSection from '@/components/ToolSeoSection';

export const metadata: Metadata = generateToolMetadata('word-counter');

export default function WordCounterPage() {
  return (
    <>
      <SeoHead toolId="word-counter" />
      <WordCounterClient />
          <ToolSeoSection toolId="word-counter" />
    </>
  );
}
