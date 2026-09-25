'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Copy, Download, Trash2, Globe, CheckCircle, Volume2, Pause } from 'lucide-react';
import AudioVisualizer from '@/components/AudioVisualizer';

export default function SpeechToTextClient() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [language, setLanguage] = useState('en-US');
  const [copied, setCopied] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [browserSupported, setBrowserSupported] = useState(true);

  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<any>(null);
  const isRecordingRef = useRef(isRecording);
  isRecordingRef.current = isRecording;

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setBrowserSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = language;

    recognition.onresult = (event: any) => {
      let currentTranscript = '';
      for (let i = 0; i < event.results.length; i++) {
        currentTranscript += event.results[i][0].transcript;
      }
      setTranscript(currentTranscript);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
    };

    recognition.onend = () => {
      if (isRecordingRef.current) {
        // Automatically restart if continuous speech ended prematurely
        try {
          recognition.start();
        } catch (e) {
          // ignore error if manually stopped
        }
      }
    };

    recognitionRef.current = recognition;
  }, [language]);

  const toggleRecording = () => {
    if (!recognitionRef.current) return;

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
        setElapsedSeconds(0);
        timerRef.current = setInterval(() => {
          setElapsedSeconds((prev) => prev + 1);
        }, 1000);
      } catch (err) {
        console.error('Failed to start speech recognition:', err);
      }
    }
  };

  const copyToClipboard = () => {
    if (!transcript) return;
    navigator.clipboard.writeText(transcript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadTxt = () => {
    if (!transcript) return;
    const blob = new Blob([transcript], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dictation-transcript-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
  };

  const clearTranscript = () => {
    setTranscript('');
    setElapsedSeconds(0);
  };

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const wordCount = transcript.trim() ? transcript.trim().split(/\s+/).length : 0;
  const charCount = transcript.length;

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
            <Mic className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Speech to Text Dictation</h1>
            <p className="text-xs text-zinc-400">Real-time continuous voice recording and transcription powered by Web Speech API.</p>
          </div>
        </div>

        <AudioVisualizer isRecording={isRecording} />
      </div>

      {!browserSupported && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400 font-medium">
          Web Speech API is not supported in this browser environment. Please use Google Chrome, Microsoft Edge, or Safari for voice dictation.
        </div>
      )}

      {/* Dictation Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Text Editor Area */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-4 shadow-xl">
            <div className="flex items-center justify-between flex-wrap gap-2 border-b border-zinc-800/60 pb-3">
              <div className="flex items-center gap-4 text-xs text-zinc-400 font-mono">
                <span>Duration: <strong className="text-white">{formatTimer(elapsedSeconds)}</strong></span>
                <span>Words: <strong className="text-white">{wordCount}</strong></span>
                <span>Chars: <strong className="text-white">{charCount}</strong></span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={copyToClipboard}
                  disabled={!transcript}
                  className="px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs font-semibold text-zinc-300 hover:text-white hover:border-zinc-700 disabled:opacity-40 transition-colors flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
                <button
                  onClick={downloadTxt}
                  disabled={!transcript}
                  className="px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs font-semibold text-zinc-300 hover:text-white hover:border-zinc-700 disabled:opacity-40 transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .txt</span>
                </button>
                <button
                  onClick={clearTranscript}
                  disabled={!transcript && !isRecording}
                  className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 disabled:opacity-30 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Transcript Textarea */}
            <textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Click 'Start Recording' below and speak into your microphone, or type directly here..."
              rows={12}
              className="w-full bg-transparent border-0 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none resize-none leading-relaxed font-sans"
            />
          </div>
        </div>

        {/* Dictation Controls Sidebar */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-6">
            <h3 className="text-sm font-bold text-zinc-200 flex items-center gap-2">
              <Globe className="w-4 h-4 text-rose-400" />
              <span>Dictation Controls</span>
            </h3>

            {/* Language Selector */}
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-2">Recognition Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                disabled={isRecording}
                className="w-full px-3 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-rose-500 cursor-pointer"
              >
                <option value="en-US">English (US)</option>
                <option value="en-GB">English (UK)</option>
                <option value="es-ES">Spanish (Español)</option>
                <option value="fr-FR">French (Français)</option>
                <option value="de-DE">German (Deutsch)</option>
                <option value="hi-IN">Hindi (हिन्दी)</option>
                <option value="zh-CN">Chinese (Mandarin)</option>
                <option value="ja-JP">Japanese (日本語)</option>
              </select>
            </div>

            {/* Start / Stop Toggle Button */}
            <button
              onClick={toggleRecording}
              disabled={!browserSupported}
              className={`
                w-full py-4 rounded-xl font-bold text-xs shadow-glow-sm transition-all flex items-center justify-center gap-2.5
                ${isRecording
                  ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
                  : 'bg-gradient-to-r from-rose-500 to-pink-600 text-white hover:shadow-glow-md'
                }
              `}
            >
              {isRecording ? (
                <>
                  <MicOff className="w-4 h-4 animate-pulse" />
                  <span>Stop Dictation Recording</span>
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4" />
                  <span>Start Microphone Recording</span>
                </>
              )}
            </button>

            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2 text-[11px] text-zinc-400 leading-relaxed">
              <p className="font-semibold text-zinc-300">💡 Dictation Tips:</p>
              <ul className="list-disc list-inside space-y-1 text-zinc-500">
                <li>Speak clearly into a low-noise environment.</li>
                <li>You can manually edit transcribed text anytime.</li>
                <li>Continuous dictation auto-scrolls text.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
