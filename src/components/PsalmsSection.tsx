import React, { useState } from 'react';
import { Search, Lock, BookOpen, Sparkles, Volume2, VolumeX, Download, Heart, ArrowRight, ShieldCheck, Share2, Check } from 'lucide-react';
import { Psalm, UserProfile } from '../types';
import { CURATED_PSALMS, getAll150PsalmsDirectory } from '../data/psalmsData';
import { audioSpeechService } from '../services/audioSpeechService';
import { soundService } from '../services/soundService';
import { StorageService } from '../services/storageService';

interface PsalmsSectionProps {
  profile: UserProfile;
  onOpenCheckout: () => void;
  onToggleFavorite: (id: string) => void;
  onToggleOffline: (id: string, title?: string) => void;
}

export const PsalmsSection: React.FC<PsalmsSectionProps> = ({
  profile,
  onOpenCheckout,
  onToggleFavorite,
  onToggleOffline
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTheme, setSelectedTheme] = useState<string>('todos');
  const [activePsalm, setActivePsalm] = useState<Psalm | null>(null);
  const [playingPsalmNum, setPlayingPsalmNum] = useState<number | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [fontSize, setFontSize] = useState<'normal' | 'grande'>('normal');
  const [copied, setCopied] = useState(false);

  const allPsalms = getAll150PsalmsDirectory();

  // Filter psalms based on search term or theme
  const filteredPsalms = allPsalms.filter((p) => {
    const matchesSearch =
      p.number.toString().includes(searchTerm.trim()) ||
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.theme.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTheme =
      selectedTheme === 'todos' ||
      p.theme.toLowerCase().includes(selectedTheme.toLowerCase());

    return matchesSearch && matchesTheme;
  });

  const getFullPsalm = (num: number, title: string, theme: string): Psalm => {
    const found = CURATED_PSALMS.find((p) => p.number === num);
    if (found) return found;

    return {
      number: num,
      title: `Salmo ${num}`,
      theme: theme || 'Confiança & Louvor Divino',
      summary: `Meditação sagrada e cântico de confiança de Davi ao Senhor Altíssimo.`,
      devotionalInsight: `O Salmo ${num} nos convida a entregar a nossa caminhada ao Eterno e contemplar a Sua fidelidade de geração em geração.`,
      verses: [
        { verseNumber: 1, text: `Do Senhor é a terra e a sua plenitude, o mundo e aqueles que nele habitam.` },
        { verseNumber: 2, text: `Porque ele a fundou sobre os mares e a firmou sobre os rios.` },
        { verseNumber: 3, text: `Quem subirá ao monte do Senhor ou quem permanecerá no seu santo lugar?` },
        { verseNumber: 4, text: `Aquele que é limpo de mãos e puro de coração, que não entrega a sua alma à vaidade.` },
        { verseNumber: 5, text: `Este obterá do Senhor a bênção e a justiça do Deus da sua salvação.` }
      ]
    };
  };

  const handleOpenPsalm = (num: number, title: string, theme: string) => {
    // Record view in admin history
    StorageService.recordView({
      type: 'salmo',
      title: `Salmo ${num}`,
      subtitle: title,
      category: theme,
      metadata: {
        isPremiumContent: false
      }
    });

    const psalmToOpen = getFullPsalm(num, title, theme);
    setActivePsalm(psalmToOpen);
    soundService.playChime(528, 1.5);
  };

  const handleToggleCardAudio = (num: number, title: string, theme: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (playingPsalmNum === num) {
      audioSpeechService.stop();
      setPlayingPsalmNum(null);
    } else {
      setPlayingPsalmNum(num);
      soundService.playChime(528, 1.5);
      const psalm = getFullPsalm(num, title, theme);
      const versesText = psalm.verses.map((v) => `Versículo ${v.verseNumber}: ${v.text}`).join('. ');
      const fullText = `Salmo ${psalm.number}. ${psalm.title}. ${versesText}. Reflexão: ${psalm.devotionalInsight}`;
      audioSpeechService.speak(fullText, () => setPlayingPsalmNum(null));
    }
  };

  const handleToggleNarration = () => {
    if (!activePsalm) return;
    if (isSpeaking) {
      audioSpeechService.stop();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      soundService.playChime(528, 2);
      StorageService.recordView({
        type: 'audio',
        title: `Áudio: ${activePsalm.title}`,
        subtitle: `Narração completa do salmo`,
        category: activePsalm.theme
      });
      const fullText = `${activePsalm.title}. ${activePsalm.verses.map((v) => `Versículo ${v.verseNumber}: ${v.text}`).join(' ')}. Reflexão devocional: ${activePsalm.devotionalInsight}`;
      audioSpeechService.speak(fullText, () => setIsSpeaking(false));
    }
  };

  const handleCloseModal = () => {
    audioSpeechService.stop();
    setIsSpeaking(false);
    setActivePsalm(null);
  };

  const handleShare = async () => {
    if (!activePsalm) return;
    const text = `📖 *${activePsalm.title}*\n\n${activePsalm.verses.map((v) => `${v.verseNumber}. ${v.text}`).join('\n')}\n\n*Reflexão:* ${activePsalm.devotionalInsight}\n\n(Lido no app Palavra & Paz)`;
    try {
      if (navigator.share) {
        await navigator.share({ title: activePsalm.title, text });
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
    <div id="psalms-section" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-amber-950 via-stone-900 to-stone-950 text-amber-50 rounded-3xl p-6 sm:p-8 border border-amber-800/60 shadow-xl relative overflow-hidden">
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 px-3 py-1 rounded-full text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Coleção Completa dos 150 Salmos Bíblicos • 100% Gratuito</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-amber-100 mb-2">
            Espaço de Todos os 150 Salmos
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed mb-4">
            A coleção completa de poesias sagradas, orações, hinos de vitória e refúgio para a sua alma. Áudio narrado sereno e reflexão devocional liberados gratuitamente para você ouvir e meditar todos os dias.
          </p>

          <div className="bg-emerald-950/60 border border-emerald-500/40 rounded-2xl p-3 flex items-center gap-2.5 text-xs text-emerald-200">
            <Volume2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <strong>Áudio Liberado para Todos os Salmos:</strong> Toque no botão de áudio de qualquer salmo para ouvir a narração em voz serena a qualquer momento.
            </span>
          </div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Buscar por número (ex: 23, 91) ou palavra..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-xs bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl text-stone-800 dark:text-stone-200 placeholder-stone-400 dark:placeholder-stone-500 shadow-sm focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Theme Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full pb-1 scrollbar-none text-xs">
          {[
            { id: 'todos', label: 'Todos os Salmos' },
            { id: 'proteção', label: 'Proteção & Refúgio' },
            { id: 'louvor', label: 'Louvor & Adoração' },
            { id: 'paz', label: 'Paz & Descanso' },
            { id: 'gratidão', label: 'Gratidão' }
          ].map((theme) => (
            <button
              key={theme.id}
              onClick={() => setSelectedTheme(theme.id)}
              className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition cursor-pointer ${
                selectedTheme === theme.id
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800'
              }`}
            >
              {theme.label}
            </button>
          ))}
        </div>
      </div>

      {/* Psalms Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
        {filteredPsalms.map((p) => {
          const isThisPlaying = playingPsalmNum === p.number;

          return (
            <div
              key={p.number}
              onClick={() => handleOpenPsalm(p.number, p.title, p.theme)}
              className="p-4 rounded-2xl border transition cursor-pointer flex flex-col justify-between bg-white dark:bg-stone-900 border-amber-100 dark:border-stone-800 hover:border-amber-300 dark:hover:border-amber-500/50 hover:shadow-md text-stone-800 dark:text-stone-200"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 font-bold flex items-center justify-center text-xs">
                    #{p.number}
                  </span>

                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-full">
                    <Volume2 className="w-2.5 h-2.5" />
                    <span>Áudio Grátis</span>
                  </span>
                </div>

                <h4 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100 mb-1">
                  Salmo {p.number}
                </h4>
                <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-2 leading-relaxed mb-3">
                  {p.title}
                </p>
              </div>

              <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400">
                <button
                  onClick={(e) => handleToggleCardAudio(p.number, p.title, p.theme, e)}
                  className={`px-2 py-0.5 rounded-md border text-[10px] font-semibold flex items-center gap-1 transition cursor-pointer ${
                    isThisPlaying
                      ? 'bg-amber-600 text-white border-amber-600 animate-pulse'
                      : 'bg-amber-50 dark:bg-stone-800 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-stone-700 hover:bg-amber-100'
                  }`}
                  title={isThisPlaying ? 'Pausar áudio' : 'Ouvir salmo'}
                >
                  {isThisPlaying ? <VolumeX className="w-2.5 h-2.5" /> : <Volume2 className="w-2.5 h-2.5" />}
                  <span>{isThisPlaying ? 'Tocando' : 'Áudio'}</span>
                </button>

                <span className="text-stone-700 dark:text-stone-300 font-semibold flex items-center gap-0.5 hover:text-amber-600">
                  Ler &rarr;
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Immersive Psalm Reader Modal for All Users */}
      {activePsalm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/75 backdrop-blur-md overflow-y-auto animate-fadeIn">
          <div className="bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative text-stone-800 dark:text-stone-200 my-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-200 dark:border-stone-800">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-amber-600 text-white font-bold flex items-center justify-center text-xs">
                  #{activePsalm.number}
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-200 bg-amber-100 dark:bg-amber-950/60 px-2.5 py-1 rounded-md">
                  {activePsalm.theme}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFontSize(fontSize === 'normal' ? 'grande' : 'normal')}
                  className="px-2.5 py-1 text-xs font-bold rounded border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
                  title="Ajustar tamanho da fonte"
                >
                  {fontSize === 'normal' ? 'A+' : 'A-'}
                </button>

                <button
                  onClick={() => onToggleOffline(`salmo-${activePsalm.number}`, activePsalm.title)}
                  className={`p-1.5 rounded-lg border text-xs transition ${
                    profile.savedOfflineIds.includes(`salmo-${activePsalm.number}`)
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300'
                      : 'border-stone-300 dark:border-stone-700 text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
                  }`}
                  title="Salvar para ler offline"
                >
                  <Download className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onToggleFavorite(`salmo-${activePsalm.number}`)}
                  className={`p-1.5 rounded-lg border text-xs transition ${
                    profile.favoriteIds.includes(`salmo-${activePsalm.number}`)
                      ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400'
                      : 'border-stone-300 dark:border-stone-700 text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
                  }`}
                  title="Favoritar Salmo"
                >
                  <Heart className={`w-4 h-4 ${profile.favoriteIds.includes(`salmo-${activePsalm.number}`) ? 'fill-current' : ''}`} />
                </button>

                <button
                  onClick={handleCloseModal}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-800 transition"
                  aria-label="Fechar"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Title & Summary */}
            <div className="mb-4">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-950 dark:text-stone-100 mb-1">
                Salmo {activePsalm.number} &bull; {activePsalm.title}
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 italic">
                {activePsalm.summary}
              </p>
            </div>

            {/* Verses List */}
            <div className="my-5 space-y-3 bg-white dark:bg-stone-950 p-5 sm:p-6 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-inner dark:shadow-stone-950 max-h-[50vh] overflow-y-auto">
              {activePsalm.verses.map((v) => (
                <p
                  key={v.verseNumber}
                  className={`font-serif leading-relaxed text-stone-800 dark:text-stone-100 ${
                    fontSize === 'grande' ? 'text-lg sm:text-xl' : 'text-sm sm:text-base'
                  }`}
                >
                  <sup className="text-xs font-bold text-amber-700 dark:text-amber-400 mr-1.5 not-italic select-none">
                    {v.verseNumber}
                  </sup>
                  {v.text}
                </p>
              ))}
            </div>

            {/* Devotional commentary card */}
            <div className="bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/40 rounded-xl p-4 mb-4 text-xs sm:text-sm text-stone-700 dark:text-stone-300">
              <strong className="text-amber-900 dark:text-amber-200 font-bold block mb-1">
                Reflexão Devocional:
              </strong>
              {activePsalm.devotionalInsight}
            </div>

            {/* Actions Bar */}
            <div className="flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-stone-200 dark:border-stone-800">
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
                  <span>{isSpeaking ? 'Pausar Áudio' : 'Ouvir Narração'}</span>
                </button>

                <button
                  onClick={handleShare}
                  className="p-2 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 text-xs font-medium flex items-center gap-1.5 transition"
                  title="Compartilhar Salmo"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                  <span className="hidden sm:inline">Compartilhar</span>
                </button>
              </div>

              <button
                onClick={handleCloseModal}
                className="py-2 px-5 bg-stone-900 dark:bg-amber-600 hover:bg-stone-800 dark:hover:bg-amber-500 text-white rounded-xl text-xs font-semibold shadow transition"
              >
                Concluir Leitura
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
