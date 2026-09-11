import { PracticeLog, UserProfile, AppAdminConfig, ContentViewLog, ContentViewType, ThemeMode } from '../types';

const PROFILE_STORAGE_KEY = 'palavra_paz_user_profile';
const LOGS_STORAGE_KEY = 'palavra_paz_practice_logs';
const ADMIN_CONFIG_STORAGE_KEY = 'palavra_paz_admin_config';
const ADMIN_SESSION_KEY = 'palavra_paz_admin_logged_in';
const VIEW_HISTORY_STORAGE_KEY = 'palavra_paz_view_history';
const THEME_STORAGE_KEY = 'palavra_paz_theme_mode';

export const DEFAULT_ADMIN_CONFIG: AppAdminConfig = {
  adminUser: 'admin',
  adminPin: '9876',
  kiwifyCheckoutUrl: 'https://pay.kiwify.com.br/vxSeONK',
  subscriptionPrice: '14,90',
  adFreeCheckoutUrl: 'https://pay.kiwify.com.br/vxSeONK',
  adFreePrice: '4,90',
  adsenseClientId: '',
  adsenseSlotId: '',
  announcementBanner: 'Bem-vindo(a) ao Palavra & Paz! Um novo devocional diário é preparado a cada amanhecer.',
  announcementActive: false,
  instagramUrl: 'https://www.instagram.com/verdadeiraluzcaminho?stkn=YXB6ZG51czJuZjNm',
  instagramHandle: '@verdadeiraluzcaminho',
  supportWhatsAppUrl: 'https://wa.link/18u8sf',
  supportPassword: 'hmcjp159',
  adsEnabled: true
};

export class StorageService {
  public static getAdminConfig(): AppAdminConfig {
    try {
      const stored = localStorage.getItem(ADMIN_CONFIG_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Garante que o link do Kiwify seja o oficial atualizado
        if (!parsed.kiwifyCheckoutUrl || parsed.kiwifyCheckoutUrl.includes('assinatura-devocional-palavra-paz')) {
          parsed.kiwifyCheckoutUrl = DEFAULT_ADMIN_CONFIG.kiwifyCheckoutUrl;
        }
        if (!parsed.adFreeCheckoutUrl) {
          parsed.adFreeCheckoutUrl = DEFAULT_ADMIN_CONFIG.adFreeCheckoutUrl;
        }
        if (!parsed.adFreePrice) {
          parsed.adFreePrice = DEFAULT_ADMIN_CONFIG.adFreePrice;
        }
        if (parsed.adsenseClientId === undefined) {
          parsed.adsenseClientId = DEFAULT_ADMIN_CONFIG.adsenseClientId;
        }
        if (parsed.adsenseSlotId === undefined) {
          parsed.adsenseSlotId = DEFAULT_ADMIN_CONFIG.adsenseSlotId;
        }
        if (!parsed.instagramUrl) {
          parsed.instagramUrl = DEFAULT_ADMIN_CONFIG.instagramUrl;
        }
        if (!parsed.instagramHandle) {
          parsed.instagramHandle = DEFAULT_ADMIN_CONFIG.instagramHandle;
        }
        if (!parsed.supportWhatsAppUrl) {
          parsed.supportWhatsAppUrl = DEFAULT_ADMIN_CONFIG.supportWhatsAppUrl;
        }
        if (!parsed.supportPassword) {
          parsed.supportPassword = DEFAULT_ADMIN_CONFIG.supportPassword;
        }
        if (!parsed.adminUser) {
          parsed.adminUser = DEFAULT_ADMIN_CONFIG.adminUser;
        }
        if (parsed.adsEnabled === undefined) {
          parsed.adsEnabled = DEFAULT_ADMIN_CONFIG.adsEnabled;
        }
        // Atualiza PIN antigo para a senha definida pelo administrador
        if (!parsed.adminPin || parsed.adminPin === '1234' || parsed.adminPin === '1478') {
          parsed.adminPin = '9876';
        }
        return { ...DEFAULT_ADMIN_CONFIG, ...parsed };
      }
    } catch (e) {
      console.warn('Erro ao ler admin config:', e);
    }
    return DEFAULT_ADMIN_CONFIG;
  }

  public static saveAdminConfig(config: AppAdminConfig): void {
    try {
      localStorage.setItem(ADMIN_CONFIG_STORAGE_KEY, JSON.stringify(config));
    } catch (e) {
      console.warn('Erro ao salvar admin config:', e);
    }
  }

  public static isAdminLoggedIn(): boolean {
    try {
      return localStorage.getItem(ADMIN_SESSION_KEY) === 'true';
    } catch {
      return false;
    }
  }

  public static setAdminLoggedIn(loggedIn: boolean): void {
    try {
      if (loggedIn) {
        localStorage.setItem(ADMIN_SESSION_KEY, 'true');
      } else {
        localStorage.removeItem(ADMIN_SESSION_KEY);
      }
    } catch (e) {
      console.warn('Erro ao salvar sessão admin:', e);
    }
  }

  public static getProfile(): UserProfile {
    try {
      const stored = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (stored) {
        const parsed: UserProfile = JSON.parse(stored);
        // Sem teste grátis ou bloqueio por expiração de dias: premium, ad_free ou free
        if (parsed.subscriptionStatus !== 'premium' && parsed.subscriptionStatus !== 'ad_free') {
          parsed.subscriptionStatus = 'free';
        }
        return parsed;
      }
    } catch (e) {
      console.warn('Storage read error:', e);
    }

    // Perfil inicial padrão para novos usuários (Plano Gratuito)
    const today = new Date().toISOString();
    const newProfile: UserProfile = {
      name: 'Irmão(ã) em Cristo',
      email: '',
      startDate: today,
      subscriptionStatus: 'free',
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

  public static activateAdFree(kiwifyId: string = 'KWFY-ADFREE-' + Math.floor(100000 + Math.random() * 900000)): UserProfile {
    const profile = this.getProfile();
    const expiry = new Date();
    expiry.setMonth(expiry.getMonth() + 1); // 30 dias recorrente

    profile.subscriptionStatus = 'ad_free';
    profile.kiwifyTransactionId = kiwifyId;
    profile.subscriptionExpiryDate = expiry.toISOString();
    this.saveProfile(profile);
    return profile;
  }

  public static activatePremium(kiwifyId: string = 'KWFY-' + Math.floor(100000 + Math.random() * 900000)): UserProfile {
    const profile = this.getProfile();
    const expiry = new Date();
    expiry.setMonth(expiry.getMonth() + 1); // 30 dias recorrente

    profile.subscriptionStatus = 'premium';
    profile.kiwifyTransactionId = kiwifyId;
    profile.subscriptionExpiryDate = expiry.toISOString();
    this.saveProfile(profile);
    return profile;
  }

  public static cancelOrResetSubscription(): UserProfile {
    const profile = this.getProfile();
    profile.subscriptionStatus = 'free';
    profile.kiwifyTransactionId = undefined;
    profile.subscriptionExpiryDate = undefined;
    this.saveProfile(profile);
    return profile;
  }

  // Alterna para plano gratuito (sem teste expirado)
  public static simulateTrialDay(_day: number): UserProfile {
    const profile = this.getProfile();
    profile.subscriptionStatus = 'free';
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
        notes: 'Prática maravilhosa de respiração ao som ambiente celestial.'
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

  /* =========================================================
   * HISTÓRICO DE VISUALIZAÇÕES (ÁREA DE ADM)
   * ========================================================= */

  public static getViewHistory(): ContentViewLog[] {
    try {
      const stored = localStorage.getItem(VIEW_HISTORY_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Erro ao ler histórico de visualização:', e);
    }

    // Registros iniciais para demonstração realista no painel de administração
    const now = new Date();
    const m5 = new Date(now.getTime() - 5 * 60 * 1000);
    const m25 = new Date(now.getTime() - 25 * 60 * 1000);
    const h2 = new Date(now.getTime() - 2 * 60 * 60 * 1000);
    const h4 = new Date(now.getTime() - 4 * 60 * 60 * 1000);
    const yest = new Date(now.getTime() - 22 * 60 * 60 * 1000);
    const yest2 = new Date(now.getTime() - 26 * 60 * 60 * 1000);

    const initialHistory: ContentViewLog[] = [
      {
        id: 'view-' + now.getTime(),
        type: 'versiculo',
        title: 'Versículo do Dia: Salmos 23:1',
        subtitle: 'O Senhor é o meu pastor; nada me faltará',
        category: 'Paz Interior & Fé',
        timestamp: m5.toISOString(),
        userStatus: 'free',
        metadata: {
          isPremiumContent: false,
          audioListened: false
        }
      },
      {
        id: 'view-' + (now.getTime() - 1),
        type: 'salmo',
        title: 'Salmo 91',
        subtitle: 'Aquele que habita no esconderijo do Altíssimo',
        category: 'Proteção & Livramento',
        timestamp: m25.toISOString(),
        userStatus: 'premium',
        metadata: {
          isPremiumContent: true,
          audioListened: true
        }
      },
      {
        id: 'view-' + (now.getTime() - 2),
        type: 'oracao',
        title: 'Oração da Manhã & Consagração',
        subtitle: 'Salmos 143:8 - Faze-me ouvir a tua benignidade pela manhã',
        category: 'manha',
        timestamp: h2.toISOString(),
        userStatus: 'free',
        metadata: {
          isPremiumContent: false,
          audioListened: true
        }
      },
      {
        id: 'view-' + (now.getTime() - 3),
        type: 'meditacao',
        title: 'Silenciando a Mente & Ansiedade',
        subtitle: 'Duração: 5 minutos • Respiração guiada',
        category: 'Paz Interior & Confiança',
        timestamp: h4.toISOString(),
        userStatus: 'free',
        metadata: {
          isPremiumContent: false,
          durationSeconds: 300
        }
      },
      {
        id: 'view-' + (now.getTime() - 4),
        type: 'salmo',
        title: 'Salmo 121',
        subtitle: 'Elevo os olhos para os montes: de onde me virá o socorro?',
        category: 'Auxílio & Socorro',
        timestamp: yest.toISOString(),
        userStatus: 'premium',
        metadata: {
          isPremiumContent: true,
          audioListened: true
        }
      },
      {
        id: 'view-' + (now.getTime() - 5),
        type: 'estudo',
        title: 'O Poder Transformador da Oração em Segredo',
        subtitle: 'Como falar com o Pai sem pressa e receber paz que excede o entendimento',
        category: 'Vida de Oração',
        timestamp: yest2.toISOString(),
        userStatus: 'premium',
        metadata: {
          isPremiumContent: true
        }
      }
    ];

    this.saveViewHistory(initialHistory);
    return initialHistory;
  }

  public static saveViewHistory(history: ContentViewLog[]): void {
    try {
      localStorage.setItem(VIEW_HISTORY_STORAGE_KEY, JSON.stringify(history));
    } catch (e) {
      console.warn('Erro ao salvar histórico de visualização:', e);
    }
  }

  public static recordView(entry: {
    type: ContentViewType;
    title: string;
    subtitle?: string;
    category?: string;
    metadata?: ContentViewLog['metadata'];
  }): ContentViewLog | null {
    try {
      const history = this.getViewHistory();
      const profile = this.getProfile();
      const userStatus: 'free' | 'premium' = profile.subscriptionStatus === 'premium' ? 'premium' : 'free';

      // Evitar duplicações idênticas registradas em menos de 10 segundos
      if (history.length > 0) {
        const last = history[0];
        const isSame = last.type === entry.type && last.title === entry.title;
        const diffMs = Date.now() - new Date(last.timestamp).getTime();
        if (isSame && diffMs < 10000) {
          return null;
        }
      }

      const newLog: ContentViewLog = {
        id: 'view-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
        type: entry.type,
        title: entry.title,
        subtitle: entry.subtitle,
        category: entry.category,
        timestamp: new Date().toISOString(),
        userStatus,
        metadata: entry.metadata
      };

      // Manter no máximo os 200 registros mais recentes
      const updatedHistory = [newLog, ...history].slice(0, 200);
      this.saveViewHistory(updatedHistory);
      return newLog;
    } catch (e) {
      console.warn('Erro ao registrar visualização:', e);
      return null;
    }
  }

  public static clearViewHistory(): void {
    try {
      localStorage.setItem(VIEW_HISTORY_STORAGE_KEY, JSON.stringify([]));
    } catch (e) {
      console.warn('Erro ao limpar histórico:', e);
    }
  }

  public static getThemePreference(): ThemeMode {
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (stored === 'light' || stored === 'dark' || stored === 'auto') {
        return stored as ThemeMode;
      }
    } catch (e) {
      console.warn('Erro ao ler tema:', e);
    }
    return 'auto';
  }

  public static setThemePreference(theme: ThemeMode): void {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (e) {
      console.warn('Erro ao salvar tema:', e);
    }
  }

  public static isNightTime(): boolean {
    const hour = new Date().getHours();
    // Leitura noturna automática: das 18:00 às 06:00
    return hour >= 18 || hour < 6;
  }

  public static resolveIsDark(theme: ThemeMode): boolean {
    if (theme === 'dark') return true;
    if (theme === 'light') return false;
    // Modo automático: verifica se é período da noite ou preferência do sistema
    if (typeof window !== 'undefined' && window.matchMedia) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) return true;
    }
    return this.isNightTime();
  }
}
