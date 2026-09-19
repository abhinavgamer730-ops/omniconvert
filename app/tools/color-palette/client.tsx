'use client';

import React, { useState } from 'react';
import { Palette, Copy, Download, CheckCircle, Image as ImageIcon } from 'lucide-react';
import Dropzone from '@/components/Dropzone';

interface ColorSwatch {
  hex: string;
  rgb: string;
  percentage: number;
}

export default function ColorPaletteClient() {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [palette, setPalette] = useState<ColorSwatch[]>([]);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);

  const handleFilesSelected = (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0];
    setFile(selected);
    const url = URL.createObjectURL(selected);
    setImageUrl(url);
    extractPalette(url);
  };

  const extractPalette = (url: string) => {
    setIsExtracting(true);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = url;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 150;
      canvas.height = 150;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(img, 0, 0, 150, 150);
      const imgData = ctx.getImageData(0, 0, 150, 150).data;

      // Color bucket map
      const colorCounts: Record<string, { count: number; r: number; g: number; b: number }> = {};
      const totalPixels = imgData.length / 4;

      for (let i = 0; i < imgData.length; i += 16) {
        const r = Math.round(imgData[i] / 24) * 24;
        const g = Math.round(imgData[i + 1] / 24) * 24;
        const b = Math.round(imgData[i + 2] / 24) * 24;
        const a = imgData[i + 3];

        if (a < 128) continue; // skip transparent pixels

        const key = `${r},${g},${b}`;
        if (!colorCounts[key]) {
          colorCounts[key] = { count: 0, r, g, b };
        }
        colorCounts[key].count += 1;
      }

      // Sort by frequency
      const sorted = Object.values(colorCounts)
        .sort((a, b) => b.count - a.count)
        .slice(0, 8);

      const swatches: ColorSwatch[] = sorted.map((c) => {
        const hexR = c.r.toString(16).padStart(2, '0');
        const hexG = c.g.toString(16).padStart(2, '0');
        const hexB = c.b.toString(16).padStart(2, '0');
        const hex = `#${hexR}${hexG}${hexB}`;
        const pct = Math.round((c.count / (totalPixels / 4)) * 100);

        return {
          hex,
          rgb: `rgb(${c.r}, ${c.g}, ${c.b})`,
          percentage: pct,
        };
      });

      setPalette(swatches);
      setIsExtracting(false);
    };
  };

  const copyColor = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  const exportCssVars = () => {
    const cssText = palette
      .map((c, i) => `--color-extracted-${i + 1}: ${c.hex};`)
      .join('\n');
    navigator.clipboard.writeText(cssText);
    setCopiedHex('CSS');
    setTimeout(() => setCopiedHex(null), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-400">
            <Palette className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Color Palette Extractor</h1>
            <p className="text-xs text-zinc-400">Extract dominant HEX/RGB color schemes automatically from any uploaded photo.</p>
          </div>
        </div>

        {file && (
          <button
            onClick={() => {
              setFile(null);
              setImageUrl(null);
              setPalette([]);
            }}
            className="px-3 py-1.5 rounded-lg bg-zinc-800 text-xs font-semibold text-zinc-400 hover:text-rose-400 transition-colors"
          >
            Change Photo
          </button>
        )}
      </div>

      {!file ? (
        <div className="max-w-2xl mx-auto">
          <Dropzone
            accept="image/png, image/jpeg, image/webp, image/svg+xml"
            multiple={false}
            onFilesSelected={handleFilesSelected}
            title="Upload Image for Color Palette Extraction"
            subtitle="Drag & drop PNG or JPG photo"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Source Image Display */}
          <div className="lg:col-span-1 space-y-4">
            <div className="rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800 p-4 flex items-center justify-center min-h-[320px]">
              <img src={imageUrl || ''} alt="Source for palette" className="max-h-[360px] object-contain rounded-xl" />
            </div>
          </div>

          {/* Extracted Swatches Grid */}
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-2 border-b border-zinc-800 pb-4">
                <h3 className="text-sm font-bold text-zinc-200">
                  Extracted Palette ({palette.length} Colors)
                </h3>
                {palette.length > 0 && (
                  <button
                    onClick={exportCssVars}
                    className="px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs font-semibold text-zinc-300 hover:text-white transition-colors flex items-center gap-1.5"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedHex === 'CSS' ? 'Copied CSS!' : 'Copy CSS Variables'}</span>
                  </button>
                )}
              </div>

              {/* Swatch Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {palette.map((swatch, idx) => (
                  <div
                    key={idx}
                    onClick={() => copyColor(swatch.hex)}
                    className="group rounded-2xl bg-zinc-950 border border-zinc-800 overflow-hidden cursor-pointer hover:border-zinc-700 transition-all hover:-translate-y-1"
                  >
                    <div
                      className="h-28 w-full flex items-end justify-end p-2 transition-transform group-hover:scale-105"
                      style={{ backgroundColor: swatch.hex }}
                    >
                      <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-black/40 text-white backdrop-blur-md">
                        {swatch.percentage}%
                      </span>
                    </div>
                    <div className="p-3 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold font-mono text-white">{swatch.hex}</p>
                        <p className="text-[10px] text-zinc-500 font-mono">{swatch.rgb}</p>
                      </div>
                      <span className="text-[10px] text-zinc-400 group-hover:text-fuchsia-400">
                        {copiedHex === swatch.hex ? 'Copied!' : 'Copy'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
