'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  Headphones,
  Globe,
  AlignRight,
} from 'lucide-react';

const SURAHS = [
  { num: 1, name: 'الفاتحة', verses: 7 },
  { num: 2, name: 'البقرة', verses: 286 },
  { num: 3, name: 'آل عمران', verses: 200 },
  { num: 18, name: 'الكهف', verses: 110 },
  { num: 36, name: 'يس', verses: 83 },
  { num: 55, name: 'الرحمن', verses: 78 },
  { num: 56, name: 'الواقعة', verses: 96 },
  { num: 67, name: 'الملك', verses: 30 },
  { num: 78, name: 'النبأ', verses: 40 },
  { num: 112, name: 'الإخلاص', verses: 4 },
  { num: 113, name: 'الفلق', verses: 5 },
  { num: 114, name: 'الناس', verses: 6 },
];

const QUICK_LINKS = [
  { label: 'المصحف الكامل', url: 'https://quran.com/ar', icon: <BookOpen className="w-4 h-4" /> },
  { label: 'استماع قرآن', url: 'https://mp3quran.net', icon: <Headphones className="w-4 h-4" /> },
  { label: 'تفسير القرآن', url: 'https://tafsir.app', icon: <AlignRight className="w-4 h-4" /> },
];

export default function QuranPage() {
  const [selectedSurah, setSelectedSurah] = useState(1);
  const [iframeError, setIframeError] = useState(false);

  const currentSurah = SURAHS.find((s) => s.num === selectedSurah) ?? SURAHS[0];

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50 text-gray-900 font-sans">
      {/* الشريط العلوي */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-emerald-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-900 transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
            <span>العودة للوحة التحكم</span>
          </Link>

          <div className="flex items-center gap-2 text-emerald-800">
            <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <h1 className="font-bold text-base sm:text-lg">قارئ القرآن الكريم</h1>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* بطاقة العنوان والاختيار السريع */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-800 text-white p-5 sm:p-6 shadow-lg">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/5 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10">
            <p className="text-emerald-200 text-xs mb-1">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
            <h2 className="text-xl sm:text-2xl font-bold mb-1">ورد القرآن اليومي</h2>
            <p className="text-xs text-emerald-100/80">
              «اقرأ وارقَ، فإن منزلتك عند آخر آية تقرؤها»
            </p>

            {/* اختيار السورة */}
            <div className="mt-4 flex flex-wrap gap-2">
              {SURAHS.map((s) => (
                <button
                  key={s.num}
                  type="button"
                  onClick={() => {
                    setSelectedSurah(s.num);
                    setIframeError(false);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    selectedSurah === s.num
                      ? 'bg-white text-emerald-800 shadow-sm'
                      : 'bg-white/15 text-white hover:bg-white/25'
                  }`}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* عارض القرآن الرئيسي */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-700" />
                <span className="font-bold text-gray-900 text-sm">
                  سورة {currentSurah.name}
                </span>
                <span className="text-xs text-gray-400">({currentSurah.verses} آية)</span>
              </div>
              <a
                href={`https://quran.com/ar/${selectedSurah}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-emerald-700 hover:underline font-medium"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>فتح في quran.com</span>
              </a>
            </div>

            {/* الـ iframe أو الرسالة البديلة */}
            {!iframeError ? (
              <div className="relative">
                <iframe
                  key={selectedSurah}
                  src={`https://quran.com/ar/${selectedSurah}`}
                  title={`سورة ${currentSurah.name}`}
                  className="w-full border-none"
                  style={{ height: '600px' }}
                  onError={() => setIframeError(true)}
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                />
              </div>
            ) : (
              /* بديل إذا رفض iframe التحميل */
              <div className="flex flex-col items-center justify-center py-16 px-6 text-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <Globe className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">افتح القرآن في نافذة جديدة</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    بعض الأجهزة لا تدعم التضمين المباشر. اضغط على الزر لفتح المصحف في تبويب منفصل.
                  </p>
                </div>
                <a
                  href={`https://quran.com/ar/${selectedSurah}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm flex items-center gap-2 transition-all"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>فتح سورة {currentSurah.name}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>

          {/* الشريط الجانبي: روابط سريعة */}
          <div className="space-y-4">
            {/* روابط مواقع القرآن */}
            <div className="bg-white rounded-2xl border border-gray-200/80 p-4 shadow-xs">
              <h3 className="font-bold text-gray-900 text-sm mb-3 flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-700" />
                مواقع القرآن المعتمدة
              </h3>
              <div className="space-y-2">
                {QUICK_LINKS.map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 p-3 rounded-xl border border-gray-100 hover:border-emerald-200 hover:bg-emerald-50/50 transition-all text-sm font-medium text-gray-700 hover:text-emerald-800 group"
                  >
                    <span className="text-emerald-600">{link.icon}</span>
                    <span className="flex-1">{link.label}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-gray-300 group-hover:text-emerald-500 transition-colors" />
                  </a>
                ))}
              </div>
            </div>

            {/* قائمة السور الكاملة */}
            <div className="bg-white rounded-2xl border border-gray-200/80 p-4 shadow-xs">
              <h3 className="font-bold text-gray-900 text-sm mb-3 flex items-center gap-2">
                <ChevronDown className="w-4 h-4 text-emerald-700" />
                اختر سورة
              </h3>
              <div className="space-y-1 max-h-64 overflow-y-auto">
                {SURAHS.map((s) => (
                  <button
                    key={s.num}
                    type="button"
                    onClick={() => {
                      setSelectedSurah(s.num);
                      setIframeError(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      selectedSurah === s.num
                        ? 'bg-emerald-700 text-white'
                        : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-800'
                    }`}
                  >
                    <span>{s.name}</span>
                    <span className="opacity-60">{s.verses} آية</span>
                  </button>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100">
                <a
                  href="https://quran.com/ar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 text-xs text-emerald-700 hover:underline font-medium"
                >
                  <span>عرض جميع السور (114 سورة)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* بطاقة تذكير */}
            <div className="bg-emerald-900/5 border border-emerald-800/10 rounded-2xl p-4">
              <p className="text-xs text-gray-700 leading-relaxed font-serif text-center">
                «خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ»
              </p>
              <p className="text-[11px] text-gray-400 text-center mt-1">صحيح البخاري</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
