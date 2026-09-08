import React, { useState } from 'react';
import { CheckCircle2, Sparkles, X, Shield, ExternalLink } from 'lucide-react';
import { UserProfile } from '../types';
import { soundService } from '../services/soundService';
import { getKiwifyCheckoutUrl } from '../config/paymentConfig';

interface KiwifyCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onActivateSubscription: (code?: string) => void;
}

export const KiwifyCheckoutModal: React.FC<KiwifyCheckoutModalProps> = ({
  isOpen,
  onClose,
  onActivateSubscription
}) => {
  const [simulatedSuccess, setSimulatedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSimulatePayment = () => {
    soundService.playChime(659, 3);
    setSimulatedSuccess(true);
    setTimeout(() => {
      onActivateSubscription('KWFY-' + Math.floor(100000 + Math.random() * 900000));
      onClose();
    }, 1200);
  };

  const handleOpenKiwify = () => {
    const activeUrl = getKiwifyCheckoutUrl();
    window.open(activeUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/75 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="bg-stone-50 border border-stone-200 rounded-2xl max-w-xl w-full p-5 sm:p-7 shadow-2xl relative text-stone-800 my-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-1.5 rounded-full hover:bg-stone-200 transition cursor-pointer"
          aria-label="Fechar modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Kiwify Badge */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 border border-amber-300/80 px-3 py-1 rounded-full text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Assinatura Oficial Kiwify &bull; 100% Segura</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-950 mb-1">
            Desbloqueie o Devocional Completo
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto">
            Aprofunde sua intimidade diária com Deus, com todos os 150 Salmos, orações guiadas sem distrações e áudio narrado.
          </p>
        </div>

        {/* Pricing Card */}
        <div className="bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 text-white rounded-2xl p-4 sm:p-5 shadow-lg mb-5 text-center relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none" />
          <div className="text-amber-100 text-xs font-medium uppercase tracking-wider mb-1">
            Plano Recorrente Mensal no Kiwify
          </div>
          <div className="flex items-baseline justify-center gap-1 my-1">
            <span className="text-sm font-semibold text-amber-100">R$</span>
            <span className="text-4xl sm:text-5xl font-extrabold tracking-tight">14,90</span>
            <span className="text-xs sm:text-sm text-amber-200">/mês</span>
          </div>
          <p className="text-xs text-amber-100/90 font-medium">
            Apenas R$ 0,49 por dia &bull; Cancele a qualquer momento com 1 clique
          </p>
        </div>

        {/* Comparison: Free vs Premium */}
        <div className="bg-white border border-stone-200 rounded-xl p-3.5 sm:p-4 mb-5 shadow-sm">
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2.5">
            O que você desbloqueia no Plano Premium:
          </h4>
          <div className="space-y-2 text-xs sm:text-sm">
            <div className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <div>
                <strong className="text-stone-900 font-semibold">Todos os 150 Salmos Completos</strong>
                <p className="text-[11px] text-stone-500">Leitor bíblico com busca temática, reflexões e comentários devocionais.</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <div>
                <strong className="text-stone-900 font-semibold">Todas as Orações Liberadas</strong>
                <p className="text-[11px] text-stone-500">Orações profundas da manhã, tarde, noite, para acalmar a alma e combater ansiedade.</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <div>
                <strong className="text-stone-900 font-semibold">Estudos Teológicos Avançados com Narração em Áudio</strong>
                <p className="text-[11px] text-stone-500">Voz serena em português para ouvir enquanto ora, cozinha ou dirige.</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <div>
                <strong className="text-stone-900 font-semibold">100% Livre de Anúncios</strong>
                <p className="text-[11px] text-stone-500">Leitura contínua em paz, sem interrupções de banners comerciais.</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <div>
                <strong className="text-stone-900 font-semibold">Acesso Offline Completo</strong>
                <p className="text-[11px] text-stone-500">Guarde seus textos, orações e meditações para ler mesmo sem conexão de internet.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Kiwify Checkout Button */}
        <div className="space-y-2.5 mb-4">
          <button
            id="btn-kiwify-checkout"
            onClick={handleOpenKiwify}
            className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-bold rounded-xl shadow-lg hover:shadow-emerald-600/30 transition flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer"
          >
            <span>Assinar por R$ 14,90 no Kiwify</span>
            <ExternalLink className="w-4 h-4" />
          </button>

          {/* Instant Activation Simulator for Testing/Review */}
          <button
            id="btn-simulate-activation"
            onClick={handleSimulatePayment}
            disabled={simulatedSuccess}
            className="w-full py-2.5 px-4 bg-stone-900 hover:bg-stone-800 text-amber-200 font-semibold rounded-xl text-xs sm:text-sm transition flex items-center justify-center gap-2 border border-stone-700 shadow-sm cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            {simulatedSuccess ? 'Assinatura Aprovada com Sucesso!' : 'Simular Assinatura Aprovada (Ativação Instantânea)'}
          </button>
        </div>

        {/* Footer info */}
        <div className="text-center text-[11px] text-stone-500 space-y-1">
          <div className="flex items-center justify-center gap-1">
            <Shield className="w-3.5 h-3.5 text-emerald-600" />
            <span>Transação processada com criptografia de ponta a ponta pela Kiwify.</span>
          </div>
          <p className="text-[10px] text-stone-400">
            Acesso liberado imediatamente após a confirmação do pagamento no Kiwify.
          </p>
        </div>
      </div>
    </div>
  );
};
