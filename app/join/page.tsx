'use client';

import React, { useState, useEffect, useTransition, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  HeartHandshake,
  Sparkles,
  Loader2,
  CheckCircle,
  ArrowRight,
  AlertCircle,
  LogIn,
  UserCheck,
  Mail,
  Lock,
  User,
  ShieldCheck,
} from 'lucide-react';
import { acceptInviteCode, getInviteDetails } from '../actions/partner';
import { createClient } from '../../lib/supabase/client';

function JoinPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const codeFromUrl = searchParams.get('code') ?? '';

  const [inviteCode, setInviteCode] = useState(codeFromUrl.toUpperCase());
  const [inviterName, setInviterName] = useState<string | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // حالة العملية
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [partnerConnectedName, setPartnerConnectedName] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // نموذج الدخول المدمج لغير المسجلين بالبريد وكلمة المرور
  const [isSignUp, setIsSignUp] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // 1. حفظ كود الدعوة محلياً فوراً حتى لا يضيع
  useEffect(() => {
    if (codeFromUrl) {
      const clean = codeFromUrl.toUpperCase().trim();
      setInviteCode(clean);
      try {
        localStorage.setItem('pending_invite_code', clean);
      } catch {
        // ignore
      }
    }
  }, [codeFromUrl]);

  // 2. التحقق من هوية المستخدم المسجل وجلب تفاصيل صاحب الدعوة
  useEffect(() => {
    const supabase = createClient();

    // فحص المستخدم الحالي
    supabase.auth.getUser().then(({ data: { user } }) => {
      setCurrentUser(user || null);
      setIsCheckingAuth(false);
    }).catch(() => {
      setIsCheckingAuth(false);
    });

    // جلب بيانات صاحب الدعوة
    const targetCode = codeFromUrl || inviteCode;
    if (targetCode) {
      setIsLoadingDetails(true);
      getInviteDetails(targetCode)
        .then((res) => {
          if (res.valid && res.inviterName) {
            setInviterName(res.inviterName);
          } else if (res.error) {
            setErrorMsg(res.error);
          }
        })
        .catch(() => {
          // ignore
        })
        .finally(() => {
          setIsLoadingDetails(false);
        });
    } else {
      setIsLoadingDetails(false);
    }
  }, [codeFromUrl]);

  // 3. تأكيد الارتباط بالرفيق
  const handleAcceptInvite = (codeToUse?: string) => {
    const code = (codeToUse || inviteCode).trim().toUpperCase();
    if (!code) {
      setErrorMsg('يرجى إدخال كود الدعوة');
      return;
    }

    setErrorMsg(null);
    setSuccessMsg(null);

    startTransition(async () => {
      try {
        const res = await acceptInviteCode(code);
        if (res.success) {
          try {
            localStorage.removeItem('pending_invite_code');
          } catch {
            // ignore
          }
          setSuccessMsg(res.message || 'تم ربط الشريك بنجاح!');
          setPartnerConnectedName(res.partnerName || inviterName || 'رفيقك المبارك');
          // توجيه تلقائي بعد 2 ثانية إلى الصفحة الرئيسية
          setTimeout(() => {
            router.push('/');
          }, 2000);
        } else {
          setErrorMsg(res.error || 'تعذر تأكيد الارتباط، تأكد من صحة الكود.');
        }
      } catch (err: any) {
        setErrorMsg(err?.message || 'حدث خطأ غير متوقع أثناء معالجة الطلب.');
      }
    });
  };

  // 4. الدخول أو إنشاء الحساب بالبريد وكلمة المرور
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setAuthError('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    try {
      setIsAuthLoading(true);
      setAuthError(null);
      const supabase = createClient();

      if (isSignUp) {
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName || email.split('@')[0],
            },
          },
        });

        if (signUpError) throw signUpError;

        if (signUpData.user) {
          setCurrentUser(signUpData.user);
          // تأكيد كود الدعوة تلقائياً بعد التسجيل
          handleAcceptInvite(inviteCode);
        }
      } else {
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) throw signInError;

        if (signInData.user) {
          setCurrentUser(signInData.user);
          handleAcceptInvite(inviteCode);
        }
      }
    } catch (err: any) {
      setAuthError(err?.message || 'حدث خطأ أثناء تسجيل الدخول. يرجى التأكد من البيانات.');
    } finally {
      setIsAuthLoading(false);
    }
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-gradient-to-b from-emerald-950 via-emerald-900 to-slate-950 text-white flex flex-col justify-center items-center p-4 sm:p-6"
    >
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* هالة جمالية */}
        <div className="absolute -top-24 -right-24 w-52 h-52 bg-emerald-500/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-52 h-52 bg-teal-400/20 rounded-full blur-3xl pointer-events-none" />

        {/* رأس الصفحة والشعار */}
        <div className="text-center mb-6 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 mx-auto flex items-center justify-center text-white shadow-lg shadow-emerald-500/30 mb-3.5">
            <HeartHandshake className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            مُعين
          </h1>
          <p className="text-xs sm:text-sm text-emerald-200/90 mt-1">
            رفيق الالتزام وتثبيت الطاعات 🌿
          </p>
        </div>

        {/* ===================== حالة النجاح ===================== */}
        {successMsg ? (
          <div className="text-center space-y-5 relative z-10 animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10 text-emerald-300" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white mb-1.5">بارك الله فيكما! 🌿</h2>
              <p className="text-sm text-emerald-100 leading-relaxed">
                تم ربطك بنجاح مع رفيقك المبارك{' '}
                <strong className="text-white underline decoration-emerald-400 decoration-2 underline-offset-4">
                  {partnerConnectedName}
                </strong>
              </p>
              <p className="text-xs text-emerald-300/80 mt-2.5">
                «المؤمن للمؤمن كالبنيان يشد بعضه بعضاً»
              </p>
            </div>
            <div className="pt-2">
              <Link
                href="/"
                className="w-full py-3.5 px-5 rounded-2xl bg-white hover:bg-gray-50 text-emerald-900 font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>الانتقال للوحة المتابعة والصلوات</span>
                <ArrowRight className="w-4 h-4 text-emerald-600" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="relative z-10 space-y-5">
            {/* بطاقة الترحيب وتوضيح الدعوة */}
            <div className="bg-emerald-900/40 border border-emerald-500/30 rounded-2xl p-4 text-center">
              {isLoadingDetails ? (
                <div className="flex items-center justify-center gap-2 text-xs text-emerald-200 py-1">
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                  <span>جارٍ جلب تفاصيل الدعوة...</span>
                </div>
              ) : inviterName ? (
                <div>
                  <span className="text-[11px] font-semibold text-emerald-300 bg-emerald-500/20 px-2.5 py-0.5 rounded-full inline-block mb-1.5">
                    دعوة رفيق صالحة 🤝
                  </span>
                  <p className="text-sm text-white font-medium leading-relaxed">
                    أخوك <strong className="text-emerald-300 font-bold text-base">{inviterName}</strong> يدعوك لتكون رفيق التزامه في الصلوات والأذكار والورد القرآني.
                  </p>
                </div>
              ) : (
                <p className="text-xs text-emerald-100/90 leading-relaxed">
                  أنت على وشك الانضمام كشريك التزام لمتابعة الصلوات والقرآن الكريم يومياً.
                </p>
              )}
            </div>

            {/* عرض كود الدعوة في خانة واضحة */}
            <div>
              <label className="text-xs font-semibold text-emerald-200 block mb-1.5">
                كود الدعوة المستلم:
              </label>
              <input
                type="text"
                value={inviteCode}
                onChange={(e) => {
                  setInviteCode(e.target.value.toUpperCase());
                  setErrorMsg(null);
                }}
                placeholder="مثال: MN-6E3036"
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 text-center font-mono text-base tracking-widest uppercase text-white placeholder:text-white/30 transition-all outline-none"
                dir="ltr"
              />
            </div>

            {/* رسائل التنبيه والخطأ */}
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* ===================== الحالة 1: المستخدم مسجل دخول بالفعل ===================== */}
            {currentUser ? (
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between text-xs text-emerald-200 bg-white/5 p-2.5 rounded-xl border border-white/10">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-emerald-400" />
                    <span>متصل باسم: <strong>{currentUser.user_metadata?.full_name || currentUser.email}</strong></span>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={isPending || !inviteCode.trim()}
                  onClick={() => handleAcceptInvite()}
                  className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-gray-50 active:scale-[0.98] text-emerald-900 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-black/20 transition-all cursor-pointer disabled:opacity-60"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin text-emerald-700" />
                      <span>جارٍ تأكيد الارتباط بالشريك...</span>
                    </>
                  ) : (
                    <>
                      <HeartHandshake className="w-5 h-5 text-emerald-700" />
                      <span>قبول الدعوة والارتباط بالرفيق 🤝</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              /* ===================== الحالة 2: الزائر غير مسجل ===================== */
              <div className="space-y-4 pt-1">
                <div className="text-center">
                  <p className="text-xs text-emerald-200/90 leading-relaxed mb-3">
                    لربطك بصديقك وحفظ إنجازاتكما، سجّل دخولك بخطوة واحدة:
                  </p>
                </div>

                {/* أزرار التبديل بين الدخول وإنشاء حساب */}
                <div className="flex rounded-xl bg-white/5 p-1 border border-white/10 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => { setIsSignUp(false); setAuthError(null); }}
                    className={`flex-1 py-1.5 rounded-lg transition-all ${
                      !isSignUp ? 'bg-emerald-600 text-white shadow-xs' : 'text-emerald-200/70 hover:text-white'
                    }`}
                  >
                    تسجيل الدخول
                  </button>
                  <button
                    type="button"
                    onClick={() => { setIsSignUp(true); setAuthError(null); }}
                    className={`flex-1 py-1.5 rounded-lg transition-all ${
                      isSignUp ? 'bg-emerald-600 text-white shadow-xs' : 'text-emerald-200/70 hover:text-white'
                    }`}
                  >
                    إنشاء حساب جديد
                  </button>
                </div>

                <form onSubmit={handleEmailAuth} className="space-y-3">
                    {isSignUp && (
                      <div>
                        <div className="relative">
                          <input
                            type="text"
                            required
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="اسمك الكريم"
                            className="w-full bg-white/10 border border-white/20 rounded-xl px-3.5 py-2 pl-9 text-xs text-white placeholder-emerald-200/40 focus:outline-hidden focus:border-emerald-400"
                          />
                          <User className="w-3.5 h-3.5 text-emerald-300 absolute left-3 top-2.5" />
                        </div>
                      </div>
                    )}
                    <div>
                      <div className="relative">
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="البريد الإلكتروني"
                          className="w-full bg-white/10 border border-white/20 rounded-xl px-3.5 py-2 pl-9 text-xs text-white placeholder-emerald-200/40 focus:outline-hidden focus:border-emerald-400"
                        />
                        <Mail className="w-3.5 h-3.5 text-emerald-300 absolute left-3 top-2.5" />
                      </div>
                    </div>
                    <div>
                      <div className="relative">
                        <input
                          type="password"
                          required
                          minLength={6}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="كلمة المرور (6 أحرف أو أكثر)"
                          className="w-full bg-white/10 border border-white/20 rounded-xl px-3.5 py-2 pl-9 text-xs text-white placeholder-emerald-200/40 focus:outline-hidden focus:border-emerald-400"
                        />
                        <Lock className="w-3.5 h-3.5 text-emerald-300 absolute left-3 top-2.5" />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isAuthLoading}
                      className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
                    >
                      {isAuthLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <LogIn className="w-4 h-4" />
                      )}
                      <span>{isSignUp ? 'إنشاء حساب والارتباط فوراً' : 'دخول وقبول الدعوة'}</span>
                    </button>

                    <div className="text-center pt-1">
                      <button
                        type="button"
                        onClick={() => { setIsSignUp(!isSignUp); setAuthError(null); }}
                        className="text-[11px] text-emerald-300 hover:underline"
                      >
                        {isSignUp
                          ? 'لديك حساب بالفعل؟ اضغط هنا لتسجيل الدخول'
                          : 'مستخدم جديد؟ اضغط هنا لإنشاء حساب سريع'}
                      </button>
                    </div>
                  </form>

                {authError && (
                  <p className="text-xs text-rose-200 bg-rose-950/60 p-2.5 rounded-xl border border-rose-500/30 text-center">
                    {authError}
                  </p>
                )}
              </div>
            )}

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-emerald-300/60 pt-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>خصوصية تامة • شريكك يرى نسبة إنجازك اليومية فقط</span>
            </div>
          </div>
        )}
      </div>

      {/* تذييل */}
      <footer className="mt-8 text-center text-xs text-emerald-300/50">
        منصة مُعين • تثبيت عاداتك الدينية بروح الإخاء والالتزام 🌿
      </footer>
    </div>
  );
}

export default function JoinPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-emerald-950 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
        </div>
      }
    >
      <JoinPageContent />
    </Suspense>
  );
}
