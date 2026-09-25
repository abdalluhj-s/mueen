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
  Send,
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
  const [inviteCode, setInviteCode] = useState<string>('MN-...');
  const [inviteUrl, setInviteUrl] = useState<string>('');
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);

  // إدخال كود الصديق
  const [inputCode, setInputCode] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // فحص دعم مشاركة النظام الأصلية (Native Share)
  useEffect(() => {
    if (typeof navigator !== 'undefined' && !!navigator.share) {
      setCanNativeShare(true);
    }
  }, []);

  // جلب الكود الحقيقي للمستخدم عند فتح النافذة
  useEffect(() => {
    if (isOpen) {
      setErrorMsg(null);
      setSuccessMsg(null);

      const origin =
        typeof window !== 'undefined' && window.location.origin
          ? window.location.origin
          : 'https://mueen.ah4549658.workers.dev';

      // مبدئياً نعرض رابط سريع مع الكود المؤقت
      setInviteUrl(`${origin}/join?code=${inviteCode}`);

      getUserInviteCode()
        .then((res) => {
          if (res?.code) {
            setInviteCode(res.code);
            setInviteUrl(`${origin}/join?code=${res.code}`);
            setIsGuest(false);
          }
        })
        .catch(() => {
          setIsGuest(true);
        });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // نص المشاركة المعتمد
  const shareMessage = `السلام عليكم يا غالي، اخترتك لتكون رفيق التزامي في منصة «مُعين» لمتابعة الورد القرآني والصلوات سوياً 🤝 ادخل من الرابط لنبدأ التحدي الإيماني: ${inviteUrl}`;

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

  // زر المشاركة الذكي عبر واتساب
  const handleWhatsAppShare = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareMessage)}`;
    window.open(whatsappUrl, '_blank');
  };

  // زر مشاركة النظام الأصلية للموبايل (Android / iOS Share Sheet)
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'دعوة رفيق التزام في منصة مُعين',
          text: shareMessage,
          url: inviteUrl,
        });
      } catch {
        // المستخدم ألغى المشاركة
      }
    } else {
      handleWhatsAppShare();
    }
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
          }, 2000);
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
              <h3 className="font-bold text-gray-900 text-base">رفيق الالتزام «المُعين»</h3>
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
                شارك هذا الرابط مع صديق صالح عبر واتساب، وعندما يفتحه سيتم ربطكما معاً في لوحة متابعة الصلوات والأوراد اليومية.
              </p>

              {/* أزرار المشاركة المباشرة */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={handleWhatsAppShare}
                  className="py-3 px-4 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] active:scale-[0.98] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-[#25D366]/25 transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>إرسال عبر واتساب</span>
                </button>

                {canNativeShare ? (
                  <button
                    type="button"
                    onClick={handleNativeShare}
                    className="py-3 px-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 active:scale-[0.98] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>مشاركة الرابط</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleCopyUrl}
                    className="py-3 px-4 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    {copiedUrl ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-700" />
                        <span>تم نسخ الرابط</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>نسخ الرابط بالكامل</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* بطاقة كود الدعوة المباشر */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80">
                <div className="text-[11px] font-semibold text-emerald-800 mb-1.5 flex items-center justify-between">
                  <span>كود الدعوة المباشر:</span>
                  <span className="text-[10px] text-emerald-600">يمكن لصديقك إدخاله يدوياً</span>
                </div>
                <div className="flex items-center justify-between gap-2 bg-white px-3.5 py-2.5 rounded-xl border border-emerald-200 shadow-2xs">
                  <span className="font-mono text-base sm:text-lg font-bold tracking-widest text-emerald-950">
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

              {/* حقل الرابط الكامل */}
              <div>
                <label className="text-[11px] font-semibold text-gray-600 mb-1 block">
                  رابط الانضمام المباشر:
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
                    className="text-emerald-700 hover:text-emerald-900 shrink-0 font-bold cursor-pointer"
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

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>خصوصية تامة: شريكك يرى نسبة إنجازك فقط، وأورادك الشخصية محفوظة.</span>
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
                  placeholder="مثال: MN-6E3036"
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
