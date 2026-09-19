'use client';

import React, { useState, useRef } from 'react';
import { Wand2, Download, RefreshCw, Key, Image as ImageIcon, Sliders, CheckCircle, Cpu, Sparkles } from 'lucide-react';
import Dropzone from '@/components/Dropzone';
import CanvasBrush, { CanvasBrushRef } from '@/components/CanvasBrush';
import BeforeAfterSlider from '@/components/BeforeAfterSlider';
import { removeObjectOrBackground, MagicEraserRequest } from '@/lib/api/magic-eraser';

export default function MagicEraserClient() {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [mode, setMode] = useState<'magic-eraser' | 'remove-background'>('magic-eraser');
  const [model, setModel] = useState<'local-inpainting' | 'replicate-lama' | 'huggingface-sd'>('local-inpainting');
  const [brushSize, setBrushSize] = useState<number>(35);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [showApiConfig, setShowApiConfig] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const brushRef = useRef<CanvasBrushRef>(null);

  const handleFilesSelected = (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0];
    setFile(selected);
    const url = URL.createObjectURL(selected);
    setImageUrl(url);
    setResultUrl(null);
    setErrorMsg(null);
  };

  const handleProcess = async () => {
    if (!imageUrl) return;
    setIsProcessing(true);
    setErrorMsg(null);

    let maskDataUrl: string | undefined;

    if (mode === 'magic-eraser' && brushRef.current) {
      const mask = brushRef.current.getMaskDataUrl();
      if (mask) maskDataUrl = mask;
    }

    try {
      const request: MagicEraserRequest = {
        image: imageUrl,
        mask: maskDataUrl,
        mode,
        model,
        apiKey: apiKey.trim() || undefined,
      };

      const response = await removeObjectOrBackground(request);

      if (response.success && response.resultImageUrl) {
        setResultUrl(response.resultImageUrl);
      } else {
        setErrorMsg(response.error || 'Failed to process image.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error occurred during processing.');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadResult = () => {
    if (!resultUrl || !file) return;
    const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
    const suffix = mode === 'magic-eraser' ? 'erased' : 'no-bg';
    const a = document.createElement('a');
    a.href = resultUrl;
    a.download = `${baseName}-${suffix}.png`;
    a.click();
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400">
            <Wand2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white">Magic Eraser & BG Remover</h1>
              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30">
                AI Powered Inpainting
              </span>
            </div>
            <p className="text-xs text-zinc-400">Brush over unwanted people or objects to erase them seamlessly with content-aware AI.</p>
          </div>
        </div>

        {file && (
          <button
            onClick={() => {
              setFile(null);
              setImageUrl(null);
              setResultUrl(null);
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
            title="Upload Photo for Object/Background Removal"
            subtitle="Drag & drop PNG or JPG photo"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Workspace / Interactive Result */}
          <div className="lg:col-span-2 space-y-6">
            {resultUrl && imageUrl ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-zinc-400 px-1">
                  <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4" />
                    <span>Object Erased - Drag Center Handle to Compare</span>
                  </span>
                  <button
                    onClick={() => setResultUrl(null)}
                    className="text-xs text-indigo-400 hover:underline"
                  >
                    Edit Mask Again
                  </button>
                </div>
                
                <BeforeAfterSlider
                  originalImage={imageUrl}
                  processedImage={resultUrl}
                  originalLabel="Original Photo"
                  processedLabel="Object Erased / BG Removed"
                />
              </div>
            ) : mode === 'magic-eraser' && imageUrl ? (
              <div className="space-y-2">
                <p className="text-xs text-zinc-400 px-1 font-medium">
                  Paint over unwanted objects or people with your mouse/touch brush:
                </p>
                <CanvasBrush
                  ref={brushRef}
                  imageUrl={imageUrl}
                  brushSize={brushSize}
                  onBrushSizeChange={setBrushSize}
                />
              </div>
            ) : (
              <div className="rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800 p-4 flex items-center justify-center min-h-[400px]">
                <img src={imageUrl || ''} alt="Base Preview" className="max-h-[480px] object-contain" />
              </div>
            )}
          </div>

          {/* Right AI Controls & Model Selection Panel */}
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-6">
              <h3 className="text-sm font-bold text-zinc-200">Mode & AI Engine</h3>

              {/* Mode Toggle Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => { setMode('magic-eraser'); setResultUrl(null); }}
                  className={`py-3 px-3 rounded-xl text-xs font-bold border transition-all ${
                    mode === 'magic-eraser'
                      ? 'bg-pink-600 text-white border-pink-500 shadow-glow-sm'
                      : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:bg-zinc-900'
                  }`}
                >
                  Magic Eraser (Brush Mask)
                </button>
                <button
                  onClick={() => { setMode('remove-background'); setResultUrl(null); }}
                  className={`py-3 px-3 rounded-xl text-xs font-bold border transition-all ${
                    mode === 'remove-background'
                      ? 'bg-pink-600 text-white border-pink-500 shadow-glow-sm'
                      : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:bg-zinc-900'
                  }`}
                >
                  Remove Background
                </button>
              </div>

              {/* Model Choice */}
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-2">AI Processing Engine</label>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-pink-500 cursor-pointer"
                >
                  <option value="local-inpainting">Fast Marching Local Engine (Offline / Instant)</option>
                  <option value="replicate-lama">Replicate LaMa Inpainting (Cloud AI)</option>
                  <option value="huggingface-sd">Hugging Face Stable Diffusion Inpainting</option>
                </select>
              </div>

              {/* API Key Configuration */}
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-pink-400" />
                    <span>Cloud AI API Key (Optional)</span>
                  </span>
                  <button
                    onClick={() => setShowApiConfig(!showApiConfig)}
                    className="text-[10px] font-semibold text-indigo-400 hover:underline"
                  >
                    {showApiConfig ? 'Hide' : 'Configure Key'}
                  </button>
                </div>

                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Local texture-diffusion engine works 100% offline out-of-the-box. Add a Replicate API token to connect cloud models.
                </p>

                {showApiConfig && (
                  <input
                    type="password"
                    placeholder="Enter Replicate API token (r8_...)"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-pink-500"
                  />
                )}
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400">
                  {errorMsg}
                </div>
              )}

              {/* Action Button */}
              <button
                onClick={handleProcess}
                disabled={isProcessing}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 text-white font-bold text-xs shadow-glow-sm hover:shadow-glow-md disabled:opacity-40 transition-all flex items-center justify-center gap-2"
              >
                <Wand2 className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
                <span>
                  {isProcessing
                    ? 'Inpainting Content with AI...'
                    : mode === 'magic-eraser'
                    ? 'Erase Masked Objects'
                    : 'Remove Background Now'
                  }
                </span>
              </button>

              {resultUrl && (
                <button
                  onClick={downloadResult}
                  className="w-full py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Transparent PNG Result</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
