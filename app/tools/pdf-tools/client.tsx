'use client';

import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { FileStack, Download, ArrowUp, ArrowDown, Trash2, FileText, Split, Layers, CheckCircle } from 'lucide-react';
import Dropzone from '@/components/Dropzone';

interface PdfFileItem {
  id: string;
  file: File;
  pageCount: number;
}

export default function PdfToolsClient() {
  const [activeTab, setActiveTab] = useState<'merge' | 'split'>('merge');

  // Merge state
  const [mergeFiles, setMergeFiles] = useState<PdfFileItem[]>([]);
  const [mergedPdfUrl, setMergedPdfUrl] = useState<string | null>(null);

  // Split state
  const [splitFile, setSplitFile] = useState<File | null>(null);
  const [splitPageCount, setSplitPageCount] = useState<number>(0);
  const [selectedPagesStr, setSelectedPagesStr] = useState<string>('1-2');
  const [splitPdfUrl, setSplitPdfUrl] = useState<string | null>(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Handle PDF upload for Merger
  const handleMergeFilesSelected = async (files: File[]) => {
    setErrorMsg(null);
    setMergedPdfUrl(null);

    const newItems: PdfFileItem[] = [];
    for (const f of files) {
      if (f.type === 'application/pdf' || f.name.endsWith('.pdf')) {
        try {
          const buffer = await f.arrayBuffer();
          const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
          newItems.push({
            id: Math.random().toString(36).substring(2, 9),
            file: f,
            pageCount: doc.getPageCount(),
          });
        } catch (err) {
          console.warn('Could not read PDF:', f.name, err);
        }
      }
    }
    setMergeFiles((prev) => [...prev, ...newItems]);
  };

  const moveMergeFile = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= mergeFiles.length) return;
    const updated = [...mergeFiles];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    setMergeFiles(updated);
  };

  const removeMergeFile = (index: number) => {
    setMergeFiles(mergeFiles.filter((_, i) => i !== index));
  };

  const processMerge = async () => {
    if (mergeFiles.length < 2) {
      setErrorMsg('Please upload at least 2 PDF files to merge.');
      return;
    }
    setIsProcessing(true);
    setErrorMsg(null);

    try {
      const mergedDoc = await PDFDocument.create();

      for (const item of mergeFiles) {
        const buffer = await item.file.arrayBuffer();
        const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
        const copiedPages = await mergedDoc.copyPages(doc, doc.getPageIndices());
        copiedPages.forEach((page) => mergedDoc.addPage(page));
      }

      const pdfBytes = await mergedDoc.save();
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setMergedPdfUrl(url);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to merge PDF documents.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle PDF upload for Splitter
  const handleSplitFileSelected = async (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0];
    setErrorMsg(null);
    setSplitPdfUrl(null);

    try {
      const buffer = await selected.arrayBuffer();
      const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const count = doc.getPageCount();
      setSplitFile(selected);
      setSplitPageCount(count);
      setSelectedPagesStr(count > 1 ? `1-${Math.min(2, count)}` : '1');
    } catch (err: any) {
      setErrorMsg('Failed to read PDF file. Please ensure it is a valid unencrypted PDF.');
    }
  };

  const processSplit = async () => {
    if (!splitFile || splitPageCount === 0) return;
    setIsProcessing(true);
    setErrorMsg(null);

    try {
      const buffer = await splitFile.arrayBuffer();
      const srcDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });

      // Parse user page input (e.g. "1-3, 5")
      const pagesToExtract = new Set<number>();
      const parts = selectedPagesStr.split(',');

      for (const part of parts) {
        const trimmed = part.trim();
        if (trimmed.includes('-')) {
          const [startStr, endStr] = trimmed.split('-');
          const start = parseInt(startStr, 10);
          const end = parseInt(endStr, 10);
          if (!isNaN(start) && !isNaN(end)) {
            for (let p = Math.max(1, start); p <= Math.min(splitPageCount, end); p++) {
              pagesToExtract.add(p - 1); // 0-indexed
            }
          }
        } else {
          const p = parseInt(trimmed, 10);
          if (!isNaN(p) && p >= 1 && p <= splitPageCount) {
            pagesToExtract.add(p - 1);
          }
        }
      }

      if (pagesToExtract.size === 0) {
        throw new Error(`Invalid page range. Please enter valid page numbers between 1 and ${splitPageCount}.`);
      }

      const indices = Array.from(pagesToExtract).sort((a, b) => a - b);
      const splitDoc = await PDFDocument.create();
      const copiedPages = await splitDoc.copyPages(srcDoc, indices);
      copiedPages.forEach((page) => splitDoc.addPage(page));

      const pdfBytes = await splitDoc.save();
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setSplitPdfUrl(url);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to extract PDF pages.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
            <FileStack className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white">PDF Splitter & Merger</h1>
              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                100% Client Privacy
              </span>
            </div>
            <p className="text-xs text-zinc-400">Combine multiple PDF documents into one or extract specific page ranges securely in your browser using pdf-lib.</p>
          </div>
        </div>

        {/* Tab Toggle */}
        <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-zinc-950 border border-zinc-800">
          <button
            onClick={() => { setActiveTab('merge'); setErrorMsg(null); }}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'merge'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>PDF Merger</span>
          </button>
          <button
            onClick={() => { setActiveTab('split'); setErrorMsg(null); }}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'split'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Split className="w-3.5 h-3.5" />
            <span>PDF Splitter</span>
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400">
          {errorMsg}
        </div>
      )}

      {/* TAB 1: PDF MERGER */}
      {activeTab === 'merge' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <Dropzone
              accept="application/pdf"
              multiple={true}
              onFilesSelected={handleMergeFilesSelected}
              title="Upload PDFs to Combine"
              subtitle="Drag & drop PDF files to append to list"
            />

            {mergeFiles.length > 0 && (
              <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-zinc-300 px-1">
                  <span>Files to Merge ({mergeFiles.length})</span>
                  <button
                    onClick={() => setMergeFiles([])}
                    className="text-xs text-rose-400 hover:underline"
                  >
                    Clear All
                  </button>
                </div>

                <div className="space-y-2">
                  {mergeFiles.map((item, idx) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-zinc-200 truncate">{item.file.name}</div>
                          <div className="text-[11px] text-zinc-500">
                            {item.pageCount} {item.pageCount === 1 ? 'page' : 'pages'} • {(item.file.size / 1024 / 1024).toFixed(2)} MB
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => moveMergeFile(idx, 'up')}
                          disabled={idx === 0}
                          className="p-1.5 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white disabled:opacity-30"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => moveMergeFile(idx, 'down')}
                          disabled={idx === mergeFiles.length - 1}
                          className="p-1.5 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white disabled:opacity-30"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => removeMergeFile(idx)}
                          className="p-1.5 rounded-lg bg-zinc-900 text-rose-400 hover:text-rose-300"
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

          <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-6">
            <h3 className="text-sm font-bold text-zinc-200">Merge Output</h3>

            <div className="text-xs text-zinc-400 leading-relaxed">
              PDF files will be combined sequentially in the order listed on the left.
            </div>

            <button
              onClick={processMerge}
              disabled={isProcessing || mergeFiles.length < 2}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-500 to-orange-600 text-white font-bold text-xs shadow-glow-sm disabled:opacity-40 transition-all flex items-center justify-center gap-2"
            >
              <Layers className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
              <span>{isProcessing ? 'Merging PDFs...' : 'Merge All PDF Files'}</span>
            </button>

            {mergedPdfUrl && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
                  <CheckCircle className="w-4 h-4" />
                  <span>PDF Merged Successfully!</span>
                </div>
                <a
                  href={mergedPdfUrl}
                  download="merged-document.pdf"
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Combined PDF</span>
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: PDF SPLITTER */}
      {activeTab === 'split' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {!splitFile ? (
              <Dropzone
                accept="application/pdf"
                multiple={false}
                onFilesSelected={handleSplitFileSelected}
                title="Upload PDF to Split"
                subtitle="Select multi-page PDF document"
              />
            ) : (
              <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">{splitFile.name}</div>
                      <div className="text-xs text-zinc-400">Total Pages: <span className="font-bold text-rose-400">{splitPageCount}</span></div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSplitFile(null);
                      setSplitPdfUrl(null);
                    }}
                    className="text-xs text-zinc-400 hover:text-rose-400 transition-colors"
                  >
                    Change PDF
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-6">
            <h3 className="text-sm font-bold text-zinc-200">Page Extraction Settings</h3>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-2">Page Range to Extract</label>
              <input
                type="text"
                placeholder="e.g. 1-3, 5"
                value={selectedPagesStr}
                onChange={(e) => setSelectedPagesStr(e.target.value)}
                disabled={!splitFile}
                className="w-full px-3 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 font-mono focus:outline-none focus:border-rose-500 disabled:opacity-40"
              />
              <p className="text-[11px] text-zinc-500 mt-1.5 leading-relaxed">
                Use numbers or dash ranges separated by commas (e.g. <span className="font-mono text-zinc-400">1-3, 5</span> extracts pages 1, 2, 3, and 5).
              </p>
            </div>

            <button
              onClick={processSplit}
              disabled={isProcessing || !splitFile}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-500 to-orange-600 text-white font-bold text-xs shadow-glow-sm disabled:opacity-40 transition-all flex items-center justify-center gap-2"
            >
              <Split className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
              <span>{isProcessing ? 'Extracting Pages...' : 'Extract Selected Pages'}</span>
            </button>

            {splitPdfUrl && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
                  <CheckCircle className="w-4 h-4" />
                  <span>Pages Extracted Successfully!</span>
                </div>
                <a
                  href={splitPdfUrl}
                  download="extracted-pages.pdf"
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Extracted PDF</span>
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
