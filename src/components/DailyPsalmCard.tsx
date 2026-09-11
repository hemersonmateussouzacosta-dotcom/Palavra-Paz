import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Share2, Heart, BookOpen, Sparkles, Check, ArrowRight, Play, Pause } from 'lucide-react';
import { Psalm } from '../types';
import { getDailyPsalm } from '../data/psalmsData';
import { audioSpeechService } from '../services/audioSpeechService';
import { soundService } from '../services/soundService';
import { StorageService } from '../services/storageService';

interface DailyPsalmCardProps {
  selectedDate?: string;
  onOpenAllPsalms?: () => void;
  onToggleFavorite?: (id: string) => void;
  isFavorite?: boolean;
}

export const DailyPsalmCard: React.FC<DailyPsalmCardProps> = ({
  selectedDate,
  onOpenAllPsalms,
  onToggleFavorite,
  isFavorite = false
}) => {
  const [psalm, setPsalm] = useState<Psalm>(() => getDailyPsalm(selectedDate));
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showFullVerses, setShowFullVerses] = useState(false);

  useEffect(() => {
    const p = getDailyPsalm(selectedDate);
    setPsalm(p);
  }, [selectedDate]);

  useEffect(() => {
    return () => {
      audioSpeechService.stop();
    };
  }, []);

  const formatDateLabel = (dateStr?: string) => {
    try {
      const date = dateStr ? new Date(dateStr + 'T12:00:00') : new Date();
      return date.toLocaleDateString('pt-BR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
      });
    } catch {
      return 'Salmo de Hoje';
    }
  };

  const handleToggleNarration = () => {
    if (isSpeaking) {
      audioSpeechService.stop();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      soundService.playChime(528, 2);
      StorageService.recordView({
        type: 'audio',
        title: `Áudio: Salmo ${psalm.number}`,
        subtitle: psalm.title,
        category: psalm.theme
      });

      const versesText = psalm.verses
        .map((v) => `Versículo ${v.verseNumber}: ${v.text}`)
        .join('. ');

      const fullNarration = `Salmo do Dia. Salmo ${psalm.number}. ${psalm.title}. ${versesText}. Reflexão do Salmo: ${psalm.devotionalInsight}`;
      
      audioSpeechService.speak(fullNarration, () => {
        setIsSpeaking(false);
      });
    }
  };

  const handleShare = async () => {
    const versesText = psalm.verses
      .map((v) => `${v.verseNumber}. ${v.text}`)
      .join('\n');

    const message = `🕊️ *Salmo do Dia • Salmo ${psalm.number}*\n_${psalm.title}_\n\n${versesText}\n\n*Reflexão:* ${psalm.devotionalInsight}\n\n📖 Palavra & Paz • App Devocional Gratuito`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: `Salmo ${psalm.number} - ${psalm.title}`,
          text: message
        });
      } else {
        await navigator.clipboard.writeText(message);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <article
      id="card-salmo-do-dia"
      aria-label="Salmo do Dia"
      className="bg-white dark:bg-stone-900 border border-amber-200/90 dark:border-amber-900/40 rounded-3xl p-6 sm:p-8 shadow-md hover:shadow-lg transition relative overflow-hidden"
    >
      {/* Decorative ambient background blur */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-200/20 dark:bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar: Badge, Date and Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 relative z-10">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 bg-amber-100 dark:bg-amber-950/70 text-amber-900 dark:text-amber-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-amber-300 dark:border-amber-700/50">
            <BookOpen className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
            <span>Salmo do Dia</span>
          </span>
          <span className="text-xs text-stone-500 dark:text-stone-400 font-medium capitalize">
            {formatDateLabel(selectedDate)}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {onToggleFavorite && (
            <button
              onClick={() => onToggleFavorite(`salmo-${psalm.number}`)}
              className={`p-2 rounded-xl transition border text-xs flex items-center gap-1 ${
                isFavorite
                  ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:text-rose-600'
              }`}
              title={isFavorite ? 'Remover dos favoritos' : 'Salvar nos favoritos'}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current text-rose-500' : ''}`} />
            </button>
          )}

          <button
            onClick={handleShare}
            className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:text-amber-700 dark:hover:text-amber-300 border border-stone-200 dark:border-stone-700 transition"
            title="Compartilhar Salmo"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Psalm Header: Number, Title & Theme */}
      <div className="mb-5 relative z-10">
        <div className="flex items-baseline gap-3 mb-1">
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100 tracking-tight">
            Salmo {psalm.number}
          </h3>
          <span className="text-xs font-semibold text-amber-800 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-0.5 rounded-md border border-amber-200 dark:border-amber-800">
            {psalm.theme}
          </span>
        </div>
        <p className="text-sm font-medium text-stone-600 dark:text-stone-300">
          {psalm.title}
        </p>
      </div>

      {/* Audio Narration Bar */}
      <div className="mb-6 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-amber-50 via-stone-50 to-amber-50/50 dark:from-stone-850 dark:via-stone-900 dark:to-stone-850 border border-amber-200/80 dark:border-stone-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 relative z-10">
        <div className="flex items-center gap-3">
          <button
            id="btn-play-daily-psalm-audio"
            onClick={handleToggleNarration}
            className={`p-3 rounded-xl transition flex items-center justify-center shadow-xs cursor-pointer ${
              isSpeaking
                ? 'bg-amber-600 text-white animate-pulse'
                : 'bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold'
            }`}
            title={isSpeaking ? 'Parar narração' : 'Ouvir narração do Salmo'}
          >
            {isSpeaking ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
          </button>
          <div>
            <div className="flex items-center gap-1.5">
              <Volume2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span className="text-xs font-bold text-stone-800 dark:text-stone-200">
                {isSpeaking ? 'Narrando Salmo com Voz Serena...' : 'Ouvir Salmo Narrado em Áudio'}
              </span>
            </div>
            <p className="text-[11px] text-stone-500 dark:text-stone-400">
              {isSpeaking ? 'Clique para pausar o áudio' : 'Áudio disponível gratuitamente para todos os Salmos'}
            </p>
          </div>
        </div>

        {isSpeaking && (
          <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400 text-xs font-mono font-bold animate-pulse">
            <span>● Áudio Ativo</span>
          </div>
        )}
      </div>

      {/* Verses Content */}
      <div className="space-y-3 mb-6 font-serif text-stone-800 dark:text-stone-200 text-base sm:text-lg leading-relaxed relative z-10">
        {(showFullVerses ? psalm.verses : psalm.verses.slice(0, 4)).map((verse) => (
          <div key={verse.verseNumber} className="flex gap-2.5 items-start">
            <span className="text-xs font-bold font-sans text-amber-700 dark:text-amber-400 select-none pt-1">
              {verse.verseNumber}.
            </span>
            <p className="italic">
              &ldquo;{verse.text}&rdquo;
            </p>
          </div>
        ))}

        {psalm.verses.length > 4 && (
          <button
            onClick={() => setShowFullVerses(!showFullVerses)}
            className="text-xs font-sans font-bold text-amber-700 dark:text-amber-400 hover:underline pt-1 cursor-pointer"
          >
            {showFullVerses
              ? 'Mostrar menos versículos'
              : `Ler todos os ${psalm.verses.length} versículos deste Salmo...`}
          </button>
        )}
      </div>

      {/* Devotional Insight Box */}
      {psalm.devotionalInsight && (
        <div className="bg-amber-50/70 dark:bg-stone-850 border-l-4 border-amber-500 rounded-r-2xl p-4 mb-5 text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed relative z-10">
          <strong className="text-amber-900 dark:text-amber-300 block mb-1 font-serif text-sm">
            Reflexão Devocional do Salmo:
          </strong>
          {psalm.devotionalInsight}
        </div>
      )}

      {/* Bottom bar: explore all 150 Psalms */}
      <div className="pt-4 border-t border-stone-200/80 dark:border-stone-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs relative z-10">
        <div className="flex items-center gap-1.5 text-stone-500 dark:text-stone-400">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Todos os 150 Salmos estão 100% liberados com áudio</span>
        </div>

        {onOpenAllPsalms && (
          <button
            onClick={onOpenAllPsalms}
            className="inline-flex items-center gap-1 font-bold text-amber-800 dark:text-amber-400 hover:text-amber-950 dark:hover:text-amber-200 hover:underline transition cursor-pointer"
          >
            <span>Explorar os 150 Salmos Bíblicos</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </article>
  );
};
