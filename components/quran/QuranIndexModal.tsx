'use client';

import React, { useState, useMemo } from 'react';
import { QURAN_SURAHS, QURAN_JUZS, toArabicNumerals } from './quranMetadata';
import { SurahMetaExtended, JuzInfo } from './types';
import { X, Search, Bookmark, BookOpen, Layers, ArrowLeft } from 'lucide-react';

interface QuranIndexModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPage: (pageNum: number) => void;
  currentPage: number;
  bookmarkedPage: number | null;
}

export const QuranIndexModal: React.FC<QuranIndexModalProps> = ({
  isOpen,
  onClose,
  onSelectPage,
  currentPage,
  bookmarkedPage,
}) => {
  const [activeTab, setActiveTab] = useState<'surahs' | 'juzs'>('surahs');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredSurahs = useMemo(() => {
    if (!searchQuery.trim()) return QURAN_SURAHS;
    const q = searchQuery.trim().toLowerCase();
    return QURAN_SURAHS.filter(
      (s) =>
        s.name.includes(q) ||
        s.fullName.includes(q) ||
        s.englishName.toLowerCase().includes(q) ||
        String(s.num) === q ||
        String(s.startPage) === q
    );
  }, [searchQuery]);

  const filteredJuzs = useMemo(() => {
    if (!searchQuery.trim()) return QURAN_JUZS;
    const q = searchQuery.trim().toLowerCase();
    return QURAN_JUZS.filter(
      (j) =>
        j.name.includes(q) ||
        j.startSurahName.includes(q) ||
        String(j.juzNumber) === q ||
        String(j.startPage) === q
    );
  }, [searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        dir="rtl"
        className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 shadow-2xl border border-gray-100 dark:border-slate-800 max-h-[88vh] flex flex-col space-y-4"
      >
        {/* رأس النافذة */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-base text-gray-900 dark:text-white">فهرس المصحف الشريف</h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* فاصلة القراءة المحفوظة للرجوع السريع */}
        {bookmarkedPage && (
          <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-amber-600 fill-amber-600" />
              <div>
                <span className="text-xs font-bold text-amber-900 dark:text-amber-200">
                  فاصلة قراءتك المحفوظة
                </span>
                <span className="text-[11px] text-amber-700 dark:text-amber-400 block">
                  الصفحة {toArabicNumerals(bookmarkedPage)}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                onSelectPage(bookmarkedPage);
                onClose();
              }}
              className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1"
            >
              <span>متابعة القراءة</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* تبويبات الفهرس: السور / الأجزاء */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 dark:bg-slate-800 rounded-2xl">
          <button
            type="button"
            onClick={() => setActiveTab('surahs')}
            className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'surahs'
                ? 'bg-white dark:bg-slate-700 text-emerald-800 dark:text-emerald-300 shadow-2xs'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>السور الكريمة (١١٤)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('juzs')}
            className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'juzs'
                ? 'bg-white dark:bg-slate-700 text-emerald-800 dark:text-emerald-300 shadow-2xs'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>الأجزاء (٣٠)</span>
          </button>
        </div>

        {/* حقل البحث السريع */}
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute right-3.5 top-3" />
          <input
            type="text"
            placeholder={
              activeTab === 'surahs'
                ? 'ابحث باسم السورة أو رقمها أو رقم الصفحة...'
                : 'ابحث برقم الجزء أو اسمه...'
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-xs text-gray-900 dark:text-white outline-none focus:border-emerald-500"
          />
        </div>

        {/* قائمة السور أو الأجزاء */}
        <div className="flex-1 overflow-y-auto space-y-1 pr-1 max-h-[48vh] scrollbar-none">
          {activeTab === 'surahs' ? (
            filteredSurahs.map((surah) => {
              const isSelected = currentPage >= surah.startPage && currentPage <= surah.endPage;
              return (
                <button
                  key={surah.num}
                  type="button"
                  onClick={() => {
                    onSelectPage(surah.startPage);
                    onClose();
                  }}
                  className={`w-full p-2.5 rounded-2xl text-right flex items-center justify-between text-xs transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 font-bold border border-emerald-200 dark:border-emerald-800'
                      : 'hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center font-mono font-bold text-xs text-gray-500">
                      {toArabicNumerals(surah.num)}
                    </span>
                    <div>
                      <div className="font-bold text-sm font-serif">{surah.fullName}</div>
                      <div className="text-[10px] text-gray-400">
                        {surah.type} • {toArabicNumerals(surah.verses)} آيات
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-50/70 dark:bg-emerald-950/40 px-2 py-0.5 rounded-lg border border-emerald-200/50">
                      صـ {toArabicNumerals(surah.startPage)}
                    </span>
                  </div>
                </button>
              );
            })
          ) : (
            filteredJuzs.map((juz) => {
              const isSelected = currentPage >= juz.startPage && currentPage <= juz.endPage;
              return (
                <button
                  key={juz.juzNumber}
                  type="button"
                  onClick={() => {
                    onSelectPage(juz.startPage);
                    onClose();
                  }}
                  className={`w-full p-3 rounded-2xl text-right flex items-center justify-between text-xs transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 font-bold border border-emerald-200 dark:border-emerald-800'
                      : 'hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-emerald-100/70 dark:bg-slate-800 flex items-center justify-center font-bold text-xs text-emerald-800 dark:text-emerald-300">
                      {toArabicNumerals(juz.juzNumber)}
                    </span>
                    <div>
                      <div className="font-bold text-sm">{juz.name}</div>
                      <div className="text-[10px] text-gray-400">يبدأ من سورة {juz.startSurahName}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-50/70 dark:bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-200/50">
                      صـ {toArabicNumerals(juz.startPage)}
                    </span>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
