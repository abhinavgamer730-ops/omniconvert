import { Metadata } from 'next';
import PasswordGeneratorClient from './client';
import { generateToolMetadata } from '@/lib/seo-config';
import SeoHead from '@/components/SeoHead';

export const metadata: Metadata = generateToolMetadata('password-generator');

export default function PasswordGeneratorPage() {
  return (
    <>
      <SeoHead toolId="password-generator" />
      <PasswordGeneratorClient />
    </>
  );
}
