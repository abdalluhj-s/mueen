'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '../../lib/supabase/server';
import { PartnerStatus } from '../../types/dashboard';

/**
 * 1. دالة لتحديث أو تسجيل إنجاز العادة اليومية في جدول daily_logs
 * @param userHabitId مُعرف عادة المستخدم في جدول user_habits
 * @param date التاريخ بصيغة 'YYYY-MM-DD'
 * @param status حالة الإنجاز (true / false)
 */
export async function toggleHabitCompletion(
  userHabitId: string,
  date: string,
  status: boolean,
  habitDetails?: { title: string; category: string }
) {
  const supabase = await createClient();

  // التحقق من هوية المستخدم المسجل
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error('غير مصرح لك بتنفيذ هذه العملية. يرجى تسجيل الدخول.');
  }

  // تحديث أو إدخال العادة في جدول user_habits لضمان وجودها (مهم للعادات الافتراضية)
  if (habitDetails) {
    const { error: upsertHabitError } = await supabase
      .from('user_habits')
      .upsert(
        {
          id: userHabitId,
          user_id: user.id,
          title: habitDetails.title,
          category: habitDetails.category,
          is_active: true,
        },
        { onConflict: 'id' }
      );

    if (upsertHabitError) {
      console.warn('تعذر تحديث بيانات العادة في قاعدة البيانات:', upsertHabitError);
    }
  } else {
    // التحقق القديم في حال لم يتم تمرير التفاصيل
    const { data: userHabit, error: habitError } = await supabase
      .from('user_habits')
      .select('id')
      .eq('id', userHabitId)
      .eq('user_id', user.id)
      .single();

    if (habitError || !userHabit) {
      throw new Error('لم يتم العثور على هذه العادة في قائمة عاداتك.');
    }
  }

  // إضافة أو تعديل السجل في جدول daily_logs عبر Upsert
  const { error: upsertError } = await supabase
    .from('daily_logs')
    .upsert(
      {
        user_habit_id: userHabitId,
        date: date,
        completed: status,
      },
      {
        onConflict: 'user_habit_id,date',
      }
    );

  if (upsertError) {
    console.error('فشل حفظ إنجاز العادة:', upsertError.message);
    throw new Error('حدث خطأ أثناء حفظ حالة الورد اليومي.');
  }

  // لا نستخدم revalidatePath هنا لأن الحالة تُدار محلياً عبر localStorage
  // revalidatePath يسبب إعادة تحميل الصفحة وفقدان حالة المستخدم

  return {
    success: true,
    userHabitId,
    completed: status,
    date,
  };
}

/**
 * 2. دالة لجلب إنجاز الشريك لليوم الحالي فقط وحساب النسبة المئوية
 */
export async function fetchPartnerProgress(): Promise<PartnerStatus | null> {
  const supabase = await createClient();

  // التحقق من هوية المستخدم الحالي
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // جلب الشراكة النشطة للمستخدم (سواء كان هو الطرف الأول أو الثاني)
  const { data: partnership, error: partError } = await supabase
    .from('partnerships')
    .select('id, user_id_1, user_id_2, created_at')
    .eq('status', 'accepted')
    .or(`user_id_1.eq.${user.id},user_id_2.eq.${user.id}`)
    .maybeSingle();

  if (partError || !partnership) {
    return null; // لا يوجد شريك مسجل أو مقبول حالياً
  }

  // تحديد معرف الشريك
  const partnerId =
    partnership.user_id_1 === user.id ? partnership.user_id_2 : partnership.user_id_1;

  // جلب الملف الشخصي للشريك (الاسم والصورة)
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, avatar_url')
    .eq('id', partnerId)
    .single();

  // حساب عدد العادات الإجمالية المفعلة للشريك
  const { data: partnerHabits, error: habitsError } = await supabase
    .from('user_habits')
    .select('id')
    .eq('user_id', partnerId);

  // فحص ما إذا كان المستخدم قد أرسل تشجيعاً لشريكه اليوم
  const today = new Date().toISOString().split('T')[0];
  const { data: encouragementRecord } = await supabase
    .from('partner_messages')
    .select('id')
    .eq('sender_id', user.id)
    .eq('receiver_id', partnerId)
    .gte('created_at', `${today}T00:00:00Z`)
    .limit(1)
    .maybeSingle();

  const encouragedToday = !!encouragementRecord;

  // حساب عدد الأيام معاً بشكل واقعي من تاريخ إنشاء الشراكة
  let daysTogether = 1;
  if (partnership.created_at) {
    const start = new Date(partnership.created_at).getTime();
    const now = Date.now();
    const diffDays = Math.floor((now - start) / (1000 * 60 * 60 * 24)) + 1;
    daysTogether = Math.max(1, diffDays);
  }

  if (!partnerHabits || partnerHabits.length === 0) {
    return {
      id: partnerId,
      name: profile?.full_name || 'رفيق الالتزام',
      avatarUrl: profile?.avatar_url,
      completedCount: 0,
      totalHabits: 11,
      streakDays: daysTogether,
      lastActiveTime: 'اليوم',
      encouragedToday,
    };
  }

  const totalHabits = Math.max(partnerHabits.length, 11);

  // استخراج معرّفات عادات الشريك
  const partnerHabitIds = partnerHabits.map((h) => h.id);

  // جلب إنجازات الشريك المسجلة لليوم الحالي فقط (Current Date)
  const { data: todayLogs } = await supabase
    .from('daily_logs')
    .select('id, completed')
    .in('user_habit_id', partnerHabitIds)
    .eq('date', today)
    .eq('completed', true);

  const completedCount = todayLogs?.length || 0;

  return {
    id: partnerId,
    name: profile?.full_name || 'رفيق الالتزام',
    avatarUrl: profile?.avatar_url,
    completedCount: completedCount,
    totalHabits: totalHabits,
    streakDays: daysTogether,
    lastActiveTime: completedCount > 0 ? 'اليوم (نشط)' : 'منذ قليل',
    encouragedToday,
  };
}

/**
 * 3. دالة لحساب سلسلة الالتزام الحقيقية (Streak) للمستخدم من واقع السجلات
 */
export async function getUserRealStreak(): Promise<number> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return 0;

  // جلب عادات المستخدم
  const { data: userHabits } = await supabase
    .from('user_habits')
    .select('id')
    .eq('user_id', user.id);

  if (!userHabits || userHabits.length === 0) return 0;

  const habitIds = userHabits.map((h) => h.id);

  // جلب التواريخ المكتملة
  const { data: completedLogs } = await supabase
    .from('daily_logs')
    .select('date')
    .in('user_habit_id', habitIds)
    .eq('completed', true);

  if (!completedLogs || completedLogs.length === 0) return 0;

  const activeDates = new Set(completedLogs.map((l) => l.date));

  const today = new Date();
  const formatDate = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

  const todayStr = formatDate(today);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = formatDate(yesterday);

  let streak = 0;
  let checkDate = new Date(today);

  // إذا لم ينجز اليوم شيئاً بعد، نفحص إذا كان أمس منجزاً ليستمر الستريك
  if (!activeDates.has(todayStr)) {
    if (activeDates.has(yesterdayStr)) {
      checkDate = yesterday;
    } else {
      return 0;
    }
  }

  while (true) {
    const ds = formatDate(checkDate);
    if (activeDates.has(ds)) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}


