import { Metadata } from 'next';
import MagicEraserClient from './client';
import { generateToolMetadata } from '@/lib/seo-config';
import SeoHead from '@/components/SeoHead';
import ToolSeoSection from '@/components/ToolSeoSection';

export const metadata: Metadata = generateToolMetadata('magic-eraser');

export default function MagicEraserPage() {
  return (
    <>
      <SeoHead toolId="magic-eraser" />
      <MagicEraserClient />
          <ToolSeoSection toolId="magic-eraser" />
    </>
  );
}
