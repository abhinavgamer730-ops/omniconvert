'use client';

import React, { useState } from 'react';
import { Sparkles, Download, SlidersHorizontal, Key, CheckCircle, AlertCircle, RefreshCw, Layers } from 'lucide-react';
import Dropzone from '@/components/Dropzone';
import BeforeAfterSlider from '@/components/BeforeAfterSlider';
import { upscaleImage, UpscaleRequest } from '@/lib/api/upscale';

export default function ImageUpscalerClient() {
  const [file, setFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [scale, setScale] = useState<2 | 4 | 8>(4);
  const [upscaledUrl, setUpscaledUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
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
    setError(null);
  };

  const handleUpscale = async () => {
    if (!originalUrl) return;
    setIsProcessing(true);
    setError(null);
    setStatusText('Analyzing source pixels & preparing 4K canvas...');

    try {
      setTimeout(() => {
        setStatusText('Applying high-order bicubic interpolation & micro-contrast...');
      }, 350);

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
      } else {
        setError(result.error || 'Failed to upscale image. Please try a different photo.');
      }
    } catch (err: any) {
      console.error('Upscaling failed:', err);
      setError(err?.message || 'Unexpected error while upscaling. Please try again.');
    } finally {
      setIsProcessing(false);
      setStatusText('');
    }
  };

  const downloadUpscaled = () => {
    if (!upscaledUrl || !file) return;
    const a = document.createElement('a');
    a.href = upscaledUrl;
    a.download = `${file.name.replace(/\.[^/.]+$/, '')}-4k-upscaled-${scale}x.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shadow-glow-sm">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white">Image to 4K Upscaler</h1>
              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                4K Ultra HD
              </span>
            </div>
            <p className="text-xs text-zinc-400">Enhance resolution, detail, and sharpness up to 4K (3840px) with interactive Before/After comparison slider.</p>
          </div>
        </div>

        {file && (
          <button
            onClick={() => {
              setFile(null);
              setOriginalUrl(null);
              setUpscaledUrl(null);
              setError(null);
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
            subtitle="Drag & drop any PNG, JPG, or WebP photo to enhance resolution"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Visual Slider Area */}
          <div className="lg:col-span-2 space-y-4">
            {originalUrl && upscaledUrl ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-medium text-zinc-400 px-1">
                  <span>Interactive Split Comparison (Drag handle left/right)</span>
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
                  processedLabel={`4K Enhanced (${scale}x)`}
                />
              </div>
            ) : (
              <div className="h-[400px] rounded-2xl bg-zinc-950 border border-zinc-800 flex flex-col items-center justify-center p-6 text-center">
                <img
                  src={originalUrl || ''}
                  alt="Original Preview"
                  className="max-h-64 object-contain rounded-xl mb-4"
                />
                <p className="text-xs text-zinc-400">Click &quot;Upscale Photo to 4K&quot; on the right to enhance resolution</p>
              </div>
            )}

            {error && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Upscale Controls */}
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-6">
              <h3 className="text-sm font-bold text-zinc-200 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-amber-400" />
                <span>4K Resolution Settings</span>
              </h3>

              {/* Scale Multiplier */}
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-2">Resolution Multiplier</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { factor: 2, label: '2x (Full HD)' },
                    { factor: 4, label: '4x (Ultra HD 4K)' },
                    { factor: 8, label: '8x (Max Res)' },
                  ].map((item) => (
                    <button
                      key={item.factor}
                      onClick={() => setScale(item.factor as any)}
                      className={`py-2.5 px-2 rounded-xl text-xs font-bold border transition-all text-center ${
                        scale === item.factor
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500 shadow-glow-sm'
                          : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:bg-zinc-900'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Optional Cloud AI Integration */}
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-amber-400" />
                    <span>Cloud AI API (Optional)</span>
                  </span>
                  <button
                    onClick={() => setShowApiInput(!showApiInput)}
                    className="text-[10px] font-semibold text-amber-400 hover:underline"
                  >
                    {showApiInput ? 'Hide' : 'Add API Key'}
                  </button>
                </div>

                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Fast client-side 4K super-resolution is enabled by default with zero limits. You can optionally connect a Replicate (Real-ESRGAN) API key below.
                </p>

                {showApiInput && (
                  <input
                    type="password"
                    placeholder="Enter Replicate API token (r8_...)..."
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
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-zinc-950 font-bold text-xs shadow-glow-sm hover:shadow-glow-md disabled:opacity-40 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
                <span>{isProcessing ? (statusText || 'Enhancing to 4K...') : `Upscale Photo (${scale}x)`}</span>
              </button>

              {/* Download Button */}
              {upscaledUrl && (
                <button
                  onClick={downloadUpscaled}
                  className="w-full py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download 4K Photo {stats ? `(${stats.new})` : ''}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
