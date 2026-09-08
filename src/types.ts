export type SubscriptionStatus = 'free' | 'premium' | 'trial' | 'expired';

export interface UserProfile {
  name: string;
  email: string;
  startDate: string; // ISO date string when user first accessed
  subscriptionStatus: SubscriptionStatus;
  subscriptionExpiryDate?: string;
  kiwifyTransactionId?: string;
  trialDaysUsed: number; // 0, 1, 2, 3+
  dailyGoalMinutes: number;
  streakDays: number;
  lastActiveDate: string;
  savedOfflineIds: string[];
  favoriteIds: string[];
}

export interface PracticeLog {
  id: string;
  title: string;
  type: 'oracao' | 'meditacao' | 'leitura_salmos' | 'estudo';
  durationSeconds: number;
  timestamp: string;
  notes?: string;
}

export interface DailyVerse {
  id: string;
  date: string; // YYYY-MM-DD
  reference: string;
  text: string;
  reflection: string;
  actionPrompt: string;
  theme: string;
}

export type PrayerCategory = 'manha' | 'acalmar_alma' | 'tarde_noite' | 'protecao' | 'gratidao';

export interface Prayer {
  id: string;
  title: string;
  category: PrayerCategory;
  summary: string;
  text: string;
  biblicalRef: string;
  isPremium: boolean;
  durationMinutes: number;
}

export interface GuidedMeditation {
  id: string;
  title: string;
  durationMinutes: number;
  description: string;
  theme: string;
  isPremium: boolean;
  stages: {
    title: string;
    guidance: string;
    seconds: number;
  }[];
}

export interface Psalm {
  number: number;
  title: string;
  theme: string;
  summary: string;
  verses: {
    verseNumber: number;
    text: string;
  }[];
  devotionalInsight: string;
}

export interface StudyMaterial {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  estimatedReadMinutes: number;
  isPremium: boolean;
  content: string[];
  keyVerses: string[];
}

export interface NotificationSettings {
  enabled: boolean;
  morningTime: string; // e.g. "06:30"
  hasPermission: boolean;
}

export interface AppAdminConfig {
  adminPin: string;
  kiwifyCheckoutUrl: string;
  subscriptionPrice: string;
  announcementBanner: string;
  announcementActive: boolean;
}

