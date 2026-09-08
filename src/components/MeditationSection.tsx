import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles, Lock, ArrowRight, CheckCircle2, ShieldCheck, Heart } from 'lucide-react';
import { GuidedMeditation, UserProfile } from '../types';
import { GUIDED_MEDITATIONS } from '../data/meditationsData';
import { soundService } from '../services/soundService';
import { audioSpeechService } from '../services/audioSpeechService';
import { StorageService } from '../services/storageService';

interface MeditationSectionProps {
  profile: UserProfile;
  onOpenCheckout: () => void;
  onLogCompleted: () => void;
}

export const MeditationSection: React.FC<MeditationSectionProps> = ({
  profile,
  onOpenCheckout,
  onLogCompleted
}) => {
  const [activeMeditation, setActiveMeditation] = useState<GuidedMeditation | null>(null);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [stageSecondsRemaining, setStageSecondsRemaining] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState<'inspire' | 'segure' | 'expire' | 'repouse'>('inspire');
  const [ambientSound, setAmbientSound] = useState<'none' | 'celestial' | 'chuva' | 'aguas'>('celestial');
  const [narrationActive, setNarrationActive] = useState(true);
  const [completedNotification, setCompletedNotification] = useState(false);

  const isPremium = profile.subscriptionStatus === 'premium';

  // Breathing cycle animation timer (4s inspire, 4s segure, 4s expire, 2s repouse)
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setBreathingPhase((prev) => {
        if (prev === 'inspire') return 'segure';
        if (prev === 'segure') return 'expire';
        if (prev === 'expire') return 'repouse';
        return 'inspire';
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  // Stage countdown timer
  useEffect(() => {
    if (!isPlaying || !activeMeditation) return;

    const timer = setInterval(() => {
      setStageSecondsRemaining((prev) => {
        if (prev <= 1) {
          // Advance to next stage or finish
          const nextIndex = currentStageIndex + 1;
          if (nextIndex < activeMeditation.stages.length) {
            setCurrentStageIndex(nextIndex);
            const nextStage = activeMeditation.stages[nextIndex];
            soundService.playChime(528, 2);
            if (narrationActive) {
              audioSpeechService.speak(nextStage.guidance);
            }
            return nextStage.seconds;
          } else {
            // Meditation finished!
            setIsPlaying(false);
            soundService.playChime(659, 4);
            audioSpeechService.stop();
            soundService.stopAmbient();

            // Save log to storage
            StorageService.addPracticeLog({
              title: `Meditação: ${activeMeditation.title}`,
              type: 'meditacao',
              durationSeconds: activeMeditation.durationMinutes * 60,
              notes: 'Sessão guiada de respiração e paz espiritual concluída.'
            });

            onLogCompleted();
            setCompletedNotification(true);
            setTimeout(() => setCompletedNotification(false), 5000);
            return 0;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, activeMeditation, currentStageIndex, narrationActive]);

  const handleStartMeditation = (med: GuidedMeditation) => {
    StorageService.recordView({
      type: 'meditacao',
      title: med.title,
      subtitle: `${med.durationMinutes} min • ${med.theme}`,
      category: med.theme,
      metadata: {
        isPremiumContent: med.isPremium,
        durationSeconds: med.durationMinutes * 60
      }
    });

    if (med.isPremium && !isPremium) {
      onOpenCheckout();
      return;
    }

    setActiveMeditation(med);
    setCurrentStageIndex(0);
    setStageSecondsRemaining(med.stages[0].seconds);
    setIsPlaying(true);
    setCompletedNotification(false);

    soundService.playChime(528, 3);
    if (ambientSound !== 'none') {
      soundService.playAmbient(ambientSound, 0.25);
    }

    if (narrationActive) {
      audioSpeechService.speak(`Iniciando meditação ${med.title}. ${med.stages[0].guidance}`);
    }
  };

  const handlePauseResume = () => {
    if (isPlaying) {
      setIsPlaying(false);
      audioSpeechService.pause();
      soundService.stopAmbient();
    } else {
      setIsPlaying(true);
      audioSpeechService.resume();
      if (ambientSound !== 'none') {
        soundService.playAmbient(ambientSound, 0.25);
      }
    }
  };

  const handleStop = () => {
    setIsPlaying(false);
    audioSpeechService.stop();
    soundService.stopAmbient();
    setActiveMeditation(null);
  };

  return (
    <div id="meditation-section" className="space-y-6">
      {/* Header Info */}
      <div className="bg-white/90 border border-stone-200 rounded-2xl p-5 sm:p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
              Meditação Bíblica Guiada
            </h2>
            <p className="text-xs sm:text-sm text-stone-600">
              Aquiete a sua respiração e ancore o coração nas promessas divinas de paz e descanso.
            </p>
          </div>
        </div>
      </div>

      {completedNotification && (
        <div className="bg-emerald-100 border border-emerald-300 text-emerald-900 px-4 py-3 rounded-2xl flex items-center gap-3 text-xs sm:text-sm shadow-md animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
          <div>
            <strong>Glória a Deus!</strong> Meditação concluída com sucesso. Os minutos foram salvos no seu Painel de Progresso.
          </div>
        </div>
      )}

      {/* Active Meditation Player View */}
      {activeMeditation && (
        <div
          id="active-meditation-player"
          className="bg-stone-900 text-stone-100 rounded-3xl p-6 sm:p-8 border border-stone-800 shadow-2xl relative overflow-hidden text-center"
        >
          {/* Subtle celestial background gradient */}
          <div className="absolute inset-0 bg-radial from-amber-500/10 via-transparent to-black pointer-events-none" />

          <div className="relative z-10 max-w-xl mx-auto space-y-6">
            <div className="flex items-center justify-between text-xs text-stone-400">
              <span className="uppercase tracking-wider font-semibold text-amber-400">
                {activeMeditation.theme}
              </span>
              <span>
                Etapa {currentStageIndex + 1} de {activeMeditation.stages.length}
              </span>
            </div>

            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-amber-100">
              {activeMeditation.title}
            </h3>

            {/* Breathing Animation Circle */}
            <div className="py-6 flex flex-col items-center justify-center">
              <div
                className={`w-44 h-44 sm:w-52 sm:h-52 rounded-full border-4 flex flex-col items-center justify-center transition-all duration-1000 shadow-2xl relative ${
                  breathingPhase === 'inspire'
                    ? 'scale-110 border-amber-400 bg-amber-500/20 shadow-amber-500/30'
                    : breathingPhase === 'segure'
                    ? 'scale-110 border-emerald-400 bg-emerald-500/20 shadow-emerald-500/30'
                    : breathingPhase === 'expire'
                    ? 'scale-90 border-cyan-400 bg-cyan-500/10 shadow-cyan-500/20'
                    : 'scale-95 border-stone-600 bg-stone-800/40'
                }`}
              >
                <span className="text-xs font-bold uppercase tracking-widest text-stone-300 mb-1">
                  {breathingPhase === 'inspire' && 'Inspire suavemente'}
                  {breathingPhase === 'segure' && 'Segure e contemple'}
                  {breathingPhase === 'expire' && 'Expire as tensões'}
                  {breathingPhase === 'repouse' && 'Descanse na paz'}
                </span>
                <span className="text-3xl sm:text-4xl font-bold font-mono text-amber-200">
                  {Math.floor(stageSecondsRemaining / 60)}:
                  {(stageSecondsRemaining % 60).toString().padStart(2, '0')}
                </span>
                <span className="text-[10px] text-stone-400 mt-1">
                  {activeMeditation.stages[currentStageIndex].title}
                </span>
              </div>
            </div>

            {/* Guidance Text */}
            <div className="bg-stone-800/80 border border-stone-700/80 rounded-2xl p-4 sm:p-5 text-sm sm:text-base text-stone-200 leading-relaxed font-serif italic">
              &ldquo;{activeMeditation.stages[currentStageIndex].guidance}&rdquo;
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4 pt-2">
              <button
                onClick={handleStop}
                className="p-3 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 transition"
                title="Cancelar meditação"
              >
                <RotateCcw className="w-5 h-5" />
              </button>

              <button
                onClick={handlePauseResume}
                className="p-5 rounded-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold transition shadow-lg shadow-amber-500/30 transform active:scale-95"
                title={isPlaying ? 'Pausar' : 'Continuar'}
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
              </button>

              {/* Soundscape toggle inside player */}
              <button
                onClick={() => {
                  const next: 'none' | 'celestial' | 'chuva' | 'aguas' =
                    ambientSound === 'celestial' ? 'chuva' : ambientSound === 'chuva' ? 'aguas' : ambientSound === 'aguas' ? 'none' : 'celestial';
                  setAmbientSound(next);
                  if (next === 'none') soundService.stopAmbient();
                  else soundService.playAmbient(next, 0.25);
                }}
                className="p-3 rounded-full bg-stone-800 hover:bg-stone-700 text-amber-300 transition text-xs font-semibold flex items-center gap-1"
                title="Trocar Som de Fundo"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Meditation Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {GUIDED_MEDITATIONS.map((med) => {
          const isLocked = med.isPremium && !isPremium;
          return (
            <div
              key={med.id}
              className={`rounded-2xl p-5 sm:p-6 border transition flex flex-col justify-between ${
                isLocked
                  ? 'bg-stone-100/90 border-stone-200 opacity-90'
                  : 'bg-white border-stone-200 hover:border-amber-400 shadow-sm hover:shadow-md'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                    {med.durationMinutes} minutos &bull; {med.theme}
                  </span>

                  {isLocked ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-900 bg-amber-200 px-2 py-0.5 rounded-full">
                      <Lock className="w-3 h-3 text-amber-700" />
                      <span>Kiwify Premium</span>
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      Gratuito
                    </span>
                  )}
                </div>

                <h3 className="font-serif font-bold text-lg text-stone-900 mb-1.5">
                  {med.title}
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-4">
                  {med.description}
                </p>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                <span className="text-xs text-stone-500 font-medium">
                  {med.stages.length} etapas guiadas com respiração
                </span>

                <button
                  onClick={() => handleStartMeditation(med)}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition ${
                    isLocked
                      ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-sm'
                      : 'bg-stone-900 hover:bg-stone-800 text-amber-200 shadow-sm'
                  }`}
                >
                  {isLocked ? (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      <span>Desbloquear</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5" />
                      <span>Iniciar Meditação</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
