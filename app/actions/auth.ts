'use server';

import { createClient } from '../../lib/supabase/server';

export interface AuthActionResult {
  success: boolean;
  error?: string;
  user?: any;
}

/**
 * تسجيل الدخول عبر خادم Vercel لتفادي حجب مزودات الإنترنت المحلية
 */
export async function loginWithEmail(email: string, password: string): Promise<AuthActionResult> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      console.error('Server Action Login Error:', error);
      let translatedError = error.message;
      if (error.message.includes('Invalid login credentials')) {
        translatedError = 'بيانات الدخول غير صحيحة (تأكد من البريد الإلكتروني وكلمة المرور)';
      } else if (error.message.includes('Email not confirmed')) {
        translatedError = 'يرجى تأكيد بريدك الإلكتروني أولاً عبر الرابط المرسل لك';
      }
      return { success: false, error: translatedError };
    }

    return { success: true, user: data.user };
  } catch (err: any) {
    console.error('Unexpected Server Action Login Error:', err);
    return { success: false, error: err?.message || 'حدث خطأ أثناء محاولة تسجيل الدخول' };
  }
}

/**
 * إنشاء حساب جديد عبر خادم Vercel
 */
export async function signUpWithEmail(
  email: string,
  password: string,
  fullName?: string
): Promise<AuthActionResult> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          full_name: fullName || email.split('@')[0],
        },
      },
    });

    if (error) {
      console.error('Server Action SignUp Error:', error);
      let translatedError = error.message;
      if (error.message.includes('User already registered')) {
        translatedError = 'هذا البريد الإلكتروني مسجل بالفعل، يمكنك تسجيل الدخول به';
      }
      return { success: false, error: translatedError };
    }

    return { success: true, user: data.user };
  } catch (err: any) {
    console.error('Unexpected Server Action SignUp Error:', err);
    return { success: false, error: err?.message || 'حدث خطأ أثناء محاولة إنشاء الحساب' };
  }
}

/**
 * تسجيل الخروج عبر السيرفر
 */
export async function logout(): Promise<{ success: boolean }> {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
    return { success: true };
  } catch {
    return { success: false };
  }
}
