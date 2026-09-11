import React, { useState } from 'react';
import { Lock, Sparkles, Volume2, VolumeX, Heart, Share2, Check, Sun, Moon, Wind, ArrowRight, Download, ShieldCheck, AlertCircle } from 'lucide-react';
import { Prayer, PrayerCategory, UserProfile } from '../types';
import { PRAYERS_DATA } from '../data/prayersData';
import { audioSpeechService } from '../services/audioSpeechService';
import { soundService } from '../services/soundService';
import { StorageService } from '../services/storageService';

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
  const [selectedFilter, setSelectedFilter] = useState<'todas' | 'manha' | 'acalmar_alma' | 'tarde_noite'>('todas');
  const [activePrayer, setActivePrayer] = useState<Prayer | null>(null);
  const [playingPrayerId, setPlayingPrayerId] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [fontSize, setFontSize] = useState<'normal' | 'grande'>('normal');
  const [copied, setCopied] = useState(false);

  // Filter prayers
  const filteredPrayers = PRAYERS_DATA.filter((prayer) => {
    if (selectedFilter === 'todas') return true;
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
        isPremiumContent: false
      }
    });

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

  const handleToggleCardAudio = (prayer: Prayer, e: React.MouseEvent) => {
    e.stopPropagation();
    if (playingPrayerId === prayer.id) {
      audioSpeechService.stop();
      setPlayingPrayerId(null);
    } else {
      setPlayingPrayerId(prayer.id);
      soundService.playChime(528, 1.5);
      StorageService.recordView({
        type: 'audio',
        title: `Áudio: ${prayer.title}`,
        subtitle: `Narração de voz (${prayer.durationMinutes} min)`,
        category: prayer.category
      });
      audioSpeechService.speak(`Oração: ${prayer.title}. ${prayer.text}`, () => {
        setPlayingPrayerId(null);
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
      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
        <button
          onClick={() => setSelectedFilter('todas')}
          className={`px-3.5 py-1.5 rounded-full font-semibold whitespace-nowrap transition cursor-pointer ${
            selectedFilter === 'todas'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          Todas as Orações
        </button>

        <button
          onClick={() => setSelectedFilter('manha')}
          className={`px-3.5 py-1.5 rounded-full font-semibold whitespace-nowrap transition flex items-center gap-1.5 cursor-pointer ${
            selectedFilter === 'manha'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <Sun className="w-3.5 h-3.5 text-amber-500" />
          <span>Orações da Manhã</span>
        </button>

        <button
          onClick={() => setSelectedFilter('acalmar_alma')}
          className={`px-3.5 py-1.5 rounded-full font-semibold whitespace-nowrap transition flex items-center gap-1.5 cursor-pointer ${
            selectedFilter === 'acalmar_alma'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <Wind className="w-3.5 h-3.5 text-emerald-500" />
          <span>Acalmar a Alma</span>
        </button>

        <button
          onClick={() => setSelectedFilter('tarde_noite')}
          className={`px-3.5 py-1.5 rounded-full font-semibold whitespace-nowrap transition flex items-center gap-1.5 cursor-pointer ${
            selectedFilter === 'tarde_noite'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <Moon className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
          <span>Tarde &amp; Noite</span>
        </button>
      </div>

      {/* Prayers Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPrayers.map((prayer) => {
          const isThisPlaying = playingPrayerId === prayer.id;

          return (
            <div
              key={prayer.id}
              onClick={() => handleOpenPrayer(prayer)}
              className="group relative rounded-2xl p-5 border transition cursor-pointer flex flex-col justify-between bg-white dark:bg-stone-900 border-amber-100/90 dark:border-stone-800 text-stone-800 dark:text-stone-200 hover:shadow-md hover:border-amber-300 dark:hover:border-amber-500/50"
            >
              <div>
                {/* Header badges */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                      prayer.category === 'manha'
                        ? 'bg-amber-100 dark:bg-amber-950/50 text-amber-900 dark:text-amber-200'
                        : prayer.category === 'acalmar_alma'
                        ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-200'
                        : 'bg-indigo-100 dark:bg-indigo-950/50 text-indigo-900 dark:text-indigo-200'
                    }`}
                  >
                    {prayer.category === 'manha'
                      ? 'Manhã'
                      : prayer.category === 'acalmar_alma'
                      ? 'Acalmar Alma'
                      : 'Tarde / Noite'}
                  </span>

                  <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 dark:text-emerald-300 font-bold bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-full">
                    <Volume2 className="w-2.5 h-2.5" />
                    <span>Áudio Liberado</span>
                  </span>
                </div>

                {/* Title and summary */}
                <h3 className="font-serif font-bold text-base sm:text-lg text-stone-900 dark:text-stone-100 mb-1.5 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition">
                  {prayer.title}
                </h3>
                <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-2 leading-relaxed mb-3">
                  {prayer.summary}
                </p>
              </div>

              {/* Footer row with Audio CTA and Read button */}
              <div className="pt-3 border-t border-stone-200/60 dark:border-stone-800 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
                <span className="text-[11px] font-medium text-amber-800 dark:text-amber-400 truncate max-w-[120px]">
                  {prayer.biblicalRef}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => handleToggleCardAudio(prayer, e)}
                    className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold flex items-center gap-1 transition cursor-pointer ${
                      isThisPlaying
                        ? 'bg-amber-600 text-white border-amber-600 animate-pulse'
                        : 'bg-amber-50 dark:bg-stone-800 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-stone-700 hover:bg-amber-100'
                    }`}
                    title={isThisPlaying ? 'Pausar narração em áudio' : 'Ouvir oração em áudio'}
                  >
                    {isThisPlaying ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                    <span>{isThisPlaying ? 'Pausar' : 'Áudio'}</span>
                  </button>

                  <span className="text-stone-700 dark:text-stone-300 font-semibold group-hover:text-amber-700 dark:group-hover:text-amber-400 flex items-center gap-1 text-xs">
                    Orar &rarr;
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reader Modal for Open Prayers */}
      {activePrayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/70 backdrop-blur-sm overflow-y-auto animate-fadeIn">
          <div className="bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded-3xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl relative text-stone-800 dark:text-stone-200 my-auto">
            {/* Modal Top Bar */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-200 dark:border-stone-800">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/60 px-2.5 py-1 rounded-md">
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
                  className="px-2 py-1 text-xs font-semibold rounded border border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
                  title="Alterar tamanho da fonte para leitura confortável"
                >
                  {fontSize === 'normal' ? 'A+' : 'A-'}
                </button>

                {/* Offline save */}
                <button
                  onClick={() => onToggleOffline(activePrayer.id, activePrayer.title)}
                  className={`p-1.5 rounded-lg border text-xs transition ${
                    profile.savedOfflineIds.includes(activePrayer.id)
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300'
                      : 'border-stone-300 dark:border-stone-700 text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
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
                      ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400'
                      : 'border-stone-300 dark:border-stone-700 text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
                  }`}
                  title="Favoritar oração"
                >
                  <Heart className={`w-4 h-4 ${profile.favoriteIds.includes(activePrayer.id) ? 'fill-current' : ''}`} />
                </button>

                {/* Close modal */}
                <button
                  onClick={handleCloseModal}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-800 transition"
                  aria-label="Fechar"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Title & Biblical Ref */}
            <div className="mb-2">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100 mb-1">
                {activePrayer.title}
              </h2>
              <p className="text-xs font-semibold text-amber-800 dark:text-amber-400">
                Base Bíblica: {activePrayer.biblicalRef} &bull; Tempo sugerido: {activePrayer.durationMinutes} min
              </p>
            </div>

            {/* Prayer Text Content */}
            <div
              className={`font-serif text-stone-800 dark:text-stone-100 leading-relaxed whitespace-pre-line my-4 p-4 sm:p-6 bg-white dark:bg-stone-950 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-inner dark:shadow-stone-950 ${
                fontSize === 'grande' ? 'text-lg sm:text-xl' : 'text-sm sm:text-base'
              }`}
            >
              {activePrayer.text}
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-between flex-wrap gap-2 pt-3 border-t border-stone-200 dark:border-stone-800">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleToggleNarration}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition shadow-sm ${
                    isSpeaking
                      ? 'bg-amber-600 text-white animate-pulse'
                      : 'bg-amber-100 dark:bg-amber-950/60 hover:bg-amber-200 dark:hover:bg-amber-900/60 text-amber-900 dark:text-amber-200 border border-amber-300/40 dark:border-amber-800/50'
                  }`}
                >
                  {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  <span>{isSpeaking ? 'Parar Voz' : 'Ouvir Narração em Voz Alta'}</span>
                </button>

                <button
                  onClick={handleShare}
                  className="p-2 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 text-xs font-medium flex items-center gap-1.5 transition"
                  title="Copiar texto da oração"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                  <span className="hidden sm:inline">Compartilhar</span>
                </button>
              </div>

              <button
                onClick={handleCloseModal}
                className="py-2 px-5 bg-stone-900 dark:bg-amber-600 hover:bg-stone-800 dark:hover:bg-amber-500 text-white rounded-xl text-xs font-semibold shadow transition"
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
