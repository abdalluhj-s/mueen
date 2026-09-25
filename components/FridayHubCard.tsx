'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Compass,
  BookOpen,
  Sparkles,
  CheckCircle2,
  Clock,
  Heart,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface FridaySunanProps {
  onOpenSebhaWithSalawat: () => void;
}

const FRIDAY_SUNAN_ITEMS = [
  { id: 'fri_ghusl', title: 'الاغتسال لصلاة الجمعة', desc: '«غسل يوم الجمعة واجب على كل محتلم» (سنة مؤكدة)' },
  { id: 'fri_teeb', title: 'التطيب واستعمال السواك', desc: '«ومسّ من طيب إن كان عنده» والسواك مطهرة للفم' },
  { id: 'fri_thiyab', title: 'لبس أحسن وأطهر الثياب', desc: 'التجمل للجمعة والمشي إليها بسكينة ووقار' },
  { id: 'fri_tabkeer', title: 'التبكير إلى المسجد', desc: 'في الساعة الأولى كمن قرّب بدنة والإنصات للخطبة' },
];

export const FridayHubCard: React.FC<FridaySunanProps> = ({ onOpenSebhaWithSalawat }) => {
  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>({});
  const [salawatCount, setSalawatCount] = useState<number>(0);

  // معرفة ما إذا كان اليوم هو الجمعة
  const isFriday = new Date().getDay() === 5;

  useEffect(() => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const saved = localStorage.getItem(`mueen_friday_sunan_${today}`);
      if (saved) setCompletedItems(JSON.parse(saved));

      const savedSalawat = localStorage.getItem(`mueen_friday_salawat_${today}`);
      if (savedSalawat) setSalawatCount(parseInt(savedSalawat, 10) || 0);
    } catch {
      // ignore
    }
  }, []);

  const toggleItem = (id: string) => {
    const nextState = { ...completedItems, [id]: !completedItems[id] };
    setCompletedItems(nextState);
    try {
      const today = new Date().toISOString().split('T')[0];
      localStorage.setItem(`mueen_friday_sunan_${today}`, JSON.stringify(nextState));
    } catch {
      // ignore
    }
  };

  const handleIncrementSalawat = () => {
    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(15);
    }
    const next = salawatCount + 1;
    setSalawatCount(next);
    try {
      const today = new Date().toISOString().split('T')[0];
      localStorage.setItem(`mueen_friday_salawat_${today}`, String(next));
    } catch {
      // ignore
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-emerald-200/80 dark:border-emerald-900/60 shadow-xs space-y-5">
      {/* عنوان القسم */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-xs text-base">
            🕌
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base text-gray-900 dark:text-white">سنن وبركات يوم الجمعة</h3>
              {isFriday && (
                <span className="text-[10px] font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-full animate-pulse">
                  اليوم جمعة مباركة
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400 font-serif">«خير يوم طلعت عليه الشمس يوم الجمعة»</p>
          </div>
        </div>

        <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200">
          سيد الأيام
        </span>
      </div>

      {/* تنبيه ساعة الاستجابة في الجمعة */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-300/60 dark:border-amber-900/60 flex items-start gap-3">
        <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-bold text-xs sm:text-sm text-amber-900 dark:text-amber-200">
            تذكير: ساعة الاستجابة في يوم الجمعة 🤲
          </h4>
          <p className="text-xs text-amber-800/90 dark:text-amber-300/80 leading-relaxed font-serif">
            «فيهِ سَاعَةٌ لَا يُوَافِقُهَا عَبْدٌ مُسْلِمٌ وَهُوَ قَائِمٌ يُصَلِّي يَسْأَلُ اللَّهَ شَيْئًا إِلَّا أَعْطَاهُ إِيَّاهُ» — أكثروا من الدعاء في آخر ساعة بعد العصر وقبل غروب الشمس.
          </p>
        </div>
      </div>

      {/* سورة الكهف والصلاة على النبي (الكارتان السريعان) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* كارت قراءة سورة الكهف */}
        <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-900/60 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
              <h4 className="font-bold text-sm text-emerald-950 dark:text-emerald-200">قراءة سورة الكهف</h4>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-white dark:bg-slate-800 px-2 py-0.5 rounded-md border border-emerald-200/60">
              نور ما بين الجمعتين
            </span>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-300 font-serif">
            «من قرأ سورة الكهف في يوم الجمعة أضاء له من النور ما بين الجمعتين».
          </p>
          <Link
            href="/quran?page=293"
            className="w-full py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
          >
            <span>اقرأ سورة الكهف في المصحف</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* كارت الصلاة على النبي ﷺ (عداد مفتوح) */}
        <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/50 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-amber-600 fill-amber-600" />
              <h4 className="font-bold text-sm text-amber-950 dark:text-amber-200">الصلاة على النبي ﷺ</h4>
            </div>
            <span className="text-xs font-mono font-bold text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/60 px-2 py-0.5 rounded-lg">
              {salawatCount} صلاة
            </span>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-300 font-serif">
            «فَأَكْثِرُوا عَلَيَّ مِنَ الصَّلَاةِ فِيهِ فَإِنَّ صَلَاتَكُمْ مَعْرُوضَةٌ عَلَيَّ».
          </p>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleIncrementSalawat}
              className="flex-1 py-2.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 active:scale-95 text-white font-bold text-xs transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1"
            >
              <span>+ صلِّ عليه الآن</span>
            </button>
            <button
              type="button"
              onClick={onOpenSebhaWithSalawat}
              className="px-3 py-2.5 rounded-xl bg-white dark:bg-slate-800 text-amber-800 dark:text-amber-300 border border-amber-300/80 text-xs font-bold hover:bg-amber-50 transition-colors cursor-pointer"
              title="فتح السبحة الرقمية الكاملة"
            >
              📿 السبحة
            </button>
          </div>
        </div>
      </div>

      {/* قائمة سنن الجمعة الفردية */}
      <div className="space-y-2 pt-1">
        <span className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">
          سنن وآداب حضور الجمعة:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {FRIDAY_SUNAN_ITEMS.map((item) => {
            const isDone = Boolean(completedItems[item.id]);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => toggleItem(item.id)}
                className={`p-3 rounded-2xl border text-right transition-all flex items-start gap-3 cursor-pointer ${
                  isDone
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200'
                    : 'bg-gray-50/70 dark:bg-slate-800/60 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:border-emerald-300'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                    isDone
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : 'border-gray-300 dark:border-slate-600'
                  }`}
                >
                  {isDone && <CheckCircle2 className="w-4 h-4 fill-white text-emerald-600" />}
                </div>
                <div>
                  <div className={`font-bold text-xs ${isDone ? 'line-through opacity-80' : ''}`}>
                    {item.title}
                  </div>
                  <div className="text-[10px] text-gray-400 mt-0.5">{item.desc}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
