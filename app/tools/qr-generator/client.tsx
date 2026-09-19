'use client';

import React, { useState, useRef } from 'react';
import { QRCodeSVG, QRCodeCanvas } from 'qrcode.react';
import { QrCode, Download, Copy, CheckCircle, Palette, Sliders, Link as LinkIcon, Wifi, Mail } from 'lucide-react';

export default function QrGeneratorClient() {
  const [qrText, setQrText] = useState('https://github.com');
  const [fgColor, setFgColor] = useState('#ffffff');
  const [bgColor, setBgColor] = useState('#09090b');
  const [size, setSize] = useState<number>(256);
  const [level, setLevel] = useState<'L' | 'M' | 'Q' | 'H'>('H');
  const [includeMargin, setIncludeMargin] = useState(true);
  const [presetType, setPresetType] = useState<'url' | 'wifi' | 'text'>('url');

  const canvasRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<HTMLDivElement>(null);

  const downloadPNG = () => {
    const canvas = canvasRef.current?.querySelector('canvas');
    if (!canvas) return;
    const image = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = image;
    a.download = 'custom-qrcode.png';
    a.click();
  };

  const downloadSVG = () => {
    const svgElement = svgRef.current?.querySelector('svg');
    if (!svgElement) return;
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    const a = document.createElement('a');
    a.href = svgUrl;
    a.download = 'custom-qrcode.svg';
    a.click();
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <QrCode className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">QR Code Generator</h1>
            <p className="text-xs text-zinc-400">Generate customizable QR codes for links, text, or credentials and export as PNG or SVG.</p>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Inputs & Customizations */}
        <div className="lg:col-span-2 space-y-6">
          {/* Input Panel */}
          <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-4">
            <h3 className="text-sm font-bold text-zinc-200 flex items-center gap-2">
              <LinkIcon className="w-4 h-4 text-cyan-400" />
              <span>QR Content</span>
            </h3>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-2">URL or Plain Text</label>
              <textarea
                value={qrText}
                onChange={(e) => setQrText(e.target.value)}
                placeholder="Enter URL (https://...) or any plain text..."
                rows={4}
                className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Style Customization Panel */}
          <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-6">
            <h3 className="text-sm font-bold text-zinc-200 flex items-center gap-2">
              <Palette className="w-4 h-4 text-cyan-400" />
              <span>Design & Colors</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Foreground Color */}
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-2">QR Code Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="w-10 h-10 rounded-xl bg-transparent border border-zinc-700 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="w-28 px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-200"
                  />
                </div>
              </div>

              {/* Background Color */}
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-2">Background Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-10 h-10 rounded-xl bg-transparent border border-zinc-700 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-28 px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-200"
                  />
                </div>
              </div>
            </div>

            {/* Error Correction & Size */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-2">Error Correction Level</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['L', 'M', 'Q', 'H'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setLevel(lvl)}
                      className={`py-2 rounded-xl text-xs font-bold border ${
                        level === lvl
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500'
                          : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:bg-zinc-900'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-2">Size ({size}px)</label>
                <input
                  type="range"
                  min="128"
                  max="512"
                  step="16"
                  value={size}
                  onChange={(e) => setSize(Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer mt-2"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Live Preview & Download Card */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-6 text-center">
            <h3 className="text-sm font-bold text-zinc-200">Live Preview</h3>

            {/* Render Container */}
            <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-center shadow-inner min-h-[280px]">
              <div ref={canvasRef} className="hidden">
                <QRCodeCanvas
                  value={qrText || ' '}
                  size={size}
                  fgColor={fgColor}
                  bgColor={bgColor}
                  level={level}
                  includeMargin={includeMargin}
                />
              </div>

              <div ref={svgRef} className="p-3 rounded-xl" style={{ backgroundColor: bgColor }}>
                <QRCodeSVG
                  value={qrText || ' '}
                  size={Math.min(size, 240)}
                  fgColor={fgColor}
                  bgColor={bgColor}
                  level={level}
                  includeMargin={includeMargin}
                />
              </div>
            </div>

            {/* Export Buttons */}
            <div className="space-y-3 pt-2">
              <button
                onClick={downloadPNG}
                disabled={!qrText}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-zinc-950 font-bold text-xs shadow-glow-sm hover:shadow-glow-md disabled:opacity-40 transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Download High-Res PNG</span>
              </button>

              <button
                onClick={downloadSVG}
                disabled={!qrText}
                className="w-full py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Download Vector SVG</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
