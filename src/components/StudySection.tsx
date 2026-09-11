import React, { useState } from 'react';
import { BookOpen, Sparkles, Volume2, VolumeX, Lock, Download, Check, Share2, ArrowRight } from 'lucide-react';
import { StudyMaterial, UserProfile } from '../types';
import { STUDY_MATERIALS } from '../data/studyData';
import { audioSpeechService } from '../services/audioSpeechService';
import { soundService } from '../services/soundService';
import { StorageService } from '../services/storageService';

interface StudySectionProps {
  profile: UserProfile;
  onOpenCheckout: () => void;
  onToggleOffline: (id: string, title?: string) => void;
}

export const StudySection: React.FC<StudySectionProps> = ({
  profile,
  onOpenCheckout,
  onToggleOffline
}) => {
  const [activeStudy, setActiveStudy] = useState<StudyMaterial | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleOpenStudy = (study: StudyMaterial) => {
    StorageService.recordView({
      type: 'estudo',
      title: study.title,
      subtitle: study.subtitle,
      category: study.category,
      metadata: {
        isPremiumContent: false
      }
    });

    setActiveStudy(study);
    soundService.playChime(528, 1.5);
  };

  const handleToggleNarration = () => {
    if (!activeStudy) return;
    if (isSpeaking) {
      audioSpeechService.stop();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      soundService.playChime(528, 2);
      StorageService.recordView({
        type: 'audio',
        title: `Áudio: ${activeStudy.title}`,
        subtitle: `Narração do estudo bíblico (${activeStudy.estimatedReadMinutes} min)`,
        category: activeStudy.category
      });
      const textToSpeak = `${activeStudy.title}. ${activeStudy.subtitle}. ${activeStudy.content.join(' ')}`;
      audioSpeechService.speak(textToSpeak, () => setIsSpeaking(false));
    }
  };

  return (
    <div id="study-materials-section" className="space-y-6">
      {/* Header */}
      <div className="bg-white/95 dark:bg-stone-900 rounded-2xl p-5 sm:p-6 border border-stone-200 dark:border-stone-800 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-900 dark:text-amber-200 bg-amber-200/80 dark:bg-amber-950/60 px-2 py-0.5 rounded-full mb-1">
              <Sparkles className="w-3 h-3 text-amber-700 dark:text-amber-400" />
              <span>Estudos Bíblicos 100% Gratuitos com Áudio</span>
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100">
              Estudos Bíblicos e Teologia Prática
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400">
              Aprofunde suas raízes na Palavra com exegese bíblica, reflexão diária e planos de estudo completos narrados com voz serena.
            </p>
          </div>
        </div>
      </div>

      {/* Grid of Study Materials */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {STUDY_MATERIALS.map((study) => {
          return (
            <div
              key={study.id}
              onClick={() => handleOpenStudy(study)}
              className="rounded-2xl p-5 border transition flex flex-col justify-between cursor-pointer bg-white dark:bg-stone-900 border-amber-100 dark:border-stone-800 hover:border-amber-300 dark:hover:border-amber-500/50 hover:shadow-md text-stone-800 dark:text-stone-200"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 dark:text-amber-200 bg-amber-100 dark:bg-amber-950/60 px-2 py-0.5 rounded">
                    {study.category}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                    <Sparkles className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Liberado com Áudio</span>
                  </span>
                </div>

                <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100 mb-1.5">
                  {study.title}
                </h3>
                <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed mb-3">
                  {study.subtitle}
                </p>

                <div className="flex items-center gap-1.5 flex-wrap mb-4">
                  {study.keyVerses.map((v, i) => (
                    <span key={i} className="text-[10px] bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 px-2 py-0.5 rounded-md">
                      {v}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
                <span className="flex items-center gap-1 font-medium text-amber-800 dark:text-amber-400">
                  <Volume2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>Áudio incluso ({study.estimatedReadMinutes} min)</span>
                </span>
                <span className="text-stone-700 dark:text-stone-300 font-bold hover:text-amber-600">
                  Ler &amp; Ouvir &rarr;
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reader Modal */}
      {activeStudy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/75 backdrop-blur-md overflow-y-auto animate-fadeIn">
          <div className="bg-stone-50 border border-stone-200 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative text-stone-800 my-auto">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-200">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-900 bg-amber-100 px-2.5 py-1 rounded-md">
                {activeStudy.category}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onToggleOffline(activeStudy.id, activeStudy.title)}
                  className={`p-1.5 rounded-lg border text-xs transition ${
                    profile.savedOfflineIds.includes(activeStudy.id)
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                      : 'border-stone-300 text-stone-500 hover:bg-stone-100'
                  }`}
                  title="Salvar offline"
                >
                  <Download className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    audioSpeechService.stop();
                    setIsSpeaking(false);
                    setActiveStudy(null);
                  }}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="mb-4">
              <h2 className="font-serif text-2xl font-bold text-stone-900 mb-1">
                {activeStudy.title}
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 italic">
                {activeStudy.subtitle}
              </p>
            </div>

            <div className="my-4 space-y-3 bg-white p-5 rounded-2xl border border-stone-200 max-h-[50vh] overflow-y-auto font-serif text-sm sm:text-base leading-relaxed text-stone-800">
              {activeStudy.content.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-stone-200">
              <button
                onClick={handleToggleNarration}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition shadow-sm ${
                  isSpeaking ? 'bg-amber-600 text-white animate-pulse' : 'bg-amber-100 hover:bg-amber-200 text-amber-900'
                }`}
              >
                {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                <span>{isSpeaking ? 'Pausar Narração' : 'Ouvir Narração em Voz Alta'}</span>
              </button>

              <button
                onClick={() => {
                  audioSpeechService.stop();
                  setIsSpeaking(false);
                  setActiveStudy(null);
                }}
                className="py-2 px-5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold shadow transition"
              >
                Concluir Estudo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
