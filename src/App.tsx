import React, { useState, useEffect } from 'react';
import { UserProfile, PracticeLog, AppAdminConfig } from './types';
import { StorageService } from './services/storageService';
import { getTodayVerse } from './data/versesData';
import { Navbar } from './components/Navbar';
import { TrialBanner } from './components/TrialBanner';
import { DailyVerseCard } from './components/DailyVerseCard';
import { PrayersSection } from './components/PrayersSection';
import { MeditationSection } from './components/MeditationSection';
import { PracticeTimer } from './components/PracticeTimer';
import { PsalmsSection } from './components/PsalmsSection';
import { StudySection } from './components/StudySection';
import { ProgressDashboard } from './components/ProgressDashboard';
import { KiwifyCheckoutModal } from './components/KiwifyCheckoutModal';
import { MorningNotificationModal } from './components/MorningNotificationModal';
import { OfflineLockedModal } from './components/OfflineLockedModal';
import { AdminPanelModal } from './components/AdminPanelModal';
import { AndroidInstallModal } from './components/AndroidInstallModal';
import { usePWAInstall } from './hooks/usePWAInstall';
import { useTheme } from './hooks/useTheme';
import { soundService } from './services/soundService';
import { Bell, ShieldAlert, Sparkles, X, Instagram, ExternalLink, Smartphone, Download, Sun, Moon } from 'lucide-react';

export default function App() {
  const { theme, isDark, setTheme } = useTheme();
  const [profile, setProfile] = useState<UserProfile>(StorageService.getProfile());
  const [practiceLogs, setPracticeLogs] = useState<PracticeLog[]>(StorageService.getPracticeLogs());
  const [activeTab, setActiveTab] = useState<'inicio' | 'meditacao' | 'salmos' | 'cronometro' | 'estudos' | 'progresso'>('inicio');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isAndroidModalOpen, setIsAndroidModalOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(StorageService.isAdminLoggedIn());
  const [adminConfig, setAdminConfig] = useState<AppAdminConfig>(StorageService.getAdminConfig());
  const [dismissBanner, setDismissBanner] = useState(false);
  const [offlineModalInfo, setOfflineModalInfo] = useState<{ isOpen: boolean; title?: string }>({
    isOpen: false
  });

  const { isInstallable, isInstalled, install: installPWA } = usePWAInstall();

  // Selected date for devotional browsing (defaults to today)
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [verseRefreshTrigger, setVerseRefreshTrigger] = useState(0);

  const currentVerse = getTodayVerse(selectedDate);

  // Initialize profile and config
  useEffect(() => {
    const current = StorageService.getProfile();
    setProfile(current);
    setIsAdmin(StorageService.isAdminLoggedIn());
    setAdminConfig(StorageService.getAdminConfig());
  }, []);

  const handleSimulateDay = (day: number) => {
    const updated = StorageService.simulateTrialDay(day);
    setProfile(updated);
  };

  const handleActivateSubscription = (code?: string) => {
    const updated = StorageService.activatePremium(code);
    setProfile(updated);
  };

  const handleToggleFavorite = (id: string) => {
    StorageService.toggleFavorite(id);
    setProfile(StorageService.getProfile());
  };

  const handleToggleOffline = (id: string, title?: string) => {
    if (profile.subscriptionStatus !== 'premium') {
      setOfflineModalInfo({ isOpen: true, title });
      soundService.playChime(440, 1.2);
      return;
    }
    StorageService.toggleOfflineSave(id);
    setProfile(StorageService.getProfile());
  };

  const handleRefreshLogs = () => {
    setPracticeLogs(StorageService.getPracticeLogs());
    setProfile(StorageService.getProfile());
  };

  const handleVerseUpdated = () => {
    setVerseRefreshTrigger((prev) => prev + 1);
    setAdminConfig(StorageService.getAdminConfig());
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-100/60 dark:bg-stone-950 text-stone-900 dark:text-stone-100 font-sans selection:bg-amber-200 dark:selection:bg-amber-800 pb-20 lg:pb-0 transition-colors duration-200">
      {/* Admin Announcement Banner if configured by administrator */}
      {adminConfig.announcementActive && adminConfig.announcementBanner && !dismissBanner && (
        <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 text-white px-4 py-2 text-xs font-semibold shadow-sm flex items-center justify-between">
          <div className="max-w-6xl mx-auto flex items-center justify-between w-full gap-2">
            <span className="flex items-center gap-2">
              <Bell className="w-3.5 h-3.5 text-amber-200 animate-bounce" />
              <span>{adminConfig.announcementBanner}</span>
            </span>
            <button
              onClick={() => setDismissBanner(true)}
              className="text-amber-200 hover:text-white p-1"
              title="Dispensar aviso"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 3-Day Trial / Kiwify Status Banner */}
      <TrialBanner
        profile={profile}
        onOpenCheckout={() => setIsCheckoutOpen(true)}
        onSimulateDay={handleSimulateDay}
      />

      {/* Main Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        profile={profile}
        onOpenCheckout={() => setIsCheckoutOpen(true)}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
        onOpenAndroidInstall={() => setIsAndroidModalOpen(true)}
        isAdmin={isAdmin}
        instagramUrl={adminConfig.instagramUrl}
        currentTheme={theme}
        isEffectiveDark={isDark}
        onThemeChange={setTheme}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {activeTab === 'inicio' && (
          <div className="space-y-8 animate-fadeIn" key={verseRefreshTrigger}>
            {/* Daily Morning Verse Card */}
            <section aria-label="Versículo do Dia">
              <DailyVerseCard
                verse={currentVerse}
                selectedDate={selectedDate}
                onSelectDate={(newDate) => setSelectedDate(newDate)}
                onOpenNotificationModal={() => setIsNotificationOpen(true)}
                isFavorite={profile.favoriteIds.includes(currentVerse.id)}
                onToggleFavorite={() => handleToggleFavorite(currentVerse.id)}
                isOfflineSaved={profile.savedOfflineIds.includes(currentVerse.id)}
                onToggleOffline={handleToggleOffline}
                isPremium={profile.subscriptionStatus === 'premium'}
              />
            </section>

            {/* Prayers Section */}
            <section aria-label="Orações da Manhã e para Acalmar a Alma">
              <div className="mb-4">
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-950">
                  Orações Diárias &amp; Paz na Alma
                </h2>
                <p className="text-xs sm:text-sm text-stone-600">
                  Orações consagradas para a manhã, para acalmar a ansiedade e para fechar a noite em paz.
                </p>
              </div>

              <PrayersSection
                profile={profile}
                onOpenCheckout={() => setIsCheckoutOpen(true)}
                onToggleFavorite={handleToggleFavorite}
                onToggleOffline={handleToggleOffline}
              />
            </section>

            {/* Instagram Official Community Banner */}
            <section
              id="instagram-community-banner"
              aria-label="Siga no Instagram"
              className="bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 text-stone-100 rounded-3xl p-6 sm:p-7 border border-stone-800 shadow-xl relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5"
            >
              <div className="flex items-center gap-4">
                <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-amber-500 via-pink-600 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-pink-900/40 shrink-0">
                  <Instagram className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-pink-300 bg-pink-500/20 px-2.5 py-0.5 rounded-full border border-pink-500/30">
                      Instagram Oficial
                    </span>
                    <span className="text-xs text-amber-200/90 font-mono font-semibold">
                      {adminConfig.instagramHandle || '@verdadeiraluzcaminho'}
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-lg sm:text-xl text-amber-100">
                    Siga o Verdadeira Luz Caminho
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-300 max-w-xl leading-relaxed mt-0.5">
                    Receba orações em vídeo, mensagens bíblicas de conforto, salmos diários e palavras edificantes para transformar a sua rotina com Deus.
                  </p>
                </div>
              </div>

              <a
                id="btn-instagram-home-follow"
                href={adminConfig.instagramUrl || 'https://www.instagram.com/verdadeiraluzcaminho?stkn=YXB6ZG51czJuZjNm'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-pink-600 via-rose-600 to-amber-600 hover:from-pink-500 hover:to-amber-500 text-white font-bold text-xs shadow-lg shadow-pink-900/30 transition transform active:scale-95 shrink-0"
              >
                <Instagram className="w-4 h-4" />
                <span>Seguir no Instagram</span>
                <ExternalLink className="w-3.5 h-3.5 text-white/80" />
              </a>
            </section>

            {/* Android PWA Install Banner */}
            <section
              id="android-install-banner"
              aria-label="Instalar no Android"
              className="bg-gradient-to-r from-emerald-950 via-stone-900 to-emerald-950 text-stone-100 rounded-3xl p-6 sm:p-7 border border-emerald-800/40 shadow-xl relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5"
            >
              <div className="flex items-center gap-4">
                <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-amber-500 text-white flex items-center justify-center shadow-lg shadow-emerald-950/50 shrink-0">
                  <Smartphone className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-300 bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                      Disponível para Celular
                    </span>
                    <span className="text-xs text-emerald-200/90 font-medium">
                      App Android Oficial (PWA / APK)
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-lg sm:text-xl text-amber-100">
                    Instale o Palavra &amp; Paz no seu Android
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-300 max-w-xl leading-relaxed mt-0.5">
                    Instale como aplicativo nativo no seu smartphone para acessar com um toque na tela inicial, ouvir áudios e praticar suas orações em tela cheia e offline.
                  </p>
                </div>
              </div>

              <button
                id="btn-android-home-install"
                onClick={() => setIsAndroidModalOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/40 transition transform active:scale-95 shrink-0 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>{isInstalled ? 'Opções do App Android' : 'Instalar App Android'}</span>
              </button>
            </section>
          </div>
        )}

        {activeTab === 'meditacao' && (
          <div className="animate-fadeIn">
            <MeditationSection
              profile={profile}
              onOpenCheckout={() => setIsCheckoutOpen(true)}
              onLogCompleted={handleRefreshLogs}
            />
          </div>
        )}

        {activeTab === 'salmos' && (
          <div className="animate-fadeIn">
            <PsalmsSection
              profile={profile}
              onOpenCheckout={() => setIsCheckoutOpen(true)}
              onToggleFavorite={handleToggleFavorite}
              onToggleOffline={handleToggleOffline}
            />
          </div>
        )}

        {activeTab === 'cronometro' && (
          <div className="animate-fadeIn">
            <PracticeTimer
              profile={profile}
              onLogSaved={handleRefreshLogs}
            />
          </div>
        )}

        {activeTab === 'estudos' && (
          <div className="animate-fadeIn">
            <StudySection
              profile={profile}
              onOpenCheckout={() => setIsCheckoutOpen(true)}
              onToggleOffline={handleToggleOffline}
            />
          </div>
        )}

        {activeTab === 'progresso' && (
          <div className="animate-fadeIn">
            <ProgressDashboard
              profile={profile}
              practiceLogs={practiceLogs}
              onProfileUpdate={(updated) => setProfile(updated)}
              onOpenCheckout={() => setIsCheckoutOpen(true)}
              onOpenAdmin={() => setIsAdminModalOpen(true)}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/90 py-6 text-xs text-stone-500 dark:text-stone-400 transition-colors">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
            <span>
              &copy; {new Date().getFullYear()} <strong className="text-stone-700 dark:text-stone-200">Palavra &amp; Paz</strong> &bull; Devocional Diário Cristão
            </span>
            <a
              id="footer-btn-instagram"
              href={adminConfig.instagramUrl || 'https://www.instagram.com/verdadeiraluzcaminho?stkn=YXB6ZG51czJuZjNm'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-stone-700 dark:text-stone-300 hover:text-pink-600 dark:hover:text-pink-400 font-medium transition bg-stone-100 dark:bg-stone-800 hover:bg-pink-50 dark:hover:bg-pink-950/40 px-2.5 py-1 rounded-lg border border-stone-200 dark:border-stone-700 hover:border-pink-200"
              title="Siga no Instagram @verdadeiraluzcaminho"
            >
              <Instagram className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400" />
              <span>Siga @verdadeiraluzcaminho</span>
            </a>
          </div>
          <div className="flex items-center flex-wrap justify-center gap-4">
            {/* Quick theme toggle button in footer */}
            <button
              id="footer-btn-theme"
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className="text-stone-600 dark:text-stone-300 hover:text-amber-700 dark:hover:text-amber-300 font-medium flex items-center gap-1 transition cursor-pointer"
              title={`Alternar tema: atualmente em modo ${isDark ? 'escuro' : 'claro'}`}
            >
              {isDark ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>Modo Claro</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-amber-500" />
                  <span>Modo Noturno</span>
                </>
              )}
            </button>

            <button
              id="footer-btn-android"
              onClick={() => setIsAndroidModalOpen(true)}
              className="text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300 font-semibold flex items-center gap-1 transition"
              title="Instalar Palavra &amp; Paz no celular Android"
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Instalar App Android</span>
            </button>
            <button
              onClick={() => setIsCheckoutOpen(true)}
              className="text-amber-800 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-300 font-semibold hover:underline flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Assinatura Kiwify (R$ 14,90/mês)</span>
            </button>
            <button
              onClick={() => setIsNotificationOpen(true)}
              className="text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 transition"
            >
              Lembretes Matinais
            </button>
            <button
              id="footer-btn-admin"
              onClick={() => setIsAdminModalOpen(true)}
              className="text-stone-400 hover:text-amber-800 dark:hover:text-amber-300 transition flex items-center gap-1 font-semibold"
              title="Painel do Administrador"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Acesso ADM</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Android PWA Install Modal */}
      <AndroidInstallModal
        isOpen={isAndroidModalOpen}
        onClose={() => setIsAndroidModalOpen(false)}
        isInstallable={isInstallable}
        isInstalled={isInstalled}
        onInstall={installPWA}
      />

      {/* Admin Panel Modal */}
      <AdminPanelModal
        isOpen={isAdminModalOpen}
        onClose={() => {
          setIsAdminModalOpen(false);
          setIsAdmin(StorageService.isAdminLoggedIn());
          setAdminConfig(StorageService.getAdminConfig());
        }}
        profile={profile}
        onProfileUpdate={(updated) => setProfile(updated)}
        onVerseUpdated={handleVerseUpdated}
      />

      {/* Kiwify Paywall & Subscription Modal */}
      <KiwifyCheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        profile={profile}
        onActivateSubscription={handleActivateSubscription}
      />

      {/* Morning Notification Setup Modal */}
      <MorningNotificationModal
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />

      {/* Offline Access Locked Modal */}
      <OfflineLockedModal
        isOpen={offlineModalInfo.isOpen}
        onClose={() => setOfflineModalInfo({ isOpen: false })}
        onOpenCheckout={() => setIsCheckoutOpen(true)}
        itemTitle={offlineModalInfo.title}
      />
    </div>
  );
}
