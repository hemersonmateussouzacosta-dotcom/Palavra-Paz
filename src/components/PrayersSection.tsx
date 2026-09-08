import React, { useState } from 'react';
import { Lock, Sparkles, Volume2, VolumeX, Heart, Share2, Check, Sun, Moon, Wind, ArrowRight, Download, ShieldCheck, AlertCircle } from 'lucide-react';
import { Prayer, PrayerCategory, UserProfile } from '../types';
import { PRAYERS_DATA } from '../data/prayersData';
import { audioSpeechService } from '../services/audioSpeechService';
import { soundService } from '../services/soundService';
import { StorageService } from '../services/storageService';
import { SimulatedAdBanner } from './SimulatedAdBanner';

interface PrayersSectionProps {
  profile: UserProfile;
  onOpenCheckout: () => void;
  onToggleFavorite: (id: string) => void;
  onToggleOffline: (id: string, title?: string) => void;
}

export const PrayersSection: React.FC<PrayersSectionProps> = ({
  profile,
  onOpenCheckout,
  onToggleFavorite,
  onToggleOffline
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'todas' | 'gratuitas' | 'manha' | 'acalmar_alma' | 'tarde_noite'>('todas');
  const [activePrayer, setActivePrayer] = useState<Prayer | null>(null);
  const [lockedPrayerPreview, setLockedPrayerPreview] = useState<Prayer | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [fontSize, setFontSize] = useState<'normal' | 'grande'>('normal');
  const [copied, setCopied] = useState(false);

  const isPremium = profile.subscriptionStatus === 'premium';

  // Filter prayers
  const filteredPrayers = PRAYERS_DATA.filter((prayer) => {
    if (selectedFilter === 'todas') return true;
    if (selectedFilter === 'gratuitas') return !prayer.isPremium;
    if (selectedFilter === 'manha') return prayer.category === 'manha';
    if (selectedFilter === 'acalmar_alma') return prayer.category === 'acalmar_alma';
    if (selectedFilter === 'tarde_noite') return prayer.category === 'tarde_noite';
    return true;
  });

  const handleOpenPrayer = (prayer: Prayer) => {
    // Record view in admin history
    StorageService.recordView({
      type: 'oracao',
      title: prayer.title,
      subtitle: prayer.biblicalRef,
      category: prayer.category,
      metadata: {
        isPremiumContent: prayer.isPremium
      }
    });

    // If locked for the user
    const isLocked = !isPremium && prayer.isPremium;
    if (isLocked) {
      setLockedPrayerPreview(prayer);
      soundService.playChime(440, 1.2);
      return;
    }

    setActivePrayer(prayer);
    soundService.playChime(528, 1.5);
  };

  const handleToggleNarration = () => {
    if (!activePrayer) return;
    if (isSpeaking) {
      audioSpeechService.stop();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      soundService.playChime(528, 2);
      StorageService.recordView({
        type: 'audio',
        title: `Áudio: ${activePrayer.title}`,
        subtitle: `Narração de voz (${activePrayer.durationMinutes} min)`,
        category: activePrayer.category
      });
      audioSpeechService.speak(`${activePrayer.title}. ${activePrayer.text}`, () => {
        setIsSpeaking(false);
      });
    }
  };

  const handleCloseModal = () => {
    audioSpeechService.stop();
    setIsSpeaking(false);
    setActivePrayer(null);
  };

  const handleShare = async () => {
    if (!activePrayer) return;
    const text = `🙏 *${activePrayer.title}*\n\n${activePrayer.text}\n\n📖 ${activePrayer.biblicalRef}\n(Lido no Palavra & Paz Devocional)`;
    try {
      if (navigator.share) {
        await navigator.share({ title: activePrayer.title, text });
      } else {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div id="prayers-section" className="space-y-6">
      {/* Free Tier vs Premium Information Banner */}
      {!isPremium && (
        <div className="bg-gradient-to-r from-amber-50 via-white to-amber-100/60 border border-amber-200/90 rounded-2xl p-4 sm:p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-200 text-amber-900 px-2 py-0.5 rounded-md">
                  Versão Gratuita (Free Tier)
                </span>
                <span className="text-xs text-stone-500">Acesso Parcial</span>
              </div>
              <p className="text-xs sm:text-sm text-stone-700">
                Você tem acesso a <strong>1 oração da manhã e 1 da tarde</strong> gratuitas com anúncios recorrentes. As orações profundas para <strong>acalmar a alma, cura de ansiedade e orações noturnas</strong> são exclusivas para assinantes Kiwify.
              </p>
            </div>
            <button
              onClick={onOpenCheckout}
              className="shrink-0 bg-amber-600 hover:bg-amber-700 active:scale-95 text-white font-bold py-2 px-4 rounded-xl shadow transition text-xs flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              <span>Desbloquear Tudo por R$ 14,90</span>
            </button>
          </div>
        </div>
      )}

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
        <button
          onClick={() => setSelectedFilter('todas')}
          className={`px-3.5 py-1.5 rounded-full font-semibold whitespace-nowrap transition ${
            selectedFilter === 'todas'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
          }`}
        >
          Todas as Orações
        </button>

        <button
          onClick={() => setSelectedFilter('gratuitas')}
          className={`px-3.5 py-1.5 rounded-full font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
            selectedFilter === 'gratuitas'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
          }`}
        >
          <Check className="w-3 h-3" />
          <span>Orações Gratuitas (Abertas)</span>
        </button>

        <button
          onClick={() => setSelectedFilter('manha')}
          className={`px-3.5 py-1.5 rounded-full font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
            selectedFilter === 'manha'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
          }`}
        >
          <Sun className="w-3.5 h-3.5 text-amber-500" />
          <span>Orações da Manhã</span>
        </button>

        <button
          onClick={() => setSelectedFilter('acalmar_alma')}
          className={`px-3.5 py-1.5 rounded-full font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
            selectedFilter === 'acalmar_alma'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
          }`}
        >
          <Wind className="w-3.5 h-3.5 text-emerald-500" />
          <span>Acalmar a Alma (Kiwify)</span>
        </button>

        <button
          onClick={() => setSelectedFilter('tarde_noite')}
          className={`px-3.5 py-1.5 rounded-full font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
            selectedFilter === 'tarde_noite'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
          }`}
        >
          <Moon className="w-3.5 h-3.5 text-indigo-500" />
          <span>Tarde & Noite</span>
        </button>
      </div>

      {/* Prayers Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPrayers.map((prayer) => {
          const isLocked = !isPremium && prayer.isPremium;
          const isFreeOption = !prayer.isPremium;

          return (
            <div
              key={prayer.id}
              onClick={() => handleOpenPrayer(prayer)}
              className={`group relative rounded-2xl p-5 border transition cursor-pointer flex flex-col justify-between ${
                isLocked
                  ? 'bg-stone-100/90 border-stone-300 text-stone-700 hover:border-amber-400 hover:shadow-sm'
                  : 'bg-white border-amber-100/90 text-stone-800 hover:shadow-md hover:border-amber-300'
              }`}
            >
              <div>
                {/* Header badges */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                      prayer.category === 'manha'
                        ? 'bg-amber-100 text-amber-900'
                        : prayer.category === 'acalmar_alma'
                        ? 'bg-emerald-100 text-emerald-900'
                        : 'bg-indigo-100 text-indigo-900'
                    }`}
                  >
                    {prayer.category === 'manha'
                      ? 'Manhã'
                      : prayer.category === 'acalmar_alma'
                      ? 'Acalmar Alma'
                      : 'Tarde / Noite'}
                  </span>

                  {isLocked ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-950 bg-amber-200 px-2 py-0.5 rounded-full border border-amber-300 shadow-xs">
                      <Lock className="w-3 h-3 text-amber-800" />
                      <span>Bloqueado no Grátis</span>
                    </span>
                  ) : (
                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                      {isFreeOption && !isPremium ? 'Gratuito (Com Anúncios)' : 'Liberado'}
                    </span>
                  )}
                </div>

                {/* Title and summary */}
                <h3 className="font-serif font-bold text-base sm:text-lg text-stone-900 mb-1.5 group-hover:text-amber-700 transition">
                  {prayer.title}
                </h3>
                <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed mb-3">
                  {prayer.summary}
                </p>
              </div>

              {/* Footer row */}
              <div className="pt-3 border-t border-stone-200/60 flex items-center justify-between text-xs text-stone-500">
                <span className="text-[11px] font-medium text-amber-800">
                  {prayer.biblicalRef}
                </span>

                <div className="flex items-center gap-1.5">
                  {isLocked ? (
                    <span className="text-amber-900 font-bold flex items-center gap-1 text-xs">
                      Desbloquear <ArrowRight className="w-3 h-3" />
                    </span>
                  ) : (
                    <span className="text-stone-700 font-semibold group-hover:text-amber-700 flex items-center gap-1 text-xs">
                      Orar agora &rarr;
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Locked Prayer Upgrade Teaser Modal */}
      {lockedPrayerPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/75 backdrop-blur-md overflow-y-auto animate-fadeIn">
          <div className="bg-stone-50 border border-amber-300 rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl relative text-stone-800 text-center my-auto">
            <button
              onClick={() => setLockedPrayerPreview(null)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-1.5 rounded-full hover:bg-stone-200 transition"
              aria-label="Fechar"
            >
              ✕
            </button>

            <div className="w-14 h-14 rounded-2xl bg-amber-100 border border-amber-300 text-amber-800 flex items-center justify-center mx-auto mb-3">
              <Lock className="w-7 h-7" />
            </div>

            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 bg-amber-200 px-3 py-1 rounded-full inline-block mb-2">
              Conteúdo Exclusivo Kiwify Premium
            </span>

            <h3 className="font-serif text-xl font-bold text-stone-950 mb-1.5">
              {lockedPrayerPreview.title}
            </h3>

            <p className="text-xs text-stone-600 mb-4 leading-relaxed">
              Esta oração para {lockedPrayerPreview.category === 'acalmar_alma' ? 'acalmar a ansiedade e trazer paz interior' : 'fortalecimento espiritual'} faz parte do acervo premium de orações sem cortes.
            </p>

            <div className="bg-white border border-stone-200 rounded-xl p-3.5 mb-5 text-left text-xs space-y-1.5">
              <strong className="text-stone-900 font-bold block mb-1">
                No Plano Kiwify você tem:
              </strong>
              <div className="flex items-center gap-2 text-stone-700">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Todas as orações matinais, de cura e noturnas</span>
              </div>
              <div className="flex items-center gap-2 text-stone-700">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Todos os 150 Salmos completos narrados</span>
              </div>
              <div className="flex items-center gap-2 text-stone-700">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Acesso offline sem necessidade de internet</span>
              </div>
              <div className="flex items-center gap-2 text-stone-700">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Sem anúncios recorrentes</span>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => {
                  setLockedPrayerPreview(null);
                  onOpenCheckout();
                }}
                className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2 text-sm"
              >
                <Sparkles className="w-4 h-4" />
                <span>Assinar no Kiwify por R$ 14,90/mês</span>
              </button>

              <button
                onClick={() => setLockedPrayerPreview(null)}
                className="w-full py-2 text-xs text-stone-500 hover:text-stone-700 transition"
              >
                Continuar nas orações gratuitas
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reader Modal for Open Prayers */}
      {activePrayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/70 backdrop-blur-sm overflow-y-auto animate-fadeIn">
          <div className="bg-stone-50 border border-stone-300 rounded-3xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl relative text-stone-800 my-auto">
            {/* Modal Top Bar */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-200">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2.5 py-1 rounded-md">
                {activePrayer.category === 'manha'
                  ? 'Oração da Manhã'
                  : activePrayer.category === 'acalmar_alma'
                  ? 'Acalmar a Alma'
                  : 'Tarde & Noite'}
              </span>

              <div className="flex items-center gap-2">
                {/* Font size toggle */}
                <button
                  onClick={() => setFontSize(fontSize === 'normal' ? 'grande' : 'normal')}
                  className="px-2 py-1 text-xs font-semibold rounded border border-stone-300 text-stone-600 hover:bg-stone-100"
                  title="Alterar tamanho da fonte para leitura confortável"
                >
                  {fontSize === 'normal' ? 'A+' : 'A-'}
                </button>

                {/* Offline save */}
                <button
                  onClick={() => onToggleOffline(activePrayer.id, activePrayer.title)}
                  className={`p-1.5 rounded-lg border text-xs transition ${
                    profile.savedOfflineIds.includes(activePrayer.id)
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                      : 'border-stone-300 text-stone-500 hover:bg-stone-100'
                  }`}
                  title={
                    profile.savedOfflineIds.includes(activePrayer.id)
                      ? 'Salvo para leitura offline'
                      : 'Salvar offline (Recurso Kiwify)'
                  }
                >
                  <Download className="w-4 h-4" />
                </button>

                {/* Favorite */}
                <button
                  onClick={() => onToggleFavorite(activePrayer.id)}
                  className={`p-1.5 rounded-lg border text-xs transition ${
                    profile.favoriteIds.includes(activePrayer.id)
                      ? 'bg-rose-50 border-rose-300 text-rose-600'
                      : 'border-stone-300 text-stone-500 hover:bg-stone-100'
                  }`}
                  title="Favoritar oração"
                >
                  <Heart className={`w-4 h-4 ${profile.favoriteIds.includes(activePrayer.id) ? 'fill-current' : ''}`} />
                </button>

                {/* Close modal */}
                <button
                  onClick={handleCloseModal}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition"
                  aria-label="Fechar"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Title & Biblical Ref */}
            <div className="mb-2">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 mb-1">
                {activePrayer.title}
              </h2>
              <p className="text-xs font-semibold text-amber-800">
                Base Bíblica: {activePrayer.biblicalRef} &bull; Tempo sugerido: {activePrayer.durationMinutes} min
              </p>
            </div>

            {/* Recurring Ad Ticker for Free Users during reading sessions */}
            {!isPremium && (
              <SimulatedAdBanner onUpgradeClick={onOpenCheckout} variant="recurring-ticker" />
            )}

            {/* Prayer Text Content */}
            <div
              className={`font-serif text-stone-800 leading-relaxed whitespace-pre-line my-4 p-4 sm:p-6 bg-white rounded-2xl border border-stone-200 shadow-inner ${
                fontSize === 'grande' ? 'text-lg sm:text-xl' : 'text-sm sm:text-base'
              }`}
            >
              {activePrayer.text}
            </div>

            {/* Bottom recurring card ad for free reading experience */}
            {!isPremium && (
              <SimulatedAdBanner onUpgradeClick={onOpenCheckout} variant="card" />
            )}

            {/* Action buttons */}
            <div className="flex items-center justify-between flex-wrap gap-2 pt-3 border-t border-stone-200">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleToggleNarration}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition shadow-sm ${
                    isSpeaking
                      ? 'bg-amber-600 text-white animate-pulse'
                      : 'bg-amber-100 hover:bg-amber-200 text-amber-900'
                  }`}
                >
                  {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  <span>{isSpeaking ? 'Parar Voz' : 'Ouvir Narração em Voz Alta'}</span>
                </button>

                <button
                  onClick={handleShare}
                  className="p-2 rounded-xl border border-stone-300 text-stone-600 hover:bg-stone-100 text-xs font-medium flex items-center gap-1.5 transition"
                  title="Copiar texto da oração"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                  <span className="hidden sm:inline">Compartilhar</span>
                </button>
              </div>

              <button
                onClick={handleCloseModal}
                className="py-2 px-5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold shadow transition"
              >
                Concluir Oração
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
