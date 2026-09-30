import { Metadata } from 'next';
import PasswordGeneratorClient from './client';
import { generateToolMetadata } from '@/lib/seo-config';
import SeoHead from '@/components/SeoHead';
import ToolSeoSection from '@/components/ToolSeoSection';

export const metadata: Metadata = generateToolMetadata('password-generator');

export default function PasswordGeneratorPage() {
  return (
    <>
      <SeoHead toolId="password-generator" />
      <PasswordGeneratorClient />
          <ToolSeoSection toolId="password-generator" />
    </>
  );
}
