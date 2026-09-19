'use client';

import React, { useState } from 'react';
import { Sparkles, Download, SlidersHorizontal, Key, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import Dropzone from '@/components/Dropzone';
import BeforeAfterSlider from '@/components/BeforeAfterSlider';
import { upscaleImage, UpscaleRequest } from '@/lib/api/upscale';

export default function ImageUpscalerClient() {
  const [file, setFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [scale, setScale] = useState<2 | 4 | 8>(4);
  const [upscaledUrl, setUpscaledUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showApiInput, setShowApiInput] = useState(false);
  const [stats, setStats] = useState<{ orig: string; new: string; time: number } | null>(null);

  const handleFilesSelected = (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0];
    setFile(selected);
    const url = URL.createObjectURL(selected);
    setOriginalUrl(url);
    setUpscaledUrl(null);
    setStats(null);
  };

  const handleUpscale = async () => {
    if (!originalUrl) return;
    setIsProcessing(true);

    try {
      const request: UpscaleRequest = {
        image: originalUrl,
        scale,
        apiKey: apiKey.trim() || undefined,
      };

      const result = await upscaleImage(request);

      if (result.success && result.upscaledImageUrl) {
        setUpscaledUrl(result.upscaledImageUrl);
        if (result.originalDimensions && result.newDimensions) {
          setStats({
            orig: `${result.originalDimensions.width}x${result.originalDimensions.height}`,
            new: `${result.newDimensions.width}x${result.newDimensions.height}`,
            time: result.processingTimeMs || 0,
          });
        }
      }
    } catch (err) {
      console.error('Upscaling failed:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadUpscaled = () => {
    if (!upscaledUrl || !file) return;
    const a = document.createElement('a');
    a.href = upscaledUrl;
    a.download = `${file.name.replace(/\.[^/.]+$/, '')}-upscaled-${scale}x.png`;
    a.click();
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white">Image to 4K Upscaler</h1>
              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                AI Powered
              </span>
            </div>
            <p className="text-xs text-zinc-400">Enhance clarity and upscale resolution up to 4K with interactive Before/After comparison.</p>
          </div>
        </div>

        {file && (
          <button
            onClick={() => {
              setFile(null);
              setOriginalUrl(null);
              setUpscaledUrl(null);
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
            accept="image/png, image/jpeg, image/webp"
            multiple={false}
            onFilesSelected={handleFilesSelected}
            title="Upload Image for 4K Upscaling"
            subtitle="Drag & drop PNG or JPG images to enhance resolution"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Visual Slider Area */}
          <div className="lg:col-span-2 space-y-4">
            {originalUrl && upscaledUrl ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-medium text-zinc-400 px-1">
                  <span>Split Screen Comparison (Drag center handle)</span>
                  {stats && (
                    <span className="text-emerald-400 font-mono">
                      {stats.orig} → {stats.new} ({stats.time}ms)
                    </span>
                  )}
                </div>
                <BeforeAfterSlider
                  originalImage={originalUrl}
                  processedImage={upscaledUrl}
                  originalLabel="Original Image"
                  processedLabel={`Upscaled ${scale}x (High Res)`}
                />
              </div>
            ) : (
              <div className="h-[400px] rounded-2xl bg-zinc-950 border border-zinc-800 flex flex-col items-center justify-center p-6 text-center">
                <img
                  src={originalUrl || ''}
                  alt="Original Preview"
                  className="max-h-64 object-contain rounded-xl mb-4"
                />
                <p className="text-xs text-zinc-400">Click "Upscale Image" to generate high-resolution output</p>
              </div>
            )}
          </div>

          {/* Upscale Controls & API Stub Settings */}
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-6">
              <h3 className="text-sm font-bold text-zinc-200 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-amber-400" />
                <span>Upscale Settings</span>
              </h3>

              {/* Scale Multiplier */}
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-2">Scale Factor</label>
                <div className="grid grid-cols-3 gap-2">
                  {([2, 4, 8] as const).map((factor) => (
                    <button
                      key={factor}
                      onClick={() => setScale(factor)}
                      className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${
                        scale === factor
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500 shadow-glow-sm'
                          : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:bg-zinc-900'
                      }`}
                    >
                      {factor}x Scale
                    </button>
                  ))}
                </div>
              </div>

              {/* Backend API Integration Option (Stubbed for Replicate/Stability AI) */}
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-amber-400" />
                    <span>API Integration Stub</span>
                  </span>
                  <button
                    onClick={() => setShowApiInput(!showApiInput)}
                    className="text-[10px] font-semibold text-indigo-400 hover:underline"
                  >
                    {showApiInput ? 'Hide' : 'Configure API Key'}
                  </button>
                </div>

                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  By default, local high-quality Canvas upscaling simulation is used. You can provide an API Key for Replicate/Stability AI below.
                </p>

                {showApiInput && (
                  <input
                    type="password"
                    placeholder="Enter Replicate / Stability API key..."
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                  />
                )}
              </div>

              {/* Upscale CTA Button */}
              <button
                onClick={handleUpscale}
                disabled={isProcessing}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-zinc-950 font-bold text-xs shadow-glow-sm hover:shadow-glow-md disabled:opacity-40 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
                <span>{isProcessing ? 'Enhancing Image...' : `Upscale ${scale}x Now`}</span>
              </button>

              {/* Download Button */}
              {upscaledUrl && (
                <button
                  onClick={downloadUpscaled}
                  className="w-full py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download 4K Upscaled Image</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
