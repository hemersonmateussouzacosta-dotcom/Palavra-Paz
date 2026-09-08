import { PracticeLog, UserProfile } from '../types';

const PROFILE_STORAGE_KEY = 'palavra_paz_user_profile';
const LOGS_STORAGE_KEY = 'palavra_paz_practice_logs';

export class StorageService {
  public static getProfile(): UserProfile {
    try {
      const stored = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (stored) {
        const parsed: UserProfile = JSON.parse(stored);
        // Calculate days since start
        const start = new Date(parsed.startDate).getTime();
        const now = Date.now();
        const diffDays = Math.max(0, Math.floor((now - start) / (1000 * 60 * 60 * 24)));

        // If not premium and past 3 days (trial expired)
        if (parsed.subscriptionStatus !== 'premium') {
          if (diffDays >= 3) {
            parsed.subscriptionStatus = 'expired';
          } else {
            parsed.subscriptionStatus = 'trial';
          }
        }
        parsed.trialDaysUsed = diffDays;
        return parsed;
      }
    } catch (e) {
      console.warn('Storage read error:', e);
    }

    // Default new user profile
    const today = new Date().toISOString();
    const newProfile: UserProfile = {
      name: 'Irmão(ã) em Cristo',
      email: '',
      startDate: today,
      subscriptionStatus: 'trial',
      trialDaysUsed: 0,
      dailyGoalMinutes: 15,
      streakDays: 1,
      lastActiveDate: today.split('T')[0],
      savedOfflineIds: ['oracao-manha-1', 'oracao-alma-1', 'v-1'],
      favoriteIds: ['v-1']
    };

    StorageService.saveProfile(newProfile);
    return newProfile;
  }

  public static saveProfile(profile: UserProfile): void {
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
    } catch (e) {
      console.warn('Storage write error:', e);
    }
  }

  public static activatePremium(kiwifyId: string = 'KWFY-' + Math.floor(100000 + Math.random() * 900000)): UserProfile {
    const profile = this.getProfile();
    const expiry = new Date();
    expiry.setMonth(expiry.getMonth() + 1); // 30 days recurring

    profile.subscriptionStatus = 'premium';
    profile.kiwifyTransactionId = kiwifyId;
    profile.subscriptionExpiryDate = expiry.toISOString();
    this.saveProfile(profile);
    return profile;
  }

  public static cancelOrResetSubscription(): UserProfile {
    const profile = this.getProfile();
    profile.subscriptionStatus = 'trial';
    profile.kiwifyTransactionId = undefined;
    profile.subscriptionExpiryDate = undefined;
    this.saveProfile(profile);
    return profile;
  }

  // Developer / user simulator for testing trial days
  public static simulateTrialDay(day: number): UserProfile {
    const profile = this.getProfile();
    const newStart = new Date();
    newStart.setDate(newStart.getDate() - day);
    profile.startDate = newStart.toISOString();
    profile.trialDaysUsed = day;

    if (profile.subscriptionStatus !== 'premium') {
      if (day >= 3) {
        profile.subscriptionStatus = 'expired';
      } else {
        profile.subscriptionStatus = 'trial';
      }
    }
    this.saveProfile(profile);
    return profile;
  }

  public static getPracticeLogs(): PracticeLog[] {
    try {
      const stored = localStorage.getItem(LOGS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
    // Default initial seed logs to make dashboard inspiring
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const initialLogs: PracticeLog[] = [
      {
        id: 'log-1',
        title: 'Oração da Manhã & Consagração',
        type: 'oracao',
        durationSeconds: 180,
        timestamp: today.toISOString(),
        notes: 'Coração em paz ao entregar as preocupações do trabalho.'
      },
      {
        id: 'log-2',
        title: 'Meditação: Silenciando a Mente',
        type: 'meditacao',
        durationSeconds: 300,
        timestamp: yesterday.toISOString(),
        notes: 'Prática maravilhosa de respiração ao som de harpa celestial.'
      }
    ];
    this.savePracticeLogs(initialLogs);
    return initialLogs;
  }

  public static savePracticeLogs(logs: PracticeLog[]): void {
    try {
      localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(logs));
    } catch {
      // ignore
    }
  }

  public static addPracticeLog(log: Omit<PracticeLog, 'id' | 'timestamp'>): PracticeLog {
    const logs = this.getPracticeLogs();
    const newLog: PracticeLog = {
      ...log,
      id: 'log-' + Date.now(),
      timestamp: new Date().toISOString()
    };
    logs.unshift(newLog);
    this.savePracticeLogs(logs);

    // Update profile streak and last active date
    const profile = this.getProfile();
    const todayStr = new Date().toISOString().split('T')[0];
    if (profile.lastActiveDate !== todayStr) {
      profile.streakDays += 1;
      profile.lastActiveDate = todayStr;
      this.saveProfile(profile);
    }

    return newLog;
  }

  public static toggleFavorite(id: string): boolean {
    const profile = this.getProfile();
    const index = profile.favoriteIds.indexOf(id);
    let isFav = false;
    if (index > -1) {
      profile.favoriteIds.splice(index, 1);
      isFav = false;
    } else {
      profile.favoriteIds.push(id);
      isFav = true;
    }
    this.saveProfile(profile);
    return isFav;
  }

  public static toggleOfflineSave(id: string): boolean {
    const profile = this.getProfile();
    const index = profile.savedOfflineIds.indexOf(id);
    let isSaved = false;
    if (index > -1) {
      profile.savedOfflineIds.splice(index, 1);
      isSaved = false;
    } else {
      profile.savedOfflineIds.push(id);
      isSaved = true;
    }
    this.saveProfile(profile);
    return isSaved;
  }
}
