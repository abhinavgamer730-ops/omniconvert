import { Metadata } from 'next';
import PdfCompressorClient from './client';
import { generateToolMetadata } from '@/lib/seo-config';
import SeoHead from '@/components/SeoHead';
import ToolSeoSection from '@/components/ToolSeoSection';

export const metadata: Metadata = generateToolMetadata('pdf-compressor');

export default function PdfCompressorPage() {
  return (
    <>
      <SeoHead toolId="pdf-compressor" />
      <PdfCompressorClient />
      <ToolSeoSection toolId="pdf-compressor" />
    </>
  );
}
