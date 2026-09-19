import { Metadata } from 'next';
import ImageToPdfClient from './client';
import { generateToolMetadata } from '@/lib/seo-config';
import SeoHead from '@/components/SeoHead';

export const metadata: Metadata = generateToolMetadata('image-to-pdf');

export default function ImageToPdfPage() {
  return (
    <>
      <SeoHead toolId="image-to-pdf" />
      <ImageToPdfClient />
    </>
  );
}
