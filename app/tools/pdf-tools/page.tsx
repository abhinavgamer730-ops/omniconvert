import { Metadata } from 'next';
import PdfToolsClient from './client';
import { generateToolMetadata } from '@/lib/seo-config';
import SeoHead from '@/components/SeoHead';
import ToolSeoSection from '@/components/ToolSeoSection';

export const metadata: Metadata = generateToolMetadata('pdf-tools');

export default function PdfToolsPage() {
  return (
    <>
      <SeoHead toolId="pdf-tools" />
      <PdfToolsClient />
          <ToolSeoSection toolId="pdf-tools" />
    </>
  );
}
