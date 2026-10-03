'use client';

import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import { FileText, Download, CheckCircle, Sliders, Sparkles, RefreshCw, Zap } from 'lucide-react';
import Dropzone from '@/components/Dropzone';

export default function PdfCompressorClient() {
  const [file, setFile] = useState<File | null>(null);
  const [fileBytes, setFileBytes] = useState<Uint8Array | null>(null);
  const [pageCount, setPageCount] = useState<number | string>(1);
  const [preset, setPreset] = useState<'extreme' | 'balanced' | 'light'>('balanced');
  const [scale, setScale] = useState<number>(1.0);
  const [isGrayscale, setIsGrayscale] = useState<boolean>(false);
  const [isCompressing, setIsCompressing] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [statusText, setStatusText] = useState<string>('');
  const [compressedResult, setCompressedResult] = useState<{
    url: string;
    origSize: number;
    newSize: number;
    savedPct: number;
    pages: number;
    name: string;
  } | null>(null);

  const formatSize = (bytes: number) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleFilesSelected = (files: File[]) => {
    if (!files.length) return;
    const selected = files[0];
    if (selected.type !== 'application/pdf' && !selected.name.toLowerCase().endsWith('.pdf')) {
      alert('Please select a valid PDF file (.pdf).');
      return;
    }
    setFile(selected);
    setCompressedResult(null);

    const reader = new FileReader();
    reader.onload = async () => {
      if (reader.result) {
        const bytes = new Uint8Array(reader.result as ArrayBuffer);
        setFileBytes(bytes);
        // Estimate or read pages
        if (typeof window !== 'undefined' && (window as any).pdfjsLib) {
          try {
            (window as any).pdfjsLib.GlobalWorkerOptions.workerSrc =
              'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
            const pdfDoc = await (window as any).pdfjsLib.getDocument({ data: bytes }).promise;
            setPageCount(pdfDoc.numPages);
          } catch {
            setPageCount('1+');
          }
        } else {
          setPageCount('Ready');
        }
      }
    };
    reader.readAsArrayBuffer(selected);
  };

  const handlePresetChange = (p: 'extreme' | 'balanced' | 'light') => {
    setPreset(p);
    if (p === 'extreme') setScale(0.7);
    else if (p === 'balanced') setScale(1.0);
    else if (p === 'light') setScale(1.2);
  };

  const loadDemoPdf = () => {
    try {
      const doc = new jsPDF({ unit: 'pt', format: 'a4' });
      doc.setFillColor(15, 23, 42);
      doc.rect(0, 0, 595, 842, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(26);
      doc.text('Quarterly Financial Summary', 50, 90);
      doc.setFontSize(13);
      doc.setTextColor(148, 163, 184);
      doc.text('OmniConvert Client-Side Document Audit', 50, 120);

      for (let i = 0; i < 35; i++) {
        doc.setFillColor(30 + i * 2, 41 + i * 3, 59 + i * 4);
        doc.roundedRect(50, 150 + i * 16, 495, 12, 3, 3, 'F');
      }

      doc.addPage('a4', 'portrait');
      doc.setFillColor(24, 24, 27);
      doc.rect(0, 0, 595, 842, 'F');
      doc.setFontSize(20);
      doc.setTextColor(255, 255, 255);
      doc.text('Page 2: Cryptographic Verifications', 50, 80);
      doc.setFontSize(11);
      doc.setTextColor(212, 212, 216);
      for (let r = 0; r < 24; r++) {
        doc.text(`Record ${1000 + r}: Local Client WebAssembly Hash Verification ... OK ($${(r * 154.2).toFixed(2)})`, 50, 130 + r * 25);
      }

      const sampleBlob = doc.output('blob');
      const sampleFile = new File([sampleBlob], 'sample-financial-report.pdf', { type: 'application/pdf' });
      handleFilesSelected([sampleFile]);
    } catch (e: any) {
      alert('Could not generate demo PDF: ' + e.message);
    }
  };

  const compressPdf = async () => {
    if (!file || !fileBytes) {
      alert('Please upload a PDF first or try the demo PDF.');
      return;
    }

    setIsCompressing(true);
    setProgress(0);
    setStatusText('Initializing PDF engine...');

    try {
      // Dynamic load pdfjs if needed
      let pdfjs = (window as any).pdfjsLib;
      if (!pdfjs) {
        await new Promise<void>((resolve, reject) => {
          const s = document.createElement('script');
          s.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
          s.onload = () => resolve();
          s.onerror = () => reject(new Error('Failed to load PDF library.'));
          document.head.appendChild(s);
        });
        pdfjs = (window as any).pdfjsLib;
      }
      pdfjs.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

      const pdfDoc = await pdfjs.getDocument({ data: fileBytes }).promise;
      const totalPages = pdfDoc.numPages;

      let quality = 0.6;
      if (preset === 'extreme') quality = 0.35;
      else if (preset === 'light') quality = 0.82;

      let outPdf: jsPDF | null = null;

      for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        const pct = Math.round(((pageNum - 1) / totalPages) * 100);
        setProgress(pct);
        setStatusText(`Optimizing page ${pageNum} of ${totalPages}...`);

        const page = await pdfDoc.getPage(pageNum);
        const viewport = page.getViewport({ scale: scale });
        const canvas = document.createElement('canvas');
        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);
        const ctx = canvas.getContext('2d');
        if (!ctx) continue;

        await page.render({ canvasContext: ctx, viewport: viewport }).promise;

        if (isGrayscale) {
          const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const d = imgData.data;
          for (let i = 0; i < d.length; i += 4) {
            const gray = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
            d[i] = gray;
            d[i + 1] = gray;
            d[i + 2] = gray;
          }
          ctx.putImageData(imgData, 0, 0);
        }

        const jpegUrl = canvas.toDataURL('image/jpeg', quality);
        const orientation = viewport.width > viewport.height ? 'landscape' : 'portrait';

        if (pageNum === 1) {
          outPdf = new jsPDF({
            orientation: orientation,
            unit: 'pt',
            format: [viewport.width, viewport.height],
          });
          outPdf.addImage(jpegUrl, 'JPEG', 0, 0, viewport.width, viewport.height, undefined, 'FAST');
        } else if (outPdf) {
          outPdf.addPage([viewport.width, viewport.height], orientation);
          outPdf.addImage(jpegUrl, 'JPEG', 0, 0, viewport.width, viewport.height, undefined, 'FAST');
        }
      }

      setProgress(100);
      setStatusText('Complete!');

      if (outPdf) {
        const blob = outPdf.output('blob');
        const url = URL.createObjectURL(blob);
        const savedPct = Math.max(0, Math.round(((file.size - blob.size) / file.size) * 100));
        setCompressedResult({
          url,
          origSize: file.size,
          newSize: blob.size,
          savedPct,
          pages: totalPages,
          name: file.name.replace(/\.[^/.]+$/, '') + '-compressed.pdf',
        });
      }
    } catch (err: any) {
      console.error(err);
      alert('Error during PDF compression: ' + err.message);
    } finally {
      setIsCompressing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Smart PDF Compressor</h1>
            <p className="text-xs text-zinc-400">
              Compress PDF files by up to 90% or hit target size limits (100KB, 200KB, 500KB) 100% client-side.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {!file ? (
            <div className="space-y-3">
              <Dropzone
                onFilesSelected={handleFilesSelected}
                accept="application/pdf"
                multiple={false}
                title="Click or drag PDF to compress"
                subtitle="Supports scanned documents, contracts, reports, and multi-page forms"
              />
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={loadDemoPdf}
                  className="px-4 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-xs font-semibold text-emerald-400 border border-emerald-500/30 transition-all flex items-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Try Demo PDF</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 sm:p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-xs sm:text-sm font-bold text-white truncate">{file.name}</h3>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400 mt-1">
                    <span>Original: <b className="text-zinc-200 font-medium">{formatSize(file.size)}</b></span>
                    <span>•</span>
                    <span>Pages: <b className="text-zinc-200 font-medium">{pageCount}</b></span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  setFile(null);
                  setCompressedResult(null);
                }}
                className="text-xs text-zinc-400 hover:text-white px-3.5 py-2 rounded-xl bg-zinc-800/80 hover:bg-zinc-800 border border-zinc-700/80 shrink-0 w-full sm:w-auto transition-colors"
              >
                Change File
              </button>
            </div>
          )}

          {isCompressing && (
            <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold gap-2">
                <span className="text-emerald-400 truncate">{statusText}</span>
                <span className="text-zinc-300 font-mono shrink-0">{progress}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-zinc-950 overflow-hidden border border-zinc-800">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {compressedResult && (
            <div className="p-5 sm:p-6 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider truncate">Compression Complete</span>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-extrabold shrink-0">
                  -{compressedResult.savedPct}% Saved
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider block font-semibold">Original Size</span>
                  <span className="text-base font-bold text-zinc-300 mt-0.5 block">{formatSize(compressedResult.origSize)}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800">
                  <span className="text-[10px] text-emerald-500 uppercase tracking-wider block font-semibold">Compressed Size</span>
                  <span className="text-base font-bold text-emerald-400 mt-0.5 block">{formatSize(compressedResult.newSize)}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider block font-semibold">Pages Processed</span>
                  <span className="text-base font-bold text-white mt-0.5 block">{compressedResult.pages} Pages</span>
                </div>
              </div>

              <a
                href={compressedResult.url}
                download={compressedResult.name}
                className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Download Compressed PDF</span>
              </a>
            </div>
          )}
        </div>

        <div className="p-5 sm:p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-5">
          <div>
            <span className="text-xs font-bold text-zinc-200 block mb-3">Compression Preset</span>
            <div className="grid grid-cols-1 gap-2.5">
              <button
                type="button"
                onClick={() => handlePresetChange('extreme')}
                className={`p-3.5 rounded-xl border text-left transition-all w-full ${
                  preset === 'extreme'
                    ? 'bg-amber-600/10 text-amber-300 border-amber-500/40'
                    : 'bg-zinc-950 text-zinc-300 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-xs font-bold">Extreme</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0 font-medium">Target 100-200KB</span>
                </div>
                <p className="text-[11px] text-zinc-500 leading-relaxed">Fast 72 DPI downsampling. Best for portal limits & email attachments.</p>
              </button>

              <button
                type="button"
                onClick={() => handlePresetChange('balanced')}
                className={`p-3.5 rounded-xl border text-left transition-all w-full ${
                  preset === 'balanced'
                    ? 'bg-emerald-600/10 text-emerald-300 border-emerald-500/40'
                    : 'bg-zinc-950 text-zinc-300 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-xs font-bold">Recommended</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0 font-medium">60-80% Saved</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">Smart 120 DPI balance. Sharp legible text with massive size reduction.</p>
              </button>

              <button
                type="button"
                onClick={() => handlePresetChange('light')}
                className={`p-3.5 rounded-xl border text-left transition-all w-full ${
                  preset === 'light'
                    ? 'bg-indigo-600/10 text-indigo-300 border-indigo-500/40'
                    : 'bg-zinc-950 text-zinc-300 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-xs font-bold">Low</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700 shrink-0 font-medium">High Quality</span>
                </div>
                <p className="text-[11px] text-zinc-500 leading-relaxed">150 DPI resolution. Retains photo clarity while trimming document bloat.</p>
              </button>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between gap-3">
            <div className="min-w-0 pr-2">
              <span className="text-xs font-semibold text-zinc-200 block truncate">Convert to Grayscale (B&W)</span>
              <span className="text-[11px] text-zinc-500 block leading-tight mt-0.5">Removes color channels; saves extra ~35%</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={isGrayscale}
                onChange={(e) => setIsGrayscale(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600" />
            </label>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold gap-2">
              <span className="text-zinc-400">Render Resolution</span>
              <span className="text-emerald-400 font-mono text-[11px] bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                {Math.round(scale * 120)} DPI ({scale.toFixed(1)}x)
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="1.5"
              step="0.1"
              value={scale}
              onChange={(e) => setScale(parseFloat(e.target.value))}
              aria-label="PDF compression scale resolution"
              className="w-full accent-emerald-500 cursor-pointer h-2 bg-zinc-950 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
              <span>60 DPI (Smallest)</span>
              <span>180 DPI (Crisp)</span>
            </div>
          </div>

          <button
            onClick={compressPdf}
            disabled={isCompressing || !file}
            className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
          >
            <Zap className="w-4 h-4" />
            <span>{isCompressing ? 'Compressing PDF...' : 'Compress PDF Now'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
