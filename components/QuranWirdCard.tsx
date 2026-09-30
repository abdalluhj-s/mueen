'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookOpen, Bookmark, Sparkles, ChevronLeft, List, Flame, Heart } from 'lucide-react';
import { toArabicNumerals, getSurahByPage, getJuzByPage } from './quran/quranMetadata';
import { Language } from '../lib/translations';

interface QuranWirdCardProps {
  lang?: Language;
}

export const QuranWirdCard: React.FC<QuranWirdCardProps> = ({ lang = 'ar' }) => {
  const [lastPage, setLastPage] = useState<number>(1);
  const [bookmarkedPage, setBookmarkedPage] = useState<number | null>(null);
  const [isFriday, setIsFriday] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedPage = localStorage.getItem('mueen_quran_last_page');
        if (savedPage) {
          const p = parseInt(savedPage, 10);
          if (!isNaN(p) && p >= 1 && p <= 604) setLastPage(p);
        }

        const savedBookmark = localStorage.getItem('mueen_quran_bookmark_page');
        if (savedBookmark) {
          const bp = parseInt(savedBookmark, 10);
          if (!isNaN(bp) && bp >= 1 && bp <= 604) setBookmarkedPage(bp);
        }

        // فحص هل اليوم جمعة
        const todayDay = new Date().getDay();
        setIsFriday(todayDay === 5);
      } catch {
        // ignore
      }
    }
  }, []);

  const surahInfo = getSurahByPage(lastPage);
  const juzInfo = getJuzByPage(lastPage);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white p-5 sm:p-7 shadow-xl border border-emerald-500/30 transition-all hover:border-emerald-400/50">
      {/* خلفية جمالية وزخارف إسلامية خافتة */}
      <div className="absolute -top-16 -left-16 w-52 h-52 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -right-16 w-52 h-52 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
        {/* الجزء الأيمن: عنوان المصحف وتفاصيل آخر صفحة مقروءة */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-700/80 border border-emerald-400/40 text-xs font-bold text-emerald-100 shadow-xs">
              <BookOpen className="w-3.5 h-3.5 text-amber-300" />
              <span>{lang === 'ar' ? 'المصحف الشريف' : 'The Holy Quran'}</span>
            </span>

            {isFriday && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-400/20 border border-amber-300/40 text-[11px] font-bold text-amber-200 animate-pulse">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>{lang === 'ar' ? 'نور الجمعة: سورة الكهف' : 'Friday: Surah Al-Kahf'}</span>
              </span>
            )}

            {bookmarkedPage && (
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/10 text-[11px] text-emerald-200">
                <Bookmark className="w-3 h-3 text-amber-300" />
                <span>{lang === 'ar' ? `فاصل: صفحة ${toArabicNumerals(bookmarkedPage)}` : `Bookmark: p.${bookmarkedPage}`}</span>
              </span>
            )}
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <span>{lang === 'ar' ? 'ورد التلاوة والتدبر اليومي' : 'Daily Quran Recitation'}</span>
          </h2>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-emerald-100/90 font-medium">
            <span className="bg-white/10 px-2.5 py-1 rounded-lg border border-white/10">
              {lang === 'ar' ? `آخر قراءة: صفحة ${toArabicNumerals(lastPage)}` : `Last read: Page ${lastPage}`}
            </span>
            <span>•</span>
            <span className="font-serif font-bold text-amber-200">
              {surahInfo.fullName}
            </span>
            <span>•</span>
            <span className="text-emerald-200/80">
              {juzInfo.name}
            </span>
          </div>
        </div>

        {/* الجزء الأيسر: أزرار التفاعل المباشرة */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {/* زر سورة الكهف يوم الجمعة */}
          {isFriday && (
            <Link
              href="/quran?page=293"
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-md shadow-amber-900/30 transition-all hover:scale-105"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>{lang === 'ar' ? 'قراءة الكهف (٢٩٣)' : 'Read Al-Kahf (293)'}</span>
            </Link>
          )}

          {/* زر متابعة القراءة الأساسي */}
          <Link
            href={`/quran?page=${lastPage}`}
            className="px-5 py-2.5 rounded-2xl bg-white hover:bg-emerald-50 active:scale-95 text-emerald-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-black/20 transition-all cursor-pointer hover:shadow-xl"
          >
            <BookOpen className="w-4 h-4 text-emerald-700" />
            <span>{lang === 'ar' ? `متابعة من صفحة ${toArabicNumerals(lastPage)}` : `Continue from p.${lastPage}`}</span>
            <ChevronLeft className={`w-4 h-4 text-emerald-800 ${lang === 'en' ? 'rotate-180' : ''}`} />
          </Link>

          {/* زر فتح الفهرس */}
          <Link
            href="/quran"
            className="px-3.5 py-2.5 rounded-2xl bg-emerald-800/80 hover:bg-emerald-700/80 border border-emerald-400/30 text-white font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <List className="w-4 h-4 text-emerald-200" />
            <span>{lang === 'ar' ? 'فهرس السور' : 'Index'}</span>
          </Link>
        </div>
      </div>

      {/* شريط سريع لأشهر السور القرآنية للوصول بضغطة زر */}
      <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
        <span className="text-emerald-200/70 text-[11px] font-medium shrink-0">
          {lang === 'ar' ? 'سور شائعة:' : 'Quick Surahs:'}
        </span>
        <Link
          href="/quran?page=1"
          className="px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[11px] font-semibold transition-colors shrink-0"
        >
          {lang === 'ar' ? 'الفاتحة (١)' : 'Al-Fatihah'}
        </Link>
        <Link
          href="/quran?page=2"
          className="px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[11px] font-semibold transition-colors shrink-0"
        >
          {lang === 'ar' ? 'البقرة (٢)' : 'Al-Baqarah'}
        </Link>
        <Link
          href="/quran?page=293"
          className="px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[11px] font-semibold transition-colors shrink-0"
        >
          {lang === 'ar' ? 'الكهف (٢٩٣)' : 'Al-Kahf'}
        </Link>
        <Link
          href="/quran?page=440"
          className="px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[11px] font-semibold transition-colors shrink-0"
        >
          {lang === 'ar' ? 'يس (٤٤٠)' : 'Yasin'}
        </Link>
        <Link
          href="/quran?page=562"
          className="px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[11px] font-semibold transition-colors shrink-0"
        >
          {lang === 'ar' ? 'الملك (٥٦٢)' : 'Al-Mulk'}
        </Link>
        <Link
          href="/quran?page=604"
          className="px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[11px] font-semibold transition-colors shrink-0"
        >
          {lang === 'ar' ? 'المعوذات (٦٠٤)' : 'Al-Mu’awwidhat'}
        </Link>
      </div>
    </div>
  );
};
