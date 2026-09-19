'use client';

import React from 'react';

interface AudioVisualizerProps {
  isRecording: boolean;
}

export default function AudioVisualizer({ isRecording }: AudioVisualizerProps) {
  return (
    <div className="flex items-center gap-1.5 h-10 px-4 py-2 rounded-full bg-zinc-900/80 border border-zinc-800">
      <div className={`w-2 h-2 rounded-full ${isRecording ? 'bg-rose-500 animate-ping' : 'bg-zinc-600'}`} />
      <div className="flex items-center gap-1 h-6">
        <span className={`w-1 rounded-full bg-rose-500 transition-all ${isRecording ? 'animate-wave-1' : 'h-2 bg-zinc-700'}`} />
        <span className={`w-1 rounded-full bg-rose-500 transition-all ${isRecording ? 'animate-wave-2' : 'h-3 bg-zinc-700'}`} />
        <span className={`w-1 rounded-full bg-rose-500 transition-all ${isRecording ? 'animate-wave-3' : 'h-1 bg-zinc-700'}`} />
        <span className={`w-1 rounded-full bg-rose-500 transition-all ${isRecording ? 'animate-wave-4' : 'h-4 bg-zinc-700'}`} />
        <span className={`w-1 rounded-full bg-rose-500 transition-all ${isRecording ? 'animate-wave-2' : 'h-2 bg-zinc-700'}`} />
      </div>
      <span className="text-xs font-semibold font-mono text-zinc-300 ml-1">
        {isRecording ? 'RECORDING' : 'IDLE'}
      </span>
    </div>
  );
}
