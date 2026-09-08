import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Clock, Bell, CheckCircle2, Volume2, Sparkles, BookOpen, Heart, Flame } from 'lucide-react';
import { PracticeLog, UserProfile } from '../types';
import { soundService } from '../services/soundService';
import { StorageService } from '../services/storageService';

interface PracticeTimerProps {
  profile: UserProfile;
  onLogSaved: () => void;
}

export const PracticeTimer: React.FC<PracticeTimerProps> = ({ profile, onLogSaved }) => {
  const [timerMode, setTimerMode] = useState<'stopwatch' | 'countdown'>('countdown');
  const [practiceType, setPracticeType] = useState<PracticeLog['type']>('oracao');
  const [targetMinutes, setTargetMinutes] = useState(10);
  const [secondsRemaining, setSecondsRemaining] = useState(10 * 60);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [backgroundAmbient, setBackgroundAmbient] = useState<'none' | 'celestial' | 'chuva' | 'aguas'>('celestial');
  const [notes, setNotes] = useState('');
  const [savedSuccessMessage, setSavedSuccessMessage] = useState(false);

  // Countdown timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive) {
      interval = setInterval(() => {
        if (timerMode === 'countdown') {
          setSecondsRemaining((prev) => {
            if (prev <= 1) {
              // Timer completed
              setIsActive(false);
              soundService.playChime(659, 4);
              soundService.stopAmbient();
              handleAutoSave(targetMinutes * 60);
              return 0;
            }
            return prev - 1;
          });
        } else {
          setElapsedSeconds((prev) => prev + 1);
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timerMode, targetMinutes]);

  const handleStart = () => {
    setIsActive(true);
    soundService.playChime(528, 2.5);
    if (backgroundAmbient !== 'none') {
      soundService.playAmbient(backgroundAmbient, 0.25);
    }
  };

  const handlePause = () => {
    setIsActive(false);
    soundService.stopAmbient();
  };

  const handleReset = () => {
    setIsActive(false);
    soundService.stopAmbient();
    if (timerMode === 'countdown') {
      setSecondsRemaining(targetMinutes * 60);
    } else {
      setElapsedSeconds(0);
    }
  };

  const handleSelectMinutes = (mins: number) => {
    setTargetMinutes(mins);
    setSecondsRemaining(mins * 60);
    if (isActive) {
      setIsActive(false);
      soundService.stopAmbient();
    }
  };

  const handleAutoSave = (durationSec: number) => {
    const titlesMap: Record<PracticeLog['type'], string> = {
      oracao: 'Momento de Oração e Intercessão',
      meditacao: 'Meditação e Quietude com Deus',
      leitura_salmos: 'Leitura Contemplativa dos Salmos',
      estudo: 'Estudo Bíblico e Teológico'
    };

    StorageService.addPracticeLog({
      title: titlesMap[practiceType],
      type: practiceType,
      durationSeconds: durationSec,
      notes: notes.trim() || 'Prática concluída com paz e gratidão.'
    });

    StorageService.recordView({
      type: 'cronometro',
      title: titlesMap[practiceType],
      subtitle: `${Math.round(durationSec / 60)} min dedicados ao Senhor`,
      category: 'Cronômetro Devocional',
      metadata: {
        durationSeconds: durationSec
      }
    });

    onLogSaved();
    setSavedSuccessMessage(true);
    setTimeout(() => setSavedSuccessMessage(false), 5000);
  };

  const handleManualSave = () => {
    const duration = timerMode === 'countdown' ? targetMinutes * 60 - secondsRemaining : elapsedSeconds;
    if (duration < 10) return; // At least 10 seconds to save
    handleAutoSave(duration);
    handleReset();
  };

  // Format seconds to MM:SS
  const displaySeconds = timerMode === 'countdown' ? secondsRemaining : elapsedSeconds;
  const minutes = Math.floor(displaySeconds / 60);
  const seconds = displaySeconds % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return (
    <div id="practice-timer-container" className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white/95 rounded-2xl p-5 sm:p-6 border border-amber-200/80 shadow-sm text-center">
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 mb-1">
          Cronômetro de Prática Sagrada
        </h2>
        <p className="text-xs sm:text-sm text-stone-600">
          Separe um tempo sagrado diário sem distrações. O Senhor recompensa a perseverança.
        </p>
      </div>

      {savedSuccessMessage && (
        <div className="bg-emerald-100 border border-emerald-300 text-emerald-900 px-4 py-3 rounded-2xl flex items-center gap-3 text-xs sm:text-sm shadow-md animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
          <div>
            <strong>Tempo registrado!</strong> Seus minutos orados foram sincronizados no Painel de Progresso.
          </div>
        </div>
      )}

      {/* Main Timer Board */}
      <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-8 border border-stone-800 shadow-2xl relative overflow-hidden text-center">
        {/* Practice Type Selector */}
        <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-6 flex-wrap">
          {[
            { type: 'oracao', label: 'Oração' },
            { type: 'meditacao', label: 'Meditação' },
            { type: 'leitura_salmos', label: 'Salmos' },
            { type: 'estudo', label: 'Silêncio' }
          ].map((item) => (
            <button
              key={item.type}
              onClick={() => setPracticeType(item.type as PracticeLog['type'])}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                practiceType === item.type
                  ? 'bg-amber-500 text-stone-950 font-bold shadow'
                  : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Mode Toggles: Temporizador vs Cronômetro Livre */}
        <div className="inline-flex rounded-xl bg-stone-800 p-1 border border-stone-700 mb-6 text-xs">
          <button
            onClick={() => {
              setTimerMode('countdown');
              setIsActive(false);
              setSecondsRemaining(targetMinutes * 60);
            }}
            className={`px-3.5 py-1.5 rounded-lg font-medium transition ${
              timerMode === 'countdown' ? 'bg-amber-600 text-white shadow' : 'text-stone-400 hover:text-white'
            }`}
          >
            Temporizador Regressivo
          </button>
          <button
            onClick={() => {
              setTimerMode('stopwatch');
              setIsActive(false);
              setElapsedSeconds(0);
            }}
            className={`px-3.5 py-1.5 rounded-lg font-medium transition ${
              timerMode === 'stopwatch' ? 'bg-amber-600 text-white shadow' : 'text-stone-400 hover:text-white'
            }`}
          >
            Cronômetro Livre
          </button>
        </div>

        {/* Countdown preset buttons if in countdown mode */}
        {timerMode === 'countdown' && !isActive && (
          <div className="flex items-center justify-center gap-2 mb-6 flex-wrap">
            {[5, 10, 15, 20, 30].map((mins) => (
              <button
                key={mins}
                onClick={() => handleSelectMinutes(mins)}
                className={`w-11 h-9 rounded-xl text-xs font-semibold border transition ${
                  targetMinutes === mins
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500'
                    : 'bg-stone-800/80 text-stone-400 border-stone-700 hover:bg-stone-700'
                }`}
              >
                {mins}m
              </button>
            ))}
          </div>
        )}

        {/* Big Clock Display */}
        <div className="my-6">
          <div className="font-mono text-6xl sm:text-7xl md:text-8xl font-bold tracking-tight text-amber-100 select-none">
            {formattedTime}
          </div>
          <p className="text-xs text-stone-400 mt-2">
            {isActive ? 'Prática em andamento... Esteja com o coração aberto.' : 'Pressione play para iniciar'}
          </p>
        </div>

        {/* Ambient sound selector during practice */}
        <div className="flex items-center justify-center gap-2 mb-6 text-xs text-stone-300">
          <span className="text-stone-400 text-[11px]">Som ambiente:</span>
          {[
            { key: 'none', label: 'Silêncio' },
            { key: 'celestial', label: 'Harpa' },
            { key: 'chuva', label: 'Chuva' },
            { key: 'aguas', label: 'Riacho' }
          ].map((snd) => (
            <button
              key={snd.key}
              onClick={() => {
                const k = snd.key as 'none' | 'celestial' | 'chuva' | 'aguas';
                setBackgroundAmbient(k);
                if (isActive) {
                  if (k === 'none') soundService.stopAmbient();
                  else soundService.playAmbient(k, 0.25);
                }
              }}
              className={`px-2.5 py-1 rounded-lg text-[11px] transition ${
                backgroundAmbient === snd.key
                  ? 'bg-amber-500/30 text-amber-200 border border-amber-500/40'
                  : 'bg-stone-800 text-stone-400 hover:text-white'
              }`}
            >
              {snd.label}
            </button>
          ))}
        </div>

        {/* Main Action Buttons */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={handleReset}
            className="p-3.5 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 transition"
            title="Reiniciar"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            id="btn-timer-play-pause"
            onClick={isActive ? handlePause : handleStart}
            className="p-5 sm:p-6 rounded-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold shadow-xl shadow-amber-500/30 transition transform active:scale-95"
            title={isActive ? 'Pausar' : 'Iniciar'}
          >
            {isActive ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-0.5" />}
          </button>

          <button
            onClick={handleManualSave}
            className="p-3.5 rounded-full bg-stone-800 hover:bg-stone-700 text-emerald-400 transition"
            title="Salvar no meu histórico agora"
          >
            <CheckCircle2 className="w-5 h-5" />
          </button>
        </div>

        {/* Notes input */}
        <div className="mt-6 pt-6 border-t border-stone-800 max-w-md mx-auto">
          <input
            type="text"
            placeholder="Anotação ou pedido de oração (opcional)..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-stone-800/80 border border-stone-700 rounded-xl text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>
    </div>
  );
};
