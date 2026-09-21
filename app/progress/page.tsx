import React from 'react';
import { createClient } from '../../lib/supabase/server';
import { redirect } from 'next/navigation';
import Header from '../../components/Header';
import { Calendar, CheckCircle, Flame, Target } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'مُعين | السجل الشهري',
};

export default async function ProgressPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?next=/progress');
  }

  // جلب سجلات الأيام للمستخدم
  // نستخدم inner join لضمان جلب السجلات التي تتبع عادات هذا المستخدم فقط
  const { data: logs, error } = await supabase
    .from('daily_logs')
    .select(`
      date,
      completed,
      user_habits!inner (
        id,
        user_id,
        title
      )
    `)
    .eq('user_habits.user_id', user.id)
    .eq('completed', true);

  if (error) {
    console.error('خطأ في جلب السجلات:', error);
  }

  // تجميع السجلات حسب اليوم
  const completedByDate: Record<string, number> = {};
  if (logs) {
    logs.forEach((log) => {
      const dateStr = log.date;
      if (!completedByDate[dateStr]) {
        completedByDate[dateStr] = 0;
      }
      completedByDate[dateStr]++;
    });
  }

  // إعداد بيانات التقويم للشهر الحالي
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  // أول يوم في الشهر
  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDay = new Date(currentYear, currentMonth + 1, 0);
  const daysInMonth = lastDay.getDate();

  // لمعرفة اليوم الذي يبدأ فيه الشهر (0 = الأحد، 6 = السبت)
  let startDayOfWeek = firstDay.getDay(); 
  // تعديل البداية لتناسب التقويم العربي (السبت أو الأحد)
  // لنفترض أننا سنعرض الأيام كالمعتاد (الأحد إلى السبت)
  
  const days = [];
  for (let i = 1; i <= daysInMonth; i++) {
    const d = new Date(currentYear, currentMonth, i);
    // Format YYYY-MM-DD in local time
    const dateString = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    days.push({
      dayNumber: i,
      dateString,
      count: completedByDate[dateString] || 0,
    });
  }

  // حساب أرقام ملخص الشهر
  const totalCompletedThisMonth = days.reduce((acc, curr) => acc + curr.count, 0);
  const activeDaysThisMonth = days.filter(d => d.count > 0).length;
  
  // حساب الستريك (أيام متتالية)
  let currentStreak = 0;
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  
  // نبدأ من اليوم ونعود للخلف
  let tempDate = new Date();
  while (true) {
    const ds = `${tempDate.getFullYear()}-${String(tempDate.getMonth() + 1).padStart(2, '0')}-${String(tempDate.getDate()).padStart(2, '0')}`;
    if (completedByDate[ds] && completedByDate[ds] > 0) {
      currentStreak++;
      tempDate.setDate(tempDate.getDate() - 1);
    } else if (ds === todayStr) {
      // لو كان اليوم لسه ما انجزش حاجة، نشوف امبارح
      tempDate.setDate(tempDate.getDate() - 1);
    } else {
      break;
    }
  }

  const monthName = new Intl.DateTimeFormat('ar-EG', { month: 'long', year: 'numeric' }).format(today);

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50 text-gray-900 font-sans pb-12">
      <Header userStreak={currentStreak} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* عنوان الصفحة */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-emerald-600" />
              السجل الشهري
            </h1>
            <p className="text-gray-500 mt-1">تتبع إنجازاتك ومدى التزامك خلال {monthName}</p>
          </div>
          <Link href="/" className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors shadow-sm">
            العودة للرئيسية
          </Link>
        </div>

        {/* بطاقات الإحصائيات */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 shrink-0">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">الشعلة الحالية (Streak)</p>
              <p className="text-2xl font-bold text-gray-900">{currentStreak} <span className="text-base font-normal text-gray-500">أيام</span></p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">إجمالي الإنجازات</p>
              <p className="text-2xl font-bold text-gray-900">{totalCompletedThisMonth} <span className="text-base font-normal text-gray-500">عادة</span></p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">أيام الالتزام</p>
              <p className="text-2xl font-bold text-gray-900">{activeDaysThisMonth} <span className="text-base font-normal text-gray-500">يوم</span></p>
            </div>
          </div>
        </div>

        {/* التقويم الشهري */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">سجل شهر {monthName}</h2>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-7 gap-2 sm:gap-4 mb-2">
              {['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'].map(day => (
                <div key={day} className="text-center text-xs font-semibold text-gray-400 py-2">
                  {day}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-2 sm:gap-4">
              {/* الفراغات لبداية الشهر */}
              {Array.from({ length: startDayOfWeek }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square rounded-xl bg-gray-50/50"></div>
              ))}
              
              {/* أيام الشهر */}
              {days.map((day) => {
                // تحديد لون اليوم بناءً على عدد العادات المكتملة
                let bgClass = "bg-gray-50 hover:bg-gray-100 text-gray-600 border-gray-100";
                
                if (day.count > 0) {
                  if (day.count >= 8) {
                    bgClass = "bg-emerald-500 text-white border-emerald-600 hover:bg-emerald-600 shadow-sm"; // ممتاز
                  } else if (day.count >= 4) {
                    bgClass = "bg-emerald-300 text-emerald-900 border-emerald-400 hover:bg-emerald-400"; // جيد
                  } else {
                    bgClass = "bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200"; // قليل
                  }
                } else if (day.dateString === todayStr) {
                  bgClass = "bg-white border-2 border-emerald-500 text-gray-900 font-bold"; // اليوم الحالي ولم ينجز بعد
                }

                return (
                  <div 
                    key={day.dayNumber}
                    className={`aspect-square rounded-xl border flex flex-col items-center justify-center transition-all duration-200 relative group cursor-default ${bgClass}`}
                  >
                    <span className="text-sm sm:text-base">{day.dayNumber}</span>
                    
                    {/* Tooltip */}
                    {day.count > 0 && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                        أنجزت {day.count} عادة
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            <div className="mt-8 flex items-center justify-center gap-6 text-sm text-gray-500 border-t border-gray-100 pt-6">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-gray-50 border border-gray-100"></div>
                <span>لم ينجز</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-emerald-100 border border-emerald-200"></div>
                <span>قليل</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-emerald-300 border border-emerald-400"></div>
                <span>جيد</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-emerald-500 border border-emerald-600"></div>
                <span>ممتاز</span>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
