import React, { useState } from 'react';
import { ShieldCheck, Lock, X, Eye, EyeOff, MessageCircle, ExternalLink, AlertCircle, ArrowRight } from 'lucide-react';
import { soundService } from '../services/soundService';

interface SupportAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  supportWhatsAppUrl?: string;
  configuredPassword?: string;
}

export const SupportAccessModal: React.FC<SupportAccessModalProps> = ({
  isOpen,
  onClose,
  supportWhatsAppUrl = 'https://wa.link/18u8sf',
  configuredPassword = 'hmcjp159'
}) => {
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const requiredPass = (configuredPassword || 'hmcjp159').trim();
    if (passwordInput.trim() === requiredPass) {
      setIsSuccess(true);
      soundService.playChime(528, 1.2);

      setTimeout(() => {
        window.open(supportWhatsAppUrl, '_blank', 'noopener,noreferrer');
        setIsSuccess(false);
        setPasswordInput('');
        onClose();
      }, 700);
    } else {
      soundService.playChime(300, 0.4);
      setErrorMessage('Senha de acesso incorreta. Verifique os dados digitados ou contate a administração.');
    }
  };

  const handleClose = () => {
    setPasswordInput('');
    setErrorMessage(null);
    setIsSuccess(false);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="support-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={handleClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl relative text-stone-900 dark:text-stone-100 overflow-hidden"
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition"
          aria-label="Fechar modal de suporte"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon & Header */}
        <div className="flex items-center gap-3.5 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <MessageCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-0.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Atendimento Autorizado</span>
            </div>
            <h3 id="support-modal-title" className="text-lg sm:text-xl font-serif font-bold">
              Canal de Suporte
            </h3>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed mb-5">
          Para iniciar o atendimento com o suporte exclusivo via WhatsApp, informe sua senha de acesso autorizada abaixo:
        </p>

        {/* Feedback Messages */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-300 text-xs flex items-start gap-2 animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600 dark:text-red-400" />
            <span className="leading-snug">{errorMessage}</span>
          </div>
        )}

        {isSuccess && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span className="font-semibold">Senha validada com sucesso! Redirecionando para o WhatsApp...</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-stone-500" />
              <span>Senha de Acesso ao Suporte:</span>
            </label>
            <div className="relative">
              <input
                id="input-support-password"
                type={showPassword ? 'text' : 'password'}
                autoFocus
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                placeholder="Digite a senha de liberação"
                className="w-full px-3.5 py-2.5 pr-10 text-sm rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/80 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-1"
                aria-label={showPassword ? 'Ocultar senha' : 'Exibir senha'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex gap-2.5 pt-1">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-2.5 px-4 rounded-xl border border-stone-300 dark:border-stone-700 text-xs font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!passwordInput.trim() || isSuccess}
              className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-stone-300 dark:disabled:bg-stone-800 disabled:cursor-not-allowed text-white text-xs font-bold shadow-md hover:shadow-emerald-600/30 transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Acessar Suporte</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>

        <div className="mt-5 pt-4 border-t border-stone-100 dark:border-stone-800/80 text-center">
          <p className="text-[11px] text-stone-400 dark:text-stone-500 flex items-center justify-center gap-1">
            <span>Canal reservado para membros e administradores autorizados.</span>
          </p>
        </div>
      </div>
    </div>
  );
};
