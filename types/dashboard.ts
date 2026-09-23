export type HabitCategory = 'صلاة' | 'سنة' | 'قرآن' | 'أذكار' | 'صيام' | 'عام';

export interface HabitItem {
  id: string;
  title: string;
  category: HabitCategory;
  completed: boolean;
  notes?: string;
  timeHint?: string; // مثلاً: "قبل الشروق"، "بعد صلاة الفجر"
  timeSlot?: 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha' | 'quran' | 'night' | 'fasting';
  isSunnah?: boolean;
  fastingType?: 'mon_thu' | 'white_days' | 'voluntary';
}

export interface PartnerStatus {
  id: string;
  name: string;
  avatarUrl?: string;
  completedCount: number;
  totalHabits: number;
  streakDays: number;
  lastActiveTime: string;
  encouragedToday: boolean;
}

export interface UserStats {
  streakDays: number;
  name: string;
}

export interface PartnerMessage {
  id: string;
  senderId: string;
  senderName: string;
  message: string;
  type: string;
  createdAt: string;
}

