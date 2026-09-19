import { Metadata } from 'next';
import AgeCalculatorClient from './client';
import { generateToolMetadata } from '@/lib/seo-config';
import SeoHead from '@/components/SeoHead';

export const metadata: Metadata = generateToolMetadata('age-calculator');

export default function AgeCalculatorPage() {
  return (
    <>
      <SeoHead toolId="age-calculator" />
      <AgeCalculatorClient />
    </>
  );
}
