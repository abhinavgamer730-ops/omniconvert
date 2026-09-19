'use client';

import React, { useState, useEffect } from 'react';
import { FileCheck, Download, Sliders, CheckCircle, ArrowDown } from 'lucide-react';
import Dropzone from '@/components/Dropzone';
import BeforeAfterSlider from '@/components/BeforeAfterSlider';

export default function ImageCompressorClient() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [quality, setQuality] = useState<number>(75);
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
  const [compressedSize, setCompressedSize] = useState<number | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);

  const handleFilesSelected = (files: File[]) => {
    if (files.length === 0) return;
    const file = files[0];
    setOriginalFile(file);
    const url = URL.createObjectURL(file);
    setOriginalUrl(url);
  };

  useEffect(() => {
    if (!originalUrl || !originalFile) return;

    let isMounted = true;
    setIsCompressing(true);

    const img = new Image();
    img.src = originalUrl;
    img.onload = () => {
      if (!isMounted) return;

      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        // preserve background if original image was transparent png
        if (originalFile.type === 'image/jpeg') {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        ctx.drawImage(img, 0, 0);
      }

      // Convert quality percentage (1-100) to fraction (0.01 - 1.0)
      const qFraction = quality / 100;
      const outputType = originalFile.type === 'image/png' ? 'image/webp' : originalFile.type;
      const dataUrl = canvas.toDataURL(outputType, qFraction);

      const base64Length = dataUrl.split(',')[1]?.length || 0;
      const sizeInBytes = Math.floor(base64Length * (3 / 4));

      setCompressedUrl(dataUrl);
      setCompressedSize(sizeInBytes);
      setIsCompressing(false);
    };

    return () => {
      isMounted = false;
    };
  }, [originalUrl, originalFile, quality]);

  const downloadCompressed = () => {
    if (!compressedUrl || !originalFile) return;
    const ext = originalFile.name.substring(originalFile.name.lastIndexOf('.')) || '.jpg';
    const baseName = originalFile.name.substring(0, originalFile.name.lastIndexOf('.'));
    const downloadName = `${baseName}-compressed-${quality}pct${ext}`;

    const a = document.createElement('a');
    a.href = compressedUrl;
    a.download = downloadName;
    a.click();
  };

  const savedPercentage =
    originalFile && compressedSize
      ? Math.round(((originalFile.size - compressedSize) / originalFile.size) * 100)
      : 0;

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <FileCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Smart Image Compressor</h1>
            <p className="text-xs text-zinc-400">Compress image file sizes with real-time quality preview and instant savings calculation.</p>
          </div>
        </div>

        {originalFile && (
          <button
            onClick={() => {
              setOriginalFile(null);
              setOriginalUrl(null);
              setCompressedUrl(null);
            }}
            className="px-3 py-1.5 rounded-lg bg-zinc-800 text-xs font-semibold text-zinc-400 hover:text-rose-400 transition-colors"
          >
            Change Image
          </button>
        )}
      </div>

      {!originalFile ? (
        <div className="max-w-2xl mx-auto">
          <Dropzone
            accept="image/png, image/jpeg, image/webp"
            multiple={false}
            onFilesSelected={handleFilesSelected}
            title="Upload Image to Compress"
            subtitle="Select a PNG, JPG, or WebP photo to reduce file size"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Visual Comparison Slider */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between text-xs font-medium text-zinc-400 px-1">
              <span>Interactive Split Comparison (Drag divider left/right)</span>
              {isCompressing && <span className="text-purple-400 animate-pulse">Calculating size...</span>}
            </div>

            {originalUrl && compressedUrl && (
              <BeforeAfterSlider
                originalImage={originalUrl}
                processedImage={compressedUrl}
                originalLabel={`Original (${(originalFile.size / 1024).toFixed(1)} KB)`}
                processedLabel={`Compressed (${((compressedSize || 0) / 1024).toFixed(1)} KB)`}
              />
            )}
          </div>

          {/* Controls & Metrics Panel */}
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-6">
              <h3 className="text-sm font-bold text-zinc-200 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-purple-400" />
                <span>Compression Controls</span>
              </h3>

              {/* Savings Badge */}
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-400 font-medium">Estimated New Size</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${savedPercentage > 0 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-zinc-800 text-zinc-400'}`}>
                    {savedPercentage > 0 ? `-${savedPercentage}% Saved` : '0%'}
                  </span>
                </div>

                <div className="flex items-baseline justify-between pt-1">
                  <div>
                    <p className="text-[10px] text-zinc-500 uppercase font-mono">Original</p>
                    <p className="text-sm font-semibold text-zinc-300">{(originalFile.size / 1024).toFixed(1)} KB</p>
                  </div>
                  <ArrowDown className="w-4 h-4 text-purple-400" />
                  <div className="text-right">
                    <p className="text-[10px] text-purple-400 uppercase font-mono font-bold">Compressed</p>
                    <p className="text-lg font-bold text-white">
                      {compressedSize ? (compressedSize / 1024).toFixed(1) : '...'} KB
                    </p>
                  </div>
                </div>
              </div>

              {/* Quality Slider */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-zinc-300">Compression Quality</label>
                  <span className="text-xs font-mono font-bold text-purple-400">{quality}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="95"
                  step="1"
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full accent-purple-500 cursor-pointer"
                />

                {/* Preset Quality Buttons */}
                <div className="grid grid-cols-4 gap-1.5 mt-3">
                  {[
                    { label: 'Max', val: 30 },
                    { label: 'High', val: 50 },
                    { label: 'Medium', val: 75 },
                    { label: 'Low', val: 90 },
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      onClick={() => setQuality(preset.val)}
                      className={`py-1 rounded-lg text-[11px] font-semibold border ${
                        quality === preset.val
                          ? 'bg-purple-600/30 text-purple-300 border-purple-500'
                          : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:bg-zinc-900'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Download CTA Button */}
              <button
                onClick={downloadCompressed}
                disabled={!compressedUrl || isCompressing}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xs shadow-glow-sm hover:shadow-glow-md disabled:opacity-40 transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Download Compressed Image</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
