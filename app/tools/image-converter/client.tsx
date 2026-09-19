'use client';

import React, { useState } from 'react';
import JSZip from 'jszip';
import { Image as ImageIcon, Download, RefreshCw, CheckCircle, Package } from 'lucide-react';
import Dropzone from '@/components/Dropzone';

interface ImageFileItem {
  id: string;
  file: File;
  previewUrl: string;
  convertedUrl?: string;
  convertedName?: string;
  convertedSize?: number;
  status: 'pending' | 'converting' | 'done';
}

export default function ImageConverterClient() {
  const [items, setItems] = useState<ImageFileItem[]>([]);
  const [targetFormat, setTargetFormat] = useState<'png' | 'jpeg' | 'webp'>('webp');
  const [quality, setQuality] = useState<number>(0.92);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFilesSelected = (files: File[]) => {
    const newItems: ImageFileItem[] = files.map((file) => ({
      id: Math.random().toString(36).substring(2, 9),
      file,
      previewUrl: URL.createObjectURL(file),
      status: 'pending',
    }));
    setItems((prev) => [...prev, ...newItems]);
  };

  const convertAll = async () => {
    if (items.length === 0) return;
    setIsProcessing(true);

    const updatedItems = [...items];

    for (let i = 0; i < updatedItems.length; i++) {
      const item = updatedItems[i];
      item.status = 'converting';
      setItems([...updatedItems]);

      try {
        const img = new Image();
        img.src = item.previewUrl;
        await new Promise((resolve) => (img.onload = resolve));

        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');

        if (ctx) {
          if (targetFormat === 'jpeg') {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }
          ctx.drawImage(img, 0, 0);
        }

        const mimeType = `image/${targetFormat}`;
        const dataUrl = canvas.toDataURL(mimeType, quality);

        const base64Length = dataUrl.split(',')[1]?.length || 0;
        const sizeInBytes = Math.floor(base64Length * (3 / 4));

        const originalBaseName = item.file.name.substring(0, item.file.name.lastIndexOf('.')) || item.file.name;
        const ext = targetFormat === 'jpeg' ? 'jpg' : targetFormat;

        item.convertedUrl = dataUrl;
        item.convertedName = `${originalBaseName}.${ext}`;
        item.convertedSize = sizeInBytes;
        item.status = 'done';
      } catch (err) {
        console.error('Conversion failed for item:', item.file.name, err);
        item.status = 'pending';
      }

      setItems([...updatedItems]);
    }

    setIsProcessing(false);
  };

  const downloadSingle = (item: ImageFileItem) => {
    if (!item.convertedUrl || !item.convertedName) return;
    const a = document.createElement('a');
    a.href = item.convertedUrl;
    a.download = item.convertedName;
    a.click();
  };

  const downloadAllAsZip = async () => {
    const convertedItems = items.filter((item) => item.status === 'done' && item.convertedUrl);
    if (convertedItems.length === 0) return;

    const zip = new JSZip();

    convertedItems.forEach((item) => {
      if (item.convertedUrl && item.convertedName) {
        const base64Data = item.convertedUrl.split(',')[1];
        zip.file(item.convertedName, base64Data, { base64: true });
      }
    });

    const content = await zip.generateAsync({ type: 'blob' });
    const zipUrl = URL.createObjectURL(content);

    const a = document.createElement('a');
    a.href = zipUrl;
    a.download = `converted-images-${targetFormat}.zip`;
    a.click();
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <ImageIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Universal Image Format Converter</h1>
            <p className="text-xs text-zinc-400">Convert PNG, JPG, and WebP images locally via HTML5 Canvas API.</p>
          </div>
        </div>

        {items.length > 0 && (
          <button
            onClick={() => setItems([])}
            className="px-3 py-1.5 rounded-lg bg-zinc-800 text-xs font-semibold text-zinc-400 hover:text-rose-400 transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Dropzone
            accept="image/png, image/jpeg, image/webp, image/gif, image/bmp, image/svg+xml"
            multiple={true}
            onFilesSelected={handleFilesSelected}
            title="Upload Images to Convert"
            subtitle="Supports PNG, JPG, WebP, GIF, SVG"
          />

          {items.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Images ({items.length})
                </h3>
                {items.some((i) => i.status === 'done') && (
                  <button
                    onClick={downloadAllAsZip}
                    className="flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300"
                  >
                    <Package className="w-4 h-4" />
                    <span>Download All (ZIP)</span>
                  </button>
                )}
              </div>

              <div className="space-y-2">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={item.previewUrl}
                        alt="Preview"
                        className="w-12 h-12 rounded-lg object-cover bg-zinc-950 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-zinc-200 truncate">{item.file.name}</p>
                        <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-mono mt-0.5">
                          <span>Original: {(item.file.size / 1024).toFixed(1)} KB</span>
                          {item.convertedSize && (
                            <span className="text-indigo-400">
                              → {item.convertedName}: {(item.convertedSize / 1024).toFixed(1)} KB
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      {item.status === 'done' ? (
                        <button
                          onClick={() => downloadSingle(item)}
                          className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 transition-colors flex items-center gap-1.5 shadow-sm"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download</span>
                        </button>
                      ) : (
                        <span className="text-xs text-zinc-500 italic">Ready</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-5">
            <h3 className="text-sm font-bold text-zinc-200 flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-indigo-400" />
              <span>Conversion Options</span>
            </h3>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-2">Target Format</label>
              <div className="grid grid-cols-3 gap-2">
                {(['webp', 'png', 'jpeg'] as const).map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => setTargetFormat(fmt)}
                    className={`py-2.5 rounded-xl text-xs font-bold uppercase border ${
                      targetFormat === fmt
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-glow-sm'
                        : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:bg-zinc-900'
                    }`}
                  >
                    {fmt === 'jpeg' ? 'JPG' : fmt}
                  </button>
                ))}
              </div>
            </div>

            {targetFormat !== 'png' && (
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
                  Output Quality ({Math.round(quality * 100)}%)
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>
            )}

            <button
              onClick={convertAll}
              disabled={items.length === 0 || isProcessing}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs shadow-glow-sm hover:shadow-glow-md disabled:opacity-40 transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
              <span>{isProcessing ? 'Converting...' : `Convert All to ${targetFormat.toUpperCase()}`}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
