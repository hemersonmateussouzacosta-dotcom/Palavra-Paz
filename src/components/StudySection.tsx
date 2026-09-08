import React, { useState } from 'react';
import { BookOpen, Sparkles, Volume2, VolumeX, Lock, Download, Check, Share2, ArrowRight } from 'lucide-react';
import { StudyMaterial, UserProfile } from '../types';
import { STUDY_MATERIALS } from '../data/studyData';
import { audioSpeechService } from '../services/audioSpeechService';
import { soundService } from '../services/soundService';

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
  const [lockedStudy, setLockedStudy] = useState<StudyMaterial | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const isPremium = profile.subscriptionStatus === 'premium';

  const handleOpenStudy = (study: StudyMaterial) => {
    if (!isPremium) {
      setLockedStudy(study);
      soundService.playChime(440, 1.2);
      return;
    }
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
      const textToSpeak = `${activeStudy.title}. ${activeStudy.subtitle}. ${activeStudy.content.join(' ')}`;
      audioSpeechService.speak(textToSpeak, () => setIsSpeaking(false));
    }
  };

  return (
    <div id="study-materials-section" className="space-y-6">
      {/* Header */}
      <div className="bg-white/95 rounded-2xl p-5 sm:p-6 border border-stone-200 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded-full mb-1">
              <Sparkles className="w-3 h-3 text-amber-700" />
              <span>Conteúdo Avançado com Narração em Áudio Inclusa</span>
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
              Estudos Bíblicos Avançados
            </h2>
            <p className="text-xs sm:text-sm text-stone-600">
              Aprofunde suas raízes na Palavra com exegese bíblica, teologia prática e planos de estudo completos narrados com voz serena.
            </p>
          </div>
        </div>

        {!isPremium && (
          <div className="mt-4 p-4 bg-gradient-to-r from-amber-50 to-amber-100/60 border border-amber-200 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="text-amber-900">
              <strong className="block text-amber-950 font-bold mb-0.5">
                Exclusivo para Assinantes Kiwify (R$ 14,90/mês):
              </strong>
              <span>
                Todos os materiais de estudo avançados possuem narração em áudio inclusa e modo de leitura offline para membros assinantes.
              </span>
            </div>
            <button
              onClick={onOpenCheckout}
              className="bg-amber-600 hover:bg-amber-700 active:scale-95 text-white font-bold py-2 px-4 rounded-xl shadow shrink-0 flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Assinar por R$ 14,90</span>
            </button>
          </div>
        )}
      </div>

      {/* Grid of Study Materials */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {STUDY_MATERIALS.map((study) => {
          const isLocked = !isPremium;
          return (
            <div
              key={study.id}
              onClick={() => handleOpenStudy(study)}
              className={`rounded-2xl p-5 border transition flex flex-col justify-between cursor-pointer ${
                isLocked
                  ? 'bg-stone-100/90 border-stone-200 hover:border-amber-400 text-stone-700'
                  : 'bg-white border-amber-100 hover:border-amber-300 hover:shadow-md text-stone-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 bg-amber-100 px-2 py-0.5 rounded">
                    {study.category}
                  </span>
                  {isLocked ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-900 bg-amber-200 px-2 py-0.5 rounded-full border border-amber-300">
                      <Lock className="w-2.5 h-2.5 text-amber-800" />
                      <span>Kiwify Premium</span>
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      Liberado
                    </span>
                  )}
                </div>

                <h3 className="font-serif font-bold text-base text-stone-900 mb-1.5">
                  {study.title}
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed mb-3">
                  {study.subtitle}
                </p>

                <div className="flex items-center gap-1.5 flex-wrap mb-4">
                  {study.keyVerses.map((v, i) => (
                    <span key={i} className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-md">
                      {v}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                <span className="flex items-center gap-1 font-medium text-amber-800">
                  <Volume2 className="w-3.5 h-3.5 text-amber-600" />
                  <span>Narração em Áudio inclusa ({study.estimatedReadMinutes} min)</span>
                </span>
                <span className="text-stone-700 font-bold">
                  {isLocked ? 'Desbloquear &rarr;' : 'Ler & Ouvir &rarr;'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Locked Study Paywall Modal */}
      {lockedStudy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/75 backdrop-blur-md overflow-y-auto animate-fadeIn">
          <div className="bg-stone-50 border border-amber-300 rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl relative text-stone-800 text-center my-auto">
            <button
              onClick={() => setLockedStudy(null)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-1.5 rounded-full hover:bg-stone-200 transition"
              aria-label="Fechar"
            >
              ✕
            </button>

            <div className="w-14 h-14 rounded-2xl bg-amber-100 border border-amber-300 text-amber-800 flex items-center justify-center mx-auto mb-3">
              <Lock className="w-7 h-7" />
            </div>

            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 bg-amber-200 px-3 py-1 rounded-full inline-block mb-2">
              Estudo Bíblico Avançado &bull; Kiwify Premium
            </span>

            <h3 className="font-serif text-xl font-bold text-stone-950 mb-1.5">
              {lockedStudy.title}
            </h3>
            <p className="text-xs text-stone-600 mb-4 leading-relaxed">
              {lockedStudy.subtitle}. Este material inclui exegese profunda e narração completa em áudio.
            </p>

            <div className="bg-white border border-stone-200 rounded-xl p-3.5 mb-5 text-left text-xs space-y-2">
              <strong className="text-stone-900 font-bold block mb-1">
                Ao assinar o Kiwify por R$ 14,90/mês você recebe:
              </strong>
              <div className="flex items-center gap-2 text-stone-700">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Narração em áudio de todos os estudos</span>
              </div>
              <div className="flex items-center gap-2 text-stone-700">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Todos os 150 Salmos e orações sem anúncios</span>
              </div>
              <div className="flex items-center gap-2 text-stone-700">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Download para leitura e áudio offline</span>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => {
                  setLockedStudy(null);
                  onOpenCheckout();
                }}
                className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2 text-sm"
              >
                <Sparkles className="w-4 h-4" />
                <span>Desbloquear Estudos por R$ 14,90/mês</span>
              </button>

              <button
                onClick={() => setLockedStudy(null)}
                className="w-full py-2 text-xs text-stone-500 hover:text-stone-700 transition"
              >
                Voltar
              </button>
            </div>
          </div>
        </div>
      )}

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
