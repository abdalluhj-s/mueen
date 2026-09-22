'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '../../lib/supabase/client';
import { Sparkles, ShieldCheck, HeartHandshake, Loader2, ArrowRight, Mail, Lock, UserCheck } from 'lucide-react';
import Link from 'next/link';

function LoginPageContent() {
  const searchParams = useSearchParams();
  const nextParam = searchParams.get('next');
  const codeParam = searchParams.get('code');

  // الوجهة بعد تسجيل الدخول
  let destination = '/';
  if (codeParam) {
    destination = `/join?code=${encodeURIComponent(codeParam)}`;
  } else if (nextParam) {
    destination = nextParam;
  }

  const [authMethod, setAuthMethod] = useState<'google' | 'email'>('google');
  const [isSignUp, setIsSignUp] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // إذا وصل بكود دعوة، نحفظه في localStorage احتياطياً
  useEffect(() => {
    if (codeParam) {
      try {
        localStorage.setItem('pending_invite_code', codeParam.toUpperCase().trim());
      } catch {
        // ignore
      }
    }
  }, [codeParam]);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const supabase = createClient();

      const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(destination)}`;

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
      setError(err?.message || 'تعذر الاتصال بخدمة Google. يرجى المحاولة عبر البريد الإلكتروني.');
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setSuccessMsg(null);
      const supabase = createClient();

      if (isSignUp) {
        // إنشاء حساب جديد
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName || email.split('@')[0],
            },
          },
        });

        if (signUpError) throw signUpError;
        setSuccessMsg('تم إنشاء الحساب بنجاح! جارٍ تسجيل دخولك...');
        setTimeout(() => {
          window.location.href = destination;
        }, 1200);
      } else {
        // تسجيل الدخول
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) throw signInError;
        window.location.href = destination;
      }
    } catch (err: any) {
      console.error('خطأ في تسجيل الدخول:', err);
      setError(err?.message || 'حدث خطأ أثناء محاولة الدخول. تأكد من صحة البيانات.');
    } finally {
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
        <div className="text-center mb-6 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 mx-auto flex items-center justify-center text-white shadow-lg shadow-emerald-500/30 mb-4">
            <Sparkles className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            مُعين
          </h1>
          <p className="text-xs sm:text-sm text-emerald-200/90 mt-1 font-normal">
            «واصبر نفسك مع الذين يدعون ربهم»
          </p>
        </div>

        {/* تنبيه كود الدعوة إذا كان قادماً من رابط صديق */}
        {codeParam && (
          <div className="mb-5 p-3 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-xs text-emerald-100 flex items-center gap-2.5">
            <HeartHandshake className="w-5 h-5 text-emerald-300 shrink-0" />
            <span>سجل دخولك الآن وسيتم ربطك تلقائياً برفيقك (كود: <strong className="text-white font-mono">{codeParam}</strong>)</span>
          </div>
        )}

        {/* مميزات سريعة للمنصة */}
        <div className="space-y-2 mb-6 relative z-10 text-xs text-emerald-100/80">
          <div className="flex items-center gap-2.5 bg-white/5 p-2 rounded-xl border border-white/10">
            <HeartHandshake className="w-4 h-4 text-amber-300 shrink-0" />
            <span>نظام شريك الالتزام اليومي للتشجيع على الطاعة</span>
          </div>
          <div className="flex items-center gap-2.5 bg-white/5 p-2 rounded-xl border border-white/10">
            <ShieldCheck className="w-4 h-4 text-emerald-300 shrink-0" />
            <span>حفظ إنجازاتك في السجل الشهري والسنوي سحابياً</span>
          </div>
        </div>

        {/* أزرار التبديل بين طرق الدخول */}
        <div className="flex rounded-xl bg-white/5 p-1 mb-5 border border-white/10 relative z-10">
          <button
            type="button"
            onClick={() => { setAuthMethod('google'); setError(null); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              authMethod === 'google'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-emerald-100/70 hover:text-white'
            }`}
          >
            عبر Google
          </button>
          <button
            type="button"
            onClick={() => { setAuthMethod('email'); setError(null); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              authMethod === 'email'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-emerald-100/70 hover:text-white'
            }`}
          >
            بالبريد وكلمة المرور
          </button>
        </div>

        {/* محتوى تسجيل الدخول */}
        <div className="relative z-10">
          {authMethod === 'google' ? (
            /* زر الدخول السريع عبر Google */
            <div className="space-y-4">
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
            </div>
          ) : (
            /* نموذج الدخول بالبريد وكلمة المرور */
            <form onSubmit={handleEmailAuth} className="space-y-3.5">
              {isSignUp && (
                <div>
                  <label className="block text-xs font-medium text-emerald-100/90 mb-1.5">
                    الاسم الكريم
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="اسمك الكريم"
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-emerald-200/40 focus:outline-hidden focus:border-emerald-400"
                  />
                </div>
              )}
              <div>
                <label className="block text-xs font-medium text-emerald-100/90 mb-1.5">
                  البريد الإلكتروني
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@mail.com"
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-3.5 py-2.5 pl-10 text-sm text-white placeholder-emerald-200/40 focus:outline-hidden focus:border-emerald-400"
                  />
                  <Mail className="w-4 h-4 text-emerald-300 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-emerald-100/90 mb-1.5">
                  كلمة المرور
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-3.5 py-2.5 pl-10 text-sm text-white placeholder-emerald-200/40 focus:outline-hidden focus:border-emerald-400"
                  />
                  <Lock className="w-4 h-4 text-emerald-300 absolute left-3 top-3" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-75"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <UserCheck className="w-4 h-4" />
                )}
                <span>{isSignUp ? 'إنشاء حساب جديد' : 'تسجيل الدخول'}</span>
              </button>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => { setIsSignUp(!isSignUp); setError(null); }}
                  className="text-xs text-emerald-300 hover:underline"
                >
                  {isSignUp
                    ? 'لديك حساب بالفعل؟ سجل دخولك'
                    : 'مستخدم جديد؟ اضغط هنا لإنشاء حساب'}
                </button>
              </div>
            </form>
          )}

          {error && (
            <p className="mt-3 text-xs text-rose-200 text-center bg-rose-950/60 p-2.5 rounded-xl border border-rose-500/30">
              {error}
            </p>
          )}

          {successMsg && (
            <p className="mt-3 text-xs text-emerald-200 text-center bg-emerald-950/60 p-2.5 rounded-xl border border-emerald-500/30">
              {successMsg}
            </p>
          )}

          <div className="text-center pt-4">
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

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-emerald-950 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
        </div>
      }
    >
      <LoginPageContent />
    </Suspense>
  );
}
