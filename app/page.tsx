'use client';

import React, { useState, useTransition, useEffect } from 'react';
import { Header } from '../components/Header';
import { DailyProgressCard } from '../components/DailyProgressCard';
import { HabitList } from '../components/HabitList';
import { PartnerCard } from '../components/PartnerCard';
import { PartnerInviteModal } from '../components/PartnerInviteModal';
import { AddHabitModal } from '../components/AddHabitModal';
import { HabitItem, PartnerStatus, PartnerMessage } from '../types/dashboard';
import { toggleHabitCompletion, fetchPartnerProgress } from './actions/habits';
import { acceptInviteCode, getPartnerMessages } from './actions/partner';
import { createClient } from '../lib/supabase/client';
import { Quote, Sparkles, UserPlus, LogIn, X, CheckCircle, Bell } from 'lucide-react';
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
  const [habits, setHabits] = useState<HabitItem[]>(() => loadHabitsFromStorage());
  const [partner, setPartner] = useState<PartnerStatus | null>(null);
  const [partnerMessages, setPartnerMessages] = useState<PartnerMessage[]>([]);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [showGuestBanner, setShowGuestBanner] = useState(true);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
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

  // جلب إنجاز ورسائل الشريك
  const loadPartnerData = async () => {
    try {
      const partnerData = await fetchPartnerProgress();
      setPartner(partnerData || null);

      const msgs = await getPartnerMessages();
      setPartnerMessages(msgs || []);
    } catch (err) {
      console.warn('تعذر جلب بيانات الشريك:', err);
    }
  };

  // 1. التحقق من تسجيل الدخول ومعالجة أي كود دعوة معلق تلقائياً
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (user) {
        setIsLoggedIn(true);
        setShowGuestBanner(false);
        setUserName(user.user_metadata?.full_name || user.email?.split('@')[0] || 'أخي المبارك');
        setUserEmail(user.email ?? null);

        // فحص كود دعوة معلق في LocalStorage وقبوله فورياً
        try {
          const pendingCode = localStorage.getItem('pending_invite_code');
          if (pendingCode) {
            const res = await acceptInviteCode(pendingCode);
            if (res.success) {
              localStorage.removeItem('pending_invite_code');
              setToastMsg(`تم ربطك بنجاح مع رفيقك المبارك (${res.partnerName || ''})! 🌿`);
            }
          }
        } catch (e) {
          console.warn('فحص كود الدعوة المعلق:', e);
        }

        loadPartnerData();
      }
    }).catch(() => {});
  }, []);

  const completedCount = habits.filter((h) => h.completed).length;

  // تبديل حالة العادة مع الحفظ المباشر في LocalStorage و Supabase
  const handleToggleHabit = (id: string) => {
    const targetHabit = habits.find((h) => h.id === id);
    if (!targetHabit) return;

    const newStatus = !targetHabit.completed;

    const updatedHabits = habits.map((h) =>
      h.id === id ? { ...h, completed: newStatus } : h
    );
    setHabits(updatedHabits);

    try {
      localStorage.setItem(HABITS_KEY, JSON.stringify(updatedHabits));
    } catch (e) {
      console.warn('تعذر الحفظ في LocalStorage:', e);
    }

    if (isLoggedIn) {
      startTransition(async () => {
        try {
          await toggleHabitCompletion(id, today, newStatus, {
            title: targetHabit.title,
            category: targetHabit.category,
          });
        } catch (error) {
          console.warn('تنبيه المزامنة السحابية:', error);
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
    <div dir="rtl" className="min-h-screen bg-slate-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100 font-sans transition-colors duration-200">
      <Header userStreak={9} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* إشعار عائم بالنجاح أو تأكيد الشريك */}
        {toastMsg && (
          <div className="bg-emerald-600 text-white rounded-2xl p-4 flex items-center justify-between shadow-lg shadow-emerald-600/30 animate-in slide-in-from-top-4 duration-300">
            <div className="flex items-center gap-2.5">
              <CheckCircle className="w-5 h-5 text-emerald-200 shrink-0" />
              <span className="text-sm font-bold">{toastMsg}</span>
            </div>
            <button
              type="button"
              onClick={() => setToastMsg(null)}
              className="p-1 rounded-lg text-emerald-200 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* شريط تنبيه وضع الضيف للزوار غير المسجلين */}
        {!isLoggedIn && showGuestBanner && (
          <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm text-emerald-900 dark:text-emerald-200 shadow-xs animate-in fade-in duration-300">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <p className="leading-relaxed">
                <strong className="font-bold">وضع الحفظ المحلي:</strong> إنجازاتك تُحفظ حالياً على جهازك. سجّل الدخول لحفظ بياناتك في السجل الشهري ومشاركتها مع رفيقك.
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
                className="p-1.5 rounded-lg text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100/60 dark:hover:bg-emerald-900/40 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* شريط الترحيب بالمستخدم المتصل وتأكيد المزامنة */}
        {isLoggedIn && (
          <div className="bg-emerald-50/70 dark:bg-slate-900/80 border border-emerald-200/60 dark:border-slate-800 rounded-2xl px-4 sm:px-5 py-3 flex items-center justify-between gap-3 text-xs sm:text-sm shadow-xs animate-in fade-in duration-300">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span className="text-gray-700 dark:text-gray-200 truncate">
                مرحباً بك يا <strong>{userName}</strong> • تم تفعيل مزامنة أورادك وسجلك الشهري سحابياً ☁️
              </span>
            </div>
            <span className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-200/70 dark:border-emerald-800 shrink-0">
              سحابي نشط
            </span>
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
              <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                رفيق المسير
              </span>
              <button
                type="button"
                onClick={() => setIsInviteModalOpen(true)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 hover:underline cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>دعوة شريك</span>
              </button>
            </div>

            {/* بطاقة الشريك التفاعلية */}
            <PartnerCard
              partner={partner}
              recentMessages={partnerMessages}
              onOpenInviteModal={() => setIsInviteModalOpen(true)}
              onRefreshPartner={loadPartnerData}
            />

            {/* ومضة إيمانية */}
            <div className="bg-emerald-900/5 dark:bg-emerald-950/30 border border-emerald-800/10 dark:border-emerald-900/40 rounded-2xl p-5">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-400 font-bold text-xs mb-2">
                <Quote className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                <span>قبس اليوم</span>
              </div>
              <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-serif">
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
