'use client';

import React, { useState, useEffect } from 'react';
import { getTodayHadith, getRandomHadith, DailyHadith } from '../data/hadiths';
import { Quote, Sparkles, RotateCw, Copy, Check, BookOpen } from 'lucide-react';

export const HadithDailyCard: React.FC = () => {
  const [hadith, setHadith] = useState<DailyHadith>(getTodayHadith());
  const [copied, setCopied] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleNextHadith = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setHadith((prev) => getRandomHadith(prev.id));
      setIsAnimating(false);
    }, 200);
  };

  const handleCopy = () => {
    const textToCopy = `${hadith.text}\n— ${hadith.narrator} (${hadith.source})`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="bg-gradient-to-br from-emerald-900/5 via-teal-900/5 to-amber-900/5 dark:from-emerald-950/40 dark:via-teal-950/30 dark:to-slate-900 border border-emerald-200/70 dark:border-emerald-900/50 rounded-3xl p-5 sm:p-6 shadow-xs relative overflow-hidden transition-all">
      {/* زخرفة خلفية خفيفة */}
      <div className="absolute top-0 left-0 w-24 h-24 bg-radial from-emerald-500/10 to-transparent pointer-events-none rounded-full blur-xl" />
      <div className="absolute bottom-0 right-0 w-24 h-24 bg-radial from-amber-500/10 to-transparent pointer-events-none rounded-full blur-xl" />

      {/* الرأس: شارة حديث اليوم والأزرار */}
      <div className="flex items-center justify-between pb-3 border-b border-emerald-100 dark:border-emerald-900/40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
            <Quote className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-1.5">
              <span>حديث اليوم النبوي الشريف</span>
              <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-100/70 dark:bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-300/40">
                {hadith.topic}
              </span>
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleCopy}
            className="p-2 rounded-xl text-gray-400 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="نسخ الحديث"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={handleNextHadith}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:border-emerald-400 transition-all cursor-pointer shadow-2xs"
            title="عرض حديث نبوي آخر"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isAnimating ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">حديث آخر</span>
          </button>
        </div>
      </div>

      {/* متن الحديث الشريف */}
      <div
        className={`py-4 space-y-3 transition-opacity duration-200 ${
          isAnimating ? 'opacity-0 scale-98' : 'opacity-100 scale-100'
        }`}
      >
        <p className="font-serif text-sm sm:text-base text-gray-800 dark:text-slate-100 leading-relaxed font-bold text-justify">
          {hadith.text}
        </p>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-emerald-800 dark:text-emerald-300">
              عن {hadith.narrator}
            </span>
            <span>•</span>
            <span className="font-mono text-[11px]">{hadith.source}</span>
          </div>

          {hadith.benefit && (
            <span className="text-[11px] text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 px-2.5 py-0.5 rounded-full border border-amber-200/60 font-serif">
              💡 {hadith.benefit}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
