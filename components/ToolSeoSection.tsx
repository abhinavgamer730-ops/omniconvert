'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Zap, 
  Sparkles, 
  HelpCircle, 
  ChevronDown, 
  CheckCircle2, 
  Star, 
  Layers, 
  Lock, 
  Cpu, 
  HardDrive
} from 'lucide-react';
import { TOOLS } from '@/lib/tools-config';
import { TOOL_SEO_DETAILS, GLOBAL_FAQS } from '@/lib/seo-config';

interface ToolSeoSectionProps {
  toolId: string;
}

export default function ToolSeoSection({ toolId }: ToolSeoSectionProps) {
  const tool = TOOLS.find((t) => t.id === toolId);
  const details = TOOL_SEO_DETAILS[toolId];
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  if (!tool || !details) return null;

  const faqs = details.faqs && details.faqs.length > 0 ? details.faqs : GLOBAL_FAQS;

  return (
    <div className="mt-16 space-y-16 border-t border-zinc-800/80 pt-12 text-zinc-300">
      
      {/* Trust & Rating Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="flex text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amber-400" />
            ))}
          </div>
          <span className="text-sm font-bold text-white">
            {details.rating.score} / 5.0
          </span>
          <span className="text-xs text-zinc-400">
            ({details.rating.count.toLocaleString()} user ratings)
          </span>
        </div>
        <div className="flex items-center flex-wrap gap-4 text-xs font-medium text-zinc-400">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <CheckCircle2 className="w-4 h-4" /> 100% Free
          </span>
          <span className="flex items-center gap-1.5 text-indigo-400">
            <ShieldCheck className="w-4 h-4" /> Zero Server Uploads
          </span>
          <span className="flex items-center gap-1.5 text-purple-400">
            <Sparkles className="w-4 h-4" /> No Watermarks
          </span>
        </div>
      </div>

      {/* 3-Step How-To Guide */}
      <section className="space-y-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-300">
            <Layers className="w-3.5 h-3.5" />
            <span>Quick Guide</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            How to Use {tool.name} in 3 Simple Steps
          </h2>
          <p className="text-sm text-zinc-400">
            Convert and process your files effortlessly inside your web browser with zero technical setup.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {details.howToSteps.map((step) => (
            <div 
              key={step.step}
              className="relative p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/70 hover:border-zinc-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center font-bold text-sm mb-4">
                  0{step.step}
                </div>
                <h3 className="text-base font-semibold text-zinc-100 mb-2">
                  {step.title}
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features & Technical Advantages */}
      <section className="space-y-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-semibold text-purple-300">
            <Zap className="w-3.5 h-3.5" />
            <span>Key Advantages</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Why Choose OmniConvert for {tool.name}?
          </h2>
          <p className="text-sm text-zinc-400">
            Engineered with modern HTML5 APIs and WebAssembly for uncompromising speed and privacy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {details.highlights.map((h, i) => (
            <div key={i} className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800/60 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center mb-3">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-semibold text-zinc-200">{h.title}</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">{h.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Specifications & Supported Formats */}
      <section className="p-6 md:p-8 rounded-2xl bg-zinc-900/40 border border-zinc-800/60 space-y-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Cpu className="w-5 h-5 text-indigo-400" />
          Technical Specifications & Supported Formats
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-xs">
          <div className="space-y-2">
            <span className="font-semibold text-zinc-400 uppercase tracking-wider block">Input Formats</span>
            <div className="flex flex-wrap gap-2">
              {details.formats.input.map((fmt) => (
                <span key={fmt} className="px-2.5 py-1 rounded-lg bg-zinc-800 text-zinc-200 font-mono text-[11px]">
                  {fmt}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <span className="font-semibold text-zinc-400 uppercase tracking-wider block">Output Formats</span>
            <div className="flex flex-wrap gap-2">
              {details.formats.output.map((fmt) => (
                <span key={fmt} className="px-2.5 py-1 rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 font-mono text-[11px]">
                  {fmt}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <span className="font-semibold text-zinc-400 uppercase tracking-wider block">Processing Engine</span>
            <p className="text-zinc-300 leading-relaxed">
              100% Client-Side WebAssembly & HTML5 Canvas execution inside browser memory.
            </p>
          </div>
        </div>
      </section>

      {/* Privacy Comparison: OmniConvert vs Cloud Converters */}
      <section className="space-y-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-300">
            <Lock className="w-3.5 h-3.5" />
            <span>Privacy Guarantee</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            OmniConvert vs. Traditional Cloud Converters
          </h2>
          <p className="text-sm text-zinc-400">
            See why thousands of developers, professionals, and students trust our zero-upload architecture.
          </p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-zinc-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-900/90 text-zinc-300 border-b border-zinc-800">
              <tr>
                <th className="p-4 font-semibold">Feature / Metric</th>
                <th className="p-4 font-semibold text-indigo-400">OmniConvert (Local Client)</th>
                <th className="p-4 font-semibold text-zinc-400">Traditional Cloud Converters</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 bg-zinc-900/30">
              <tr>
                <td className="p-4 font-medium text-zinc-200">File Storage & Privacy</td>
                <td className="p-4 text-emerald-400 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 shrink-0" /> Zero bytes uploaded; stays on device
                </td>
                <td className="p-4 text-zinc-400">Uploaded to remote servers & cloud buckets</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-zinc-200">Processing Latency</td>
                <td className="p-4 text-emerald-400 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 shrink-0" /> Instant local rendering (0s upload wait)
                </td>
                <td className="p-4 text-zinc-400">Subject to network speeds and server queues</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-zinc-200">File Limits & Paywalls</td>
                <td className="p-4 text-emerald-400 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 shrink-0" /> Unlimited file size & daily usage
                </td>
                <td className="p-4 text-zinc-400">Capped (e.g. 25MB or 2 files per day)</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-zinc-200">Watermarks & Quality</td>
                <td className="p-4 text-emerald-400 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 shrink-0" /> Lossless original quality, no watermarks
                </td>
                <td className="p-4 text-zinc-400">Aggressive compression or forced watermarks</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-zinc-200">Offline Functionality</td>
                <td className="p-4 text-emerald-400 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 shrink-0" /> Supported via PWA and standalone bundle
                </td>
                <td className="p-4 text-zinc-400">Fails completely without internet</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Interactive FAQ Accordion */}
      <section className="space-y-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-semibold text-cyan-300">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Common Questions About {tool.name}
          </h2>
          <p className="text-sm text-zinc-400">
            Everything you need to know about using this tool safely, quickly, and freely.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div 
                key={idx}
                className="rounded-2xl border border-zinc-800 bg-zinc-900/40 overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-zinc-900/60 transition-colors"
                >
                  <span className="text-sm font-semibold text-zinc-100">
                    {faq.question}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-indigo-400' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-zinc-400 leading-relaxed border-t border-zinc-800/40">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}
