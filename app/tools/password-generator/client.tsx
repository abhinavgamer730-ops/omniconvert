'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Shield, Copy, RefreshCw, CheckCircle, Sliders, Lock } from 'lucide-react';

export default function PasswordGeneratorClient() {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [useUpper, setUseUpper] = useState(true);
  const [useLower, setUseLower] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [excludeSimilar, setExcludeSimilar] = useState(false);
  const [copied, setCopied] = useState(false);
  const [batch, setBatch] = useState<string[]>([]);

  const generatePassword = useCallback(() => {
    let charset = '';
    if (useUpper) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (useLower) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (useNumbers) charset += '0123456789';
    if (useSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (excludeSimilar) {
      charset = charset.replace(/[iI1lLoO0]/g, '');
    }

    if (!charset) {
      setPassword('');
      return;
    }

    let result = '';
    const array = new Uint32Array(length);
    window.crypto.getRandomValues(array);
    for (let i = 0; i < length; i++) {
      result += charset[array[i] % charset.length];
    }

    setPassword(result);

    // Generate batch of 5 additional passwords
    const batchList: string[] = [];
    for (let b = 0; b < 5; b++) {
      let temp = '';
      const tempArray = new Uint32Array(length);
      window.crypto.getRandomValues(tempArray);
      for (let i = 0; i < length; i++) {
        temp += charset[tempArray[i] % charset.length];
      }
      batchList.push(temp);
    }
    setBatch(batchList);
  }, [length, useUpper, useLower, useNumbers, useSymbols, excludeSimilar]);

  useEffect(() => {
    generatePassword();
  }, [generatePassword]);

  const copyToClipboard = (textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Calculate entropy and strength
  const getStrength = () => {
    let poolSize = 0;
    if (useUpper) poolSize += 26;
    if (useLower) poolSize += 26;
    if (useNumbers) poolSize += 10;
    if (useSymbols) poolSize += 30;
    const entropy = length * Math.log2(poolSize || 1);

    if (entropy < 40) return { label: 'Weak', color: 'bg-rose-500 text-rose-300 border-rose-500/30', pct: 25 };
    if (entropy < 65) return { label: 'Fair', color: 'bg-amber-500 text-amber-300 border-amber-500/30', pct: 50 };
    if (entropy < 90) return { label: 'Strong', color: 'bg-emerald-500 text-emerald-300 border-emerald-500/30', pct: 75 };
    return { label: 'Ultra Secure', color: 'bg-indigo-500 text-indigo-300 border-indigo-500/30', pct: 100 };
  };

  const strength = getStrength();

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Password & Passphrase Generator</h1>
            <p className="text-xs text-zinc-400">Generate high-entropy cryptographically secure random passwords.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Password Output Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Display Box */}
          <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Generated Password</span>
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${strength.color}`}>
                {strength.label}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between gap-3">
              <span className="text-lg md:text-xl font-mono font-bold text-white break-all select-all">
                {password || 'Select options below'}
              </span>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={generatePassword}
                  className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
                  title="Generate New Password"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => copyToClipboard(password)}
                  className="px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <Copy className="w-4 h-4" />
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Strength Meter Bar */}
            <div className="w-full h-1.5 rounded-full bg-zinc-950 overflow-hidden border border-zinc-800">
              <div
                className={`h-full transition-all duration-300 ${
                  strength.pct <= 25 ? 'bg-rose-500' : strength.pct <= 50 ? 'bg-amber-500' : strength.pct <= 75 ? 'bg-emerald-500' : 'bg-indigo-500'
                }`}
                style={{ width: `${strength.pct}%` }}
              />
            </div>
          </div>

          {/* Batch Alternatives */}
          <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Alternative Options ({batch.length})
            </h3>
            <div className="space-y-2">
              {batch.map((pwd, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between gap-3 group hover:border-zinc-700"
                >
                  <span className="text-xs font-mono text-zinc-300 truncate select-all">{pwd}</span>
                  <button
                    onClick={() => copyToClipboard(pwd)}
                    className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors shrink-0"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Customization Options Panel */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-6">
            <h3 className="text-sm font-bold text-zinc-200 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-violet-400" />
              <span>Password Options</span>
            </h3>

            {/* Length Slider */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-zinc-300 mb-2">
                <span>Password Length</span>
                <span className="text-violet-400 font-mono font-bold">{length} characters</span>
              </div>
              <input
                type="range"
                min="6"
                max="64"
                value={length}
                onChange={(e) => setLength(Number(e.target.value))}
                className="w-full accent-violet-500 cursor-pointer"
              />
            </div>

            {/* Checkbox Options */}
            <div className="space-y-3 pt-2">
              {[
                { label: 'Uppercase Letters (A-Z)', val: useUpper, set: setUseUpper },
                { label: 'Lowercase Letters (a-z)', val: useLower, set: setUseLower },
                { label: 'Numbers (0-9)', val: useNumbers, set: setUseNumbers },
                { label: 'Symbols (!@#$%^&*)', val: useSymbols, set: setUseSymbols },
                { label: 'Exclude Similar (i, l, 1, O, 0)', val: excludeSimilar, set: setExcludeSimilar },
              ].map((opt, i) => (
                <label key={i} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={opt.val}
                    onChange={(e) => opt.set(e.target.checked)}
                    className="w-4 h-4 rounded bg-zinc-950 border-zinc-700 text-violet-600 focus:ring-0 cursor-pointer"
                  />
                  <span className="text-xs text-zinc-300 group-hover:text-white transition-colors">{opt.label}</span>
                </label>
              ))}
            </div>

            <button
              onClick={generatePassword}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-xs shadow-glow-sm hover:shadow-glow-md transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Generate New Password</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
