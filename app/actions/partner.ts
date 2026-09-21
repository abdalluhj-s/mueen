'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '../../lib/supabase/server';

/**
 * دالة لجلب أو توليد كود الدعوة الخاص بالمستخدم الحالي
 */
export async function getUserInviteCode(): Promise<{ code: string; fullUrl: string }> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error('يجب تسجيل الدخول لتوليد كود الدعوة.');
  }

  // 1. فحص ما إذا كان للمستخدم كود دعوة محفوظ مسبقاً في profiles
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, invite_code')
    .eq('id', user.id)
    .single();

  let code = profile?.invite_code;

  // إذا لم يكن لديه كود، نولّد كوداً فريداً ومختصراً (مثال: MN-8A9C2E)
  if (!code) {
    const randomSuffix = user.id.replace(/-/g, '').substring(0, 6).toUpperCase();
    code = `MN-${randomSuffix}`;

    // حفظ الكود في جدول profiles (إذا كان العمود متاحاً)
    await supabase
      .from('profiles')
      .update({ invite_code: code })
      .eq('id', user.id);
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mueen.app';
  const fullUrl = `${baseUrl}/join?code=${code}`;

  return { code, fullUrl };
}

/**
 * دالة التحقق من كود الدعوة وربط الشريكين وتغيير الحالة إلى accepted
 * @param inviteCode كود الدعوة المدخل (مثال: MN-A1B2C3 أو معرف المستخدم)
 */
export async function acceptInviteCode(inviteCode: string) {
  const supabase = await createClient();

  // 1. التحقق من جلسة وهوية المستخدم الحالي
  const {
    data: { user: currentUser },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !currentUser) {
    return { success: false, error: 'غير مصرح لك. يرجى تسجيل الدخول أولاً.' };
  }

  const cleanCode = inviteCode.trim().toUpperCase();
  if (!cleanCode) {
    return { success: false, error: 'يرجى إدخال كود دعوة صحيح.' };
  }

  // 2. البحث عن صاحب الدعوة
  // نفحص إما عمود invite_code أو مطابقة بادئة المعرف
  let inviterId: string | null = null;
  let inviterName: string = 'شريك الالتزام';

  // البحث في profiles عبر كود الدعوة
  const { data: profileByCode } = await supabase
    .from('profiles')
    .select('id, full_name, invite_code')
    .eq('invite_code', cleanCode)
    .maybeSingle();

  if (profileByCode) {
    inviterId = profileByCode.id;
    inviterName = profileByCode.full_name || inviterName;
  } else {
    // بديل: إذا كان الكود مشتقاً من بداية المعرف (MN-XXXXXX)
    const rawSuffix = cleanCode.replace(/^MN-/, '').toLowerCase();
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, full_name');

    const matched = profiles?.find((p) =>
      p.id.replace(/-/g, '').toLowerCase().startsWith(rawSuffix)
    );

    if (matched) {
      inviterId = matched.id;
      inviterName = matched.full_name || inviterName;
    }
  }

  if (!inviterId) {
    return {
      success: false,
      error: 'كود الدعوة غير صحيح أو منتهي الصلاحية. تأكد من صحة الكود المرسل إليك.',
    };
  }

  // =========================================================================
  // معالجة الحالات الاستثنائية (Edge Cases)
  // =========================================================================

  // الحالة الاستثنائية 1: منع المستخدم من مشاركة الكود مع نفسه أو إدخال كود نفسه
  if (inviterId === currentUser.id) {
    return {
      success: false,
      error: 'لا يمكنك مشاركة الكود مع نفسك أو قبول دعوتك الشخصية!',
    };
  }

  // الحالة الاستثنائية 2: فحص ما إذا كان المستخدم الحالي لديه شريك نشط مسبقاً
  const { data: currentUserPartnerships } = await supabase
    .from('partnerships')
    .select('id, status')
    .eq('status', 'accepted')
    .or(`user_id_1.eq.${currentUser.id},user_id_2.eq.${currentUser.id}`);

  if (currentUserPartnerships && currentUserPartnerships.length > 0) {
    return {
      success: false,
      error: 'لديك شريك التزام نشط بالفعل. النسخة الحالية تسمح برفيق واحد فقط في نفس الوقت.',
    };
  }

  // الحالة الاستثنائية 3: فحص ما إذا كان صاحب الدعوة لديه شريك نشط بالفعل
  const { data: inviterPartnerships } = await supabase
    .from('partnerships')
    .select('id, status')
    .eq('status', 'accepted')
    .or(`user_id_1.eq.${inviterId},user_id_2.eq.${inviterId}`);

  if (inviterPartnerships && inviterPartnerships.length > 0) {
    return {
      success: false,
      error: `عذراً، ${inviterName} مرتبط بشريك التزام آخر بالفعل.`,
    };
  }

  // =========================================================================
  // تسجيل الشراكة وتعيين الحالة إلى 'accepted'
  // =========================================================================

  // فحص ما إذا كان هناك طلب شراكة سابق بين الطرفين (سواء معلق أو ملغى)
  const { data: existingPartnership } = await supabase
    .from('partnerships')
    .select('id')
    .or(
      `and(user_id_1.eq.${inviterId},user_id_2.eq.${currentUser.id}),and(user_id_1.eq.${currentUser.id},user_id_2.eq.${inviterId})`
    )
    .maybeSingle();

  if (existingPartnership) {
    // تحديث السجل القائم وتغيير حالته إلى accepted
    const { error: updateError } = await supabase
      .from('partnerships')
      .update({ status: 'accepted' })
      .eq('id', existingPartnership.id);

    if (updateError) {
      console.error('فشل تحديث الشراكة:', updateError.message);
      return { success: false, error: 'تعذر تأكيد الشراكة، يرجى المحاولة لاحقاً.' };
    }
  } else {
    // إدراج سجل جديد كـ accepted مباشرة
    const { error: insertError } = await supabase
      .from('partnerships')
      .insert({
        user_id_1: inviterId,
        user_id_2: currentUser.id,
        status: 'accepted',
      });

    if (insertError) {
      console.error('فشل إنشاء الشراكة:', insertError.message);
      return { success: false, error: 'تعذر إنشاء الشراكة، يرجى المحاولة لاحقاً.' };
    }
  }

  // إعادة التحقق من كاش الصفحة لتحديث بطاقة الشريك فورياً
  revalidatePath('/');
  revalidatePath('/dashboard');

  return {
    success: true,
    partnerName: inviterName,
    message: `بارك الله فيكما! تم ربطك بنجاح مع رفيقك (${inviterName}).`,
  };
}
