import { Metadata } from 'next';
import ColorPaletteClient from './client';
import { generateToolMetadata } from '@/lib/seo-config';
import SeoHead from '@/components/SeoHead';
import ToolSeoSection from '@/components/ToolSeoSection';

export const metadata: Metadata = generateToolMetadata('color-palette');

export default function ColorPalettePage() {
  return (
    <>
      <SeoHead toolId="color-palette" />
      <ColorPaletteClient />
          <ToolSeoSection toolId="color-palette" />
    </>
  );
}
