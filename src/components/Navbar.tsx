import React, { useState } from 'react';
import { BookOpen, Sparkles, Clock, Heart, Headphones, Volume2, VolumeX, Shield, User, Award, Flame } from 'lucide-react';
import { UserProfile } from '../types';
import { soundService } from '../services/soundService';

interface NavbarProps {
  activeTab: 'inicio' | 'meditacao' | 'salmos' | 'cronometro' | 'estudos' | 'progresso';
  setActiveTab: (tab: 'inicio' | 'meditacao' | 'salmos' | 'cronometro' | 'estudos' | 'progresso') => void;
  profile: UserProfile;
  onOpenCheckout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  profile,
  onOpenCheckout
}) => {
  const [ambientSound, setAmbientSound] = useState<'none' | 'chuva' | 'celestial' | 'aguas'>('none');
  const [soundMenuOpen, setSoundMenuOpen] = useState(false);

  const handleToggleSound = (type: 'none' | 'chuva' | 'celestial' | 'aguas') => {
    if (type === 'none') {
      soundService.stopAmbient();
      setAmbientSound('none');
    } else {
      soundService.playAmbient(type, 0.25);
      setAmbientSound(type);
    }
    setSoundMenuOpen(false);
  };

  const isPremium = profile.subscriptionStatus === 'premium';
  const isExpired = profile.subscriptionStatus === 'expired' || profile.trialDaysUsed >= 3;

  return (
    <header className="sticky top-0 z-40 bg-stone-900 text-stone-100 border-b border-stone-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Brand Logo & Name */}
          <div
            id="brand-logo-button"
            onClick={() => setActiveTab('inicio')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-stone-950 shadow-md shadow-amber-500/20 group-hover:scale-105 transition">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="font-serif font-bold text-lg sm:text-xl tracking-tight text-amber-100 flex items-center gap-1.5">
                Palavra & Paz
              </span>
              <span className="text-[10px] sm:text-xs text-amber-300/80 block font-medium">
                Devocional & Oração Diária
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <button
              id="nav-tab-inicio"
              onClick={() => setActiveTab('inicio')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'inicio'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800'
              }`}
            >
              Versículo & Orações
            </button>

            <button
              id="nav-tab-meditacao"
              onClick={() => setActiveTab('meditacao')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'meditacao'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800'
              }`}
            >
              Meditação Guiada
            </button>

            <button
              id="nav-tab-salmos"
              onClick={() => setActiveTab('salmos')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition relative flex items-center gap-1 ${
                activeTab === 'salmos'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800'
              }`}
            >
              <span>Todos os Salmos</span>
              {!isPremium && (
                <span className="text-[9px] bg-amber-500 text-stone-950 font-bold px-1 rounded">
                  PRO
                </span>
              )}
            </button>

            <button
              id="nav-tab-cronometro"
              onClick={() => setActiveTab('cronometro')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1 ${
                activeTab === 'cronometro'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Cronômetro</span>
            </button>

            <button
              id="nav-tab-estudos"
              onClick={() => setActiveTab('estudos')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1 ${
                activeTab === 'estudos'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800'
              }`}
            >
              <span>Estudos & Planos</span>
              {!isPremium && (
                <span className="text-[9px] bg-amber-500 text-stone-950 font-bold px-1 rounded">
                  PRO
                </span>
              )}
            </button>

            <button
              id="nav-tab-progresso"
              onClick={() => setActiveTab('progresso')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                activeTab === 'progresso'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Meu Progresso</span>
              {profile.streakDays > 0 && (
                <span className="flex items-center text-[10px] text-orange-300 bg-orange-950/60 px-1 rounded-full border border-orange-800/40">
                  <Flame className="w-2.5 h-2.5 mr-0.5 text-orange-400" />
                  {profile.streakDays}d
                </span>
              )}
            </button>
          </nav>

          {/* Right Header Actions: Sound Ambience & Kiwify Status */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Ambient Sound Dropdown */}
            <div className="relative">
              <button
                id="btn-sound-ambient"
                onClick={() => setSoundMenuOpen(!soundMenuOpen)}
                className={`p-2 rounded-xl text-xs font-medium transition flex items-center gap-1.5 border ${
                  ambientSound !== 'none'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                    : 'bg-stone-800 text-stone-300 border-stone-700 hover:bg-stone-750'
                }`}
                title="Sons de Fundo para Oração e Meditação"
              >
                {ambientSound !== 'none' ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4" />}
                <span className="hidden sm:inline capitalize text-[11px]">
                  {ambientSound === 'none' ? 'Som Ambiente' : ambientSound}
                </span>
              </button>

              {soundMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-stone-800 border border-stone-700 rounded-xl shadow-xl py-1.5 z-50 text-xs text-stone-200">
                  <div className="px-3 py-1 text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                    Sons para Oração & Paz
                  </div>
                  <button
                    onClick={() => handleToggleSound('none')}
                    className={`w-full text-left px-3 py-1.5 hover:bg-stone-700 flex items-center justify-between ${ambientSound === 'none' ? 'text-amber-400 font-semibold' : ''}`}
                  >
                    <span>Mudo (Desligado)</span>
                    {ambientSound === 'none' && <span className="text-[10px]">&bull;</span>}
                  </button>
                  <button
                    onClick={() => handleToggleSound('celestial')}
                    className={`w-full text-left px-3 py-1.5 hover:bg-stone-700 flex items-center justify-between ${ambientSound === 'celestial' ? 'text-amber-400 font-semibold' : ''}`}
                  >
                    <span>Harpa & Drone Celestial</span>
                    {ambientSound === 'celestial' && <span className="text-[10px]">&bull;</span>}
                  </button>
                  <button
                    onClick={() => handleToggleSound('chuva')}
                    className={`w-full text-left px-3 py-1.5 hover:bg-stone-700 flex items-center justify-between ${ambientSound === 'chuva' ? 'text-amber-400 font-semibold' : ''}`}
                  >
                    <span>Chuva Suave Calma</span>
                    {ambientSound === 'chuva' && <span className="text-[10px]">&bull;</span>}
                  </button>
                  <button
                    onClick={() => handleToggleSound('aguas')}
                    className={`w-full text-left px-3 py-1.5 hover:bg-stone-700 flex items-center justify-between ${ambientSound === 'aguas' ? 'text-amber-400 font-semibold' : ''}`}
                  >
                    <span>Águas Tranquilas (Riacho)</span>
                    {ambientSound === 'aguas' && <span className="text-[10px]">&bull;</span>}
                  </button>
                </div>
              )}
            </div>

            {/* Subscription CTA Pill */}
            {isPremium ? (
              <div className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 px-3 py-1.5 rounded-xl font-bold text-xs shadow-sm">
                <Shield className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Kiwify Premium</span>
              </div>
            ) : (
              <button
                id="btn-navbar-upgrade"
                onClick={onOpenCheckout}
                className="flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-bold px-3 py-1.5 rounded-xl text-xs shadow-md transition transform active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5 text-stone-900" />
                <span>{isExpired ? 'Assinar R$ 14,90' : 'Assinar Kiwify'}</span>
              </button>
            )}

            {/* Profile Avatar trigger */}
            <button
              id="btn-profile-nav"
              onClick={() => setActiveTab('progresso')}
              className="w-8 h-8 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center text-stone-300 hover:text-white hover:border-amber-500/50 transition"
              title="Meu Perfil e Progresso"
            >
              <User className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar for easy one-thumb access */}
      <div className="lg:hidden border-t border-stone-800 bg-stone-900/95 px-2 py-1.5 flex justify-around items-center">
        <button
          onClick={() => setActiveTab('inicio')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded text-[10px] font-medium ${
            activeTab === 'inicio' ? 'text-amber-400 font-bold' : 'text-stone-400'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Versículos</span>
        </button>

        <button
          onClick={() => setActiveTab('meditacao')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded text-[10px] font-medium ${
            activeTab === 'meditacao' ? 'text-amber-400 font-bold' : 'text-stone-400'
          }`}
        >
          <Headphones className="w-4 h-4" />
          <span>Meditação</span>
        </button>

        <button
          onClick={() => setActiveTab('salmos')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded text-[10px] font-medium relative ${
            activeTab === 'salmos' ? 'text-amber-400 font-bold' : 'text-stone-400'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Salmos</span>
          {!isPremium && (
            <span className="absolute -top-0.5 right-1 w-2 h-2 bg-amber-500 rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('cronometro')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded text-[10px] font-medium ${
            activeTab === 'cronometro' ? 'text-amber-400 font-bold' : 'text-stone-400'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Tempo</span>
        </button>

        <button
          onClick={() => setActiveTab('progresso')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded text-[10px] font-medium ${
            activeTab === 'progresso' ? 'text-amber-400 font-bold' : 'text-stone-400'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Progresso</span>
        </button>
      </div>
    </header>
  );
};
