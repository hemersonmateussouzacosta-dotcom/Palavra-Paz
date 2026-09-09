import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Sparkles, Check, ChevronDown } from 'lucide-react';
import { ThemeMode } from '../types';

interface ThemeSelectorProps {
  currentTheme: ThemeMode;
  isEffectiveDark: boolean;
  onThemeChange: (theme: ThemeMode) => void;
  compact?: boolean;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  currentTheme,
  isEffectiveDark,
  onThemeChange,
  compact = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (mode: ThemeMode) => {
    onThemeChange(mode);
    setIsOpen(false);
  };

  const getActiveLabel = () => {
    if (currentTheme === 'light') return 'Claro';
    if (currentTheme === 'dark') return 'Escuro';
    return isEffectiveDark ? 'Auto (Noite)' : 'Auto (Dia)';
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Toggle Button */}
      <button
        id="theme-selector-button"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Alternar tema de leitura claro ou escuro"
        className={`p-2 rounded-xl text-xs font-medium transition flex items-center gap-1.5 border shadow-xs cursor-pointer ${
          isEffectiveDark
            ? 'bg-stone-800/90 hover:bg-stone-800 text-amber-300 border-stone-700 hover:border-amber-500/50'
            : 'bg-stone-800/80 hover:bg-stone-800 text-amber-200 border-stone-700 hover:border-amber-400/50'
        }`}
        title={`Tema de Leitura: ${getActiveLabel()} (Clique para alterar)`}
      >
        {/* Dynamic Icon based on current selection */}
        {currentTheme === 'light' && (
          <Sun className="w-4 h-4 text-amber-400 shrink-0 animate-fadeIn" />
        )}
        {currentTheme === 'dark' && (
          <Moon className="w-4 h-4 text-amber-300 shrink-0 animate-fadeIn" />
        )}
        {currentTheme === 'auto' && (
          <div className="relative flex items-center justify-center shrink-0">
            {isEffectiveDark ? (
              <Moon className="w-4 h-4 text-amber-300 animate-fadeIn" />
            ) : (
              <Sun className="w-4 h-4 text-amber-400 animate-fadeIn" />
            )}
            <Sparkles className="w-2.5 h-2.5 text-amber-400 absolute -top-1 -right-1" />
          </div>
        )}

        {!compact && (
          <span className="hidden md:inline text-[11px] font-semibold whitespace-nowrap">
            {getActiveLabel()}
          </span>
        )}

        <ChevronDown
          className={`w-3 h-3 text-stone-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-amber-300' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          id="theme-selector-dropdown"
          className="absolute right-0 mt-2 w-56 bg-stone-900/98 backdrop-blur-md border border-stone-700 rounded-2xl shadow-2xl py-2 z-50 text-stone-200 text-xs animate-fadeIn"
          role="menu"
          aria-orientation="vertical"
        >
          <div className="px-3.5 py-1 text-[10px] font-bold text-stone-400 uppercase tracking-wider border-b border-stone-800 mb-1">
            Conforto de Leitura
          </div>

          {/* Option: Light (Claro) */}
          <button
            id="theme-option-light"
            onClick={() => handleSelect('light')}
            className={`w-full text-left px-3.5 py-2 hover:bg-stone-800 flex items-center justify-between transition ${
              currentTheme === 'light'
                ? 'text-amber-300 font-bold bg-stone-800/60'
                : 'text-stone-300'
            }`}
            role="menuitem"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Sun className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="block font-medium">Modo Claro (Dia)</span>
                <span className="block text-[10px] text-stone-400 font-normal">
                  Fundo claro suave e areia
                </span>
              </div>
            </div>
            {currentTheme === 'light' && (
              <Check className="w-4 h-4 text-amber-400 shrink-0" />
            )}
          </button>

          {/* Option: Dark (Escuro) */}
          <button
            id="theme-option-dark"
            onClick={() => handleSelect('dark')}
            className={`w-full text-left px-3.5 py-2 hover:bg-stone-800 flex items-center justify-between transition ${
              currentTheme === 'dark'
                ? 'text-amber-300 font-bold bg-stone-800/60'
                : 'text-stone-300'
            }`}
            role="menuitem"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-lg bg-stone-700/60 border border-stone-600 flex items-center justify-center text-amber-300">
                <Moon className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="block font-medium">Modo Escuro (Noite)</span>
                <span className="block text-[10px] text-stone-400 font-normal">
                  Descanso visual e leitura noturna
                </span>
              </div>
            </div>
            {currentTheme === 'dark' && (
              <Check className="w-4 h-4 text-amber-400 shrink-0" />
            )}
          </button>

          {/* Option: Auto (Automático / Noturno) */}
          <button
            id="theme-option-auto"
            onClick={() => handleSelect('auto')}
            className={`w-full text-left px-3.5 py-2 hover:bg-stone-800 flex items-center justify-between transition ${
              currentTheme === 'auto'
                ? 'text-amber-300 font-bold bg-stone-800/60'
                : 'text-stone-300'
            }`}
            role="menuitem"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-lg bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-300">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="block font-medium">Automático</span>
                <span className="block text-[10px] text-stone-400 font-normal">
                  Escuro das 18h às 6h e pelo sistema
                </span>
              </div>
            </div>
            {currentTheme === 'auto' && (
              <Check className="w-4 h-4 text-amber-400 shrink-0" />
            )}
          </button>

          {/* Helper hint */}
          <div className="mt-1 pt-1.5 border-t border-stone-800/90 px-3.5 text-[10px] text-stone-400 leading-tight">
            {isEffectiveDark
              ? '🌙 Modo noturno ativo para leitura repousante.'
              : '☀️ Modo diurno ativo para boa iluminação.'}
          </div>
        </div>
      )}
    </div>
  );
};
