'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle2, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { getSavedLanguage, Language, LANGUAGE_CHANGE_EVENT, t } from '../lib/translations';

interface DailyProgressCardProps {
  completedCount: number;
  totalCount: number;
  hijriDate?: string;
  gregorianDate?: string;
  countryFlag?: string;
  countryName?: string;
  timeString?: string;
}

export const DailyProgressCard: React.FC<DailyProgressCardProps> = ({
  completedCount,
  totalCount,
  hijriDate = '10 ربيع الأول 1448 هـ',
  gregorianDate = '21 سبتمبر 2026 م',
  countryFlag,
  countryName,
  timeString,
}) => {
  const [lang, setLang] = useState<Language>(() => getSavedLanguage());

  useEffect(() => {
    const handleLang = (e: any) => setLang(e?.detail?.lang || getSavedLanguage());
    window.addEventListener(LANGUAGE_CHANGE_EVENT, handleLang);
    return () => window.removeEventListener(LANGUAGE_CHANGE_EVENT, handleLang);
  }, []);

  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // اختيار رسالة تحفيزية بناءً على نسبة الإنجاز واللغة
  const getMotivationalMessage = (pct: number) => {
    if (pct === 100) return t('motivational100', lang);
    if (pct >= 60) return t('motivational60', lang);
    if (pct > 0) return t('motivationalStart', lang);
    return t('motivationalZero', lang);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-800 text-white p-5 sm:p-6 shadow-lg shadow-emerald-900/20">
      {/* زخرفة خفيفة في الخلفية */}
      <div className="absolute -top-16 -left-16 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-16 -right-16 w-56 h-56 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* قسم التواريخ والدولة */}
        <div>
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-emerald-200 text-xs sm:text-sm font-medium mb-1">
            <Calendar className="w-4 h-4 text-emerald-300 shrink-0" />
            {countryFlag && <span>{countryFlag}</span>}
            <span>{hijriDate}</span>
            <span className="text-emerald-400/60">•</span>
            <span>{gregorianDate}</span>
            {countryName && (
              <>
                <span className="text-emerald-400/60">•</span>
                <span className="text-emerald-300/90 text-xs font-normal">
                  ({countryName})
                </span>
              </>
            )}
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-wide">
            {t('todayPortionHeading', lang)}
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 font-normal">
            {getMotivationalMessage(percentage)}
          </p>
          <div className="mt-2.5">
            <Link
              href="/progress"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 active:scale-95 text-white text-xs font-bold border border-white/20 transition-all backdrop-blur-sm shadow-xs"
            >
              <Calendar className="w-3.5 h-3.5 text-amber-300" />
              <span>{t('progressCardBtn', lang)}</span>
            </Link>
          </div>
        </div>

        {/* مؤشر النسبة الدائري أو الرقمي للسرعة */}
        <div className="flex items-center gap-3 self-start sm:self-center bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/10">
          <div className={lang === 'ar' ? 'text-right' : 'text-left'}>
            <div className="text-2xl font-black text-white">{percentage}%</div>
            <div className="text-[11px] text-emerald-200">
              {lang === 'ar' 
                ? `${completedCount} من أصل ${totalCount} عادات`
                : `${completedCount} of ${totalCount} habits`}
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-400/30">
            {percentage === 100 ? (
              <CheckCircle2 className="w-6 h-6 text-amber-300" />
            ) : (
              <TrendingUp className="w-5 h-5 text-emerald-200" />
            )}
          </div>
        </div>
      </div>

      {/* شريط التقدم (Progress Bar) */}
      <div className="mt-5 relative z-10">
        <div className="h-3 w-full bg-emerald-950/40 rounded-full overflow-hidden p-0.5 border border-white/10 shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-teal-400 via-emerald-300 to-amber-300 rounded-full transition-all duration-500 ease-out shadow-sm"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="flex justify-between items-center text-[11px] text-emerald-200/80 mt-1.5 font-medium">
          <span>0%</span>
          <span>50%</span>
          <span>{t('progressDone100', lang)}</span>
        </div>
      </div>
    </div>
  );
};
