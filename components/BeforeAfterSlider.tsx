'use client';

import React, { useState, useRef, useCallback } from 'react';
import { SlidersHorizontal } from 'lucide-react';

interface BeforeAfterSliderProps {
  originalImage: string;
  processedImage: string;
  originalLabel?: string;
  processedLabel?: string;
  className?: string;
}

export default function BeforeAfterSlider({
  originalImage,
  processedImage,
  originalLabel = 'Original',
  processedLabel = 'Enhanced / Compressed',
  className = '',
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let percentage = (x / rect.width) * 100;
    if (percentage < 0) percentage = 0;
    if (percentage > 100) percentage = 100;
    setSliderPosition(percentage);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (isDragging && e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  }, [isDragging, handleMove]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging) {
      handleMove(e.clientX);
    }
  }, [isDragging, handleMove]);

  return (
    <div 
      ref={containerRef}
      onMouseDown={() => setIsDragging(true)}
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
      onMouseMove={handleMouseMove}
      onTouchStart={() => setIsDragging(true)}
      onTouchEnd={() => setIsDragging(false)}
      onTouchMove={handleTouchMove}
      className={`relative w-full h-[400px] sm:h-[480px] rounded-2xl overflow-hidden select-none bg-zinc-950 border border-zinc-800 shadow-2xl cursor-ew-resize ${className}`}
    >
      {/* Processed (After) Image - Background full width */}
      <img
        src={processedImage}
        alt="Processed output preview"
        className="absolute inset-0 w-full h-full object-contain pointer-events-none"
      />
      <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full bg-indigo-600/80 backdrop-blur-md text-white text-[11px] font-semibold border border-indigo-400/30 shadow-md">
        {processedLabel}
      </div>

      {/* Original (Before) Image - Clipped overlay */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{ width: `${sliderPosition}%` }}
      >
        <img
          src={originalImage}
          alt="Original input preview"
          className="absolute inset-0 w-full h-full object-contain pointer-events-none"
          style={{ width: containerRef.current?.getBoundingClientRect().width || '100%', maxWidth: 'none' }}
        />
        <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-zinc-900/80 backdrop-blur-md text-zinc-300 text-[11px] font-semibold border border-zinc-700 shadow-md">
          {originalLabel}
        </div>
      </div>

      {/* Vertical divider bar & handle */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white/90 shadow-[0_0_10px_rgba(255,255,255,0.8)] z-20 pointer-events-none"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-zinc-900 border-2 border-white text-indigo-400 flex items-center justify-center shadow-glow-md">
          <SlidersHorizontal className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}
