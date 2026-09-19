import { Metadata } from 'next';
import ImageUpscalerClient from './client';
import { generateToolMetadata } from '@/lib/seo-config';
import SeoHead from '@/components/SeoHead';

export const metadata: Metadata = generateToolMetadata('image-upscaler');

export default function ImageUpscalerPage() {
  return (
    <>
      <SeoHead toolId="image-upscaler" />
      <ImageUpscalerClient />
    </>
  );
}
