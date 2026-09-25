'use client';

import React, { useState } from 'react';
import { Search, Sparkles, Shield, Cpu, Zap, ArrowUpRight } from 'lucide-react';
import { TOOLS, ToolCategory } from '@/lib/tools-config';
import ToolCard from '@/components/ToolCard';

export default function DashboardHome() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory>('All');

  const categories: ToolCategory[] = ['All', 'Image', 'Video & Audio', 'Text & Utilities', 'Developer'];

  const filteredTools = TOOLS.filter((tool) => {
    const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory;
    const matchesSearch = 
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-10 pb-12">
      {/* Hero Section */}
      <section className="relative rounded-3xl p-8 md:p-12 overflow-hidden border border-zinc-800/80 bg-gradient-to-b from-zinc-900/90 via-zinc-900/40 to-zinc-950 shadow-2xl">
        {/* Glow ambient background elements */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-300">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Modern Web Utility Suite</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Universal Client-Side <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              Media & Text Suite
            </span>
          </h1>

          <p className="text-sm md:text-base text-zinc-400 leading-relaxed">
            Convert, compress, upscale, and transcribe files instantly in your browser. 
            Zero server uploads, zero file limits, 100% data privacy.
          </p>

          {/* Search bar */}
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <input
              type="text"
              placeholder="Search tools (e.g., PDF, compress, audio, QR code...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-zinc-950/90 border border-zinc-800 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 shadow-inner transition-all"
            />
          </div>
        </div>
      </section>

      {/* Category Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-zinc-800/60 pb-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`
                px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all
                ${selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-glow-sm'
                  : 'bg-zinc-900/60 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                }
              `}
            >
              {cat}
            </button>
          ))}
        </div>

        <span className="text-xs font-medium text-zinc-500">
          Showing {filteredTools.length} tools
        </span>
      </div>

      {/* Tools Grid */}
      {filteredTools.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl bg-zinc-900/30 border border-zinc-800/60">
          <p className="text-sm font-medium text-zinc-400">No tools found matching &quot;{searchQuery}&quot;</p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
            className="mt-3 text-xs font-semibold text-indigo-400 hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Features Overview Cards */}
      <section className="pt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/60 flex items-start gap-4">
          <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-zinc-200 mb-1">100% Private Processing</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">Files stay strictly on your local machine. No data is sent to external servers.</p>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/60 flex items-start gap-4">
          <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-zinc-200 mb-1">Ultra Fast Execution</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">Powered by HTML5 Web APIs & WebAssembly for instantaneous local execution.</p>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/60 flex items-start gap-4">
          <div className="p-3 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-zinc-200 mb-1">Ready for Vercel/Netlify</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">Static & SSR ready architecture easy to deploy on modern serverless platforms.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
