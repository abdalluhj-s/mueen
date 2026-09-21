'use client';

import React, { useState, useTransition, useEffect } from 'react';
import { Header } from '../components/Header';
import { DailyProgressCard } from '../components/DailyProgressCard';
import { HabitList } from '../components/HabitList';
import { PartnerCard } from '../components/PartnerCard';
import { PartnerInviteModal } from '../components/PartnerInviteModal';
import { HabitItem, PartnerStatus } from '../types/dashboard';
import { toggleHabitCompletion, fetchPartnerProgress } from './actions/habits';
import { Quote, Sparkles, UserPlus } from 'lucide-react';

const INITIAL_HABITS: HabitItem[] = [
  { id: 'h1', title: 'الصلوات الخمس في أوقاتها مع الجماعة', category: 'صلاة', completed: true, timeHint: 'الفجر، الظهر، العصر، المغرب، العشاء' },
  { id: 'h2', title: 'ورد القرآن اليومي (جزء أو نصف حزب)', category: 'قرآن', completed: true, timeHint: 'بعد صلاة الفجر' },
  { id: 'h3', title: 'أذكار الصباح والمساء', category: 'أذكار', completed: false, timeHint: 'شروق وغروب الشمس' },
  { id: 'h4', title: 'صلاة الوتر وركعتي قيام الليل', category: 'صلاة', completed: false, timeHint: 'في الثلث الأخير من الليل' },
  { id: 'h5', title: 'السنن الرواتب (12 ركعة)', category: 'صلاة', completed: false, timeHint: 'قبل وبعد الصلوات المفروضة' },
];

export default function DashboardPage() {
  const [habits, setHabits] = useState<HabitItem[]>(INITIAL_HABITS);
  const [partner, setPartner] = useState<PartnerStatus | null>(null);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const today = new Date().toISOString().split('T')[0];

  // جلب إنجاز الشريك عند التحميل
  const loadPartnerData = async () => {
    try {
      const partnerData = await fetchPartnerProgress();
      if (partnerData) {
        setPartner(partnerData);
      }
    } catch (err) {
      console.error('تعذر جلب بيانات الشريك:', err);
    }
  };

  useEffect(() => {
    loadPartnerData();
  }, []);

  const completedCount = habits.filter((h) => h.completed).length;

  // تبديل حالة العادة مع Optimistic Update
  const handleToggleHabit = (id: string) => {
    const targetHabit = habits.find((h) => h.id === id);
    if (!targetHabit) return;

    const newStatus = !targetHabit.completed;

    setHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, completed: newStatus } : h))
    );

    startTransition(async () => {
      try {
        await toggleHabitCompletion(id, today, newStatus);
      } catch (error) {
        console.warn('استعادة حالة العادة:', error);
        setHabits((prev) =>
          prev.map((h) => (h.id === id ? { ...h, completed: !newStatus } : h))
        );
      }
    });
  };

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50 text-gray-900 font-sans">
      <Header user={{ name: 'أحمد البصري', streakDays: 9 }} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* شريط الإنجاز اليومي العام والتاريخ الهجري والميلادي */}
        <DailyProgressCard
          completedCount={completedCount}
          totalCount={habits.length}
          hijriDate="10 ربيع الأول 1448 هـ"
          gregorianDate="21 سبتمبر 2026 م"
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* العمود الرئيسي: قائمة عادات اليوم */}
          <section className="lg:col-span-2 space-y-6">
            <HabitList habits={habits} onToggleHabit={handleToggleHabit} />
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
                className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline"
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
    </div>
  );
}
