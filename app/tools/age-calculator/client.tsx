'use client';

import React, { useState } from 'react';
import { Calendar, Clock, Heart, Award, Sparkles } from 'lucide-react';

export default function AgeCalculatorClient() {
  const todayStr = new Date().toISOString().split('T')[0];
  const [dob, setDob] = useState<string>('2000-01-01');
  const [targetDate, setTargetDate] = useState<string>(todayStr);

  const calculateAge = () => {
    if (!dob || !targetDate) return null;

    const birth = new Date(dob);
    const target = new Date(targetDate);

    if (isNaN(birth.getTime()) || isNaN(target.getTime())) return null;
    if (birth > target) return { error: 'Date of birth cannot be in the future of the target date.' };

    let years = target.getFullYear() - birth.getFullYear();
    let months = target.getMonth() - birth.getMonth();
    let days = target.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(target.getFullYear(), target.getMonth(), 0);
      days += prevMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    // Total metrics
    const diffTime = target.getTime() - birth.getTime();
    const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const totalHours = totalDays * 24;
    const totalMinutes = totalHours * 60;
    const totalWeeks = Math.floor(totalDays / 7);

    // Next Birthday Calculation
    const nextBdayYear = target.getFullYear() + (
      (target.getMonth() > birth.getMonth() || (target.getMonth() === birth.getMonth() && target.getDate() > birth.getDate())) ? 1 : 0
    );
    const nextBday = new Date(nextBdayYear, birth.getMonth(), birth.getDate());
    const daysUntilNextBday = Math.ceil((nextBday.getTime() - target.getTime()) / (1000 * 60 * 60 * 24));

    // Zodiac Sign
    const getZodiac = (day: number, month: number) => {
      const zodiacs = [
        { name: 'Capricorn ♑', endDay: 19 },
        { name: 'Aquarius ♒', endDay: 18 },
        { name: 'Pisces ♓', endDay: 20 },
        { name: 'Aries ♈', endDay: 19 },
        { name: 'Taurus ♉', endDay: 20 },
        { name: 'Gemini ♊', endDay: 20 },
        { name: 'Cancer ♋', endDay: 22 },
        { name: 'Leo ♌', endDay: 22 },
        { name: 'Virgo ♍', endDay: 22 },
        { name: 'Libra ♎', endDay: 22 },
        { name: 'Scorpio ♏', endDay: 21 },
        { name: 'Sagittarius ♐', endDay: 21 },
      ];
      const m = birth.getMonth();
      return day <= zodiacs[m].endDay ? zodiacs[m].name : zodiacs[(m + 1) % 12].name;
    };

    const zodiac = getZodiac(birth.getDate(), birth.getMonth());

    return {
      years,
      months,
      days,
      totalDays,
      totalHours,
      totalMinutes,
      totalWeeks,
      daysUntilNextBday,
      zodiac,
    };
  };

  const result = calculateAge();

  return (
    <div className="space-y-8">
      {/* Header Banner with H1 */}
      <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white">Free Online Age & Date Calculator</h1>
              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Exact Metrics
              </span>
            </div>
            <p className="text-xs text-zinc-400">Calculate exact age in years, months, days, total days lived, and countdown to your next birthday.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Date Inputs Panel */}
        <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-6">
          <h3 className="text-sm font-bold text-zinc-200">Select Dates</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-2">Date of Birth</label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-indigo-500 cursor-pointer font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-2">Age at Date (Default Today)</label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-indigo-500 cursor-pointer font-mono"
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-400 space-y-1">
            <div className="font-semibold text-zinc-300">Quick Tip</div>
            <p>You can set any future or past target date to calculate exact age for milestone events!</p>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2 space-y-6">
          {result && 'error' in result ? (
            <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
              {result.error}
            </div>
          ) : result ? (
            <div className="space-y-6">
              {/* Primary Age Cards */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950/60 to-purple-950/40 border border-indigo-500/30 space-y-4 shadow-glow-sm">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Exact Calculated Age</span>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-4 rounded-xl bg-zinc-950/60 border border-indigo-500/20">
                    <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono">{result.years}</div>
                    <div className="text-xs text-zinc-400 mt-1 font-semibold uppercase">Years</div>
                  </div>

                  <div className="p-4 rounded-xl bg-zinc-950/60 border border-indigo-500/20">
                    <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono">{result.months}</div>
                    <div className="text-xs text-zinc-400 mt-1 font-semibold uppercase">Months</div>
                  </div>

                  <div className="p-4 rounded-xl bg-zinc-950/60 border border-indigo-500/20">
                    <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono">{result.days}</div>
                    <div className="text-xs text-zinc-400 mt-1 font-semibold uppercase">Days</div>
                  </div>
                </div>
              </div>

              {/* Lifetime Fun Statistics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-1">
                  <div className="flex items-center justify-between text-zinc-400">
                    <span className="text-xs font-semibold">Total Days Lived</span>
                    <Heart className="w-4 h-4 text-rose-400" />
                  </div>
                  <div className="text-2xl font-bold text-white font-mono">{result.totalDays.toLocaleString()}</div>
                  <div className="text-[11px] text-zinc-500">Days since birth</div>
                </div>

                <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-1">
                  <div className="flex items-center justify-between text-zinc-400">
                    <span className="text-xs font-semibold">Total Weeks</span>
                    <Calendar className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div className="text-2xl font-bold text-white font-mono">{result.totalWeeks.toLocaleString()}</div>
                  <div className="text-[11px] text-zinc-500">Weeks lived</div>
                </div>

                <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-1">
                  <div className="flex items-center justify-between text-zinc-400">
                    <span className="text-xs font-semibold">Next Birthday</span>
                    <Sparkles className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl font-bold text-amber-300 font-mono">{result.daysUntilNextBday}</div>
                  <div className="text-[11px] text-zinc-500">Days remaining</div>
                </div>

                <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-1">
                  <div className="flex items-center justify-between text-zinc-400">
                    <span className="text-xs font-semibold">Total Hours</span>
                    <Clock className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="text-xl font-bold text-white font-mono">{result.totalHours.toLocaleString()}</div>
                </div>

                <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-1">
                  <div className="flex items-center justify-between text-zinc-400">
                    <span className="text-xs font-semibold">Total Minutes</span>
                    <Clock className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-xl font-bold text-white font-mono">{result.totalMinutes.toLocaleString()}</div>
                </div>

                <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-1">
                  <div className="flex items-center justify-between text-zinc-400">
                    <span className="text-xs font-semibold">Zodiac Sign</span>
                    <Award className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="text-lg font-bold text-cyan-300">{result.zodiac}</div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
