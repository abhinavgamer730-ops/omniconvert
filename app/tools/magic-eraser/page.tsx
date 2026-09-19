import { Metadata } from 'next';
import MagicEraserClient from './client';
import { generateToolMetadata } from '@/lib/seo-config';
import SeoHead from '@/components/SeoHead';

export const metadata: Metadata = generateToolMetadata('magic-eraser');

export default function MagicEraserPage() {
  return (
    <>
      <SeoHead toolId="magic-eraser" />
      <MagicEraserClient />
    </>
  );
}
