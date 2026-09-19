import { Metadata } from 'next';
import ExactResizerClient from './client';
import { generateToolMetadata } from '@/lib/seo-config';
import SeoHead from '@/components/SeoHead';

export const metadata: Metadata = generateToolMetadata('exact-resizer');

export default function ExactResizerPage() {
  return (
    <>
      <SeoHead toolId="exact-resizer" />
      <ExactResizerClient />
    </>
  );
}
