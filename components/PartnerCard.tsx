'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  HeartHandshake,
  Send,
  CheckCircle,
  Sparkles,
  Flame,
  UserPlus,
  RefreshCw,
  MessageSquare,
  ChevronDown,
  UserX,
  Loader2,
} from 'lucide-react';
import { PartnerStatus, PartnerMessage } from '../types/dashboard';
import { sendPartnerEncouragement, disconnectPartner } from '../app/actions/partner';

interface PartnerCardProps {
  partner: PartnerStatus | null;
  recentMessages?: PartnerMessage[];
  onOpenInviteModal?: () => void;
  onRefreshPartner?: () => void;
}

const PRESET_ENCOURAGEMENTS = [
  'ثبّتك الله وبارك في همّتك! 🌿',
  'حيّ على الصلاة، لا يفوتك الورد اليوم 🕌',
  'جزاك الله خيراً، فخور بالتزامك ومسيرتك ✨',
  '«واصبر نفسك مع الذين يدعون ربهم» 🤝',
];

export const PartnerCard: React.FC<PartnerCardProps> = ({
  partner,
  recentMessages = [],
  onOpenInviteModal,
  onRefreshPartner,
}) => {
  const [hasEncouraged, setHasEncouraged] = useState<boolean>(
    partner?.encouragedToday ?? false
  );
  const [isSending, setIsSending] = useState<boolean>(false);
  const [customMsg, setCustomMsg] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [sendFeedback, setSendFeedback] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  // تحديث حالة الشريك يدوياً
  const handleRefresh = async () => {
    if (onRefreshPartner) {
      setIsRefreshing(true);
      await onRefreshPartner();
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  // إرسال تشجيع أو دعاء للشريك
  const handleSendEncouragement = async (messageText?: string) => {
    const textToSend = messageText || customMsg;
    if (!textToSend.trim() || isSending) return;

    setIsSending(true);
    setSendFeedback(null);

    try {
      const res = await sendPartnerEncouragement(textToSend.trim());
      if (res.success) {
        setHasEncouraged(true);
        setSendFeedback('تم إرسال التشجيع لرفيقك بنجاح! 🌿');
        setCustomMsg('');
        setShowCustomInput(false);
        setTimeout(() => setSendFeedback(null), 4000);
      } else {
        setSendFeedback(res.error || 'تعذر الإرسال حالياً');
      }
    } catch {
      setSendFeedback('حدث خطأ أثناء الإرسال');
    } finally {
      setIsSending(false);
    }
  };

  // فك الارتباط بالشريك
  const handleDisconnect = async () => {
    if (!window.confirm('هل أنت متأكد من رغبتك في فك الارتباط بهذا الرفيق؟ يمكنك دائماً ربط رفيق جديد.')) {
      return;
    }

    setIsDisconnecting(true);
    try {
      const res = await disconnectPartner();
      if (res.success && onRefreshPartner) {
        onRefreshPartner();
      }
    } catch {
      // ignore
    } finally {
      setIsDisconnecting(false);
      setShowMenu(false);
    }
  };

  // ===================== حالة عدم وجود شريك =====================
  if (!partner) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-emerald-300 dark:border-emerald-800 p-6 text-center shadow-xs transition-colors duration-200 relative overflow-hidden">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-100 to-teal-50 dark:from-emerald-950 dark:to-teal-900 text-emerald-700 dark:text-emerald-300 flex items-center justify-center mx-auto mb-3.5 shadow-2xs">
          <HeartHandshake className="w-7 h-7" />
        </div>
        <h3 className="font-bold text-gray-900 dark:text-white text-base">
          لا يوجد رفيق التزام حالياً
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 mb-5 leading-relaxed max-w-xs mx-auto">
          «المؤمن للمؤمن كالبنيان يشد بعضه بعضاً». شارك رابطك مع صديقك المقرب ليعينك وتُعينه على الطاعة اليومية.
        </p>

        <button
          type="button"
          onClick={onOpenInviteModal}
          className="w-full py-3 px-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 active:scale-[0.98] text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>دعوة أو ربط شريك التزام 🤝</span>
        </button>
      </div>
    );
  }

  // حساب نسبة إنجاز الشريك اليوم
  const completionPct =
    partner.totalHabits > 0
      ? Math.round((partner.completedCount / partner.totalHabits) * 100)
      : 0;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200/90 dark:border-slate-800 p-5 shadow-xs relative overflow-hidden transition-colors duration-200 space-y-4">
      {/* رأس البطاقة */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <HeartHandshake className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <h3 className="font-bold text-gray-900 dark:text-white text-sm">
            رفيق الالتزام
          </h3>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 px-2.5 py-1 rounded-full border border-emerald-200/70 dark:border-emerald-800/60">
            <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>{partner.streakDays} أيام معاً</span>
          </span>

          {/* زر التحديث */}
          <button
            type="button"
            onClick={handleRefresh}
            title="تحديث بيانات الشريك"
            className="p-1 rounded-lg text-gray-400 hover:text-emerald-700 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-emerald-600' : ''}`} />
          </button>

          {/* خيارات الشريك */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            {showMenu && (
              <div className="absolute left-0 mt-1 w-36 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 p-1 z-20 text-xs">
                <button
                  type="button"
                  onClick={handleDisconnect}
                  disabled={isDisconnecting}
                  className="w-full text-right px-2.5 py-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-1.5"
                >
                  <UserX className="w-3.5 h-3.5" />
                  <span>فك الارتباط</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* معلومات الشريك والبروفايل */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
          {partner.avatarUrl ? (
            <img
              src={partner.avatarUrl}
              alt={partner.name}
              className="w-full h-full rounded-2xl object-cover"
            />
          ) : (
            partner.name.charAt(0)
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="font-bold text-gray-900 dark:text-white text-sm sm:text-base truncate">
            {partner.name}
          </h4>
          <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
            <span>نشاط اليوم: {partner.lastActiveTime}</span>
          </p>
        </div>
      </div>

      {/* شريط إنجاز الشريك اليومي */}
      <div className="p-3.5 rounded-2xl bg-gray-50/80 dark:bg-slate-800/60 border border-gray-100 dark:border-slate-800">
        <div className="flex justify-between items-center text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
          <span>إنجاز ورد اليوم</span>
          <span className="text-emerald-700 dark:text-emerald-400 font-extrabold text-sm">{completionPct}%</span>
        </div>

        <div className="h-2.5 w-full bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-l from-emerald-500 to-teal-600 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${completionPct}%` }}
          />
        </div>

        <div className="flex justify-between items-center mt-2 text-[11px] text-gray-400 dark:text-gray-500 font-normal">
          <span>أنجز {partner.completedCount} من {partner.totalHabits} أوراد</span>
          <span className="flex items-center gap-0.5 text-gray-400 dark:text-gray-500">
            <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            <span>خصوصية تامة</span>
          </span>
        </div>
      </div>

      {/* رسائل وتشجيعات واردة من الشريك */}
      {recentMessages && recentMessages.length > 0 && (
        <div className="p-3 bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/70 dark:border-emerald-800/60 rounded-2xl text-xs space-y-1 animate-in fade-in">
          <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 font-bold text-[11px]">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>رسالة تشجيع من رفيقك ({partner.name}):</span>
          </div>
          <p className="text-emerald-950 dark:text-emerald-100 italic pr-2 font-medium">
            «{recentMessages[0].message}»
          </p>
        </div>
      )}

      {/* صندوق التفاعل والإرسال للشريك ("يبعت للشخص التاني") */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between text-xs font-semibold text-gray-700 dark:text-gray-300">
          <span className="flex items-center gap-1">
            <Send className="w-3.5 h-3.5 text-emerald-600" />
            <span>أرسل تشجيعاً أو دعاءً لرفيقك:</span>
          </span>
          <button
            type="button"
            onClick={() => setShowCustomInput(!showCustomInput)}
            className="text-[11px] text-emerald-700 dark:text-emerald-400 hover:underline"
          >
            {showCustomInput ? 'عبارات جاهزة' : 'كتابة دعاء خاص'}
          </button>
        </div>

        {/* العبارات الجاهزة بنقرة واحدة */}
        {!showCustomInput ? (
          <div className="grid grid-cols-2 gap-1.5">
            {PRESET_ENCOURAGEMENTS.map((msg, idx) => (
              <button
                key={idx}
                type="button"
                disabled={isSending}
                onClick={() => handleSendEncouragement(msg)}
                className="p-2 text-[11px] text-right rounded-xl bg-gray-50 hover:bg-emerald-50 dark:bg-slate-800/80 dark:hover:bg-emerald-950/60 border border-gray-200/80 dark:border-slate-700 text-gray-700 dark:text-gray-200 hover:text-emerald-800 dark:hover:text-emerald-200 transition-all cursor-pointer leading-tight active:scale-[0.98]"
              >
                {msg}
              </button>
            ))}
          </div>
        ) : (
          /* حقل كتابة رسالة مخصصة */
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="اكتب دعاءً أو تشجيعاً طيباً..."
              value={customMsg}
              onChange={(e) => setCustomMsg(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendEncouragement();
              }}
              className="flex-1 px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-100 outline-none focus:border-emerald-600"
            />
            <button
              type="button"
              disabled={isSending || !customMsg.trim()}
              onClick={() => handleSendEncouragement()}
              className="px-3 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center gap-1 shrink-0 cursor-pointer"
            >
              {isSending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              <span>إرسال</span>
            </button>
          </div>
        )}

        {/* إشعار حالة الإرسال */}
        {sendFeedback && (
          <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 text-emerald-800 dark:text-emerald-300 text-[11px] text-center font-medium animate-in fade-in">
            {sendFeedback}
          </div>
        )}
      </div>
    </div>
  );
};
