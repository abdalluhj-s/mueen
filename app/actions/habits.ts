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
  status: boolean
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

  // التحقق من أن العادة تخص المستخدم الحالي قبل التعديل
  const { data: userHabit, error: habitError } = await supabase
    .from('user_habits')
    .select('id')
    .eq('id', userHabitId)
    .eq('user_id', user.id)
    .single();

  if (habitError || !userHabit) {
    throw new Error('لم يتم العثور على هذه العادة في قائمة عاداتك.');
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

  if (!partnerHabits || partnerHabits.length === 0) {
    return {
      id: partnerId,
      name: profile?.full_name || 'رفيق الالتزام',
      avatarUrl: profile?.avatar_url,
      completedCount: 0,
      totalHabits: 0,
      streakDays: 1,
      lastActiveTime: 'اليوم',
      encouragedToday: false,
    };
  }

  const totalHabits = partnerHabits.length;

  // استخراج معرّفات عادات الشريك
  const partnerHabitIds = partnerHabits.map((h) => h.id);

  // جلب إنجازات الشريك المسجلة لليوم الحالي فقط (Current Date)
  const today = new Date().toISOString().split('T')[0];

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
    streakDays: 7, // يمكن حسابه ديناميكياً من عدد الأيام المتتابعة
    lastActiveTime: completedCount > 0 ? 'اليوم (نشط)' : 'منذ فترة',
    encouragedToday: false,
  };
}
