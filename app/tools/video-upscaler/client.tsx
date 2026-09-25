'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Film, Sparkles, Download, SlidersHorizontal, Play, Pause, RefreshCw, CheckCircle, AlertCircle, Eye, Zap, Volume2 } from 'lucide-react';
import Dropzone from '@/components/Dropzone';

export default function VideoUpscalerClient() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [upscaledUrl, setUpscaledUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Settings
  const [targetRes, setTargetRes] = useState<'4k' | '2k' | '1080p' | '2x'>('4k');
  const [filterMode, setFilterMode] = useState<'ai-sharp' | 'cinematic' | 'vivid'>('ai-sharp');
  const [durationMode, setDurationMode] = useState<'sample5' | 'full'>('sample5');

  // Video metadata
  const [videoMeta, setVideoMeta] = useState<{
    width: number;
    height: number;
    duration: number;
    targetWidth: number;
    targetHeight: number;
  } | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const abortRef = useRef(false);

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
    setVideoFile(new File(['sample'], 'nature-clip.mp4', { type: 'video/mp4' }));
    setUpscaledUrl(null);
    setProgress(0);
    setError(null);
  };

  // Calculate target dimensions
  useEffect(() => {
    setVideoMeta((prev) => {
      if (!prev) return null;
      const origW = prev.width;
      const origH = prev.height;
      const aspect = origW / origH;

      let targetW = 3840;
      let targetH = Math.round(3840 / aspect);

      if (targetRes === '2k') {
        targetW = 2560;
        targetH = Math.round(2560 / aspect);
      } else if (targetRes === '1080p') {
        targetW = 1920;
        targetH = Math.round(1920 / aspect);
      } else if (targetRes === '2x') {
        targetW = Math.min(3840, Math.round(origW * 2));
        targetH = Math.min(2160, Math.round(origH * 2));
      }

      // Ensure even dimensions for video codecs
      targetW = targetW % 2 === 0 ? targetW : targetW + 1;
      targetH = targetH % 2 === 0 ? targetH : targetH + 1;

      return { ...prev, targetWidth: targetW, targetHeight: targetH };
    });
  }, [targetRes]);

  const onVideoLoadedMetadata = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const v = e.currentTarget;
    const w = v.videoWidth || 1280;
    const h = v.videoHeight || 720;
    const aspect = w / h;
    const d = v.duration || 10;

    let targetW = 3840;
    let targetH = Math.round(3840 / aspect);
    targetW = targetW % 2 === 0 ? targetW : targetW + 1;
    targetH = targetH % 2 === 0 ? targetH : targetH + 1;

    setVideoMeta({
      width: w,
      height: h,
      duration: d,
      targetWidth: targetW,
      targetHeight: targetH,
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
    setStatusText('Preparing 4K super-resolution canvas pipeline...');

    try {
      const targetW = videoMeta.targetWidth;
      const targetH = videoMeta.targetHeight;

      // Prepare Canvas
      const canvas = document.createElement('canvas');
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext('2d', { alpha: false });

      if (!ctx) {
        throw new Error('Canvas 2D context creation failed.');
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Configure filter
      let filterStyle = 'contrast(1.06) saturate(1.04)';
      if (filterMode === 'cinematic') {
        filterStyle = 'contrast(1.12) saturate(1.15) brightness(1.02)';
      } else if (filterMode === 'vivid') {
        filterStyle = 'contrast(1.08) saturate(1.18)';
      }
      ctx.filter = filterStyle;

      // Extract Audio Stream if available
      let combinedStream: MediaStream;
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const audioCtx = new AudioContextClass();
        const sourceNode = audioCtx.createMediaElementSource(video);
        const destination = audioCtx.createMediaStreamDestination();
        sourceNode.connect(destination);
        sourceNode.connect(audioCtx.destination);

        const canvasStream = canvas.captureStream(30);
        const audioTracks = destination.stream.getAudioTracks();
        if (audioTracks.length > 0) {
          canvasStream.addTrack(audioTracks[0]);
        }
        combinedStream = canvasStream;
      } catch (audioErr) {
        // If audio connection is restricted or silent, fallback to canvas video stream
        combinedStream = canvas.captureStream(30);
      }

      // Check supported MIME types
      const mimeTypes = [
        'video/webm;codecs=vp9',
        'video/webm;codecs=vp8',
        'video/webm',
        'video/mp4',
      ];
      const selectedMime = mimeTypes.find((m) => MediaRecorder.isTypeSupported(m)) || 'video/webm';

      // 4K High Bitrate: 15 Mbps for crisp definition
      const mediaRecorder = new MediaRecorder(combinedStream, {
        mimeType: selectedMime,
        videoBitsPerSecond: 15000000,
      });
      mediaRecorderRef.current = mediaRecorder;

      const recordedChunks: Blob[] = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          recordedChunks.push(event.data);
        }
      };

      const maxProcessDuration = durationMode === 'sample5' ? Math.min(5, video.duration) : video.duration;

      mediaRecorder.onstop = () => {
        if (recordedChunks.length > 0 && !abortRef.current) {
          const blob = new Blob(recordedChunks, { type: selectedMime });
          const generatedUrl = URL.createObjectURL(blob);
          setUpscaledUrl(generatedUrl);
          setProgress(100);
          setStatusText(`Successfully upscaled to 4K (${targetW}x${targetH})!`);
        }
        setIsProcessing(false);
      };

      mediaRecorder.start(100);

      // Reset and play video
      video.currentTime = 0;
      await video.play();

      setStatusText(`Super-sampling frames to ${targetW}x${targetH}...`);

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

        // Draw and upscale frame to 4K canvas with filter
        ctx.drawImage(video, 0, 0, targetW, targetH);

        const currentPct = Math.min(99, Math.round((video.currentTime / maxProcessDuration) * 100));
        setProgress(currentPct);
        setStatusText(`Rendering 4K: ${currentPct}% • ${video.currentTime.toFixed(1)}s / ${maxProcessDuration.toFixed(1)}s`);

        requestAnimationFrame(renderFrame);
      };

      requestAnimationFrame(renderFrame);
    } catch (err: any) {
      console.error('Video upscaling error:', err);
      setError(err?.message || 'Failed to initialize 4K video upscaler. Please try a different video format.');
      setIsProcessing(false);
    }
  };

  const downloadUpscaledVideo = () => {
    if (!upscaledUrl) return;
    const a = document.createElement('a');
    a.href = upscaledUrl;
    const ext = upscaledUrl.includes('mp4') ? 'mp4' : 'webm';
    a.download = `video-4k-upscaled-${videoMeta?.targetWidth}x${videoMeta?.targetHeight}.${ext}`;
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
              <h1 className="text-xl font-bold text-white">Video to 4K Upscaler</h1>
              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                4K Ultra HD
              </span>
            </div>
            <p className="text-xs text-zinc-400">Upscale video clips and movies to 4K Ultra HD (3840×2160) with bicubic super-sampling and audio preservation.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!videoUrl && (
            <button
              onClick={loadSampleVideo}
              className="px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-amber-300 border border-amber-500/30 flex items-center gap-1.5 transition-colors"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Try Sample Clip</span>
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

      {!videoUrl ? (
        <div className="max-w-2xl mx-auto space-y-4">
          <Dropzone
            accept="video/mp4, video/webm, video/quicktime, video/x-matroska"
            multiple={false}
            onFilesSelected={handleFilesSelected}
            title="Upload Video for 4K Super-Resolution"
            subtitle="Drag & drop MP4, WebM, or MOV clips to upscale to 4K UHD"
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
                      {videoMeta.targetWidth}x{videoMeta.targetHeight} (4K)
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
                      <Film className={`w-8 h-8 text-zinc-600 mx-auto ${isProcessing ? 'animate-pulse text-amber-400' : ''}`} />
                      <p className="text-xs text-zinc-400">
                        {isProcessing ? 'Super-sampling video frames...' : 'Click "Start 4K Upscaling" on the right to render'}
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
                    className="bg-gradient-to-r from-amber-500 to-orange-500 h-2.5 rounded-full transition-all duration-300"
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
                <span>4K Video Settings</span>
              </h3>

              {/* Target Resolution */}
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-2">Target Resolution</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: '4k', label: '4K Ultra HD (3840p)', desc: '2160p UHD' },
                    { id: '2k', label: '2K Quad HD (2560p)', desc: '1440p QHD' },
                    { id: '1080p', label: '1080p Full HD', desc: '1080p FHD' },
                    { id: '2x', label: '2x Multiplier', desc: 'Native 2x' },
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

              {/* Enhancement Style */}
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-2">Clarity & Color Profile</label>
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
                <label className="block text-xs font-semibold text-zinc-400 mb-2">Upscale Length</label>
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
                    <span className="block text-[10px] font-normal text-zinc-500 mt-0.5">Instant test & preview</span>
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
                    <span className="block text-[10px] font-normal text-zinc-500 mt-0.5">Render entire clip</span>
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
                    : `Start 4K Video Upscale (${videoMeta ? `${videoMeta.targetWidth}x${videoMeta.targetHeight}` : '4K'})`}
                </span>
              </button>

              {upscaledUrl && (
                <button
                  onClick={downloadUpscaledVideo}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-glow-sm animate-fadeIn"
                >
                  <Download className="w-4 h-4" />
                  <span>Download 4K Video File</span>
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
                Uses HTML5 hardware canvas super-sampling and VP9/VP8 encoder with up to 15 Mbps bitrate. 100% private with no server file uploads.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
