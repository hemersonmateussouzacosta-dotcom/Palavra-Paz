import React from 'react';
import { Download, WifiOff, Sparkles, X, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import { soundService } from '../services/soundService';

interface OfflineLockedModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCheckout: () => void;
  itemTitle?: string;
}

export const OfflineLockedModal: React.FC<OfflineLockedModalProps> = ({
  isOpen,
  onClose,
  onOpenCheckout,
  itemTitle
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/75 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="bg-stone-50 border border-amber-200 rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl relative text-stone-800 text-center my-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-1.5 rounded-full hover:bg-stone-200 transition"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon */}
        <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-800 border border-amber-200 flex items-center justify-center mx-auto mb-4 shadow-sm">
          <WifiOff className="w-8 h-8" />
        </div>

        <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 bg-amber-100 px-3 py-1 rounded-full inline-block mb-2">
          Recurso Exclusivo Kiwify Premium
        </span>

        <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-950 mb-2">
          Acesso Offline ao Devocional
        </h3>

        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-5">
          {itemTitle ? (
            <>
              Para baixar <strong>&ldquo;{itemTitle}&rdquo;</strong> e ler sem conexão de internet em viagens ou retiros, assine o plano Kiwify.
            </>
          ) : (
            'O salvamento e a leitura offline de orações, dos 150 Salmos e estudos bíblicos são reservados aos assinantes do plano Kiwify.'
          )}
        </p>

        {/* Perks Box */}
        <div className="bg-white border border-stone-200 rounded-2xl p-4 text-left text-xs space-y-2 mb-6 shadow-sm">
          <div className="flex items-center gap-2 text-stone-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Baixe todos os 150 Salmos no celular ou computador</span>
          </div>
          <div className="flex items-center gap-2 text-stone-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Leia orações da manhã e da noite sem precisar de Wi-Fi ou dados móveis</span>
          </div>
          <div className="flex items-center gap-2 text-stone-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Estudos teológicos e áudios disponíveis onde você estiver</span>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <button
            onClick={() => {
              onClose();
              onOpenCheckout();
            }}
            className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2 text-sm"
          >
            <Sparkles className="w-4 h-4" />
            <span>Desbloquear Modo Offline por R$ 14,90/mês</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onClose}
            className="w-full py-2 text-xs text-stone-500 hover:text-stone-700 transition"
          >
            Continuar na versão gratuita com internet
          </button>
        </div>
      </div>
    </div>
  );
};
