import { Metadata } from 'next';
import DummyDataClient from './client';
import { generateToolMetadata } from '@/lib/seo-config';
import SeoHead from '@/components/SeoHead';

export const metadata: Metadata = generateToolMetadata('dummy-data');

export default function DummyDataPage() {
  return (
    <>
      <SeoHead toolId="dummy-data" />
      <DummyDataClient />
    </>
  );
}
