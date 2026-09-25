'use client';

import React, { useState, useEffect } from 'react';
import { X, RotateCcw, Volume2, VolumeX, Sparkles, Trophy, Check } from 'lucide-react';

interface SebhaModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDhikrIndex?: number;
}

const DHIKR_PRESETS = [
  {
    id: 'salawat',
    title: 'الصلاة على النبي ﷺ',
    text: 'اللَّهُمَّ صَلِّ وَسَلِّمْ وَبَارِكْ عَلَى نَبِيِّنَا مُحَمَّدٍ وَعَلَى آلِهِ وَصَحْبِهِ',
    target: 0, // 0 = مفتوح
    benefit: 'من صلى عليّ صلاة صلى الله عليه بها عشراً.',
  },
  {
    id: 'tasbih_tahmid',
    title: 'سبحان الله وبحمده سبحان الله العظيم',
    text: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ ، سُبْحَانَ اللَّهِ الْعَظِيمِ',
    target: 100,
    benefit: 'كلمتان خفيفتان على اللسان، ثقيلتان في الميزان، حبيبتان إلى الرحمن.',
  },
  {
    id: 'istighfar',
    title: 'الاستغفار والتوبة',
    text: 'أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ الَّذِي لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ وَأَتُوبُ إِلَيْهِ',
    target: 100,
    benefit: 'من لزم الاستغفار جعل الله له من كل هم فرجاً ومن كل ضيق مخرجاً.',
  },
  {
    id: 'hawqala',
    title: 'الحوقلة (كنز الجنة)',
    text: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ الْعَلِيِّ الْعَظِيمِ',
    target: 0,
    benefit: 'كنز من كنوز الجنة ودواء لتسعة وتسعين داء أيسرها الهم.',
  },
  {
    id: 'tahlil',
    title: 'التهليل الأعظم',
    text: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
    target: 100,
    benefit: 'كانت له عدل عشر رقاب وكتبت له مائة حسنة ومُحيت عنه مائة سيئة.',
  },
  {
    id: 'baqiyat',
    title: 'الباقيات الصالحات',
    text: 'سُبْحَانَ اللَّهِ ، وَالْحَمْدُ لِلَّهِ ، وَلَا إِلَهَ إِلَّا اللَّهُ ، وَاللَّهُ أَكْبَرُ',
    target: 33,
    benefit: 'أحب الكلام إلى الله وأحب مما طلعت عليه الشمس.',
  },
];

export const SebhaModal: React.FC<SebhaModalProps> = ({
  isOpen,
  onClose,
  initialDhikrIndex = 0,
}) => {
  const [selectedPresetIndex, setSelectedPresetIndex] = useState(initialDhikrIndex);
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState(DHIKR_PRESETS[initialDhikrIndex].target);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [totalToday, setTotalToday] = useState(0);

  const currentDhikr = DHIKR_PRESETS[selectedPresetIndex];

  // قراءة المجموع الإجمالي للتسبيح اليومي
  useEffect(() => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const saved = localStorage.getItem(`mueen_sebha_total_${today}`);
      if (saved) setTotalToday(parseInt(saved, 10) || 0);
    } catch {
      // ignore
    }
  }, []);

  if (!isOpen) return null;

  // تشغيل صوت نقرة ناعمة باستخدام Web Audio API دون الحاجة لملفات خارجية
  const playSoftClickSound = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.05);
    } catch {
      // ignore
    }
  };

  const handleIncrement = () => {
    // اهتزاز لمسي على أجهزة الجوال
    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(20);
    }
    playSoftClickSound();

    const nextCount = count + 1;
    setCount(nextCount);

    const nextTotal = totalToday + 1;
    setTotalToday(nextTotal);

    try {
      const today = new Date().toISOString().split('T')[0];
      localStorage.setItem(`mueen_sebha_total_${today}`, String(nextTotal));
    } catch {
      // ignore
    }
  };

  const handleReset = () => {
    setCount(0);
  };

  const handleSelectPreset = (idx: number) => {
    setSelectedPresetIndex(idx);
    setTarget(DHIKR_PRESETS[idx].target);
    setCount(0);
  };

  const isCompletedTarget = target > 0 && count >= target;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        dir="rtl"
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 shadow-2xl border border-emerald-100 dark:border-slate-800 space-y-4 max-h-[92vh] flex flex-col justify-between"
      >
        {/* شريط الرأس */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-xs text-sm">
              📿
            </div>
            <div>
              <h3 className="font-bold text-base text-gray-900 dark:text-white">السبحة الإلكترونية</h3>
              <p className="text-[10px] text-gray-400">مجموع اليوم: {totalToday} تسبيحة 🌿</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setSoundEnabled((prev) => !prev)}
              className="p-2 rounded-xl text-gray-400 hover:text-emerald-700 transition-colors"
              title={soundEnabled ? 'كتم الصوت' : 'تفعيل صوت النقر'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* اختيار صيغة الذكر */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {DHIKR_PRESETS.map((p, idx) => (
            <button
              key={p.id}
              type="button"
              onClick={() => handleSelectPreset(idx)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-all cursor-pointer border ${
                selectedPresetIndex === idx
                  ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                  : 'bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-slate-700 hover:border-emerald-300'
              }`}
            >
              <span>{p.title}</span>
            </button>
          ))}
        </div>

        {/* بطاقة نص الذكر */}
        <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/70 dark:border-emerald-900/60 text-center space-y-1.5">
          <p className="font-serif text-sm sm:text-base font-bold text-emerald-950 dark:text-emerald-200 leading-relaxed">
            {currentDhikr.text}
          </p>
          <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-serif">
            💡 {currentDhikr.benefit}
          </p>
        </div>

        {/* محدد الهدف (مفتوح أو 33 أو 100) */}
        <div className="flex items-center justify-between text-xs px-1 text-gray-500">
          <span>الهدف المطلوب:</span>
          <div className="flex bg-gray-100 dark:bg-slate-800 p-0.5 rounded-xl">
            {[0, 33, 100].map((tg) => (
              <button
                key={tg}
                type="button"
                onClick={() => setTarget(tg)}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  target === tg
                    ? 'bg-emerald-700 text-white shadow-2xs'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
                }`}
              >
                {tg === 0 ? 'مفتوح ∞' : tg}
              </button>
            ))}
          </div>
        </div>

        {/* دائرة السبحة الكبيرة للتسبيح باللمس */}
        <div className="py-2 flex flex-col items-center justify-center">
          <button
            type="button"
            onClick={handleIncrement}
            className={`w-44 h-44 sm:w-48 sm:h-48 rounded-full shadow-[0_15px_40px_rgba(5,150,105,0.25)] border-8 flex flex-col items-center justify-center transition-all cursor-pointer select-none active:scale-92 active:shadow-inner ${
              isCompletedTarget
                ? 'bg-gradient-to-tr from-amber-600 to-amber-500 border-amber-300 text-white'
                : 'bg-gradient-to-tr from-emerald-700 via-emerald-600 to-teal-500 border-emerald-200/80 dark:border-emerald-700 text-white'
            }`}
          >
            <span className="text-5xl sm:text-6xl font-extrabold font-mono tracking-tight drop-shadow-md">
              {count}
            </span>
            <span className="text-xs font-semibold opacity-90 mt-1">
              {target > 0 ? `من أصل ${target}` : 'عداد مفتوح'}
            </span>
            <span className="text-[11px] font-bold mt-2 bg-black/15 px-3 py-0.5 rounded-full">
              اضغط للتسبيح 👆
            </span>
          </button>
        </div>

        {/* أزرار التحكم السفلية */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-slate-800">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-gray-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-bold transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>تصفير العداد</span>
          </button>

          <span className="text-[11px] text-gray-400 font-mono">
            اليوم: {totalToday} مرة
          </span>
        </div>
      </div>
    </div>
  );
};
