'use server';

import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { createClient } from '../../lib/supabase/server';

/**
 * جلب الرابط الأساسي الحالي للموقع ديناميكياً
 */
function getBaseUrl(): string {
  let defaultUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mueen.ah4549658.workers.dev';
  try {
    const headersList = headers();
    const host = headersList.get('x-forwarded-host') || headersList.get('host');
    const proto = headersList.get('x-forwarded-proto') || 'https';
    if (host) {
      return `${proto}://${host}`;
    }
  } catch {
    // fallback
  }
  return defaultUrl;
}

/**
 * 1. دالة لجلب أو توليد كود الدعوة ورابط المشاركة الخاص بالمستخدم الحالي
 */
export async function getUserInviteCode(): Promise<{ code: string; fullUrl: string; partnerName?: string }> {
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
    .select('id, full_name, invite_code')
    .eq('id', user.id)
    .maybeSingle();

  let code = profile?.invite_code;

  // إذا لم يكن لديه كود، نولّد كوداً فريداً ومختصراً (مثال: MN-8A9C2E)
  if (!code) {
    const randomSuffix = user.id.replace(/-/g, '').substring(0, 6).toUpperCase();
    code = `MN-${randomSuffix}`;

    // حفظ الكود في جدول profiles
    await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        invite_code: code,
        full_name: profile?.full_name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'صاحب همة',
      }, { onConflict: 'id' });
  }

  const baseUrl = getBaseUrl();
  const fullUrl = `${baseUrl}/join?code=${code}`;

  return { code, fullUrl, partnerName: profile?.full_name };
}

/**
 * 2. دالة لجلب بيانات صاحب كود الدعوة لعرضها للزائر قبل الانضمام
 */
export async function getInviteDetails(inviteCode: string): Promise<{
  valid: boolean;
  inviterId?: string;
  inviterName?: string;
  inviterAvatar?: string;
  error?: string;
}> {
  const supabase = await createClient();
  const cleanCode = inviteCode.trim().toUpperCase();

  if (!cleanCode) {
    return { valid: false, error: 'كود الدعوة فارغ.' };
  }

  // 1. البحث عبر عمود invite_code
  let { data: profile } = await supabase
    .from('profiles')
    .select('id, full_name, avatar_url, invite_code')
    .eq('invite_code', cleanCode)
    .maybeSingle();

  // 2. إذا لم يعثر عليه، نبحث عبر بادئة المعرف
  if (!profile) {
    const rawSuffix = cleanCode.replace(/^MN-/, '').toLowerCase();
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url, invite_code');

    profile = profiles?.find((p) =>
      p.id.replace(/-/g, '').toLowerCase().startsWith(rawSuffix)
    ) || null;
  }

  if (!profile) {
    return {
      valid: false,
      error: 'لم نتمكن من العثور على صاحب هذا الكود، تأكد من صحة الرابط المرسل إليك.',
    };
  }

  return {
    valid: true,
    inviterId: profile.id,
    inviterName: profile.full_name || 'رفيق صالح',
    inviterAvatar: profile.avatar_url || undefined,
  };
}

/**
 * 3. دالة التحقق من كود الدعوة وربط الشريكين
 */
export async function acceptInviteCode(inviteCode: string) {
  const supabase = await createClient();

  // 1. التحقق من هوية المستخدم الحالي
  const {
    data: { user: currentUser },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !currentUser) {
    return { success: false, error: 'غير مصرح لك. يرجى تسجيل الدخول أولاً للارتباط بالرفيق.' };
  }

  const cleanCode = inviteCode.trim().toUpperCase();
  if (!cleanCode) {
    return { success: false, error: 'يرجى إدخال كود دعوة صحيح.' };
  }

  // التأكد من وجود بروفايل للمستخدم الحالي
  await supabase
    .from('profiles')
    .upsert({
      id: currentUser.id,
      full_name: currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || 'صاحب همة',
    }, { onConflict: 'id' });

  // 2. البحث عن صاحب الدعوة
  let inviterId: string | null = null;
  let inviterName = 'شريك الالتزام';

  const { data: profileByCode } = await supabase
    .from('profiles')
    .select('id, full_name, invite_code')
    .eq('invite_code', cleanCode)
    .maybeSingle();

  if (profileByCode) {
    inviterId = profileByCode.id;
    inviterName = profileByCode.full_name || inviterName;
  } else {
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
      error: 'كود الدعوة غير صحيح أو منتهي الصلاحية. تأكد من صحة الرابط أو الكود.',
    };
  }

  // منع المستخدم من قبول دعوة نفسه
  if (inviterId === currentUser.id) {
    return {
      success: false,
      error: 'لا يمكنك مشاركة الكود مع نفسك أو قبول دعوتك الشخصية!',
    };
  }

  // فحص ما إذا كان الطرفان مرتبطان ببعضهما بالفعل
  const { data: existingBetweenThem } = await supabase
    .from('partnerships')
    .select('id, status')
    .or(
      `and(user_id_1.eq.${inviterId},user_id_2.eq.${currentUser.id}),and(user_id_1.eq.${currentUser.id},user_id_2.eq.${inviterId})`
    )
    .maybeSingle();

  if (existingBetweenThem && existingBetweenThem.status === 'accepted') {
    return {
      success: true,
      partnerName: inviterName,
      message: `أنتم رفقاء التزام بالفعل! بارك الله فيكما وفي مسيرتكما.`,
    };
  }

  // إلغاء أي شراكات سابقة غير مكتملة أو قديمة لضمان رفيق واحد نشط
  await supabase
    .from('partnerships')
    .delete()
    .or(`user_id_1.eq.${currentUser.id},user_id_2.eq.${currentUser.id}`);

  // تسجيل الشراكة وتعيين الحالة إلى 'accepted'
  const { error: insertError } = await supabase
    .from('partnerships')
    .insert({
      user_id_1: inviterId,
      user_id_2: currentUser.id,
      invite_code: cleanCode,
      status: 'accepted',
    });

  if (insertError) {
    console.error('فشل إنشاء الشراكة:', insertError.message);
    return { success: false, error: 'تعذر تأكيد الشراكة، يرجى المحاولة لاحقاً.' };
  }

  // إرسال رسالة ترحيبية تلقائية في صندوق الشريكين
  try {
    await supabase.from('partner_messages').insert([
      {
        sender_id: currentUser.id,
        receiver_id: inviterId,
        message: 'قبلت دعوتك المباركة، نسأل الله أن يرزقنا الإخلاص والتثبيت سوياً 🤝🌿',
        type: 'dua',
      },
      {
        sender_id: inviterId,
        receiver_id: currentUser.id,
        message: `مرحباً بك يا أخي! سعدت بانضمامك رفيقاً للمسير والطاعات ✨`,
        type: 'encouragement',
      },
    ]);
  } catch (msgErr) {
    console.warn('تنبيه إرسال الرسالة الترحيبية:', msgErr);
  }

  revalidatePath('/');
  revalidatePath('/dashboard');

  return {
    success: true,
    partnerName: inviterName,
    message: `بارك الله فيكما! تم ربطك بنجاح مع رفيقك (${inviterName}).`,
  };
}

/**
 * 4. إرسال تشجيع أو دعاء للشريك
 */
export async function sendPartnerEncouragement(customMessage?: string, messageType: string = 'encouragement') {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'يجب تسجيل الدخول لإرسال تشجيع لشريكك.' };
  }

  // البحث عن الشريك النشط
  const { data: partnership } = await supabase
    .from('partnerships')
    .select('id, user_id_1, user_id_2')
    .eq('status', 'accepted')
    .or(`user_id_1.eq.${user.id},user_id_2.eq.${user.id}`)
    .maybeSingle();

  if (!partnership) {
    return { success: false, error: 'ليس لديك شريك التزام نشط حالياً.' };
  }

  const partnerId = partnership.user_id_1 === user.id ? partnership.user_id_2 : partnership.user_id_1;
  const messageText = customMessage?.trim() || 'ثبّتك الله وبارك في همّتك ووردك اليومي! 🌿';

  const { error: insertError } = await supabase
    .from('partner_messages')
    .insert({
      sender_id: user.id,
      receiver_id: partnerId,
      message: messageText,
      type: messageType,
    });

  if (insertError) {
    console.error('فشل إرسال التشجيع:', insertError.message);
    return { success: false, error: 'تعذر إرسال التشجيع حالياً.' };
  }

  return {
    success: true,
    message: 'تم إرسال التشجيع والدعاء لرفيقك بنجاح! ✨',
  };
}

/**
 * 5. جلب رسائل وتشجيعات الشريك الواردة
 */
export async function getPartnerMessages(): Promise<Array<{
  id: string;
  senderId: string;
  senderName: string;
  message: string;
  type: string;
  createdAt: string;
}>> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data: messages } = await supabase
    .from('partner_messages')
    .select('id, sender_id, message, type, created_at')
    .eq('receiver_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10);

  if (!messages || messages.length === 0) return [];

  // جلب اسم المرسل
  const senderIds = Array.from(new Set(messages.map((m) => m.sender_id)));
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, full_name')
    .in('id', senderIds);

  const profileMap = new Map(profiles?.map((p) => [p.id, p.full_name || 'رفيقك']) || []);

  return messages.map((m) => ({
    id: m.id,
    senderId: m.sender_id,
    senderName: profileMap.get(m.sender_id) || 'رفيقك',
    message: m.message,
    type: m.type,
    createdAt: m.created_at,
  }));
}

/**
 * 6. إنهاء أو فك الارتباط بالشريك الحالي
 */
export async function disconnectPartner() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'غير مصرح لك.' };
  }

  const { error } = await supabase
    .from('partnerships')
    .delete()
    .or(`user_id_1.eq.${user.id},user_id_2.eq.${user.id}`);

  if (error) {
    return { success: false, error: 'تعذر إلغاء الارتباط حالياً.' };
  }

  revalidatePath('/');
  return { success: true, message: 'تم فك الارتباط بالشريك السابق بنجاح.' };
}
