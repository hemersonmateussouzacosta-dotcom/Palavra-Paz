import React, { useState, useEffect } from 'react';
import { UserProfile, PracticeLog } from './types';
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
import { soundService } from './services/soundService';

export default function App() {
  const [profile, setProfile] = useState<UserProfile>(StorageService.getProfile());
  const [practiceLogs, setPracticeLogs] = useState<PracticeLog[]>(StorageService.getPracticeLogs());
  const [activeTab, setActiveTab] = useState<'inicio' | 'meditacao' | 'salmos' | 'cronometro' | 'estudos' | 'progresso'>('inicio');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [offlineModalInfo, setOfflineModalInfo] = useState<{ isOpen: boolean; title?: string }>({
    isOpen: false
  });

  const todayVerse = getTodayVerse();

  // Check if trial expired on initial load
  useEffect(() => {
    const current = StorageService.getProfile();
    setProfile(current);
    if (current.subscriptionStatus === 'expired') {
      setIsCheckoutOpen(true);
    }
  }, []);

  const handleSimulateDay = (day: number) => {
    const updated = StorageService.simulateTrialDay(day);
    setProfile(updated);
    if (updated.subscriptionStatus === 'expired') {
      setIsCheckoutOpen(true);
    }
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

  return (
    <div className="min-h-screen flex flex-col bg-stone-100/60 text-stone-900 font-sans selection:bg-amber-200">
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
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {activeTab === 'inicio' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Daily Morning Verse Card */}
            <section aria-label="Versículo do Dia">
              <DailyVerseCard
                verse={todayVerse}
                onOpenNotificationModal={() => setIsNotificationOpen(true)}
                isFavorite={profile.favoriteIds.includes(todayVerse.id)}
                onToggleFavorite={() => handleToggleFavorite(todayVerse.id)}
                isOfflineSaved={profile.savedOfflineIds.includes(todayVerse.id)}
                onToggleOffline={handleToggleOffline}
                isPremium={profile.subscriptionStatus === 'premium'}
              />
            </section>

            {/* Prayers Section */}
            <section aria-label="Orações da Manhã e para Acalmar a Alma">
              <div className="mb-4">
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-950">
                  Orações Diárias & Paz na Alma
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
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-stone-200 bg-white py-6 text-center text-xs text-stone-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            &copy; {new Date().getFullYear()} <strong>Palavra & Paz</strong> &bull; Devocional Diário Cristão
          </span>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsCheckoutOpen(true)}
              className="text-amber-800 font-semibold hover:underline"
            >
              Assinatura Kiwify (R$ 14,90/mês)
            </button>
            <button
              onClick={() => setIsNotificationOpen(true)}
              className="text-stone-500 hover:text-stone-800 transition"
            >
              Lembretes Matinais
            </button>
          </div>
        </div>
      </footer>

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
