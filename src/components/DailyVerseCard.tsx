import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Share2, Bell, Heart, Sparkles, Check, Bookmark, Calendar, Download, Lock } from 'lucide-react';
import { DailyVerse } from '../types';
import { audioSpeechService } from '../services/audioSpeechService';
import { soundService } from '../services/soundService';

interface DailyVerseCardProps {
  verse: DailyVerse;
  onOpenNotificationModal: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  isOfflineSaved?: boolean;
  onToggleOffline?: (id: string, title?: string) => void;
  isPremium?: boolean;
}

export const DailyVerseCard: React.FC<DailyVerseCardProps> = ({
  verse,
  onOpenNotificationModal,
  isFavorite,
  onToggleFavorite,
  isOfflineSaved,
  onToggleOffline,
  isPremium
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    audioSpeechService.setStatusCallback((speaking) => {
      setIsSpeaking(speaking);
    });
    return () => {
      audioSpeechService.stop();
    };
  }, []);

  const handleToggleNarration = () => {
    if (isSpeaking) {
      audioSpeechService.stop();
    } else {
      soundService.playChime(528, 2);
      const textToRead = `Versículo do Dia. ${verse.reference}. ${verse.text}. Reflexão devocional: ${verse.reflection}. Prática para hoje: ${verse.actionPrompt}`;
      audioSpeechService.speak(textToRead);
    }
  };

  const handleShare = async () => {
    const shareText = `☀️ *Versículo do Dia • Palavra & Paz*\n\n"${verse.text}"\n— ${verse.reference}\n\n*Reflexão:* ${verse.reflection}\n\n*Prática:* ${verse.actionPrompt}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Versículo do Dia - ${verse.reference}`,
          text: shareText
        });
      } else {
        await navigator.clipboard.writeText(shareText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      id="daily-verse-card"
      className="relative bg-white/95 rounded-2xl sm:rounded-3xl border border-amber-200/80 shadow-md sm:shadow-lg p-5 sm:p-8 transition-all overflow-hidden"
    >
      {/* Subtle sacred decorative background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-100/40 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* Header tags: Date, Notification pill, Actions */}
      <div className="flex items-center justify-between flex-wrap gap-2 mb-4 pb-3 border-b border-amber-100">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100/80 text-amber-900 border border-amber-300/60">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Alimento da Manhã (Gratuito para Todos)</span>
          </span>
          <span className="text-xs text-stone-500 font-medium hidden sm:inline">
            {verse.theme}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Morning reminder setup button */}
          <button
            id="btn-open-morning-notifications"
            onClick={onOpenNotificationModal}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition"
            title="Configurar Notificação Matinal Diária"
          >
            <Bell className="w-3.5 h-3.5 text-amber-600" />
            <span>Lembrete Matinal</span>
          </button>

          {/* Offline Save toggle button */}
          {onToggleOffline && (
            <button
              onClick={() => onToggleOffline(verse.id, `Versículo: ${verse.reference}`)}
              className={`p-1.5 rounded-lg border transition ${
                isOfflineSaved
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                  : 'bg-stone-50 border-stone-200 text-stone-400 hover:text-stone-700'
              }`}
              title={
                isOfflineSaved
                  ? 'Salvo para leitura offline'
                  : isPremium
                  ? 'Salvar para ler offline'
                  : 'Salvar offline (Recurso Kiwify Premium)'
              }
            >
              <Download className="w-4 h-4" />
            </button>
          )}

          {/* Favorite toggle */}
          <button
            onClick={onToggleFavorite}
            className={`p-1.5 rounded-lg border transition ${
              isFavorite
                ? 'bg-rose-50 border-rose-200 text-rose-600'
                : 'bg-stone-50 border-stone-200 text-stone-400 hover:text-stone-700'
            }`}
            title={isFavorite ? 'Salvo nos favoritos' : 'Favoritar este versículo'}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>

          {/* Share button */}
          <button
            onClick={handleShare}
            className="p-1.5 rounded-lg border border-stone-200 bg-stone-50 text-stone-500 hover:text-stone-800 transition"
            title="Compartilhar versículo com amigos ou no WhatsApp"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Scripture Text */}
      <div className="my-5">
        <blockquote className="font-serif text-xl sm:text-2xl md:text-3xl text-stone-900 leading-relaxed font-medium italic mb-3">
          &ldquo;{verse.text}&rdquo;
        </blockquote>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <cite className="not-italic text-sm sm:text-base font-bold text-amber-800 tracking-wide">
            — {verse.reference}
          </cite>

          {/* Audio speech narration button */}
          <button
            id="btn-narrate-verse"
            onClick={handleToggleNarration}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition shadow-sm ${
              isSpeaking
                ? 'bg-amber-600 text-white animate-pulse'
                : 'bg-amber-100 hover:bg-amber-200 text-amber-900'
            }`}
          >
            {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            <span>{isSpeaking ? 'Pausar Narração' : 'Ouvir com Voz Serena'}</span>
          </button>
        </div>
      </div>

      {/* Reflection and Daily Action */}
      <div className="mt-6 pt-4 border-t border-stone-100 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
        <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100/80">
          <h4 className="font-semibold text-stone-900 mb-1 flex items-center gap-1.5 text-xs uppercase tracking-wider text-amber-800">
            <span>📖</span> Reflexão para o Coração
          </h4>
          <p className="text-stone-700 leading-relaxed">{verse.reflection}</p>
        </div>

        <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100/80">
          <h4 className="font-semibold text-stone-900 mb-1 flex items-center gap-1.5 text-xs uppercase tracking-wider text-emerald-800">
            <span>✨</span> Prática Devocional de Hoje
          </h4>
          <p className="text-stone-700 leading-relaxed">{verse.actionPrompt}</p>
        </div>
      </div>

      {copied && (
        <div className="mt-3 text-center text-xs text-emerald-700 font-semibold animate-fadeIn">
          Versículo copiado com sucesso para a área de transferência!
        </div>
      )}
    </div>
  );
};
