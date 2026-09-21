export type HabitCategory = 'صلاة' | 'قرآن' | 'أذكار' | 'صيام' | 'عام';

export interface HabitItem {
  id: string;
  title: string;
  category: HabitCategory;
  completed: boolean;
  notes?: string;
  timeHint?: string; // مثلاً: "قبل الشروق"، "بعد صلاة الفجر"
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
