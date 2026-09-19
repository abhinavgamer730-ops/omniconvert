'use client';

import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import { FileText, Download, Trash2, ArrowUp, ArrowDown, Settings, CheckCircle } from 'lucide-react';
import Dropzone from '@/components/Dropzone';

interface ImageItem {
  id: string;
  file: File;
  previewUrl: string;
}

export default function ImageToPdfClient() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [orientation, setOrientation] = useState<'auto' | 'portrait' | 'landscape'>('auto');
  const [margin, setMargin] = useState<number>(10);
  const [pdfName, setPdfName] = useState('converted-document.pdf');
  const [isGenerating, setIsGenerating] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleFilesSelected = (files: File[]) => {
    const newItems: ImageItem[] = files.map((file) => ({
      id: Math.random().toString(36).substring(2, 9),
      file,
      previewUrl: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newItems]);
  };

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    const newImages = [...images];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newImages.length) return;
    const [moved] = newImages.splice(index, 1);
    newImages.splice(targetIndex, 0, moved);
    setImages(newImages);
  };

  const generatePdf = async () => {
    if (images.length === 0) return;
    setIsGenerating(true);
    setSuccessMessage(null);

    try {
      let doc: jsPDF | null = null;

      for (let i = 0; i < images.length; i++) {
        const item = images[i];
        const img = new Image();
        img.src = item.previewUrl;
        await new Promise((resolve) => (img.onload = resolve));

        const imgWidth = img.naturalWidth;
        const imgHeight = img.naturalHeight;

        let selectedOrientation: 'p' | 'l' = 'p';
        if (orientation === 'landscape') selectedOrientation = 'l';
        else if (orientation === 'portrait') selectedOrientation = 'p';
        else selectedOrientation = imgWidth > imgHeight ? 'l' : 'p';

        if (i === 0) {
          doc = new jsPDF({
            orientation: selectedOrientation,
            unit: 'mm',
            format: 'a4',
          });
        } else if (doc) {
          doc.addPage('a4', selectedOrientation);
        }

        if (doc) {
          const pdfWidth = doc.internal.pageSize.getWidth();
          const pdfHeight = doc.internal.pageSize.getHeight();

          const printableWidth = pdfWidth - margin * 2;
          const printableHeight = pdfHeight - margin * 2;

          const ratio = Math.min(printableWidth / imgWidth, printableHeight / imgHeight);
          const finalWidth = imgWidth * ratio;
          const finalHeight = imgHeight * ratio;

          const x = (pdfWidth - finalWidth) / 2;
          const y = (pdfHeight - finalHeight) / 2;

          doc.addImage(item.previewUrl, 'JPEG', x, y, finalWidth, finalHeight);
        }
      }

      if (doc) {
        const finalFileName = pdfName.endsWith('.pdf') ? pdfName : `${pdfName}.pdf`;
        doc.save(finalFileName);
        setSuccessMessage(`Successfully downloaded ${finalFileName}`);
      }
    } catch (error) {
      console.error('PDF generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header banner */}
      <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Image to PDF Converter</h1>
            <p className="text-xs text-zinc-400">Combine multiple photos into a single PDF document client-side.</p>
          </div>
        </div>

        {images.length > 0 && (
          <button
            onClick={() => setImages([])}
            className="px-3 py-1.5 rounded-lg bg-zinc-800 text-xs font-semibold text-zinc-400 hover:text-rose-400 transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Main Grid: Upload & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Dropzone
            accept="image/png, image/jpeg, image/webp"
            multiple={true}
            onFilesSelected={handleFilesSelected}
            title="Upload Images for PDF"
            subtitle="Drag & drop PNG, JPG, or WebP images"
          />

          {/* Image List Gallery */}
          {images.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 px-1">
                Pages ({images.length}) - Drag or reorder
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {images.map((img, idx) => (
                  <div
                    key={img.id}
                    className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-between gap-3 group hover:border-zinc-700"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-6 h-6 rounded-md bg-zinc-800 text-[11px] font-mono font-bold text-zinc-400 flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <img
                        src={img.previewUrl}
                        alt="Page thumbnail"
                        className="w-12 h-12 rounded-lg object-cover bg-zinc-950 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-zinc-200 truncate">{img.file.name}</p>
                        <p className="text-[10px] font-mono text-zinc-500">{(img.file.size / 1024).toFixed(1)} KB</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => moveImage(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white disabled:opacity-30"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => moveImage(idx, 'down')}
                        disabled={idx === images.length - 1}
                        className="p-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white disabled:opacity-30"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => removeImage(img.id)}
                        className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Settings Panel */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-5">
            <h3 className="text-sm font-bold text-zinc-200 flex items-center gap-2">
              <Settings className="w-4 h-4 text-indigo-400" />
              <span>PDF Settings</span>
            </h3>

            {/* Document Name */}
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Output Filename</label>
              <input
                type="text"
                value={pdfName}
                onChange={(e) => setPdfName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Page Orientation */}
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Page Orientation</label>
              <div className="grid grid-cols-3 gap-2">
                {(['auto', 'portrait', 'landscape'] as const).map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setOrientation(opt)}
                    className={`py-2 rounded-xl text-xs font-semibold capitalize border ${
                      orientation === opt
                        ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500'
                        : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:bg-zinc-900'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Page Margin */}
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Margin ({margin} mm)</label>
              <input
                type="range"
                min="0"
                max="30"
                value={margin}
                onChange={(e) => setMargin(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>

            {/* Download Button */}
            <button
              onClick={generatePdf}
              disabled={images.length === 0 || isGenerating}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs shadow-glow-sm hover:shadow-glow-md disabled:opacity-40 transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>{isGenerating ? 'Generating PDF...' : `Download PDF (${images.length} pages)`}</span>
            </button>

            {successMessage && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
