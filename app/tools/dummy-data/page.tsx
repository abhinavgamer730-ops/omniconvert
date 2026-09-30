import { Metadata } from 'next';
import DummyDataClient from './client';
import { generateToolMetadata } from '@/lib/seo-config';
import SeoHead from '@/components/SeoHead';
import ToolSeoSection from '@/components/ToolSeoSection';

export const metadata: Metadata = generateToolMetadata('dummy-data');

export default function DummyDataPage() {
  return (
    <>
      <SeoHead toolId="dummy-data" />
      <DummyDataClient />
          <ToolSeoSection toolId="dummy-data" />
    </>
  );
}
