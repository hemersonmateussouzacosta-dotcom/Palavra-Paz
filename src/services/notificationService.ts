import { NotificationSettings } from '../types';

const STORAGE_KEY = 'palavra_paz_notifications';

export class NotificationService {
  public static getSettings(): NotificationSettings {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return {
      enabled: false,
      morningTime: '07:00',
      hasPermission: typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted',
    };
  }

  public static saveSettings(settings: NotificationSettings) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // ignore
    }
  }

  public static async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      return false;
    }
    try {
      const permission = await Notification.requestPermission();
      const granted = permission === 'granted';
      const current = this.getSettings();
      this.saveSettings({ ...current, hasPermission: granted, enabled: granted });
      return granted;
    } catch (e) {
      console.warn('Could not request notification permission:', e);
      return false;
    }
  }

  public static showDailyVerseNotification(verseRef: string, verseText: string) {
    if (!('Notification' in window)) {
      return false;
    }
    if (Notification.permission !== 'granted') {
      return false;
    }

    try {
      const title = `☀️ Versículo da Manhã • ${verseRef}`;
      const options: NotificationOptions = {
        body: `"${verseText.slice(0, 140)}..." Abra para sua oração e meditação do dia.`,
        icon: '/favicon.ico',
        tag: 'daily-verse-morning',
      };
      new Notification(title, options);
      return true;
    } catch (err) {
      console.warn('Error showing notification:', err);
      return false;
    }
  }
}
