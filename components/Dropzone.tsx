'use client';

import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, File, X, AlertCircle } from 'lucide-react';

interface DropzoneProps {
  accept?: string;
  multiple?: boolean;
  onFilesSelected: (files: File[]) => void;
  title?: string;
  subtitle?: string;
  maxFiles?: number;
}

export default function Dropzone({
  accept = 'image/*',
  multiple = true,
  onFilesSelected,
  title = 'Drag & drop your files here',
  subtitle = 'Supports high resolution files up to 50MB',
  maxFiles = 20,
}: DropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    setErrorMsg(null);

    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;

    if (!multiple && files.length > 1) {
      setErrorMsg('Please select only one file.');
      onFilesSelected([files[0]]);
      return;
    }

    if (files.length > maxFiles) {
      setErrorMsg(`Maximum ${maxFiles} files allowed.`);
      onFilesSelected(files.slice(0, maxFiles));
      return;
    }

    onFilesSelected(files);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    onFilesSelected(files);
  };

  return (
    <div className="w-full">
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300
          flex flex-col items-center justify-center min-h-[200px] group
          ${isDragOver 
            ? 'border-indigo-500 bg-indigo-500/10 shadow-glow-md' 
            : 'border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 hover:bg-zinc-900/80'
          }
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileChange}
          className="hidden"
        />

        <div className={`
          w-14 h-14 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-center mb-4
          group-hover:border-indigo-500/40 group-hover:scale-110 transition-all text-indigo-400
          ${isDragOver ? 'border-indigo-500 text-indigo-300 scale-110' : ''}
        `}>
          <Upload className="w-6 h-6" />
        </div>

        <h4 className="text-sm font-semibold text-zinc-200 group-hover:text-indigo-300 transition-colors mb-1">
          {title}
        </h4>
        <p className="text-xs text-zinc-500 mb-4">
          {subtitle}
        </p>

        <button 
          type="button"
          className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-xs font-semibold text-zinc-200 transition-colors shadow-sm"
        >
          Browse Files
        </button>

        {errorMsg && (
          <div className="mt-3 flex items-center gap-1.5 text-xs text-rose-400 font-medium bg-rose-500/10 px-3 py-1.5 rounded-lg border border-rose-500/20">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>
    </div>
  );
}
