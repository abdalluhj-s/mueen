'use strict';
import React, { useState } from 'react';
import { ShieldCheck, HeartHandshake, Send, CheckCircle, Sparkles, Flame, UserPlus } from 'lucide-react';
import { PartnerStatus } from '../types/dashboard';

interface PartnerCardProps {
  partner: PartnerStatus | null;
  onSendEncouragement?: () => void;
  onOpenInviteModal?: () => void;
}

export const PartnerCard: React.FC<PartnerCardProps> = ({
  partner,
  onSendEncouragement,
  onOpenInviteModal,
}) => {
  const [hasEncouraged, setHasEncouraged] = useState<boolean>(
    partner?.encouragedToday ?? false
  );
  const [isSending, setIsSending] = useState<boolean>(false);

  // حالة عدم وجود شريك
  if (!partner) {
    return (
      <div className="bg-white rounded-2xl border border-dashed border-emerald-300/80 p-6 text-center shadow-xs">
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-3">
          <HeartHandshake className="w-6 h-6" />
        </div>
        <h3 className="font-bold text-gray-900 text-base">لا يوجد رفيق التزام حالياً</h3>
        <p className="text-xs text-gray-500 mt-1 mb-4 leading-relaxed">
          «المؤمن للمؤمن كالبنيان يشد بعضه بعضاً». ادعُ صديقاً ليعينك وتُعينه على الطاعة اليومية.
        </p>
        <button
          type="button"
          onClick={onOpenInviteModal}
          className="w-full py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:scale-[0.98] text-white text-xs sm:text-sm font-semibold shadow-xs flex items-center justify-center gap-2 transition-all"
        >
          <UserPlus className="w-4 h-4" />
          <span>دعوة أو ربط شريك التزام</span>
        </button>
      </div>
    );
  }

  const completionPct =
    partner.totalHabits > 0
      ? Math.round((partner.completedCount / partner.totalHabits) * 100)
      : 0;

  const handleEncourage = () => {
    if (hasEncouraged || isSending) return;
    setIsSending(true);
    setTimeout(() => {
      setHasEncouraged(true);
      setIsSending(false);
      if (onSendEncouragement) onSendEncouragement();
    }, 600);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs relative overflow-hidden">
      {/* رأس البطاقة */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <HeartHandshake className="w-5 h-5 text-emerald-700" />
          <h3 className="font-bold text-gray-900 text-sm">شريك الالتزام</h3>
        </div>
        <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
          <Flame className="w-3 h-3 text-amber-500 fill-amber-500" />
          <span>{partner.streakDays} أيام معاً</span>
        </span>
      </div>

      {/* معلومات الشريك */}
      <div className="mt-4 flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-bold text-base shadow-sm shrink-0">
          {partner.avatarUrl ? (
            <img
              src={partner.avatarUrl}
              alt={partner.name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            partner.name.charAt(0)
          )}
        </div>
        <div className="min-w-0">
          <h4 className="font-bold text-gray-900 text-sm sm:text-base truncate">
            {partner.name}
          </h4>
          <p className="text-xs text-gray-400 mt-0.5">
            آخر تفاعل: {partner.lastActiveTime}
          </p>
        </div>
      </div>

      {/* إنجاز الشريك اليومي (خصوصية تامة: نسبة رقمية فقط دون تفاصيل العبادة) */}
      <div className="mt-4 p-3.5 rounded-xl bg-gray-50 border border-gray-100">
        <div className="flex justify-between items-center text-xs font-semibold text-gray-700 mb-2">
          <span>إنجاز ورد اليوم</span>
          <span className="text-emerald-700 font-bold">{completionPct}%</span>
        </div>

        <div className="h-2.5 w-full bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-600 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${completionPct}%` }}
          />
        </div>

        <div className="flex justify-between items-center mt-2 text-[11px] text-gray-400 font-normal">
          <span>أتمّ {partner.completedCount} من {partner.totalHabits} أوراد</span>
          <span className="flex items-center gap-0.5 text-gray-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>خصوصية تامة</span>
          </span>
        </div>
      </div>

      {/* زر التشجيع السريع */}
      <div className="mt-4">
        <button
          type="button"
          disabled={hasEncouraged || isSending}
          onClick={handleEncourage}
          className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all duration-200 ${
            hasEncouraged
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
              : 'bg-emerald-700 hover:bg-emerald-800 active:scale-[0.98] text-white shadow-xs shadow-emerald-700/20'
          }`}
        >
          {isSending ? (
            <span>جارٍ الإرسال...</span>
          ) : hasEncouraged ? (
            <>
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>تم إرسال تشجيع اليوم لرفيقك 🌿</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>أرسل تشجيعاً ودعاءً لشريكك</span>
              <Send className="w-3.5 h-3.5 mr-auto" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
