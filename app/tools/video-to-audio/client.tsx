'use client';

import React, { useState, useRef } from 'react';
import { Video, Music, Download, RefreshCw, CheckCircle, Volume2, AlertCircle } from 'lucide-react';
import Dropzone from '@/components/Dropzone';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

export default function VideoToAudioClient() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [audioFormat, setAudioFormat] = useState<'mp3' | 'wav' | 'aac'>('mp3');
  const [bitrate, setBitrate] = useState<'128k' | '192k' | '320k'>('192k');
  const [progress, setProgress] = useState<number>(0);
  const [isExtracting, setIsExtracting] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>('');
  
  const ffmpegRef = useRef<FFmpeg | null>(null);

  const handleFilesSelected = (files: File[]) => {
    if (files.length === 0) return;
    const file = files[0];
    setVideoFile(file);
    const url = URL.createObjectURL(file);
    setVideoUrl(url);
    setAudioUrl(null);
    setProgress(0);
    setStatusMessage('');
  };

  const loadDemoVideo = async () => {
    setStatusMessage('Loading demo clip...');
    try {
      const resp = await fetch('/sample-video.mp4');
      if (resp.ok) {
        const blob = await resp.blob();
        const demoFile = new File([blob], 'sample-video.mp4', { type: 'video/mp4' });
        setVideoFile(demoFile);
        const url = URL.createObjectURL(blob);
        setVideoUrl(url);
        setAudioUrl(null);
        setProgress(0);
        setStatusMessage('');
      } else {
        throw new Error('Fallback');
      }
    } catch (e) {
      console.warn('Demo clip load note:', e);
    }
  };

  const extractAudioFFmpeg = async () => {
    if (!videoFile) return;
    setIsExtracting(true);
    setProgress(10);
    setStatusMessage('Loading FFmpeg WebAssembly engine...');

    try {
      if (!ffmpegRef.current) {
        ffmpegRef.current = new FFmpeg();
      }
      const ffmpeg = ffmpegRef.current;

      ffmpeg.on('progress', ({ progress: p }) => {
        const pct = Math.min(Math.round(p * 100), 99);
        setProgress(pct);
        setStatusMessage(`Processing audio stream... ${pct}%`);
      });

      // Load FFmpeg core WASM
      const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
      });

      setStatusMessage('Reading video file into memory...');
      const inputFileName = 'input_video.mp4';
      const outputFileName = `output_audio.${audioFormat}`;

      await ffmpeg.writeFile(inputFileName, await fetchFile(videoFile));

      setStatusMessage(`Encoding audio to ${audioFormat.toUpperCase()} (${bitrate})...`);
      
      // FFmpeg conversion command
      let codecArg = '-b:a';
      if (audioFormat === 'mp3') codecArg = '-c:a libmp3lame';
      else if (audioFormat === 'wav') codecArg = '-c:a pcm_s16le';
      else if (audioFormat === 'aac') codecArg = '-c:a aac';

      await ffmpeg.exec(['-i', inputFileName, '-vn', '-b:a', bitrate, outputFileName]);

      const data = await ffmpeg.readFile(outputFileName);
      const audioBlob = new Blob([data as any], { type: `audio/${audioFormat}` });
      const extractedUrl = URL.createObjectURL(audioBlob);

      setAudioUrl(extractedUrl);
      setProgress(100);
      setStatusMessage('Audio extraction complete!');
    } catch (err: any) {
      console.warn('FFmpeg WASM error, using WebAudio browser fallback:', err);
      await fallbackAudioExtraction();
    } finally {
      setIsExtracting(false);
    }
  };

  // Fallback audio extractor using HTML5 Audio Element & MediaRecorder / WebAudio API
  const fallbackAudioExtraction = async () => {
    if (!videoFile || !videoUrl) return;
    setStatusMessage('Extracting audio track via Browser AudioContext...');
    
    try {
      const response = await fetch(videoUrl);
      const arrayBuffer = await response.arrayBuffer();
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

      // Render audio buffer to WAV blob
      const wavBlob = audioBufferToWavBlob(audioBuffer);
      const fallbackUrl = URL.createObjectURL(wavBlob);

      setAudioUrl(fallbackUrl);
      setProgress(100);
      setStatusMessage('Audio extracted via browser decoder!');
    } catch (fallbackErr) {
      console.error('Fallback audio extraction failed:', fallbackErr);
      setStatusMessage('Extraction failed. Please try a different video format.');
    }
  };

  // Convert AudioBuffer to WAV Blob
  const audioBufferToWavBlob = (buffer: AudioBuffer): Blob => {
    const numOfChan = buffer.numberOfChannels;
    const length = buffer.length * numOfChan * 2 + 44;
    const out = new DataView(new ArrayBuffer(length));
    let channels: Float32Array[] = [];
    let sampleRate = buffer.sampleRate;
    let offset = 0;
    let pos = 0;

    function setUint16(data: number) { out.setUint16(pos, data, true); pos += 2; }
    function setUint32(data: number) { out.setUint32(pos, data, true); pos += 4; }

    setUint32(0x46464952); // "RIFF"
    setUint32(length - 8);
    setUint32(0x45564157); // "WAVE"
    setUint32(0x20746d66); // "fmt "
    setUint32(16); // length
    setUint16(1); // PCM
    setUint16(numOfChan);
    setUint32(sampleRate);
    setUint32(sampleRate * 2 * numOfChan);
    setUint16(numOfChan * 2);
    setUint16(16);
    setUint32(0x61746164); // "data"
    setUint32(length - pos - 4);

    for (let i = 0; i < buffer.numberOfChannels; i++) {
      channels.push(buffer.getChannelData(i));
    }

    while (offset < buffer.length) {
      for (let i = 0; i < numOfChan; i++) {
        let sample = Math.max(-1, Math.min(1, channels[i][offset]));
        sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0;
        out.setInt16(pos, sample, true);
        pos += 2;
      }
      offset++;
    }

    return new Blob([out], { type: 'audio/wav' });
  };

  const downloadAudio = () => {
    if (!audioUrl || !videoFile) return;
    const baseName = videoFile.name.substring(0, videoFile.name.lastIndexOf('.')) || videoFile.name;
    const ext = audioFormat;
    const a = document.createElement('a');
    a.href = audioUrl;
    a.download = `${baseName}-audio.${ext}`;
    a.click();
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Video className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white">Video to Audio Extractor</h1>
              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                FFmpeg.wasm
              </span>
            </div>
            <p className="text-xs text-zinc-400">Extract MP3, WAV, or AAC audio directly from MP4 and WebM videos in your browser.</p>
          </div>
        </div>

        {videoFile && (
          <button
            onClick={() => {
              setVideoFile(null);
              setVideoUrl(null);
              setAudioUrl(null);
            }}
            className="px-3 py-1.5 rounded-lg bg-zinc-800 text-xs font-semibold text-zinc-400 hover:text-rose-400 transition-colors"
          >
            Change Video
          </button>
        )}
      </div>

      {!videoFile ? (
        <div className="max-w-2xl mx-auto space-y-4">
          <Dropzone
            accept="video/mp4, video/webm, video/quicktime, video/x-matroska, video/avi"
            multiple={false}
            onFilesSelected={handleFilesSelected}
            title="Upload Video File"
            subtitle="Drag & drop MP4, WebM, MOV, or AVI video"
          />
          <div className="flex justify-center">
            <button
              onClick={loadDemoVideo}
              className="px-4 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-xs font-semibold text-emerald-400 border border-emerald-500/30 transition-all flex items-center gap-2"
            >
              <Music className="w-3.5 h-3.5" />
              Try Demo Clip (Instant 1-Click Test)
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Video Preview Player */}
          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800 p-2">
              <video
                src={videoUrl || ''}
                controls
                className="w-full max-h-[380px] rounded-xl object-contain bg-black"
              />
            </div>

            {/* Extracted Audio Player */}
            {audioUrl && (
              <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-2">
                    <Volume2 className="w-4 h-4" />
                    <span>Extracted Audio Ready</span>
                  </span>
                  <button
                    onClick={downloadAudio}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-500 transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download {audioFormat.toUpperCase()}</span>
                  </button>
                </div>
                <audio src={audioUrl} controls className="w-full accent-emerald-500" />
              </div>
            )}
          </div>

          {/* Extraction Settings & Progress Panel */}
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-6">
              <h3 className="text-sm font-bold text-zinc-200 flex items-center gap-2">
                <Music className="w-4 h-4 text-emerald-400" />
                <span>Audio Extraction Settings</span>
              </h3>

              {/* Format Selector */}
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-2">Target Audio Format</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['mp3', 'wav', 'aac'] as const).map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => setAudioFormat(fmt)}
                      className={`py-2 rounded-xl text-xs font-bold uppercase border transition-all ${
                        audioFormat === fmt
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500 shadow-glow-sm'
                          : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:bg-zinc-900'
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bitrate Selector */}
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-2">Audio Bitrate</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['128k', '192k', '320k'] as const).map((b) => (
                    <button
                      key={b}
                      onClick={() => setBitrate(b)}
                      className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                        bitrate === b
                          ? 'bg-zinc-800 text-white border-zinc-700'
                          : 'bg-zinc-950 text-zinc-500 border-zinc-800 hover:bg-zinc-900'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Progress Bar & Status */}
              {isExtracting && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-zinc-400">Processing Progress</span>
                    <span className="text-emerald-400 font-mono">{progress}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-zinc-950 overflow-hidden border border-zinc-800">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-zinc-500 italic">{statusMessage}</p>
                </div>
              )}

              {/* Extract Action Button */}
              <button
                onClick={extractAudioFFmpeg}
                disabled={isExtracting}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-zinc-950 font-bold text-xs shadow-glow-sm hover:shadow-glow-md disabled:opacity-40 transition-all flex items-center justify-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${isExtracting ? 'animate-spin' : ''}`} />
                <span>{isExtracting ? 'Extracting Audio...' : 'Extract Audio Now'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
