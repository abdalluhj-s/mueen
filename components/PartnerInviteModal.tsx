'use client';

import React, { useState, useEffect, useTransition } from 'react';
import {
  X,
  Share2,
  Copy,
  Check,
  HeartHandshake,
  MessageCircle,
  KeyRound,
  AlertCircle,
  Sparkles,
  Loader2,
  ShieldCheck,
} from 'lucide-react';
import { getUserInviteCode, acceptInviteCode } from '../app/actions/partner';

interface PartnerInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPartnerConnected?: (partnerName: string) => void;
}

export const PartnerInviteModal: React.FC<PartnerInviteModalProps> = ({
  isOpen,
  onClose,
  onPartnerConnected,
}) => {
  const [activeTab, setActiveTab] = useState<'invite' | 'join'>('invite');
  const [inviteCode, setInviteCode] = useState<string>('MN-8F3B92');
  const [inviteUrl, setInviteUrl] = useState<string>('');
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [isGuest, setIsGuest] = useState(false);

  // إدخال كود الصديق
  const [inputCode, setInputCode] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // جلب الكود الحقيقي للمستخدم عند فتح النافذة
  useEffect(() => {
    if (isOpen) {
      setErrorMsg(null);
      setSuccessMsg(null);
      const origin = typeof window !== 'undefined' ? window.location.origin : 'https://chipper-kheer-12d0a9.netlify.app';
      setInviteUrl(`${origin}/join?code=${inviteCode}`);

      getUserInviteCode()
        .then((res) => {
          if (res?.code) {
            setInviteCode(res.code);
            setInviteUrl(res.fullUrl || `${origin}/join?code=${res.code}`);
            setIsGuest(false);
          }
        })
        .catch(() => {
          setIsGuest(true);
        });
    }
  }, [isOpen, inviteCode]);

  if (!isOpen) return null;

  // نسخ كود الدعوة
  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(inviteCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch {
      // fallback
    }
  };

  // نسخ رابط الدعوة الكامل
  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    } catch {
      // fallback
    }
  };

  // زر المشاركة الذكي عبر واتساب (WhatsApp Share Flow)
  const handleWhatsAppShare = () => {
    const text = `السلام عليكم يا غالي، اخترتك لتكون رفيق التزامي في منصة معين لمتابعة الورد والصلوات سوياً 🤝 ادخل من الرابط لنبدأ التحدي: ${inviteUrl}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  };

  // تأكيد كود الدعوة والانضمام
  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) {
      setErrorMsg('يرجى كتابة كود الدعوة أولاً');
      return;
    }

    setErrorMsg(null);
    setSuccessMsg(null);

    startTransition(async () => {
      try {
        const res = await acceptInviteCode(inputCode.trim());
        if (res.success) {
          setSuccessMsg(res.message || 'تم ربط الشريك بنجاح!');
          if (onPartnerConnected && res.partnerName) {
            onPartnerConnected(res.partnerName);
          }
          setTimeout(() => {
            onClose();
          }, 2500);
        } else {
          setErrorMsg(res.error || 'تعذر الانضمام، تأكد من صحة الكود.');
        }
      } catch (err: any) {
        setErrorMsg(err?.message || 'حدث خطأ غير متوقع.');
      }
    });
  };

  return (
    <div
      dir="rtl"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
    >
      <div
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-emerald-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* رأس النافذة */}
        <div className="flex items-center justify-between p-5 sm:p-6 bg-gradient-to-l from-emerald-50 via-teal-50 to-white border-b border-emerald-100/80">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base">دعوة رفيق الالتزام</h3>
              <p className="text-xs text-gray-500">«واصبر نفسك مع الذين يدعون ربهم»</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق"
            className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* تبويبات التنقل */}
        <div className="flex p-2 bg-gray-50/80 border-b border-gray-100 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setActiveTab('invite');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'invite'
                ? 'bg-white text-emerald-800 shadow-xs border border-gray-200/60'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <Share2 className="w-4 h-4 text-emerald-600" />
            <span>أرسل دعوة لصديقك</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('join');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'join'
                ? 'bg-white text-emerald-800 shadow-xs border border-gray-200/60'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <KeyRound className="w-4 h-4 text-emerald-600" />
            <span>لدي كود دعوة</span>
          </button>
        </div>

        {/* محتوى التبويبات */}
        <div className="p-5 sm:p-6 space-y-5">
          {/* ======================= التبويب 1: إرسال الدعوة ======================= */}
          {activeTab === 'invite' && (
            <div className="space-y-4">
              <p className="text-xs text-gray-600 leading-relaxed">
                شارك دعوتك مع صديق صالح لتبدآ معاً رحلة تثبيت الطاعات ومتابعة نسبة الإنجاز اليومية بكل خصوصية.
              </p>

              {/* زر المشاركة الذكي والبارز عبر واتساب */}
              <button
                type="button"
                onClick={handleWhatsAppShare}
                className="w-full py-3.5 px-4 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] active:scale-[0.98] text-white font-bold text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-[#25D366]/25 transition-all cursor-pointer"
              >
                <MessageCircle className="w-5 h-5 fill-white" />
                <span>مشاركة عبر واتساب</span>
              </button>

              {/* بطاقة كود الدعوة المباشر */}
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80">
                <div className="text-[11px] font-semibold text-emerald-800 mb-1.5">
                  كود الدعوة المباشر:
                </div>
                <div className="flex items-center justify-between gap-2 bg-white px-3.5 py-2.5 rounded-xl border border-emerald-200 shadow-2xs">
                  <span className="font-mono text-lg font-bold tracking-widest text-emerald-950">
                    {inviteCode}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-emerald-100/70 hover:bg-emerald-200 text-emerald-800 transition-colors cursor-pointer"
                  >
                    {copiedCode ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-700" />
                        <span>تم النسخ</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>نسخ الكود</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* حقل رابط الدعوة الكامل */}
              <div>
                <label className="text-[11px] font-semibold text-gray-600 mb-1 block">
                  رابط الانضمام الخاص:
                </label>
                <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl border border-gray-200 text-xs">
                  <input
                    type="text"
                    readOnly
                    value={inviteUrl}
                    className="bg-transparent border-none outline-hidden text-gray-600 w-full text-left font-mono text-[11px]"
                    dir="ltr"
                  />
                  <button
                    type="button"
                    onClick={handleCopyUrl}
                    className="text-emerald-700 hover:text-emerald-900 shrink-0 font-medium cursor-pointer"
                  >
                    {copiedUrl ? 'تم النسخ' : 'نسخ'}
                  </button>
                </div>
              </div>

              {isGuest && (
                <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-xl text-xs text-amber-800 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>سجّل الدخول بحسابك لتفعيل كودك الخاص ومزامنة شريكك سحابياً.</span>
                  </div>
                  <a
                    href="/login"
                    className="px-2.5 py-1 bg-emerald-700 text-white rounded-lg font-semibold hover:bg-emerald-800 shrink-0 text-[11px]"
                  >
                    دخول
                  </a>
                </div>
              )}

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>شريكك سيرى نسبة إنجازك فقط، وتفاصيل أورادك محفوظة لك.</span>
              </div>
            </div>
          )}

          {/* ======================= التبويب 2: الانضمام بكود ======================= */}
          {activeTab === 'join' && (
            <form onSubmit={handleJoinSubmit} className="space-y-4">
              <p className="text-xs text-gray-600 leading-relaxed">
                إذا أرسل لك صديقك كود الدعوة الخاص به، الصقه هنا لتأكيد الشراكة مباشرة.
              </p>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1.5">
                  أدخل كود دعوة الصديق:
                </label>
                <input
                  type="text"
                  placeholder="مثال: MN-8A9C2E"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 text-center font-mono text-base tracking-widest uppercase transition-all placeholder:text-gray-400 placeholder:tracking-normal placeholder:font-sans placeholder:text-sm"
                  dir="ltr"
                />
              </div>

              {/* رسائل التنبيه والخطأ */}
              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200/80 text-rose-800 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* رسائل النجاح */}
              {successMsg && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="font-semibold">{successMsg}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isPending || !!successMsg}
                className="w-full py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:bg-emerald-400 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>جارٍ التحقق من الكود وتأكيد الشراكة...</span>
                  </>
                ) : (
                  <>
                    <HeartHandshake className="w-4 h-4" />
                    <span>تأكيد والارتباط بالشريك</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
