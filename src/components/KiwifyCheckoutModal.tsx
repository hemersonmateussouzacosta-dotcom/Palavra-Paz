import React, { useState } from 'react';
import { CheckCircle2, Sparkles, X, Shield, ExternalLink, MessageCircle, ShieldCheck } from 'lucide-react';
import { UserProfile } from '../types';
import { soundService } from '../services/soundService';
import { getKiwifyCheckoutUrl, getAdFreeCheckoutUrl } from '../config/paymentConfig';

interface KiwifyCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onActivateSubscription: (code?: string, planType?: 'premium' | 'ad_free') => void;
  adFreePrice?: string;
  premiumPrice?: string;
  onRequestSupport?: () => void;
}

export const KiwifyCheckoutModal: React.FC<KiwifyCheckoutModalProps> = ({
  isOpen,
  onClose,
  onActivateSubscription,
  adFreePrice = '4,90',
  premiumPrice = '14,90',
  onRequestSupport
}) => {
  const [selectedPlan, setSelectedPlan] = useState<'ad_free' | 'premium'>('premium');
  const [simulatedSuccess, setSimulatedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSimulatePayment = () => {
    soundService.playChime(659, 3);
    setSimulatedSuccess(true);
    setTimeout(() => {
      const code = (selectedPlan === 'ad_free' ? 'KWFY-ADFREE-' : 'KWFY-') + Math.floor(100000 + Math.random() * 900000);
      onActivateSubscription(code, selectedPlan);
      onClose();
    }, 1200);
  };

  const handleOpenKiwify = () => {
    const activeUrl = selectedPlan === 'ad_free' ? getAdFreeCheckoutUrl() : getKiwifyCheckoutUrl();
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
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 border border-amber-300/80 px-3 py-1 rounded-full text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Assinatura Oficial Kiwify &bull; 100% Segura</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-950 mb-1">
            Escolha o Seu Plano Devocional
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto">
            Aprofunde sua intimidade diária com Deus em paz, com leitura fluida e sem distrações.
          </p>
        </div>

        {/* Plan Selector Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-stone-200/80 rounded-xl mb-4">
          <button
            type="button"
            onClick={() => setSelectedPlan('ad_free')}
            className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              selectedPlan === 'ad_free'
                ? 'bg-white text-teal-900 shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
            <span>Plano Sem Anúncios (Ad-Free)</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedPlan('premium')}
            className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              selectedPlan === 'premium'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-200 shrink-0" />
            <span>Plano Premium Completo</span>
          </button>
        </div>

        {/* Dynamic Pricing Card */}
        {selectedPlan === 'ad_free' ? (
          <div className="bg-gradient-to-br from-teal-600 via-emerald-600 to-teal-800 text-white rounded-2xl p-4 sm:p-5 shadow-lg mb-4 text-center relative overflow-hidden animate-fadeIn">
            <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none" />
            <div className="text-teal-100 text-xs font-medium uppercase tracking-wider mb-1">
              Plano Sem Anúncios &bull; Foco &amp; Serenidade
            </div>
            <div className="flex items-baseline justify-center gap-1 my-1">
              <span className="text-sm font-semibold text-teal-100">R$</span>
              <span className="text-4xl sm:text-5xl font-extrabold tracking-tight">{adFreePrice}</span>
              <span className="text-xs sm:text-sm text-teal-200">/mês</span>
            </div>
            <p className="text-xs text-teal-100/90 font-medium">
              Menos de R$ 0,17 por dia &bull; Cancele a qualquer momento com 1 clique
            </p>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 text-white rounded-2xl p-4 sm:p-5 shadow-lg mb-4 text-center relative overflow-hidden animate-fadeIn">
            <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none" />
            <div className="inline-block bg-amber-400 text-stone-950 text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full mb-1">
              Mais Completo &bull; Recomendado
            </div>
            <div className="flex items-baseline justify-center gap-1 my-1">
              <span className="text-sm font-semibold text-amber-100">R$</span>
              <span className="text-4xl sm:text-5xl font-extrabold tracking-tight">{premiumPrice}</span>
              <span className="text-xs sm:text-sm text-amber-200">/mês</span>
            </div>
            <p className="text-xs text-amber-100/90 font-medium">
              Apenas R$ 0,49 por dia &bull; Cancele a qualquer momento com 1 clique
            </p>
          </div>
        )}

        {/* Dynamic Comparison & Checklist */}
        <div className="bg-white border border-stone-200 rounded-xl p-3.5 sm:p-4 mb-4 shadow-sm">
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2.5">
            {selectedPlan === 'ad_free'
              ? 'O que inclui o Plano Sem Anúncios (Ad-Free):'
              : 'O que você desbloqueia no Plano Premium Completo:'}
          </h4>
          <div className="space-y-2 text-xs sm:text-sm">
            <div className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <div>
                <strong className="text-stone-900 font-semibold">100% Livre de Anúncios e Banners</strong>
                <p className="text-[11px] text-stone-500">Nenhum anúncio ou patrocinado na tela. Leitura contínua em paz e serenidade.</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <div>
                <strong className="text-stone-900 font-semibold">Versículo do Dia &amp; Orações Essenciais em Paz</strong>
                <p className="text-[11px] text-stone-500">Reflexões diárias, orações da manhã e da noite com navegação visual limpa.</p>
              </div>
            </div>

            {selectedPlan === 'premium' ? (
              <>
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <strong className="text-stone-900 font-semibold">Todos os 150 Salmos Bíblicos Completos</strong>
                    <p className="text-[11px] text-stone-500">Acesso ilimitado ao saltério inteiro com comentários teológicos e busca.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <strong className="text-stone-900 font-semibold">Todas as Orações Profundas &amp; Contra Ansiedade</strong>
                    <p className="text-[11px] text-stone-500">Orações para acalmar a alma, proteção familiar e momentos difíceis.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <strong className="text-stone-900 font-semibold">Meditações &amp; Estudos Teológicos Narrados em Áudio</strong>
                    <p className="text-[11px] text-stone-500">Ouça com voz suave em português no carro, caminhada ou antes de dormir.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <strong className="text-stone-900 font-semibold">Modo Offline Completo</strong>
                    <p className="text-[11px] text-stone-500">Acesso garantido aos seus textos sagrados mesmo sem conexão com a internet.</p>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div>
                  <strong className="text-stone-900 font-semibold">Upgrade Fácil a Qualquer Momento</strong>
                  <p className="text-[11px] text-stone-500">Se desejar liberar os 150 Salmos e áudios guiados no futuro, basta migrar para o Premium.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Kiwify Checkout Button */}
        <div className="space-y-2.5 mb-4">
          <button
            id="btn-kiwify-checkout"
            onClick={handleOpenKiwify}
            className={`w-full py-3.5 px-4 text-white font-bold rounded-xl shadow-lg transition flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer ${
              selectedPlan === 'ad_free'
                ? 'bg-teal-600 hover:bg-teal-700 active:scale-[0.99] hover:shadow-teal-600/30'
                : 'bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] hover:shadow-emerald-600/30'
            }`}
          >
            <span>
              {selectedPlan === 'ad_free'
                ? `Assinar Plano Sem Anúncios (R$ ${adFreePrice}) no Kiwify`
                : `Assinar Plano Premium (R$ ${premiumPrice}) no Kiwify`}
            </span>
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
            {simulatedSuccess
              ? `Assinatura ${selectedPlan === 'ad_free' ? 'Sem Anúncios' : 'Premium'} Aprovada com Sucesso!`
              : `Simular Ativação do ${selectedPlan === 'ad_free' ? 'Plano Sem Anúncios' : 'Plano Premium'}`}
          </button>
        </div>

        {/* Footer info */}
        <div className="text-center text-[11px] text-stone-500 space-y-2">
          <div className="flex items-center justify-center gap-1">
            <Shield className="w-3.5 h-3.5 text-emerald-600" />
            <span>Transação processada com criptografia de ponta a ponta pela Kiwify.</span>
          </div>
          <p className="text-[10px] text-stone-400">
            Acesso liberado imediatamente após a confirmação do pagamento no Kiwify.
          </p>
          <div className="pt-1">
            {onRequestSupport ? (
              <button
                type="button"
                onClick={onRequestSupport}
                className="inline-flex items-center gap-1.5 text-xs text-emerald-700 hover:text-emerald-900 font-semibold transition hover:underline cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>Dúvidas? Atendimento de Suporte</span>
              </button>
            ) : (
              <a
                href="https://wa.link/18u8sf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-emerald-700 hover:text-emerald-900 font-semibold transition hover:underline"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>Dúvidas? Atendimento no WhatsApp</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
