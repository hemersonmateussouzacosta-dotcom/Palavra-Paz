import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Share2, Bell, Heart, Sparkles, Check, Bookmark, Calendar, Download, Lock, MessageCircle } from 'lucide-react';
import { DailyVerse } from '../types';
import { audioSpeechService } from '../services/audioSpeechService';
import { soundService } from '../services/soundService';
import { StorageService } from '../services/storageService';

interface DailyVerseCardProps {
  verse: DailyVerse;
  onOpenNotificationModal: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  isOfflineSaved?: boolean;
  onToggleOffline?: (id: string, title?: string) => void;
  isPremium?: boolean;
  selectedDate?: string;
  onSelectDate?: (dateStr: string) => void;
}

export const DailyVerseCard: React.FC<DailyVerseCardProps> = ({
  verse,
  onOpenNotificationModal,
  isFavorite,
  onToggleFavorite,
  isOfflineSaved,
  onToggleOffline,
  isPremium,
  selectedDate,
  onSelectDate
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareSuccess, setShareSuccess] = useState<string | null>(null);
  const [isSharing, setIsSharing] = useState(false);

  // Formatting date for display in Portuguese
  const formatDateLabel = (dateStr?: string) => {
    try {
      const date = dateStr ? new Date(dateStr + 'T12:00:00') : new Date();
      return date.toLocaleDateString('pt-BR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
      });
    } catch {
      return 'Devocional Diário';
    }
  };

  const handleShiftDay = (offsetDays: number) => {
    if (!onSelectDate) return;
    const current = selectedDate ? new Date(selectedDate + 'T12:00:00') : new Date();
    current.setDate(current.getDate() + offsetDays);
    const newStr = current.toISOString().split('T')[0];
    onSelectDate(newStr);
  };


  useEffect(() => {
    if (verse) {
      StorageService.recordView({
        type: 'versiculo',
        title: `Versículo: ${verse.reference}`,
        subtitle: verse.text.length > 70 ? verse.text.substring(0, 70) + '...' : verse.text,
        category: verse.theme,
        metadata: {
          isPremiumContent: false,
          dateReference: verse.date
        }
      });
    }
  }, [verse?.id, verse?.date, verse?.reference]);

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
      StorageService.recordView({
        type: 'audio',
        title: `Áudio: ${verse.reference}`,
        subtitle: 'Narração falada do devocional diário',
        category: verse.theme
      });
      const textToRead = `Versículo do Dia. ${verse.reference}. ${verse.text}. Reflexão devocional: ${verse.reflection}. Prática para hoje: ${verse.actionPrompt}`;
      audioSpeechService.speak(textToRead);
    }
  };

  const handleShare = async () => {
    setIsSharing(true);
    const appUrl = typeof window !== 'undefined' ? window.location.href : '';
    const shareText = `☀️ *Versículo do Dia • Palavra & Paz*\n\n"${verse.text}"\n— ${verse.reference}\n\n📖 *Reflexão:* ${verse.reflection}\n\n✨ *Prática para hoje:* ${verse.actionPrompt}\n\nLeia mais devocionais diários em: ${appUrl}`;

    try {
      // Prioritize modern Web Share API (navigator.share)
      if (typeof navigator !== 'undefined' && navigator.share) {
        const shareData = {
          title: `Versículo do Dia: ${verse.reference} • Palavra & Paz`,
          text: shareText,
          url: appUrl
        };

        if (!navigator.canShare || navigator.canShare(shareData)) {
          await navigator.share(shareData);
          setShareSuccess('Versículo compartilhado com sucesso!');
          soundService.playChime(660, 1);
          StorageService.recordView({
            type: 'versiculo',
            title: `Compartilhamento: ${verse.reference}`,
            subtitle: 'Enviado via Web Share API',
            category: verse.theme
          });
          setTimeout(() => setShareSuccess(null), 3500);
          setIsSharing(false);
          return;
        }
      }

      // Fallback to Clipboard API if Web Share is not supported or not allowed
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareText);
        setCopied(true);
        soundService.playChime(528, 1);
        setShareSuccess('Texto do versículo copiado! Cole nas suas redes sociais ou no WhatsApp.');
        StorageService.recordView({
          type: 'versiculo',
          title: `Copiado para compartilhar: ${verse.reference}`,
          subtitle: 'Copiado para a área de transferência',
          category: verse.theme
        });
        setTimeout(() => {
          setCopied(false);
          setShareSuccess(null);
        }, 4000);
      } else {
        setShareSuccess('Selecione e copie o texto para compartilhar.');
        setTimeout(() => setShareSuccess(null), 3000);
      }
    } catch (err: unknown) {
      // If user simply closed/aborted the native share sheet, ignore gracefully
      if (err && typeof err === 'object' && 'name' in err && (err as { name: string }).name === 'AbortError') {
        setIsSharing(false);
        return;
      }
      // If Web Share failed for another reason, fallback to clipboard
      try {
        if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(shareText);
          setCopied(true);
          setShareSuccess('Texto copiado para a área de transferência!');
          setTimeout(() => {
            setCopied(false);
            setShareSuccess(null);
          }, 3000);
        }
      } catch {
        // ignore
      }
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div
      id="daily-verse-card"
      className="relative bg-white/95 dark:bg-stone-900/95 rounded-2xl sm:rounded-3xl border border-amber-200/80 dark:border-stone-800 shadow-md sm:shadow-lg dark:shadow-stone-950/60 p-5 sm:p-8 transition-all overflow-hidden"
    >
      {/* Subtle sacred decorative background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-100/40 dark:bg-amber-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* Header tags: Date, Notification pill, Actions */}
      <div className="flex items-center justify-between flex-wrap gap-2 mb-3 pb-3 border-b border-amber-100 dark:border-stone-800">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100/80 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 border border-amber-300/60 dark:border-amber-700/50">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Alimento da Manhã (Gratuito para Todos)</span>
          </span>
          <span className="text-xs text-stone-500 dark:text-stone-400 font-medium hidden sm:inline">
            {verse.theme}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Morning reminder setup button */}
          <button
            id="btn-open-morning-notifications"
            onClick={onOpenNotificationModal}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-amber-900 dark:text-amber-200 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/50 border border-amber-200 dark:border-amber-800/60 transition"
            title="Configurar Notificação Matinal Diária"
          >
            <Bell className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Lembrete Matinal</span>
          </button>

          {/* Offline Save toggle button */}
          {onToggleOffline && (
            <button
              onClick={() => onToggleOffline(verse.id, `Versículo: ${verse.reference}`)}
              className={`p-1.5 rounded-lg border transition ${
                isOfflineSaved
                  ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300'
                  : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200'
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
                ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400'
                : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200'
            }`}
            title={isFavorite ? 'Salvo nos favoritos' : 'Favoritar este versículo'}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>

          {/* Share button */}
          <button
            onClick={handleShare}
            className="p-1.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 transition"
            title="Compartilhar versículo com amigos ou no WhatsApp"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <Share2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Date & 365 Days Navigator Bar */}
      <div className="flex items-center justify-between flex-wrap gap-2 mb-4 bg-amber-50/70 dark:bg-stone-800/80 px-3.5 py-2 rounded-xl border border-amber-200/60 dark:border-stone-700 text-xs">
        <div className="flex items-center gap-1.5 text-stone-800 dark:text-stone-200 font-semibold">
          <Calendar className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
          <span className="capitalize">{formatDateLabel(verse.date || selectedDate)}</span>
          <span className="text-[10px] text-amber-900 dark:text-amber-200 bg-amber-200/70 dark:bg-amber-900/60 px-1.5 py-0.5 rounded font-medium">
            Renovado Todo Dia
          </span>
        </div>

        {onSelectDate && (
          <div className="flex items-center gap-1 text-[11px]">
            <button
              onClick={() => handleShiftDay(-1)}
              className="px-2 py-1 rounded bg-white dark:bg-stone-700 border border-stone-200 dark:border-stone-600 hover:bg-stone-50 dark:hover:bg-stone-600 text-stone-700 dark:text-stone-200 transition active:scale-95"
              title="Ver devocional do dia anterior"
            >
              &larr; Anterior
            </button>
            <button
              onClick={() => onSelectDate(new Date().toISOString().split('T')[0])}
              className="px-2 py-1 rounded bg-amber-600 text-white font-bold hover:bg-amber-700 transition active:scale-95 shadow-xs"
              title="Ir para o devocional de hoje"
            >
              Hoje
            </button>
            <button
              onClick={() => handleShiftDay(1)}
              className="px-2 py-1 rounded bg-white dark:bg-stone-700 border border-stone-200 dark:border-stone-600 hover:bg-stone-50 dark:hover:bg-stone-600 text-stone-700 dark:text-stone-200 transition active:scale-95"
              title="Ver próximo devocional"
            >
              Próximo &rarr;
            </button>
          </div>
        )}
      </div>

      {/* Main Scripture Text */}
      <div className="my-5">
        <blockquote className="font-serif text-xl sm:text-2xl md:text-3xl text-stone-900 dark:text-stone-100 leading-relaxed font-medium italic mb-3">
          &ldquo;{verse.text}&rdquo;
        </blockquote>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <cite className="not-italic text-sm sm:text-base font-bold text-amber-800 dark:text-amber-400 tracking-wide">
            — {verse.reference}
          </cite>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Audio speech narration button */}
            <button
              id="btn-narrate-verse"
              onClick={handleToggleNarration}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition shadow-sm ${
                isSpeaking
                  ? 'bg-amber-600 text-white animate-pulse'
                  : 'bg-amber-100 dark:bg-amber-950/60 hover:bg-amber-200 dark:hover:bg-amber-900/60 text-amber-900 dark:text-amber-200 border border-amber-300/40 dark:border-amber-800/50'
              }`}
            >
              {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              <span>{isSpeaking ? 'Pausar Narração' : 'Ouvir com Voz Serena'}</span>
            </button>

            {/* Direct Web Share button */}
            <button
              id="btn-share-verse-cta"
              onClick={handleShare}
              disabled={isSharing}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition shadow-sm bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/50 text-amber-900 dark:text-amber-200 border border-amber-300/60 dark:border-amber-800/60 cursor-pointer active:scale-95"
              title="Compartilhar versículo via WhatsApp, redes sociais ou copiar texto"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-emerald-700 dark:text-emerald-400 font-bold">Copiado!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
                  <span>Compartilhar Palavra</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Reflection and Daily Action */}
      <div className="mt-6 pt-4 border-t border-stone-100 dark:border-stone-800 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
        <div className="bg-amber-50/50 dark:bg-amber-950/25 p-4 rounded-xl border border-amber-100/80 dark:border-amber-900/40">
          <h4 className="font-semibold text-stone-900 dark:text-stone-100 mb-1 flex items-center gap-1.5 text-xs uppercase tracking-wider text-amber-800 dark:text-amber-300">
            <span>📖</span> Reflexão para o Coração
          </h4>
          <p className="text-stone-700 dark:text-stone-300 leading-relaxed">{verse.reflection}</p>
        </div>

        <div className="bg-emerald-50/50 dark:bg-emerald-950/25 p-4 rounded-xl border border-emerald-100/80 dark:border-emerald-900/40">
          <h4 className="font-semibold text-stone-900 dark:text-stone-100 mb-1 flex items-center gap-1.5 text-xs uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
            <span>✨</span> Prática Devocional de Hoje
          </h4>
          <p className="text-stone-700 dark:text-stone-300 leading-relaxed">{verse.actionPrompt}</p>
        </div>
      </div>

      {/* Dedicated Social & Message Sharing Banner */}
      <div className="mt-5 pt-4 border-t border-amber-100 dark:border-stone-800 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-200 dark:border-amber-800/60">
            <Share2 className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-stone-800 dark:text-stone-200">
              Compartilhar Bênção &amp; Fé
            </p>
            <p className="text-[11px] text-stone-500 dark:text-stone-400">
              Envie este versículo e reflexão para redes sociais, WhatsApp ou grupos de oração
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            id="btn-share-verse-webshare"
            onClick={handleShare}
            disabled={isSharing}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 active:scale-95 shadow-sm transition cursor-pointer"
            title="Compartilhar versículo com a API Web Share do navegador"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Compartilhar Versículo</span>
          </button>

          <a
            id="btn-share-verse-whatsapp"
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
              `☀️ *Versículo do Dia • Palavra & Paz*\n\n"${verse.text}"\n— ${verse.reference}\n\n📖 *Reflexão:* ${verse.reflection}\n\n✨ *Prática:* ${verse.actionPrompt}\n\n${typeof window !== 'undefined' ? window.location.href : ''}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              StorageService.recordView({
                type: 'versiculo',
                title: `WhatsApp: ${verse.reference}`,
                subtitle: 'Compartilhado no WhatsApp',
                category: verse.theme
              });
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-emerald-800 dark:text-emerald-200 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-300 dark:border-emerald-700 transition cursor-pointer"
            title="Enviar mensagem direta pelo WhatsApp"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>

      {shareSuccess && (
        <div className="mt-3 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 text-center text-xs text-emerald-800 dark:text-emerald-300 font-semibold flex items-center justify-center gap-1.5 animate-fadeIn">
          <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>{shareSuccess}</span>
        </div>
      )}
    </div>
  );
};
