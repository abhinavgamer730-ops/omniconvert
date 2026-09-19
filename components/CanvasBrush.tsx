'use client';

import React, { useRef, useState, useEffect, useCallback, useImperativeHandle, forwardRef } from 'react';
import { Undo, RotateCcw, Paintbrush } from 'lucide-react';

export interface CanvasBrushRef {
  getMaskDataUrl: () => string | null;
  clearMask: () => void;
  undo: () => void;
}

interface CanvasBrushProps {
  imageUrl: string;
  brushSize: number;
  onBrushSizeChange?: (size: number) => void;
}

const CanvasBrush = forwardRef<CanvasBrushRef, CanvasBrushProps>(({
  imageUrl,
  brushSize,
  onBrushSizeChange,
}, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement>(null);
  
  const [isDrawing, setIsDrawing] = useState(false);
  const [undoStack, setUndoStack] = useState<ImageData[]>([]);
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);

  // Initialize overlay canvas dimensions once image is loaded
  const handleImageLoad = () => {
    if (!imageRef.current || !maskCanvasRef.current) return;
    const img = imageRef.current;
    const canvas = maskCanvasRef.current;
    
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    setImageDimensions({ width: img.naturalWidth, height: img.naturalHeight });

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Save initial blank state
      const initialData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      setUndoStack([initialData]);
    }
  };

  const pushUndoState = useCallback(() => {
    if (!maskCanvasRef.current) return;
    const ctx = maskCanvasRef.current.getContext('2d');
    if (ctx) {
      const currentData = ctx.getImageData(0, 0, maskCanvasRef.current.width, maskCanvasRef.current.height);
      setUndoStack((prev) => [...prev.slice(-15), currentData]); // Keep up to 15 undo steps
    }
  }, []);

  const handleUndo = useCallback(() => {
    if (undoStack.length <= 1 || !maskCanvasRef.current) return;
    const newStack = [...undoStack];
    newStack.pop(); // Remove current state
    const previousState = newStack[newStack.length - 1];

    const ctx = maskCanvasRef.current.getContext('2d');
    if (ctx && previousState) {
      ctx.putImageData(previousState, 0, 0);
    }
    setUndoStack(newStack);
  }, [undoStack]);

  const handleClear = useCallback(() => {
    if (!maskCanvasRef.current) return;
    const canvas = maskCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const blankData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      setUndoStack([blankData]);
    }
  }, []);

  useImperativeHandle(ref, () => ({
    getMaskDataUrl: () => {
      if (!maskCanvasRef.current) return null;
      return maskCanvasRef.current.toDataURL('image/png');
    },
    clearMask: handleClear,
    undo: handleUndo,
  }));

  const lastPointRef = useRef<{ x: number; y: number } | null>(null);

  const getCanvasCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    if (!maskCanvasRef.current || !imageRef.current) return null;
    const canvas = maskCanvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    let clientX = 0;
    let clientY = 0;

    if ('touches' in e && e.touches[0]) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ('clientX' in e) {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const scaleX = canvas.width / (rect.width || 1);
    const scaleY = canvas.height / (rect.height || 1);

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const drawStroke = (from: { x: number; y: number }, to: { x: number; y: number }) => {
    if (!maskCanvasRef.current) return;
    const ctx = maskCanvasRef.current.getContext('2d');
    if (!ctx) return;

    const displayWidth = imageRef.current?.clientWidth || maskCanvasRef.current.width;
    const computedLineWidth = brushSize * (maskCanvasRef.current.width / displayWidth);

    ctx.fillStyle = 'rgba(244, 63, 94, 0.75)';
    ctx.strokeStyle = 'rgba(244, 63, 94, 0.75)';
    ctx.lineWidth = computedLineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(to.x, to.y, computedLineWidth / 2, 0, Math.PI * 2);
    ctx.fill();
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const coords = getCanvasCoordinates(e);
    if (!coords) return;

    setIsDrawing(true);
    pushUndoState();
    lastPointRef.current = coords;

    // Draw single dot at start position
    drawStroke(coords, coords);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !lastPointRef.current) return;
    const coords = getCanvasCoordinates(e);
    if (!coords) return;

    drawStroke(lastPointRef.current, coords);
    lastPointRef.current = coords;
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    lastPointRef.current = null;
  };

  return (
    <div className="space-y-4">
      {/* Brush Control Toolbar */}
      <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <Paintbrush className="w-4 h-4 text-pink-400 shrink-0" />
          <span className="text-xs font-semibold text-zinc-300">Brush Size ({brushSize}px)</span>
          <input
            type="range"
            min="5"
            max="100"
            value={brushSize}
            onChange={(e) => onBrushSizeChange && onBrushSizeChange(Number(e.target.value))}
            className="w-32 accent-pink-500 cursor-pointer"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleUndo}
            disabled={undoStack.length <= 1}
            className="px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs font-semibold text-zinc-300 hover:text-white disabled:opacity-30 transition-colors flex items-center gap-1.5"
          >
            <Undo className="w-3.5 h-3.5" />
            <span>Undo</span>
          </button>

          <button
            onClick={handleClear}
            className="px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs font-semibold text-zinc-300 hover:text-white transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear Mask</span>
          </button>
        </div>
      </div>

      {/* Workspace Canvas Area */}
      <div 
        ref={containerRef}
        className="relative w-full min-h-[380px] max-h-[520px] rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800 flex items-center justify-center select-none"
      >
        <img
          ref={imageRef}
          src={imageUrl}
          alt="Source image for object erasing"
          onLoad={handleImageLoad}
          className="max-h-[500px] w-auto object-contain pointer-events-none"
        />

        <canvas
          ref={maskCanvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="absolute cursor-crosshair touch-none"
          style={{
            width: imageRef.current?.clientWidth || '100%',
            height: imageRef.current?.clientHeight || '100%',
          }}
        />
      </div>
    </div>
  );
});

CanvasBrush.displayName = 'CanvasBrush';
export default CanvasBrush;
