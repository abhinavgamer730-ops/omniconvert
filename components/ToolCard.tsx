'use client';

import React from 'react';
import Link from 'next/link';
import { 
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
  ArrowRight,
  Zap
} from 'lucide-react';
import { ToolDefinition } from '@/lib/tools-config';

const ICON_MAP: Record<string, React.ReactNode> = {
  FileText: <FileText className="w-6 h-6" />,
  ImageIcon: <ImageIcon className="w-6 h-6" />,
  FileCheck: <FileCheck className="w-6 h-6" />,
  Sparkles: <Sparkles className="w-6 h-6" />,
  Wand2: <Wand2 className="w-6 h-6" />,
  Video: <Video className="w-6 h-6" />,
  Film: <Film className="w-6 h-6" />,
  Instagram: <Instagram className="w-6 h-6" />,
  Youtube: <Youtube className="w-6 h-6" />,
  Facebook: <Facebook className="w-6 h-6" />,
  Mic: <Mic className="w-6 h-6" />,
  QrCode: <QrCode className="w-6 h-6" />,
  Shield: <Shield className="w-6 h-6" />,
  Palette: <Palette className="w-6 h-6" />,
  Database: <Database className="w-6 h-6" />,
  Type: <Type className="w-6 h-6" />,
  Crop: <Crop className="w-6 h-6" />,
  Calendar: <Calendar className="w-6 h-6" />,
  FileStack: <FileStack className="w-6 h-6" />,
};

interface ToolCardProps {
  tool: ToolDefinition;
}

export default function ToolCard({ tool }: ToolCardProps) {
  const icon = ICON_MAP[tool.iconName] || <Zap className="w-6 h-6" />;

  return (
    <Link 
      href={tool.href}
      className="group relative flex flex-col justify-between p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 
                 hover:border-indigo-500/40 hover:bg-zinc-900/90 transition-all duration-300 hover:shadow-glow-sm hover:-translate-y-1 overflow-hidden"
    >
      {/* Background ambient gradient glow on hover */}
      <div className={`absolute -right-12 -top-12 w-36 h-36 rounded-full bg-gradient-to-br ${tool.accentColor} opacity-0 group-hover:opacity-15 blur-2xl transition-opacity duration-500`} />

      <div>
        {/* Header row: Icon & Badges */}
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-indigo-400 group-hover:text-indigo-300 group-hover:border-indigo-500/30 group-hover:scale-105 transition-all">
            {icon}
          </div>
          <div className="flex items-center gap-1.5">
            {tool.badge && (
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                {tool.badge}
              </span>
            )}
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-zinc-800/80 text-zinc-400 border border-zinc-700/50">
              {tool.category}
            </span>
          </div>
        </div>

        {/* Title & Description */}
        <h3 className="text-base font-bold text-zinc-100 group-hover:text-indigo-300 transition-colors mb-2 flex items-center gap-2">
          {tool.name}
        </h3>
        <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2 mb-6">
          {tool.description}
        </p>
      </div>

      {/* Action CTA Footer */}
      <div className="pt-4 border-t border-zinc-800/50 flex items-center justify-between text-xs font-semibold text-zinc-400 group-hover:text-indigo-400 transition-colors">
        <span>Open Tool</span>
        <div className="w-7 h-7 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center group-hover:border-indigo-500/30 group-hover:bg-indigo-600 group-hover:text-white transition-all">
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </Link>
  );
}
