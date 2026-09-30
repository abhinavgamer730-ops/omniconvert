import { Metadata } from 'next';
import QrGeneratorClient from './client';
import { generateToolMetadata } from '@/lib/seo-config';
import SeoHead from '@/components/SeoHead';
import ToolSeoSection from '@/components/ToolSeoSection';

export const metadata: Metadata = generateToolMetadata('qr-generator');

export default function QrGeneratorPage() {
  return (
    <>
      <SeoHead toolId="qr-generator" />
      <QrGeneratorClient />
          <ToolSeoSection toolId="qr-generator" />
    </>
  );
}
