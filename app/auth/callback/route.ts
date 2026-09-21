import { NextResponse } from 'next/server';
import { createClient } from '../../../lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  // إذا تم تمرير وجهة مخصصة بعد تسجيل الدخول (مثل صفحة انضمام لشريك)
  const next = searchParams.get('next') ?? '/';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      // توجيه المستخدم بنجاح إلى الصفحة المستهدفة (الـ Dashboard)
      return NextResponse.redirect(`${origin}${next}`);
    }
    console.error('فشل استبدال كود المصادقة بجلسة المستخدم:', error.message);
  }

  // في حال حدوث خطأ أثناء تسجيل الدخول، العودة لصفحة الدخول مع إشعار بالخطأ
  return NextResponse.redirect(`${origin}/login?error=oauth_callback_failed`);
}
