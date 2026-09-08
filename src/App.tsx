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
import { soundService } from './services/soundService';
import { Bell, ShieldAlert, Sparkles, X } from 'lucide-react';

export default function App() {
  const [profile, setProfile] = useState<UserProfile>(StorageService.getProfile());
  const [practiceLogs, setPracticeLogs] = useState<PracticeLog[]>(StorageService.getPracticeLogs());
  const [activeTab, setActiveTab] = useState<'inicio' | 'meditacao' | 'salmos' | 'cronometro' | 'estudos' | 'progresso'>('inicio');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(StorageService.isAdminLoggedIn());
  const [adminConfig, setAdminConfig] = useState<AppAdminConfig>(StorageService.getAdminConfig());
  const [dismissBanner, setDismissBanner] = useState(false);
  const [offlineModalInfo, setOfflineModalInfo] = useState<{ isOpen: boolean; title?: string }>({
    isOpen: false
  });

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
    <div className="min-h-screen flex flex-col bg-stone-100/60 text-stone-900 font-sans selection:bg-amber-200 pb-20 lg:pb-0">
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
        isAdmin={isAdmin}
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
      <footer className="mt-auto border-t border-stone-200 bg-white py-6 text-center text-xs text-stone-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>
            &copy; {new Date().getFullYear()} <strong>Palavra &amp; Paz</strong> &bull; Devocional Diário Cristão
          </span>
          <div className="flex items-center flex-wrap justify-center gap-4">
            <button
              onClick={() => setIsCheckoutOpen(true)}
              className="text-amber-800 font-semibold hover:underline flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Assinatura Kiwify (R$ 14,90/mês)</span>
            </button>
            <button
              onClick={() => setIsNotificationOpen(true)}
              className="text-stone-500 hover:text-stone-800 transition"
            >
              Lembretes Matinais
            </button>
            <button
              id="footer-btn-admin"
              onClick={() => setIsAdminModalOpen(true)}
              className="text-stone-400 hover:text-amber-800 transition flex items-center gap-1 font-semibold"
              title="Painel do Administrador"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
              <span>Acesso ADM</span>
            </button>
          </div>
        </div>
      </footer>

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
