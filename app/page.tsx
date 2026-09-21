'use client';

import React, { useState, useTransition, useEffect } from 'react';
import { Header } from '../components/Header';
import { DailyProgressCard } from '../components/DailyProgressCard';
import { HabitList } from '../components/HabitList';
import { PartnerCard } from '../components/PartnerCard';
import { PartnerInviteModal } from '../components/PartnerInviteModal';
import { AddHabitModal } from '../components/AddHabitModal';
import { HabitItem, PartnerStatus } from '../types/dashboard';
import { toggleHabitCompletion, fetchPartnerProgress } from './actions/habits';
import { createClient } from '../lib/supabase/client';
import { Quote, Sparkles, UserPlus, LogIn, X } from 'lucide-react';
import Link from 'next/link';

// إصدار العادات الافتراضية — تغييره يؤدي لإعادة ضبط LocalStorage للزوار الجدد
const HABITS_VERSION = 'v3';
const HABITS_KEY = 'mueen_habits';
const VERSION_KEY = 'mueen_habits_version';

const DEFAULT_HABITS: HabitItem[] = [
  // ===== الصلوات =====
  { id: 'h1', title: 'صلاة الفجر في وقتها مع الجماعة', category: 'صلاة', completed: false, timeHint: 'عند أذان الفجر' },
  { id: 'h2', title: 'صلاة الظهر في وقتها مع الجماعة', category: 'صلاة', completed: false, timeHint: 'عند أذان الظهر' },
  { id: 'h3', title: 'صلاة العصر في وقتها مع الجماعة', category: 'صلاة', completed: false, timeHint: 'عند أذان العصر' },
  { id: 'h4', title: 'صلاة المغرب في وقتها مع الجماعة', category: 'صلاة', completed: false, timeHint: 'عند أذان المغرب' },
  { id: 'h5', title: 'صلاة العشاء في وقتها مع الجماعة', category: 'صلاة', completed: false, timeHint: 'عند أذان العشاء' },
  { id: 'h6', title: 'السنن الرواتب (12 ركعة)', category: 'صلاة', completed: false, timeHint: 'قبل وبعد الصلوات المفروضة' },
  { id: 'h7', title: 'صلاة الوتر وركعتي قيام الليل', category: 'صلاة', completed: false, timeHint: 'في الثلث الأخير من الليل' },
  // ===== القرآن =====
  { id: 'h8', title: 'ورد القرآن اليومي (جزء أو نصف حزب)', category: 'قرآن', completed: false, timeHint: 'بعد صلاة الفجر' },
  // ===== الأذكار =====
  { id: 'h9', title: 'أذكار الصباح', category: 'أذكار', completed: false, timeHint: 'بعد صلاة الفجر حتى الشروق' },
  { id: 'h10', title: 'أذكار المساء', category: 'أذكار', completed: false, timeHint: 'من العصر حتى غروب الشمس' },
  { id: 'h11', title: 'أذكار أخرى (النوم، الأكل، الخروج...)', category: 'أذكار', completed: false, timeHint: 'طوال اليوم' },
];

// قراءة العادات من LocalStorage مع دعم الإصدار (Versioned)
function loadHabitsFromStorage(): HabitItem[] {
  if (typeof window === 'undefined') return DEFAULT_HABITS;
  try {
    const version = localStorage.getItem(VERSION_KEY);
    const saved = localStorage.getItem(HABITS_KEY);

    // إذا اختلف الإصدار أو لا يوجد بيانات، نبدأ من الافتراضي
    if (version !== HABITS_VERSION || !saved) {
      localStorage.setItem(VERSION_KEY, HABITS_VERSION);
      localStorage.setItem(HABITS_KEY, JSON.stringify(DEFAULT_HABITS));
      return DEFAULT_HABITS;
    }

    const parsed = JSON.parse(saved);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    return DEFAULT_HABITS;
  } catch {
    return DEFAULT_HABITS;
  }
}

export default function DashboardPage() {
  // Lazy initializer: يقرأ من LocalStorage مباشرةً في أول render، لا ارتداد
  const [habits, setHabits] = useState<HabitItem[]>(() => loadHabitsFromStorage());
  const [partner, setPartner] = useState<PartnerStatus | null>(null);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showGuestBanner, setShowGuestBanner] = useState(true);
  const [isPending, startTransition] = useTransition();

  const today = new Date().toISOString().split('T')[0];

  // حساب التواريخ الهجرية والميلادية اليوم بدقة
  const getFormattedDates = () => {
    try {
      const now = new Date();
      const gregorian = new Intl.DateTimeFormat('ar-EG', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(now);

      const hijri = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(now);

      return {
        gregorian: `${gregorian} م`,
        hijri: `${hijri} هـ`,
      };
    } catch {
      return {
        gregorian: '22 سبتمبر 2026 م',
        hijri: '10 ربيع الأول 1448 هـ',
      };
    }
  };

  const { gregorian, hijri } = getFormattedDates();

  // 1. التحقق من تسجيل الدخول فقط (العادات تُحمَّل فوراً من lazy initializer)
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setIsLoggedIn(true);
        setShowGuestBanner(false);
        loadPartnerData();
      }
    }).catch(() => {});
  }, []);

  // جلب إنجاز الشريك عند التحميل
  const loadPartnerData = async () => {
    try {
      const partnerData = await fetchPartnerProgress();
      if (partnerData) {
        setPartner(partnerData);
      }
    } catch (err) {
      console.warn('تعذر جلب بيانات الشريك:', err);
    }
  };

  const completedCount = habits.filter((h) => h.completed).length;

  // تبديل حالة العادة مع الحفظ المباشر في LocalStorage و Supabase
  const handleToggleHabit = (id: string) => {
    const targetHabit = habits.find((h) => h.id === id);
    if (!targetHabit) return;

    const newStatus = !targetHabit.completed;

    // تحديث الحالة فورياً وثباتها في الواجهة
    const updatedHabits = habits.map((h) =>
      h.id === id ? { ...h, completed: newStatus } : h
    );
    setHabits(updatedHabits);

    // الحفظ المحلي الفوري الدائم
    try {
      localStorage.setItem(HABITS_KEY, JSON.stringify(updatedHabits));
    } catch (e) {
      console.warn('تعذر الحفظ في LocalStorage:', e);
    }

    // المزامنة السحابية في الخلفية إذا كان المستخدم مسجلاً
    if (isLoggedIn) {
      startTransition(async () => {
        try {
          await toggleHabitCompletion(id, today, newStatus, {
            title: targetHabit.title,
            category: targetHabit.category,
          });
        } catch (error) {
          console.warn('تنبيه المزامنة السحابية:', error);
          // لا نقوم بإلغاء التحديد للواجهة لضمان تجربة مستخدم سلسة دون ارتداد
        }
      });
    }
  };

  // إضافة ورد أو عادة جديدة
  const handleAddHabit = (newHabitData: Omit<HabitItem, 'id' | 'completed'>) => {
    const newHabit: HabitItem = {
      id: `custom_${Date.now()}`,
      title: newHabitData.title,
      category: newHabitData.category,
      timeHint: newHabitData.timeHint,
      completed: false,
    };

    const updatedHabits = [...habits, newHabit];
    setHabits(updatedHabits);

    try {
      localStorage.setItem(HABITS_KEY, JSON.stringify(updatedHabits));
    } catch (e) {
      console.warn('تعذر الحفظ في LocalStorage:', e);
    }
  };

  // حذف عادة
  const handleDeleteHabit = (id: string) => {
    const updatedHabits = habits.filter((h) => h.id !== id);
    setHabits(updatedHabits);

    try {
      localStorage.setItem(HABITS_KEY, JSON.stringify(updatedHabits));
    } catch (e) {
      console.warn('تعذر الحفظ في LocalStorage:', e);
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50 text-gray-900 font-sans">
      <Header userStreak={9} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* شريط تنبيه وضع الضيف للزوار غير المسجلين */}
        {!isLoggedIn && showGuestBanner && (
          <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm text-emerald-900 shadow-xs animate-in fade-in duration-300">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <p className="leading-relaxed">
                <strong className="font-bold">وضع الحفظ المحلي:</strong> إنجازاتك تُحفظ حالياً على متصفحك. سجّل الدخول بحساب Google بضغطة واحدة لمزامنة بياناتك سحابياً ومشاركتها مع شريكك.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              <Link
                href="/login"
                className="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold transition-all flex items-center gap-1.5 shadow-xs"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>تسجيل الدخول</span>
              </Link>
              <button
                type="button"
                onClick={() => setShowGuestBanner(false)}
                aria-label="إغلاق التنبيه"
                className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-100/60 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* شريط الإنجاز اليومي العام والتاريخ الهجري والميلادي */}
        <DailyProgressCard
          completedCount={completedCount}
          totalCount={habits.length}
          hijriDate={hijri}
          gregorianDate={gregorian}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* العمود الرئيسي: قائمة عادات اليوم */}
          <section className="lg:col-span-2 space-y-6">
            <HabitList
              habits={habits}
              onToggleHabit={handleToggleHabit}
              onDeleteHabit={handleDeleteHabit}
              onAddHabitClick={() => setIsAddModalOpen(true)}
            />
          </section>

          {/* العمود الجانبي: شريك الالتزام والفوائد */}
          <aside className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                رفيق المسير
              </span>
              <button
                type="button"
                onClick={() => setIsInviteModalOpen(true)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>دعوة شريك</span>
              </button>
            </div>

            {/* بطاقة الشريك */}
            <PartnerCard
              partner={partner}
              onOpenInviteModal={() => setIsInviteModalOpen(true)}
            />

            {/* ومضة إيمانية */}
            <div className="bg-emerald-900/5 border border-emerald-800/10 rounded-2xl p-5">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs mb-2">
                <Quote className="w-4 h-4 text-emerald-700" />
                <span>قبس اليوم</span>
              </div>
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-serif">
                «من صام يوماً في سبيل الله بعد الله وجهه عن النار سبعين خريفاً»
              </p>
            </div>
          </aside>
        </div>
      </main>

      {/* نافذة دعوة أو ربط الشريك (Modal) */}
      <PartnerInviteModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onPartnerConnected={() => {
          loadPartnerData();
        }}
      />

      {/* نافذة إضافة ورد أو عادة جديدة (Modal) */}
      <AddHabitModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddHabit={handleAddHabit}
      />
    </div>
  );
}
