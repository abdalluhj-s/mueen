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
/**
 * 2. دالة لجلب إنجاز جميع الشركاء المرتبطين بالمستخدم الحالي
 */
export async function fetchAllPartnersProgress(): Promise<PartnerStatus[]> {
  const supabase = await createClient();

  // التحقق من هوية المستخدم الحالي
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  // جلب جميع الشراكات المقبولة للمستخدم (مرتبة بالأحدث)
  const { data: partnerships, error: partError } = await supabase
    .from('partnerships')
    .select('id, user_id_1, user_id_2, created_at')
    .eq('status', 'accepted')
    .or(`user_id_1.eq.${user.id},user_id_2.eq.${user.id}`)
    .order('created_at', { ascending: false });

  if (partError || !partnerships || partnerships.length === 0) {
    return [];
  }

  const today = new Date().toISOString().split('T')[0];
  const results: PartnerStatus[] = [];

  for (const partnership of partnerships) {
    const partnerId =
      partnership.user_id_1 === user.id ? partnership.user_id_2 : partnership.user_id_1;

    // جلب الملف الشخصي للشريك (الاسم والصورة)
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, avatar_url')
      .eq('id', partnerId)
      .maybeSingle();

    // جلب عدد العادات الإجمالية المفعلة للشريك
    const { data: partnerHabits } = await supabase
      .from('user_habits')
      .select('id')
      .eq('user_id', partnerId);

    // فحص ما إذا كان المستخدم قد أرسل تشجيعاً لهذا الشريك اليوم
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

    const totalHabits = Math.max(partnerHabits?.length || 0, 11);
    let completedCount = 0;

    if (partnerHabits && partnerHabits.length > 0) {
      const partnerHabitIds = partnerHabits.map((h) => h.id);
      const { data: todayLogs } = await supabase
        .from('daily_logs')
        .select('id')
        .in('user_habit_id', partnerHabitIds)
        .eq('date', today)
        .eq('completed', true);

      completedCount = todayLogs?.length || 0;
    }

    results.push({
      id: partnerId,
      name: profile?.full_name || 'رفيق الالتزام',
      avatarUrl: profile?.avatar_url,
      completedCount,
      totalHabits,
      streakDays: daysTogether,
      lastActiveTime: completedCount > 0 ? 'اليوم (نشط)' : 'منذ قليل',
      encouragedToday,
    });
  }

  return results;
}

/**
 * دالة لجلب الشريك الأحدث (للتوافق القديم)
 */
export async function fetchPartnerProgress(): Promise<PartnerStatus | null> {
  const all = await fetchAllPartnersProgress();
  return all.length > 0 ? all[0] : null;
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

/**
 * 4. دالة لجلب سجلات العادات لشهر محدد (للتتبع والاستدراك)
 * @param year السنة (مثال 2026)
 * @param month الشهر (1 - 12)
 */
export async function fetchMonthLogs(year: number, month: number): Promise<Record<string, string[]>> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return {};

  const monthPrefix = `${year}-${String(month).padStart(2, '0')}-`;

  const { data, error } = await supabase
    .from('daily_logs')
    .select(`
      date,
      user_habit_id,
      completed,
      user_habits!inner (
        user_id
      )
    `)
    .eq('user_habits.user_id', user.id)
    .eq('completed', true)
    .like('date', `${monthPrefix}%`);

  if (error || !data) {
    console.error('خطأ في جلب سجلات الشهر:', error);
    return {};
  }

  const result: Record<string, string[]> = {};
  data.forEach((row: any) => {
    const d = row.date;
    if (!result[d]) {
      result[d] = [];
    }
    if (!result[d].includes(row.user_habit_id)) {
      result[d].push(row.user_habit_id);
    }
  });

  return result;
}

/**
 * 5. دالة لجلب ملخص السنة كاملة للعرض السنوي (Heatmap / Yearly Overview)
 * @param year السنة (مثال 2026)
 */
export async function fetchYearSummary(year: number): Promise<Record<string, number>> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return {};

  const yearPrefix = `${year}-`;

  const { data, error } = await supabase
    .from('daily_logs')
    .select(`
      date,
      completed,
      user_habits!inner (
        user_id
      )
    `)
    .eq('user_habits.user_id', user.id)
    .eq('completed', true)
    .like('date', `${yearPrefix}%`);

  if (error || !data) {
    console.error('خطأ في جلب ملخص السنة:', error);
    return {};
  }

  const result: Record<string, number> = {};
  data.forEach((row: any) => {
    const d = row.date;
    result[d] = (result[d] || 0) + 1;
  });

  return result;
}

/**
 * 6. دالة لحفظ أو تعديل مجموعة عادات ليوم محدد دفعة واحدة (للاستدراك السريع)
 */
export async function batchToggleDayHabits(
  date: string,
  updates: { habitId: string; completed: boolean; title?: string; category?: string }[]
) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error('غير مصرح. يرجى تسجيل الدخول.');
  }

  // 1. التأكد من وجود العادات في user_habits
  for (const item of updates) {
    if (item.title && item.category) {
      await supabase.from('user_habits').upsert(
        {
          id: item.habitId,
          user_id: user.id,
          title: item.title,
          category: item.category,
          is_active: true,
        },
        { onConflict: 'id' }
      );
    }
  }

  // 2. تحديث السجلات في daily_logs
  const upsertRows = updates.map((u) => ({
    user_habit_id: u.habitId,
    date,
    completed: u.completed,
  }));

  const { error: upsertError } = await supabase
    .from('daily_logs')
    .upsert(upsertRows, { onConflict: 'user_habit_id,date' });

  if (upsertError) {
    console.error('خطأ في الحفظ الجماعي:', upsertError);
    throw new Error('تعذر حفظ عادات اليوم في السجل.');
  }

  return { success: true, count: updates.length, date };
}



