'use client';

import React, { useState, useEffect } from 'react';
import { Crop, Download, Lock, Unlock, CheckCircle, FileCheck, RefreshCw, Sliders } from 'lucide-react';
import Dropzone from '@/components/Dropzone';

export default function ExactResizerClient() {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [originalWidth, setOriginalWidth] = useState<number>(0);
  const [originalHeight, setOriginalHeight] = useState<number>(0);

  // Resize settings
  const [targetWidth, setTargetWidth] = useState<number>(300);
  const [targetHeight, setTargetHeight] = useState<number>(300);
  const [lockAspectRatio, setLockAspectRatio] = useState<boolean>(true);
  const [enableSizeLimit, setEnableSizeLimit] = useState<boolean>(false);
  const [maxKbLimit, setMaxKbLimit] = useState<number>(50); // e.g. < 50KB
  const [outputFormat, setOutputFormat] = useState<'jpeg' | 'png' | 'webp'>('jpeg');

  // Result state
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  const [processedSizeBytes, setProcessedSizeBytes] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleFilesSelected = (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0];
    setFile(selected);
    const url = URL.createObjectURL(selected);
    setImageUrl(url);
    setProcessedUrl(null);

    const img = new Image();
    img.src = url;
    img.onload = () => {
      setOriginalWidth(img.naturalWidth);
      setOriginalHeight(img.naturalHeight);
      setTargetWidth(img.naturalWidth);
      setTargetHeight(img.naturalHeight);
    };
  };

  const handleWidthChange = (val: number) => {
    setTargetWidth(val);
    if (lockAspectRatio && originalWidth > 0 && originalHeight > 0) {
      const ratio = originalHeight / originalWidth;
      setTargetHeight(Math.round(val * ratio));
    }
  };

  const handleHeightChange = (val: number) => {
    setTargetHeight(val);
    if (lockAspectRatio && originalWidth > 0 && originalHeight > 0) {
      const ratio = originalWidth / originalHeight;
      setTargetWidth(Math.round(val * ratio));
    }
  };

  const applyPreset = (w: number, h: number, kbLimit?: number) => {
    setTargetWidth(w);
    setTargetHeight(h);
    setLockAspectRatio(false);
    if (kbLimit) {
      setEnableSizeLimit(true);
      setMaxKbLimit(kbLimit);
    }
  };

  const handleProcessResize = async () => {
    if (!imageUrl) return;
    setIsProcessing(true);

    try {
      const img = new Image();
      img.src = imageUrl;
      await new Promise(r => (img.onload = r));

      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, targetWidth);
      canvas.height = Math.max(1, targetHeight);
      const ctx = canvas.getContext('2d');

      if (!ctx) return;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      if (outputFormat === 'jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      let quality = 0.92;
      let dataUrl = canvas.toDataURL(`image/${outputFormat}`, quality);
      let sizeBytes = Math.floor((dataUrl.split(',')[1]?.length || 0) * 0.75);

      if (enableSizeLimit && outputFormat !== 'png') {
        const targetBytes = maxKbLimit * 1024;
        let minQ = 0.05;
        let maxQ = 0.95;

        // Binary search for optimal quality under KB limit
        for (let iter = 0; iter < 10; iter++) {
          if (sizeBytes <= targetBytes) break;
          quality = (minQ + maxQ) / 2;
          dataUrl = canvas.toDataURL(`image/${outputFormat}`, quality);
          sizeBytes = Math.floor((dataUrl.split(',')[1]?.length || 0) * 0.75);

          if (sizeBytes > targetBytes) {
            maxQ = quality;
          } else {
            minQ = quality;
          }
        }
      }

      setProcessedUrl(dataUrl);
      setProcessedSizeBytes(sizeBytes);
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Crop className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white">Exact Image Resizer for Online Forms</h1>
              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Form Ready
              </span>
            </div>
            <p className="text-xs text-zinc-400">Resize photos to exact WxH pixel dimensions or enforce maximum file size limits (e.g. &lt; 50KB) for government application forms.</p>
          </div>
        </div>

        {file && (
          <button
            onClick={() => {
              setFile(null);
              setImageUrl(null);
              setProcessedUrl(null);
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
            title="Upload Photo for Exact Resizing"
            subtitle="Drag & drop JPG, PNG, or WebP image"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Image Workspace */}
          <div className="lg:col-span-2 space-y-4">
            <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-center min-h-[380px] max-h-[500px] overflow-hidden">
              <img
                src={processedUrl || imageUrl || ''}
                alt="Image Preview"
                className="max-h-[460px] w-auto object-contain rounded-xl"
              />
            </div>

            {processedUrl && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
                  <CheckCircle className="w-4 h-4" />
                  <span>Resized to {targetWidth} × {targetHeight} px ({(processedSizeBytes / 1024).toFixed(1)} KB)</span>
                </div>
                <a
                  href={processedUrl}
                  download={`resized-${targetWidth}x${targetHeight}.${outputFormat === 'jpeg' ? 'jpg' : outputFormat}`}
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Photo</span>
                </a>
              </div>
            )}
          </div>

          {/* Controls Panel */}
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-6">
              <h3 className="text-sm font-bold text-zinc-200">Dimension & Size Controls</h3>

              {/* Form Presets */}
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-2">Common Application Presets</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => applyPreset(300, 300, 50)}
                    className="p-2 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-emerald-500/50 text-[11px] font-medium text-zinc-300 text-left transition-colors"
                  >
                    <div className="font-semibold text-white">Passport Photo</div>
                    <div className="text-[10px] text-zinc-500">300×300 px (&lt;50KB)</div>
                  </button>

                  <button
                    onClick={() => applyPreset(300, 80, 20)}
                    className="p-2 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-emerald-500/50 text-[11px] font-medium text-zinc-300 text-left transition-colors"
                  >
                    <div className="font-semibold text-white">Signature Crop</div>
                    <div className="text-[10px] text-zinc-500">300×80 px (&lt;20KB)</div>
                  </button>

                  <button
                    onClick={() => applyPreset(600, 400, 100)}
                    className="p-2 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-emerald-500/50 text-[11px] font-medium text-zinc-300 text-left transition-colors"
                  >
                    <div className="font-semibold text-white">ID Card Upload</div>
                    <div className="text-[10px] text-zinc-500">600×400 px (&lt;100KB)</div>
                  </button>

                  <button
                    onClick={() => applyPreset(1080, 1080)}
                    className="p-2 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-emerald-500/50 text-[11px] font-medium text-zinc-300 text-left transition-colors"
                  >
                    <div className="font-semibold text-white">Square Post</div>
                    <div className="text-[10px] text-zinc-500">1080×1080 px</div>
                  </button>
                </div>
              </div>

              {/* Exact Pixel Inputs */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-300">Target Pixel Dimensions</span>
                  <button
                    onClick={() => setLockAspectRatio(!lockAspectRatio)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold border flex items-center gap-1 transition-colors ${
                      lockAspectRatio
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        : 'bg-zinc-950 text-zinc-400 border-zinc-800'
                    }`}
                  >
                    {lockAspectRatio ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                    <span>{lockAspectRatio ? 'Ratio Locked' : 'Unlocked'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-medium text-zinc-400 block mb-1">Width (px)</label>
                    <input
                      type="number"
                      value={targetWidth}
                      onChange={(e) => handleWidthChange(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-zinc-400 block mb-1">Height (px)</label>
                    <input
                      type="number"
                      value={targetHeight}
                      onChange={(e) => handleHeightChange(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Strict Max File Size Toggle */}
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                    <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Max File Size Limit</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={enableSizeLimit}
                    onChange={(e) => setEnableSizeLimit(e.target.checked)}
                    className="w-4 h-4 accent-emerald-500 cursor-pointer"
                  />
                </div>

                {enableSizeLimit && (
                  <div className="space-y-2 pt-1">
                    <div className="flex justify-between text-xs text-zinc-400">
                      <span>Compress Under:</span>
                      <span className="font-bold text-emerald-400">{maxKbLimit} KB</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="500"
                      step="5"
                      value={maxKbLimit}
                      onChange={(e) => setMaxKbLimit(Number(e.target.value))}
                      className="w-full accent-emerald-500 cursor-pointer"
                    />
                  </div>
                )}
              </div>

              {/* Format selection */}
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-2">Output Format</label>
                <select
                  value={outputFormat}
                  onChange={(e) => setOutputFormat(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="jpeg">JPG / JPEG (Best for online forms)</option>
                  <option value="png">PNG (Lossless / Transparent)</option>
                  <option value="webp">WebP (Next-Gen Compressed)</option>
                </select>
              </div>

              {/* Action Button */}
              <button
                onClick={handleProcessResize}
                disabled={isProcessing}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-xs shadow-glow-sm hover:shadow-glow-md disabled:opacity-40 transition-all flex items-center justify-center gap-2"
              >
                <Crop className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
                <span>{isProcessing ? 'Resizing & Compressing...' : 'Resize Photo Now'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
