'use client';

import React, { useState } from 'react';
import { Type, Copy, Trash2, Check, Clock, AlignLeft, FileText, Sparkles } from 'lucide-react';

export default function WordCounterClient() {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);

  // Real-time metric computations
  const charactersWithSpaces = text.length;
  const charactersWithoutSpaces = text.replace(/\s/g, '').length;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const paragraphs = text.trim() ? text.split(/\n+/).filter(p => p.trim().length > 0).length : 0;
  
  // Reading time based on average 200 words per minute
  const readingTimeMinutes = Math.ceil(words / 200);

  const handleUppercase = () => {
    setText(text.toUpperCase());
  };

  const handleLowercase = () => {
    setText(text.toLowerCase());
  };

  const handleTitleCase = () => {
    const titleCased = text.replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase()
    );
    setText(titleCased);
  };

  const handleCleanWhitespace = () => {
    const cleaned = text.replace(/[ \t]+/g, ' ').replace(/\n\s*\n/g, '\n\n').trim();
    setText(cleaned);
  };

  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header Banner with H1 */}
      <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Type className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white">Free Online Word & Character Counter</h1>
              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Live Metrics
              </span>
            </div>
            <p className="text-xs text-zinc-400">Instantly count words, characters, paragraphs, and reading time with instant text formatting.</p>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-1">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold">Words</span>
            <AlignLeft className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">{words.toLocaleString()}</div>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-1">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold">Chars (with spaces)</span>
            <Type className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">{charactersWithSpaces.toLocaleString()}</div>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-1">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold">Chars (no spaces)</span>
            <Type className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">{charactersWithoutSpaces.toLocaleString()}</div>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-1">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold">Paragraphs</span>
            <FileText className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">{paragraphs.toLocaleString()}</div>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-1 col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold">Est. Reading Time</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">
            {readingTimeMinutes} {readingTimeMinutes === 1 ? 'min' : 'mins'}
          </div>
        </div>
      </div>

      {/* Main Text Area & Toolbar Workspace */}
      <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Input Text</label>
          {text && (
            <button
              onClick={() => setText('')}
              className="text-xs text-rose-400 hover:text-rose-300 transition-colors flex items-center gap-1 font-semibold"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Text</span>
            </button>
          )}
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste your text here to calculate instant metrics..."
          rows={12}
          className="w-full p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-500 leading-relaxed font-sans"
        />

        {/* Action Button Bar */}
        <div className="flex items-center justify-between flex-wrap gap-3 pt-2">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleUppercase}
              disabled={!text}
              className="px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-xs font-semibold text-zinc-200 hover:text-white disabled:opacity-40 transition-colors"
            >
              UPPERCASE
            </button>
            <button
              onClick={handleLowercase}
              disabled={!text}
              className="px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-xs font-semibold text-zinc-200 hover:text-white disabled:opacity-40 transition-colors"
            >
              lowercase
            </button>
            <button
              onClick={handleTitleCase}
              disabled={!text}
              className="px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-xs font-semibold text-zinc-200 hover:text-white disabled:opacity-40 transition-colors"
            >
              Title Case
            </button>
            <button
              onClick={handleCleanWhitespace}
              disabled={!text}
              className="px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-xs font-semibold text-zinc-200 hover:text-white disabled:opacity-40 transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Trim Spaces</span>
            </button>
          </div>

          <button
            onClick={handleCopy}
            disabled={!text}
            className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-glow-sm disabled:opacity-40 transition-all flex items-center gap-2"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Text'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
