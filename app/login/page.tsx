'use client';

import React, { useState } from 'react';
import { createClient } from '../../lib/supabase/client';
import { Sparkles, ShieldCheck, HeartHandshake, Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const supabase = createClient();

      const redirectTo = `${window.location.origin}/auth/callback?next=/`;

      const { error: signInError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (signInError) {
        throw signInError;
      }
    } catch (err: any) {
      console.error('خطأ في تسجيل الدخول عبر Google:', err);
      setError(err?.message || 'تعذر الاتصال بخدمة Google. يرجى المحاولة مرة أخرى.');
      setIsLoading(false);
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-b from-emerald-950 via-emerald-900 to-slate-950 text-white flex flex-col justify-center items-center p-4 sm:p-6 selection:bg-emerald-500 selection:text-white">
      {/* بطاقة الدخول المركزية */}
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        
        {/* هالة جمالية في الخلفية */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-teal-400/20 rounded-full blur-3xl pointer-events-none" />

        {/* الشعار واسم المنصة */}
        <div className="text-center mb-8 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 mx-auto flex items-center justify-center text-white shadow-lg shadow-emerald-500/30 mb-4">
            <Sparkles className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            مُعين
          </h1>
          <p className="text-xs sm:text-sm text-emerald-200/90 mt-1.5 font-normal">
            «واصبر نفسك مع الذين يدعون ربهم»
          </p>
        </div>

        {/* مميزات سريعة للمنصة */}
        <div className="space-y-2.5 mb-8 relative z-10 text-xs text-emerald-100/80">
          <div className="flex items-center gap-2.5 bg-white/5 p-2.5 rounded-xl border border-white/10">
            <HeartHandshake className="w-4 h-4 text-amber-300 shrink-0" />
            <span>نظام شريك الالتزام اليومي للتشجيع على الطاعة</span>
          </div>
          <div className="flex items-center gap-2.5 bg-white/5 p-2.5 rounded-xl border border-white/10">
            <ShieldCheck className="w-4 h-4 text-emerald-300 shrink-0" />
            <span>خصوصية كاملة: تظهر نسبة إنجازك فقط لرفيقك</span>
          </div>
        </div>

        {/* زر الدخول السريع عبر Google */}
        <div className="space-y-4 relative z-10">
          <button
            type="button"
            disabled={isLoading}
            onClick={handleGoogleSignIn}
            className="w-full py-3.5 px-5 rounded-2xl bg-white hover:bg-gray-50 active:scale-[0.98] text-gray-800 font-bold text-sm sm:text-base flex items-center justify-center gap-3 shadow-lg shadow-black/20 transition-all cursor-pointer disabled:opacity-75"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-emerald-700" />
                <span>جارٍ التوجيه إلى Google...</span>
              </>
            ) : (
              <>
                {/* أيقونة Google الرسمية */}
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>الدخول السريع عبر Google</span>
              </>
            )}
          </button>

          {error && (
            <p className="text-xs text-rose-300 text-center bg-rose-950/40 p-2.5 rounded-xl border border-rose-500/30">
              {error}
            </p>
          )}

          <div className="text-center pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-emerald-200/80 hover:text-white transition-colors"
            >
              <span>المتابعة كضيف مؤقتاً للوحة التحكم</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>

      {/* تذييل */}
      <footer className="mt-8 text-center text-xs text-emerald-300/50">
        منصة مُعين • تثبيت عاداتك الدينية بروح الإخاء والالتزام 🌿
      </footer>
    </div>
  );
}
