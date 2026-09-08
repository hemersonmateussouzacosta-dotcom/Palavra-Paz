import React, { useState } from 'react';
import {
  BookOpen,
  Sparkles,
  Clock,
  Heart,
  Headphones,
  Volume2,
  VolumeX,
  Shield,
  User,
  Award,
  Flame,
  ShieldAlert,
  BookMarked,
  Instagram
} from 'lucide-react';
import { UserProfile } from '../types';
import { soundService } from '../services/soundService';

interface NavbarProps {
  activeTab: 'inicio' | 'meditacao' | 'salmos' | 'cronometro' | 'estudos' | 'progresso';
  setActiveTab: (tab: 'inicio' | 'meditacao' | 'salmos' | 'cronometro' | 'estudos' | 'progresso') => void;
  profile: UserProfile;
  onOpenCheckout: () => void;
  onOpenAdmin: () => void;
  isAdmin?: boolean;
  instagramUrl?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  profile,
  onOpenCheckout,
  onOpenAdmin,
  isAdmin = false,
  instagramUrl = 'https://www.instagram.com/verdadeiraluzcaminho?stkn=YXB6ZG51czJuZjNm'
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

  return (
    <>
      <header className="sticky top-0 z-40 bg-stone-900/98 backdrop-blur-md text-stone-100 border-b border-stone-800 shadow-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-6">
          <div className="flex items-center justify-between h-15 sm:h-18 gap-2">
            {/* Brand Logo & Name - Centered & perfectly aligned for mobile & desktop */}
            <div
              id="brand-logo-button"
              onClick={() => setActiveTab('inicio')}
              className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group shrink-0 py-1"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-stone-950 shadow-md shadow-amber-500/20 group-hover:scale-105 transition shrink-0">
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="flex flex-col justify-center">
                <span className="font-serif font-bold text-base sm:text-xl tracking-tight text-amber-100 flex items-center gap-1.5 leading-tight whitespace-nowrap">
                  Palavra &amp; Paz
                  {isAdmin && (
                    <span className="text-[9px] bg-amber-600 text-stone-950 font-mono px-1 py-0.2 rounded font-bold uppercase tracking-wider">
                      ADM
                    </span>
                  )}
                </span>
                <span className="text-[9px] sm:text-xs text-amber-300/80 font-medium leading-tight mt-0.5 whitespace-nowrap">
                  Devocional &amp; Oração Diária
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
                Versículo &amp; Orações
              </button>

              <button
                id="nav-tab-meditacao"
                onClick={() => setActiveTab('meditacao')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                  activeTab === 'meditacao'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'text-stone-300 hover:text-white hover:bg-stone-800'
                }`}
              >
                <Headphones className="w-3.5 h-3.5" />
                <span>Meditação Guiada</span>
                {!isPremium && (
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1 rounded font-bold border border-amber-500/30">
                    Pro
                  </span>
                )}
              </button>

              <button
                id="nav-tab-salmos"
                onClick={() => setActiveTab('salmos')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                  activeTab === 'salmos'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'text-stone-300 hover:text-white hover:bg-stone-800'
                }`}
              >
                <Heart className="w-3.5 h-3.5 text-amber-400" />
                <span>Todos os Salmos</span>
                {!isPremium && (
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1 rounded font-bold border border-amber-500/30">
                    Pro
                  </span>
                )}
              </button>

              <button
                id="nav-tab-cronometro"
                onClick={() => setActiveTab('cronometro')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
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
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                  activeTab === 'estudos'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'text-stone-300 hover:text-white hover:bg-stone-800'
                }`}
              >
                <BookMarked className="w-3.5 h-3.5 text-amber-400" />
                <span>Estudos Bíblicos</span>
                {!isPremium && (
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1 rounded font-bold border border-amber-500/30">
                    Pro
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

            {/* Right Header Actions: Sound Ambience, Admin, Kiwify Status */}
            <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
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
                  <span className="hidden md:inline capitalize text-[11px]">
                    {ambientSound === 'none' ? 'Som Ambiente' : ambientSound}
                  </span>
                </button>

                {soundMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-stone-800 border border-stone-700 rounded-xl shadow-xl py-1.5 z-50 text-xs text-stone-200">
                    <div className="px-3 py-1 text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                      Sons para Oração &amp; Paz
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
                      <span>Harpa &amp; Som Celestial</span>
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
                      <span>Águas Tranquilas</span>
                      {ambientSound === 'aguas' && <span className="text-[10px]">&bull;</span>}
                    </button>
                  </div>
                )}
              </div>

              {/* Instagram Official Community Link */}
              <a
                id="btn-instagram-nav"
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl text-xs font-medium transition flex items-center gap-1.5 bg-gradient-to-r from-pink-600/20 via-purple-600/20 to-amber-600/20 border border-pink-500/40 text-pink-200 hover:text-white hover:border-pink-300"
                title="Siga @verdadeiraluzcaminho no Instagram"
              >
                <Instagram className="w-4 h-4 text-pink-400 shrink-0" />
                <span className="hidden xl:inline text-[11px] font-bold">Instagram</span>
              </a>

              {/* Admin Panel Quick Access */}
              <button
                id="btn-admin-nav"
                onClick={onOpenAdmin}
                className="p-2 rounded-xl text-xs font-medium transition flex items-center gap-1 bg-stone-800 text-stone-300 border border-stone-700 hover:text-amber-300 hover:border-amber-500/50"
                title="Acesso de Administrador (ADM)"
              >
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span className="hidden xl:inline text-[11px] font-bold">ADM</span>
              </button>

              {/* Subscription CTA Pill */}
              {isPremium ? (
                <div className="flex items-center gap-1 bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 px-2.5 sm:px-3 py-1.5 rounded-xl font-bold text-xs shadow-sm shrink-0">
                  <Shield className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Kiwify Premium</span>
                  <span className="sm:hidden text-[11px]">Premium</span>
                </div>
              ) : (
                <button
                  id="btn-navbar-upgrade"
                  onClick={onOpenCheckout}
                  className="flex items-center gap-1 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-bold px-2.5 sm:px-3 py-1.5 rounded-xl text-xs shadow-md transition transform active:scale-95 shrink-0"
                >
                  <Sparkles className="w-3.5 h-3.5 text-stone-900" />
                  <span className="text-[11px] sm:text-xs whitespace-nowrap">
                    Assinar Kiwify
                  </span>
                </button>
              )}

              {/* Profile Avatar trigger */}
              <button
                id="btn-profile-nav"
                onClick={() => setActiveTab('progresso')}
                className="w-8 h-8 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center text-stone-300 hover:text-white hover:border-amber-500/50 transition shrink-0"
                title="Meu Perfil e Progresso"
              >
                <User className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Fixed Bottom Navigation Bar - Positioned at bottom for one-thumb easy access */}
      <nav
        aria-label="Navegação móvel"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-stone-900/98 backdrop-blur-lg border-t border-stone-800/90 px-2 py-1.5 flex justify-around items-center shadow-2xl safe-area-bottom"
      >
        <button
          onClick={() => setActiveTab('inicio')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded text-[10px] font-medium transition ${
            activeTab === 'inicio' ? 'text-amber-400 font-bold' : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Versículos</span>
        </button>

        <button
          onClick={() => setActiveTab('meditacao')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded text-[10px] font-medium relative transition ${
            activeTab === 'meditacao' ? 'text-amber-400 font-bold' : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <Headphones className="w-4 h-4" />
          <span>Meditação</span>
          {!isPremium && (
            <span className="absolute top-0.5 right-1 w-1.5 h-1.5 bg-amber-500 rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('salmos')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded text-[10px] font-medium relative transition ${
            activeTab === 'salmos' ? 'text-amber-400 font-bold' : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Salmos</span>
          {!isPremium && (
            <span className="absolute top-0.5 right-1 w-1.5 h-1.5 bg-amber-500 rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('cronometro')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded text-[10px] font-medium transition ${
            activeTab === 'cronometro' ? 'text-amber-400 font-bold' : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Tempo</span>
        </button>

        <button
          onClick={() => setActiveTab('estudos')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded text-[10px] font-medium relative transition ${
            activeTab === 'estudos' ? 'text-amber-400 font-bold' : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <BookMarked className="w-4 h-4" />
          <span>Estudos</span>
          {!isPremium && (
            <span className="absolute top-0.5 right-1 w-1.5 h-1.5 bg-amber-500 rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('progresso')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded text-[10px] font-medium transition ${
            activeTab === 'progresso' ? 'text-amber-400 font-bold' : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Progresso</span>
        </button>
      </nav>
    </>
  );
};
