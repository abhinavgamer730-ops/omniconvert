'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldCheck, Cpu, Github, ExternalLink } from 'lucide-react';
import { TOOLS } from '@/lib/tools-config';

export default function Header() {
  const pathname = usePathname();
  const currentTool = TOOLS.find(t => t.href === pathname);

  return (
    <header className="sticky top-0 z-30 h-16 bg-zinc-950/80 border-b border-zinc-800/80 backdrop-blur-md px-6 flex items-center justify-between">
      {/* Title / Breadcrumb */}
      <div className="flex items-center gap-3 pl-10 lg:pl-0">
        <Link href="/" className="text-xs font-medium text-zinc-500 hover:text-zinc-300 transition-colors">
          Tools
        </Link>
        {currentTool && (
          <>
            <span className="text-zinc-700">/</span>
            <span className="text-xs font-semibold text-zinc-200">
              {currentTool.name}
            </span>
          </>
        )}
      </div>

      {/* Right Actions & Badges */}
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/90 border border-zinc-800 text-[11px] text-zinc-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Zero Server Storage</span>
        </div>

        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[11px] text-indigo-300">
          <Cpu className="w-3.5 h-3.5 text-indigo-400" />
          <span>Browser Processing</span>
        </div>
      </div>
    </header>
  );
}
