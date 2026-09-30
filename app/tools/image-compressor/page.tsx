import { Metadata } from 'next';
import ImageCompressorClient from './client';
import { generateToolMetadata } from '@/lib/seo-config';
import SeoHead from '@/components/SeoHead';
import ToolSeoSection from '@/components/ToolSeoSection';

export const metadata: Metadata = generateToolMetadata('image-compressor');

export default function ImageCompressorPage() {
  return (
    <>
      <SeoHead toolId="image-compressor" />
      <ImageCompressorClient />
          <ToolSeoSection toolId="image-compressor" />
    </>
  );
}
