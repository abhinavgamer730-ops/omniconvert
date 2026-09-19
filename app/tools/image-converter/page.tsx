import { Metadata } from 'next';
import ImageConverterClient from './client';
import { generateToolMetadata } from '@/lib/seo-config';
import SeoHead from '@/components/SeoHead';

export const metadata: Metadata = generateToolMetadata('image-converter');

export default function ImageConverterPage() {
  return (
    <>
      <SeoHead toolId="image-converter" />
      <ImageConverterClient />
    </>
  );
}
