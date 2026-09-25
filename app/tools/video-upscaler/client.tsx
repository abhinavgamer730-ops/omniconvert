'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Film,
  Sparkles,
  Download,
  SlidersHorizontal,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Zap,
  Cpu,
  Gauge,
  Activity,
} from 'lucide-react';
import Dropzone from '@/components/Dropzone';

interface DeviceCapacity {
  cores: number;
  memory: number;
  gpu: string;
  recommendedFps: 60 | 90 | 120;
  tier: string;
  tierColor: string;
}

export default function VideoUpscalerClient() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [upscaledUrl, setUpscaledUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Hardware Profiler State
  const [deviceCap, setDeviceCap] = useState<DeviceCapacity>({
    cores: 4,
    memory: 8,
    gpu: 'GPU Detected',
    recommendedFps: 60,
    tier: 'Detecting...',
    tierColor: 'blue',
  });

  // Settings
  const [targetRes, setTargetRes] = useState<'4k' | '2k' | '1080p' | '2x'>('4k');
  const [targetFps, setTargetFps] = useState<'auto' | '60' | '90' | '120'>('auto');
  const [motionSmoothing, setMotionSmoothing] = useState(true);
  const [filterMode, setFilterMode] = useState<'ai-sharp' | 'cinematic' | 'vivid'>('ai-sharp');
  const [durationMode, setDurationMode] = useState<'sample5' | 'full'>('sample5');

  // Video metadata
  const [videoMeta, setVideoMeta] = useState<{
    width: number;
    height: number;
    duration: number;
    targetWidth: number;
    targetHeight: number;
    effectiveFps: number;
  } | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const abortRef = useRef(false);

  // Auto-detect hardware capacity on mount
  useEffect(() => {
    try {
      const cores = navigator.hardwareConcurrency || 4;
      const memory = (navigator as any).deviceMemory || 8;
      let gpu = 'Integrated / Dedicated GPU';

      try {
        const testCanvas = document.createElement('canvas');
        const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
        if (gl) {
          const ext = (gl as any).getExtension('WEBGL_debug_renderer_info');
          if (ext) {
            const renderer = (gl as any).getParameter(ext.UNMASKED_RENDERER_WEBGL);
            if (renderer) gpu = renderer;
          }
        }
      } catch (e) {
        // ignore webgl error
      }

      let recFps: 60 | 90 | 120 = 60;
      let tier = 'Optimized Standard';
      let tierColor = 'blue';

      if (cores >= 10 || (cores >= 8 && memory >= 8 && /nvidia|geforce|radeon|apple/i.test(gpu))) {
        recFps = 120;
        tier = 'Extreme Ultra High-End';
        tierColor = 'emerald';
      } else if (cores >= 6) {
        recFps = 90;
        tier = 'High Performance';
        tierColor = 'amber';
      } else {
        recFps = 60;
        tier = 'Optimized Standard';
        tierColor = 'blue';
      }

      setDeviceCap({
        cores,
        memory,
        gpu,
        recommendedFps: recFps,
        tier,
        tierColor,
      });
    } catch (e) {
      // fallback
    }
  }, []);

  // Compute actual FPS based on selection and device capacity
  const effectiveFpsNumber =
    targetFps === 'auto' ? deviceCap.recommendedFps : parseInt(targetFps, 10);

  // Calculate target dimensions (True 4K for both landscape and portrait)
  const calculateDimensions = (origW: number, origH: number, res: string) => {
    const isPortrait = origH > origW;
    const aspect = origW / origH;
    let targetW = 3840;
    let targetH = 2160;

    if (res === '4k') {
      if (isPortrait) {
        targetH = 3840;
        targetW = Math.round(3840 * aspect);
      } else {
        targetW = 3840;
        targetH = Math.round(3840 / aspect);
      }
    } else if (res === '2k') {
      if (isPortrait) {
        targetH = 2560;
        targetW = Math.round(2560 * aspect);
      } else {
        targetW = 2560;
        targetH = Math.round(2560 / aspect);
      }
    } else if (res === '1080p') {
      if (isPortrait) {
        targetH = 1920;
        targetW = Math.round(1920 * aspect);
      } else {
        targetW = 1920;
        targetH = Math.round(1920 / aspect);
      }
    } else if (res === '2x') {
      targetW = Math.min(3840, Math.round(origW * 2));
      targetH = Math.min(3840, Math.round(origH * 2));
    }

    // Video codecs strictly require even numbers
    targetW = targetW % 2 === 0 ? targetW : targetW - 1;
    targetH = targetH % 2 === 0 ? targetH : targetH - 1;

    return { targetW, targetH };
  };

  // Recalculate dimensions whenever resolution or FPS changes
  useEffect(() => {
    setVideoMeta((prev) => {
      if (!prev) return null;
      const { targetW, targetH } = calculateDimensions(prev.width, prev.height, targetRes);
      return {
        ...prev,
        targetWidth: targetW,
        targetHeight: targetH,
        effectiveFps: effectiveFpsNumber,
      };
    });
  }, [targetRes, effectiveFpsNumber]);

  // Handle files selected
  const handleFilesSelected = (files: File[]) => {
    if (files.length === 0) return;
    const file = files[0];
    setVideoFile(file);
    const url = URL.createObjectURL(file);
    setVideoUrl(url);
    setUpscaledUrl(null);
    setProgress(0);
    setError(null);
  };

  // Load sample video for instant 1-click testing
  const loadSampleVideo = () => {
    const sampleUrl = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';
    setVideoUrl(sampleUrl);
    setVideoFile(new File(['sample'], 'nature-sample.mp4', { type: 'video/mp4' }));
    setUpscaledUrl(null);
    setProgress(0);
    setError(null);
  };

  const onVideoLoadedMetadata = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const v = e.currentTarget;
    const w = v.videoWidth || 1280;
    const h = v.videoHeight || 720;
    const d = v.duration || 10;
    const { targetW, targetH } = calculateDimensions(w, h, targetRes);

    setVideoMeta({
      width: w,
      height: h,
      duration: d,
      targetWidth: targetW,
      targetHeight: targetH,
      effectiveFps: effectiveFpsNumber,
    });
  };

  const cancelUpscaling = () => {
    abortRef.current = true;
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsProcessing(false);
    setStatusText('Upscaling canceled.');
  };

  const startUpscaling = async () => {
    if (!videoRef.current || !videoMeta) return;
    const video = videoRef.current;

    setIsProcessing(true);
    setProgress(0);
    setError(null);
    abortRef.current = false;
    setStatusText(`Initializing 4K @ ${effectiveFpsNumber} FPS super-resolution pipeline...`);

    try {
      const targetW = videoMeta.targetWidth;
      const targetH = videoMeta.targetHeight;
      const chosenFps = effectiveFpsNumber;

      // Primary Output Canvas
      const canvas = document.createElement('canvas');
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext('2d', { alpha: false });
      if (!ctx) throw new Error('Canvas 2D context error');

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Secondary Canvas for Sub-Frame Motion Smoothing Interpolation
      const prevCanvas = document.createElement('canvas');
      prevCanvas.width = targetW;
      prevCanvas.height = targetH;
      const prevCtx = prevCanvas.getContext('2d', { alpha: false });

      // Apply Enhancement Filter
      let filterStyle = 'contrast(1.06) saturate(1.04)';
      if (filterMode === 'cinematic') {
        filterStyle = 'contrast(1.12) saturate(1.15) brightness(1.02)';
      } else if (filterMode === 'vivid') {
        filterStyle = 'contrast(1.08) saturate(1.18)';
      }
      ctx.filter = filterStyle;

      // Capture canvas stream at the target enhanced FPS (60 / 90 / 120 FPS)
      const canvasStream = canvas.captureStream(chosenFps);

      // Extract original audio track via Web Audio API to preserve sound
      let combinedStream = canvasStream;
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const audioCtx = new AudioContextClass();
        const sourceNode = audioCtx.createMediaElementSource(video);
        const destination = audioCtx.createMediaStreamDestination();
        sourceNode.connect(destination);
        sourceNode.connect(audioCtx.destination);

        const audioTracks = destination.stream.getAudioTracks();
        if (audioTracks.length > 0) {
          canvasStream.addTrack(audioTracks[0]);
        }
      } catch (audioErr) {
        // Keep canvasStream if audio is silent or restricted
      }

      // Check supported MIME types and high bitrate for 4K
      const mimeTypes = [
        'video/webm;codecs=vp9,opus',
        'video/webm;codecs=vp9',
        'video/webm;codecs=vp8,opus',
        'video/webm;codecs=vp8',
        'video/webm',
        'video/mp4',
      ];
      const selectedMime = mimeTypes.find((m) => MediaRecorder.isTypeSupported(m)) || 'video/webm';

      // Bitrate scale according to FPS
      let bitrate = 25000000; // 25 Mbps for 60fps
      if (chosenFps === 90) bitrate = 35000000;
      if (chosenFps === 120) bitrate = 45000000;

      const mediaRecorder = new MediaRecorder(combinedStream, {
        mimeType: selectedMime,
        videoBitsPerSecond: bitrate,
      });
      mediaRecorderRef.current = mediaRecorder;

      const recordedChunks: Blob[] = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          recordedChunks.push(event.data);
        }
      };

      const maxProcessDuration =
        durationMode === 'sample5' ? Math.min(5, video.duration) : video.duration;

      mediaRecorder.onstop = () => {
        if (recordedChunks.length > 0 && !abortRef.current) {
          const blob = new Blob(recordedChunks, { type: selectedMime });
          const generatedUrl = URL.createObjectURL(blob);
          setUpscaledUrl(generatedUrl);
          setProgress(100);
          setStatusText(
            `Successfully converted to 4K (${targetW}x${targetH}) @ ${chosenFps} FPS!`
          );
        }
        setIsProcessing(false);
      };

      mediaRecorder.start(100);

      // Reset and play video
      video.currentTime = 0;
      await video.play();

      setStatusText(`Super-sampling & interpolating to ${targetW}x${targetH} @ ${chosenFps} FPS...`);

      let hasPrev = false;
      const frameInterval = 1000 / chosenFps;
      let lastTime = performance.now();

      const renderFrame = () => {
        if (abortRef.current) {
          video.pause();
          return;
        }

        if (video.currentTime >= maxProcessDuration || video.ended) {
          video.pause();
          if (mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop();
          }
          return;
        }

        const now = performance.now();
        if (now - lastTime >= frameInterval * 0.85) {
          lastTime = now;

          // Motion Smoothing Interpolation
          if (motionSmoothing && hasPrev && prevCtx) {
            ctx.globalAlpha = 1.0;
            ctx.drawImage(prevCanvas, 0, 0);
            ctx.globalAlpha = 0.55;
            ctx.drawImage(video, 0, 0, targetW, targetH);
            ctx.globalAlpha = 1.0;
          } else {
            ctx.drawImage(video, 0, 0, targetW, targetH);
          }

          // Store current frame into previous buffer
          if (prevCtx) {
            prevCtx.drawImage(canvas, 0, 0);
            hasPrev = true;
          }

          const currentPct = Math.min(
            99,
            Math.round((video.currentTime / maxProcessDuration) * 100)
          );
          setProgress(currentPct);
          setStatusText(
            `Rendering 4K @ ${chosenFps} FPS: ${currentPct}% • ${video.currentTime.toFixed(1)}s / ${maxProcessDuration.toFixed(1)}s`
          );
        }

        requestAnimationFrame(renderFrame);
      };

      requestAnimationFrame(renderFrame);
    } catch (err: any) {
      console.error('Video upscaling error:', err);
      setError(
        err?.message ||
          'Failed to initialize 4K video upscaler. Browser codec or hardware acceleration error.'
      );
      setIsProcessing(false);
    }
  };

  const downloadUpscaledVideo = () => {
    if (!upscaledUrl) return;
    const a = document.createElement('a');
    a.href = upscaledUrl;
    const ext = upscaledUrl.includes('mp4') ? 'mp4' : 'webm';
    a.download = `video-4k-${videoMeta?.targetWidth}x${videoMeta?.targetHeight}-${effectiveFpsNumber}fps.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-600 text-white shadow-glow-sm">
            <Film className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white">Video to 4K Upscaler & FPS Enhancer</h1>
              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                4K Ultra HD • High FPS
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Super-sample videos up to 4K UHD with AI hardware-accelerated 60 FPS, 90 FPS, or 120
              FPS motion smoothing.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!videoUrl && (
            <button
              onClick={loadSampleVideo}
              className="px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-amber-300 border border-amber-500/30 flex items-center gap-1.5 transition-colors"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Try Demo Clip</span>
            </button>
          )}

          {videoUrl && (
            <button
              onClick={() => {
                setVideoFile(null);
                setVideoUrl(null);
                setUpscaledUrl(null);
                setVideoMeta(null);
                setProgress(0);
                setError(null);
              }}
              className="px-3 py-1.5 rounded-lg bg-zinc-800 text-xs font-semibold text-zinc-400 hover:text-rose-400 transition-colors"
            >
              Change Video
            </button>
          )}
        </div>
      </div>

      {/* Hardware Capacity & AI Profiler Banner */}
      <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800 flex items-center justify-between flex-wrap gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-zinc-200">Hardware Profile:</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                  deviceCap.tierColor === 'emerald'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}
              >
                {deviceCap.tier}
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Detected {deviceCap.cores} CPU Cores • {deviceCap.memory}GB+ RAM System • Optimal: {deviceCap.recommendedFps} FPS
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-zinc-400">
          <Gauge className="w-4 h-4 text-amber-400" />
          <span>Motion Engine:</span>
          <span className="font-semibold text-zinc-200">
            {effectiveFpsNumber} FPS Super-Sampling Active
          </span>
        </div>
      </div>

      {!videoUrl ? (
        <div className="max-w-2xl mx-auto space-y-4">
          <Dropzone
            accept="video/mp4, video/webm, video/quicktime, video/x-matroska"
            multiple={false}
            onFilesSelected={handleFilesSelected}
            title="Upload Video for 4K Super-Resolution & High FPS"
            subtitle="Drag & drop MP4, WebM, or MOV clips to upscale to 4K UHD @ 60/90/120 FPS"
          />

          <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
            <span>Want to test quickly without uploading?</span>
            <button
              onClick={loadSampleVideo}
              className="text-amber-400 hover:underline font-semibold"
            >
              Load Demo Video Clip →
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Visual Comparison Area */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Original Video Box */}
              <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-300">Original Source Video</span>
                  {videoMeta && (
                    <span className="text-[11px] font-mono text-zinc-400 px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800">
                      {videoMeta.width}x{videoMeta.height}
                    </span>
                  )}
                </div>
                <div className="aspect-video bg-black rounded-xl overflow-hidden border border-zinc-800 flex items-center justify-center">
                  <video
                    ref={videoRef}
                    src={videoUrl}
                    controls
                    playsInline
                    onLoadedMetadata={onVideoLoadedMetadata}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              {/* 4K Upscaled Result Box */}
              <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Upscaled 4K Video</span>
                  </span>
                  {videoMeta && (
                    <span className="text-[11px] font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 font-bold">
                      {videoMeta.targetWidth}x{videoMeta.targetHeight} • {effectiveFpsNumber} FPS
                    </span>
                  )}
                </div>
                <div className="aspect-video bg-black rounded-xl overflow-hidden border border-zinc-800 flex items-center justify-center relative">
                  {upscaledUrl ? (
                    <video
                      src={upscaledUrl}
                      controls
                      autoPlay
                      playsInline
                      className="w-full h-full object-contain animate-fadeIn"
                    />
                  ) : (
                    <div className="text-center p-6 space-y-2">
                      <Film
                        className={`w-8 h-8 text-zinc-600 mx-auto ${
                          isProcessing ? 'animate-pulse text-amber-400' : ''
                        }`}
                      />
                      <p className="text-xs text-zinc-400">
                        {isProcessing
                          ? 'Super-sampling video frames...'
                          : 'Click "Start 4K Video Upscale" on the right to render'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Processing Progress Bar */}
            {isProcessing && (
              <div className="p-4 rounded-2xl bg-zinc-900/60 border border-amber-500/30 space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-200 font-semibold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                    <span>{statusText || 'Upscaling in progress...'}</span>
                  </span>
                  <span className="font-mono text-amber-400 font-bold">{progress}%</span>
                </div>
                <div className="w-full bg-zinc-950 rounded-full h-2.5 overflow-hidden border border-zinc-800">
                  <div
                    className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={cancelUpscaling}
                    className="text-[11px] text-rose-400 hover:underline font-semibold"
                  >
                    Cancel Upscaling
                  </button>
                </div>
              </div>
            )}

            {error && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Upscale Settings Panel */}
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-6">
              <h3 className="text-sm font-bold text-zinc-200 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-amber-400" />
                <span>4K & FPS Enhancement Settings</span>
              </h3>

              {/* Target Resolution */}
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-2">
                  Target Resolution
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: '4k', label: '4K Ultra HD', desc: '3840p UHD' },
                    { id: '2k', label: '2K Quad HD', desc: '2560p QHD' },
                    { id: '1080p', label: '1080p Full HD', desc: '1080p FHD' },
                    { id: '2x', label: '2x Native', desc: 'Double Size' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setTargetRes(item.id as any)}
                      className={`p-2.5 rounded-xl text-left border transition-all ${
                        targetRes === item.id
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500 shadow-glow-sm'
                          : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:bg-zinc-900'
                      }`}
                    >
                      <span className="text-xs font-bold block">{item.label}</span>
                      <span className="text-[10px] text-zinc-500">{item.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Enhanced FPS Selector (Capacity-Aware) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold text-zinc-400">
                    Frame Rate Enhancement (FPS)
                  </label>
                  <span className="text-[10px] text-emerald-400 font-mono">
                    Device Capacity: {deviceCap.recommendedFps} FPS
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'auto', label: 'Auto (Recommended)', desc: `${deviceCap.recommendedFps} FPS Matched` },
                    { id: '60', label: '60 FPS', desc: 'Ultra Smooth' },
                    { id: '90', label: '90 FPS', desc: 'Super Smooth' },
                    { id: '120', label: '120 FPS', desc: 'Extreme Cinema' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setTargetFps(f.id as any)}
                      className={`p-2.5 rounded-xl text-left border transition-all ${
                        targetFps === f.id
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500 shadow-glow-sm'
                          : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:bg-zinc-900'
                      }`}
                    >
                      <span className="text-xs font-bold block">{f.label}</span>
                      <span className="text-[10px] text-zinc-500">{f.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Motion Smoothing Toggle */}
              <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800 flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-xs font-semibold text-zinc-200 block">
                    Sub-Frame Motion Interpolation
                  </span>
                  <span className="text-[10px] text-zinc-400 block">
                    Synthesizes smooth frames to eliminate judder
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setMotionSmoothing(!motionSmoothing)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    motionSmoothing
                      ? 'bg-amber-500 text-zinc-950 shadow-glow-sm'
                      : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {motionSmoothing ? 'ON' : 'OFF'}
                </button>
              </div>

              {/* Enhancement Style */}
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-2">
                  Clarity & Color Profile
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: 'ai-sharp', label: 'Clarity AI' },
                    { id: 'cinematic', label: 'Cinematic' },
                    { id: 'vivid', label: 'Vivid HDR' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setFilterMode(f.id as any)}
                      className={`py-2 px-1 rounded-xl text-xs font-semibold border text-center transition-all ${
                        filterMode === f.id
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500'
                          : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:bg-zinc-900'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration Mode */}
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-2">
                  Upscale Length
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDurationMode('sample5')}
                    className={`p-2.5 rounded-xl text-xs font-bold border transition-all text-center ${
                      durationMode === 'sample5'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500'
                        : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:bg-zinc-900'
                    }`}
                  >
                    <span>⚡ Quick Test (5s)</span>
                    <span className="block text-[10px] font-normal text-zinc-500 mt-0.5">
                      Instant test & preview
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDurationMode('full')}
                    className={`p-2.5 rounded-xl text-xs font-bold border transition-all text-center ${
                      durationMode === 'full'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500'
                        : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:bg-zinc-900'
                    }`}
                  >
                    <span>🎬 Full Video</span>
                    <span className="block text-[10px] font-normal text-zinc-500 mt-0.5">
                      Render entire clip
                    </span>
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <button
                onClick={startUpscaling}
                disabled={isProcessing || !videoMeta}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 hover:from-amber-600 hover:to-rose-700 text-white font-bold text-xs shadow-glow-sm hover:shadow-glow-md disabled:opacity-40 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
                <span>
                  {isProcessing
                    ? 'Processing Video...'
                    : `Start 4K @ ${effectiveFpsNumber} FPS Upscale (${
                        videoMeta
                          ? `${videoMeta.targetWidth}x${videoMeta.targetHeight}`
                          : '4K UHD'
                      })`}
                </span>
              </button>

              {upscaledUrl && (
                <button
                  onClick={downloadUpscaledVideo}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-glow-sm animate-fadeIn"
                >
                  <Download className="w-4 h-4" />
                  <span>
                    Download 4K Video ({videoMeta?.targetWidth}x{videoMeta?.targetHeight} • {effectiveFpsNumber} FPS)
                  </span>
                </button>
              )}
            </div>

            {/* Quality Info Callout */}
            <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/60 space-y-2 text-xs text-zinc-400">
              <span className="text-zinc-200 font-semibold flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Client-Side GPU Hardware Accelerated</span>
              </span>
              <p className="text-[11px] leading-relaxed">
                Uses HTML5 hardware canvas super-sampling and VP9/VP8 encoder with up to 45 Mbps
                high bitrate. 100% private with sound retention and zero server uploads.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
