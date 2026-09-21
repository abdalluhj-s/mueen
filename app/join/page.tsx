'use client';

import React, { useState, useEffect, useTransition } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { HeartHandshake, Sparkles, Loader2, CheckCircle, ArrowRight, AlertCircle } from 'lucide-react';
import { acceptInviteCode } from '../actions/partner';

function JoinPageContent() {
  const searchParams = useSearchParams();
  const codeFromUrl = searchParams.get('code') ?? '';

  const [inputCode, setInputCode] = useState(codeFromUrl.toUpperCase());
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [partnerName, setPartnerName] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (codeFromUrl) {
      setInputCode(codeFromUrl.toUpperCase());
    }
  }, [codeFromUrl]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) {
      setErrorMsg('يرجى إدخال كود الدعوة أولاً');
      return;
    }

    setErrorMsg(null);
    setSuccessMsg(null);

    startTransition(async () => {
      try {
        const res = await acceptInviteCode(inputCode.trim());
        if (res.success) {
          setSuccessMsg(res.message ?? 'تم ربط الشريك بنجاح!');
          setPartnerName(res.partnerName ?? null);
        } else {
          setErrorMsg(res.error ?? 'تعذر الانضمام، تأكد من صحة الكود.');
        }
      } catch (err: any) {
        setErrorMsg(err?.message ?? 'حدث خطأ غير متوقع.');
      }
    });
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-gradient-to-b from-emerald-950 via-emerald-900 to-slate-950 text-white flex flex-col justify-center items-center p-4 sm:p-6"
    >
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* زخرفة خلفية */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-teal-400/20 rounded-full blur-3xl pointer-events-none" />

        {/* الشعار */}
        <div className="text-center mb-8 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 mx-auto flex items-center justify-center text-white shadow-lg shadow-emerald-500/30 mb-4">
            <HeartHandshake className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            مُعين
          </h1>
          <p className="text-xs sm:text-sm text-emerald-200/90 mt-1.5">
            دُعيت لتكون رفيق التزام 🤝
          </p>
        </div>

        {/* المحتوى */}
        <div className="relative z-10">
          {successMsg ? (
            /* حالة النجاح */
            <div className="text-center space-y-5">
              <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center mx-auto">
                <CheckCircle className="w-10 h-10 text-emerald-300" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white mb-1">بارك الله فيكما! 🌿</h2>
                {partnerName && (
                  <p className="text-sm text-emerald-200/90">
                    تم ربطك بنجاح مع رفيقك <strong className="text-white">{partnerName}</strong>
                  </p>
                )}
                <p className="text-xs text-emerald-300/80 mt-2 leading-relaxed">
                  «المؤمن للمؤمن كالبنيان يشد بعضه بعضاً»
                </p>
              </div>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white hover:bg-gray-50 text-emerald-800 font-bold text-sm transition-all shadow-lg"
              >
                <Sparkles className="w-4 h-4" />
                <span>ابدأ متابعة وردك اليومي</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            /* نموذج إدخال الكود */
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <p className="text-sm text-emerald-100/90 text-center leading-relaxed mb-5">
                  أدخل كود الدعوة الذي أرسله لك صديقك للارتباط به كرفيق التزام يومي.
                </p>

                <label className="text-xs font-semibold text-emerald-200 block mb-2">
                  كود الدعوة:
                </label>
                <input
                  type="text"
                  placeholder="مثال: MN-8A9C2E"
                  value={inputCode}
                  onChange={(e) => {
                    setInputCode(e.target.value.toUpperCase());
                    if (errorMsg) setErrorMsg(null);
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 text-center font-mono text-lg tracking-widest uppercase text-white placeholder:text-white/30 placeholder:tracking-normal placeholder:font-sans placeholder:text-sm transition-all outline-none"
                  dir="ltr"
                  autoFocus
                />
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-200 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isPending}
                className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-gray-50 active:scale-[0.98] text-emerald-800 font-bold text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-black/20 transition-all cursor-pointer disabled:opacity-70"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-emerald-700" />
                    <span>جارٍ التحقق وتأكيد الشراكة...</span>
                  </>
                ) : (
                  <>
                    <HeartHandshake className="w-5 h-5 text-emerald-700" />
                    <span>تأكيد والانضمام كرفيق التزام</span>
                  </>
                )}
              </button>

              <div className="text-center">
                <Link
                  href="/login"
                  className="text-xs text-emerald-300/70 hover:text-emerald-200 transition-colors"
                >
                  يجب تسجيل الدخول أولاً للانضمام
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* تذييل */}
      <footer className="mt-8 text-center text-xs text-emerald-300/50">
        منصة مُعين • تثبيت عاداتك الدينية بروح الإخاء والالتزام 🌿
      </footer>
    </div>
  );
}

// تغليف في Suspense لأن useSearchParams يحتاجه في Next.js
import { Suspense } from 'react';

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
