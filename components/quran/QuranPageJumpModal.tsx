'use client';

import React, { useState } from 'react';
import { toArabicNumerals, TOTAL_PAGES, getSurahByPage, getJuzByPage } from './quranMetadata';
import { X, ArrowLeft, BookOpen, Sparkles } from 'lucide-react';

interface QuranPageJumpModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage: number;
  onJumpToPage: (page: number) => void;
}

export const QuranPageJumpModal: React.FC<QuranPageJumpModalProps> = ({
  isOpen,
  onClose,
  currentPage,
  onJumpToPage,
}) => {
  const [selectedPage, setSelectedPage] = useState<number>(currentPage);

  if (!isOpen) return null;

  const currentSurah = getSurahByPage(selectedPage);
  const currentJuz = getJuzByPage(selectedPage);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPage >= 1 && selectedPage <= TOTAL_PAGES) {
      onJumpToPage(selectedPage);
      onClose();
    }
  };

  const QUICK_PAGES = [
    { label: 'الفاتحة', page: 1 },
    { label: 'البقرة', page: 2 },
    { label: 'الكهف', page: 293 },
    { label: 'يس', page: 440 },
    { label: 'الملك', page: 562 },
    { label: 'جزء عم', page: 582 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        dir="rtl"
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 shadow-2xl border border-gray-100 dark:border-slate-800 space-y-5"
      >
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-800">
          <h3 className="font-bold text-base text-gray-900 dark:text-white">انتقال سريع لصفحة في المصحف</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-center py-2">
            <span className="text-4xl sm:text-5xl font-extrabold font-serif text-emerald-800 dark:text-emerald-300">
              {toArabicNumerals(selectedPage)}
            </span>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 font-serif">
              <span>{currentSurah.fullName}</span> • <span>{currentJuz.name}</span>
            </div>
          </div>

          {/* شريط السحب */}
          <input
            type="range"
            min={1}
            max={TOTAL_PAGES}
            value={selectedPage}
            onChange={(e) => setSelectedPage(parseInt(e.target.value, 10))}
            className="w-full h-2 bg-gray-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer accent-emerald-600"
          />

          <div className="flex items-center justify-between text-xs text-gray-400 font-mono">
            <span>صـ ١</span>
            <span>صـ ٦٠٤</span>
          </div>

          {/* محطات سريعة شائعة */}
          <div className="pt-2">
            <span className="text-xs font-semibold text-gray-500 block mb-2">محطات سريعة:</span>
            <div className="grid grid-cols-3 gap-2">
              {QUICK_PAGES.map((item) => (
                <button
                  key={item.page}
                  type="button"
                  onClick={() => setSelectedPage(item.page)}
                  className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    selectedPage === item.page
                      ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                      : 'bg-gray-50 dark:bg-slate-800 border-gray-200/80 dark:border-slate-700 text-gray-700 dark:text-gray-200 hover:border-emerald-300'
                  }`}
                >
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-700/25 cursor-pointer transition-all active:scale-[0.98]"
          >
            <span>انتقل إلى الصفحة المباركة</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
