import React, { useState, useEffect } from 'react';
import { CheckCircle2, Sparkles, X, Shield, ExternalLink, Settings, Save, RotateCcw, Check, HelpCircle } from 'lucide-react';
import { UserProfile } from '../types';
import { soundService } from '../services/soundService';
import { getKiwifyCheckoutUrl, saveKiwifyCheckoutUrl, DEFAULT_KIWIFY_CHECKOUT_URL } from '../config/paymentConfig';

interface KiwifyCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onActivateSubscription: (code?: string) => void;
}

export const KiwifyCheckoutModal: React.FC<KiwifyCheckoutModalProps> = ({
  isOpen,
  onClose,
  profile,
  onActivateSubscription
}) => {
  const [customKiwifyUrl, setCustomKiwifyUrl] = useState(getKiwifyCheckoutUrl());
  const [activationCode, setActivationCode] = useState('');
  const [showConfigLink, setShowConfigLink] = useState(false);
  const [simulatedSuccess, setSimulatedSuccess] = useState(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCustomKiwifyUrl(getKiwifyCheckoutUrl());
      setSaveSuccessMessage(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isExpired = profile.subscriptionStatus === 'expired' || profile.trialDaysUsed >= 3;

  const handleSimulatePayment = () => {
    soundService.playChime(659, 3);
    setSimulatedSuccess(true);
    setTimeout(() => {
      onActivateSubscription(activationCode || 'KWFY-' + Math.floor(100000 + Math.random() * 900000));
      onClose();
    }, 1200);
  };

  const handleOpenKiwify = () => {
    const activeUrl = customKiwifyUrl.trim() || DEFAULT_KIWIFY_CHECKOUT_URL;
    window.open(activeUrl, '_blank', 'noopener,noreferrer');
  };

  const handleSaveUrl = () => {
    saveKiwifyCheckoutUrl(customKiwifyUrl.trim());
    setSaveSuccessMessage(true);
    soundService.playChime(528, 1.2);
    setTimeout(() => setSaveSuccessMessage(false), 3000);
  };

  const handleResetUrl = () => {
    setCustomKiwifyUrl(DEFAULT_KIWIFY_CHECKOUT_URL);
    saveKiwifyCheckoutUrl(DEFAULT_KIWIFY_CHECKOUT_URL);
    setSaveSuccessMessage(true);
    setTimeout(() => setSaveSuccessMessage(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/75 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="bg-stone-50 border border-stone-200 rounded-2xl max-w-xl w-full p-5 sm:p-7 shadow-2xl relative text-stone-800 my-auto">
        {/* Close button only if not locked strictly */}
        {!isExpired && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-1.5 rounded-full hover:bg-stone-200 transition"
            aria-label="Fechar modal"
          >
            <X className="w-5 h-5" />
          </button>
        )}

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
            Aprofunde sua intimidade diária com Deus, com todos os Salmos, orações guiadas sem distrações e áudio narrado.
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
            className="w-full py-2.5 px-4 bg-stone-900 hover:bg-stone-800 text-amber-200 font-semibold rounded-xl text-xs sm:text-sm transition flex items-center justify-center gap-2 border border-stone-700 shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            {simulatedSuccess ? 'Assinatura Aprovada com Sucesso!' : 'Simular Assinatura Aprovada (Ativação Instantânea)'}
          </button>
        </div>

        {/* Footer info and link configurator */}
        <div className="text-center text-[11px] text-stone-500 space-y-2">
          <div className="flex items-center justify-center gap-1">
            <Shield className="w-3.5 h-3.5 text-emerald-600" />
            <span>Transação processada com criptografia de ponta a ponta pela Kiwify.</span>
          </div>

          <div className="pt-1">
            <button
              id="btn-toggle-config-kiwify-link"
              onClick={() => setShowConfigLink(!showConfigLink)}
              className="inline-flex items-center gap-1.5 text-amber-800 hover:text-amber-950 font-medium bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3 py-1.5 rounded-lg text-xs transition"
            >
              <Settings className="w-3.5 h-3.5 text-amber-700" />
              <span>{showConfigLink ? 'Fechar Configuração do Link' : '⚙️ Como colocar o seu Link da Kiwify'}</span>
            </button>
          </div>

          {showConfigLink && (
            <div className="mt-3 p-4 bg-white border border-amber-200 rounded-xl text-left shadow-sm space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-xs text-stone-900">
                  <HelpCircle className="w-4 h-4 text-amber-600" />
                  <span>Passo a passo para colocar seu link:</span>
                </div>
                {saveSuccessMessage && (
                  <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    <Check className="w-3 h-3" /> Link salvo!
                  </span>
                )}
              </div>

              <ol className="list-decimal list-inside text-[11px] text-stone-600 space-y-1 bg-stone-50 p-2.5 rounded-lg border border-stone-200">
                <li>Acesse seu painel em <strong>dashboard.kiwify.com.br</strong>.</li>
                <li>Vá no menu <strong>Produtos</strong> e abra sua oferta de assinatura do app.</li>
                <li>Copie o <strong>Link do Checkout</strong> (ex: <code className="text-amber-900 font-mono bg-amber-50 px-1 rounded">https://pay.kiwify.com.br/abc1234</code>).</li>
                <li>Cole no campo abaixo e clique em <strong>Salvar Link</strong>.</li>
              </ol>

              <div>
                <label htmlFor="kiwify-url-input" className="block text-[11px] font-semibold text-stone-800 mb-1">
                  Cole aqui o Link do seu Checkout Kiwify:
                </label>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <input
                    id="kiwify-url-input"
                    type="url"
                    value={customKiwifyUrl}
                    onChange={(e) => setCustomKiwifyUrl(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs border border-stone-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono text-stone-900"
                    placeholder="https://pay.kiwify.com.br/seu-codigo"
                  />
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      id="btn-save-kiwify-link"
                      onClick={handleSaveUrl}
                      className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-sm transition cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Salvar Link</span>
                    </button>
                    <button
                      id="btn-reset-kiwify-link"
                      onClick={handleResetUrl}
                      title="Restaurar link padrão"
                      className="p-2 border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-600 rounded-lg transition"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[10px] text-stone-500">
                <span>Dica: Para fixar em definitivo no código, edite o arquivo <strong className="font-mono text-stone-700">src/config/paymentConfig.ts</strong>.</span>
                <button
                  onClick={handleOpenKiwify}
                  className="text-amber-800 font-bold hover:underline inline-flex items-center gap-1"
                >
                  <span>Testar link</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
