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

        {/* أزرار التبديل بين تسجيل الدخول وإنشاء حساب جديد */}
        <div className="flex rounded-xl bg-white/5 p-1 mb-5 border border-white/10 relative z-10">
          <button
            type="button"
            onClick={() => { setIsSignUp(false); setError(null); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              !isSignUp
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-emerald-100/70 hover:text-white'
            }`}
          >
            تسجيل الدخول
          </button>
          <button
            type="button"
            onClick={() => { setIsSignUp(true); setError(null); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              isSignUp
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-emerald-100/70 hover:text-white'
            }`}
          >
            إنشاء حساب جديد
          </button>
        </div>

        {/* نموذج الدخول بالبريد وكلمة المرور */}
        <div className="relative z-10">
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
