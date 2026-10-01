'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutGrid, 
  FileText, 
  Image as ImageIcon, 
  FileCheck, 
  Sparkles, 
  Video, 
  Mic, 
  QrCode,
  Wand2,
  Shield,
  Palette,
  Database,
  Type,
  Crop,
  Calendar,
  FileStack,
  Instagram,
  Youtube,
  Facebook,
  Film,
  Menu, 
  X, 
  Zap
} from 'lucide-react';
import { TOOLS } from '@/lib/tools-config';

const ICON_MAP: Record<string, React.ReactNode> = {
  FileText: <FileText className="w-4 h-4" />,
  ImageIcon: <ImageIcon className="w-4 h-4" />,
  FileCheck: <FileCheck className="w-4 h-4" />,
  Sparkles: <Sparkles className="w-4 h-4" />,
  Wand2: <Wand2 className="w-4 h-4" />,
  Video: <Video className="w-4 h-4" />,
  Film: <Film className="w-4 h-4" />,
  Instagram: <Instagram className="w-4 h-4" />,
  Youtube: <Youtube className="w-4 h-4" />,
  Facebook: <Facebook className="w-4 h-4" />,
  Mic: <Mic className="w-4 h-4" />,
  QrCode: <QrCode className="w-4 h-4" />,
  Shield: <Shield className="w-4 h-4" />,
  Palette: <Palette className="w-4 h-4" />,
  Database: <Database className="w-4 h-4" />,
  Type: <Type className="w-4 h-4" />,
  Crop: <Crop className="w-4 h-4" />,
  Calendar: <Calendar className="w-4 h-4" />,
  FileStack: <FileStack className="w-4 h-4" />,
};

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const categories = [
    { title: 'Overview', items: [{ id: 'dashboard', name: 'Dashboard', href: '/', iconName: 'LayoutGrid' }] },
    { title: 'Image Tools', items: TOOLS.filter(t => t.category === 'Image') },
    { title: 'Video & Audio', items: TOOLS.filter(t => t.category === 'Video & Audio') },
    { title: 'Text & Utilities', items: TOOLS.filter(t => t.category === 'Text & Utilities') },
    { title: 'Developer Tools', items: TOOLS.filter(t => t.category === 'Developer') },
  ];

  const renderIcon = (name: string) => {
    if (name === 'LayoutGrid') return <LayoutGrid className="w-4 h-4" />;
    return ICON_MAP[name] || <Zap className="w-4 h-4" />;
  };

  return (
    <>
      {/* Mobile menu open button */}
      {!isOpen && (
        <div className="lg:hidden fixed top-3.5 left-4 z-50">
          <button
            onClick={() => setIsOpen(true)}
            className="p-2 rounded-xl bg-zinc-900/90 border border-zinc-800 text-zinc-300 hover:text-white shadow-lg focus:outline-none"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Backdrop overlay for mobile */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)} 
          className="lg:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-40 transition-opacity"
        />
      )}

      {/* Sidebar container */}
      <aside className={`
        fixed top-0 left-0 bottom-0 z-40 w-64 bg-zinc-950/95 border-r border-zinc-800/80 
        backdrop-blur-xl flex flex-col justify-between transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo Header */}
          <div className="p-5 border-b border-zinc-900 flex items-center justify-between">
            <Link 
              href="/" 
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 p-0.5 shadow-glow-sm group-hover:shadow-glow-md transition-shadow">
                <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center">
                  <Zap className="w-5 h-5 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg text-white tracking-tight leading-none group-hover:text-indigo-300 transition-colors">
                  OmniConvert
                </span>
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 mt-1">
                  Client Utility Suite
                </span>
              </div>
            </Link>

            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
              aria-label="Close navigation menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {categories.map((group, idx) => (
              <div key={idx} className="space-y-1">
                <h3 className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider px-3 mb-2">
                  {group.title}
                </h3>
                {group.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`
                        flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all group relative
                        ${isActive 
                          ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-semibold shadow-glow-sm' 
                          : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/80 border border-transparent'
                        }
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`transition-colors ${isActive ? 'text-indigo-400' : 'text-zinc-500 group-hover:text-zinc-300'}`}>
                          {renderIcon(item.iconName)}
                        </span>
                        <span>{item.name}</span>
                      </div>
                      {'badge' in item && item.badge && (
                        <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          {item.badge}
                        </span>
                      )}
                      {isActive && (
                        <div className="w-1 h-4 rounded-r bg-indigo-500 absolute left-0 top-1/2 -translate-y-1/2" />
                      )}
                    </Link>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Footer Info */}
          <div className="p-4 border-t border-zinc-900 bg-zinc-950/60">
            <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/60 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <div className="flex flex-col">
                <span className="text-xs font-medium text-zinc-300">100% Client Side</span>
                <span className="text-[10px] text-zinc-500">Private & Fast Processing</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
