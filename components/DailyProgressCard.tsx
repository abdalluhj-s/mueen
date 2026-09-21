'use strict';
import React from 'react';
import { Calendar, CheckCircle2, TrendingUp } from 'lucide-react';

interface DailyProgressCardProps {
  completedCount: number;
  totalCount: number;
  hijriDate?: string;
  gregorianDate?: string;
}

export const DailyProgressCard: React.FC<DailyProgressCardProps> = ({
  completedCount,
  totalCount,
  hijriDate = '10 ربيع الأول 1448 هـ',
  gregorianDate = '21 سبتمبر 2026 م',
}) => {
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // اختيار رسالة تحفيزية بناءً على نسبة الإنجاز
  const getMotivationalMessage = (pct: number) => {
    if (pct === 100) return 'ما شاء الله! أتممت جميع أورادك اليومية مبارك التزامك 🌟';
    if (pct >= 60) return 'أحسنت! قطعت شوطاً رائعاً، قارب على الإتمام 🌿';
    if (pct > 0) return 'بداية طيبة، استعن بالله وأتمم بقية وردك 📖';
    return '«أَحَبُّ الأَعْمَالِ إِلَى اللَّهِ أَدْوَمُهَا وَإِنْ قَلَّ» 🕊️';
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-800 text-white p-5 sm:p-6 shadow-lg shadow-emerald-900/20">
      {/* زخرفة خفيفة في الخلفية */}
      <div className="absolute -top-16 -left-16 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-16 -right-16 w-56 h-56 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* قسم التواريخ */}
        <div>
          <div className="flex items-center gap-2 text-emerald-200 text-xs sm:text-sm font-medium mb-1">
            <Calendar className="w-4 h-4 text-emerald-300" />
            <span>{hijriDate}</span>
            <span className="text-emerald-400/60">•</span>
            <span>{gregorianDate}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-wide">
            ورد اليوم وعهده
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 font-normal">
            {getMotivationalMessage(percentage)}
          </p>
        </div>

        {/* مؤشر النسبة الدائري أو الرقمي للسرعة */}
        <div className="flex items-center gap-3 self-start sm:self-center bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/10">
          <div className="text-right">
            <div className="text-2xl font-black text-white">{percentage}%</div>
            <div className="text-[11px] text-emerald-200">
              {completedCount} من أصل {totalCount} عادات
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
          <span>100% تم الإنجاز</span>
        </div>
      </div>
    </div>
  );
};
