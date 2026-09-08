import React from 'react';
import { Sparkles, Clock, ShieldCheck, AlertCircle, ArrowRight } from 'lucide-react';
import { UserProfile } from '../types';

interface TrialBannerProps {
  profile: UserProfile;
  onOpenCheckout: () => void;
  onSimulateDay: (day: number) => void;
}

export const TrialBanner: React.FC<TrialBannerProps> = ({
  profile,
  onOpenCheckout,
  onSimulateDay
}) => {
  if (profile.subscriptionStatus === 'premium') {
    return (
      <div id="premium-active-banner" className="bg-gradient-to-r from-amber-700 via-amber-600 to-amber-800 text-amber-50 px-4 py-2.5 text-xs sm:text-sm font-medium shadow-inner flex items-center justify-between">
        <div className="max-w-6xl mx-auto w-full flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-200 shrink-0" />
            <span>
              <strong>Plano Premium Ativo:</strong> Acesso ilimitado a todos os Salmos, orações sem anúncios e modo offline.
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-amber-200 text-xs hidden md:inline">Kiwify ID: {profile.kiwifyTransactionId || 'KWFY-74892'}</span>
            <button
              onClick={() => onSimulateDay(0)}
              className="text-[11px] underline text-amber-100 hover:text-white transition"
              title="Voltar para teste para demonstrar fluxo"
            >
              Simular Teste
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isExpired = profile.subscriptionStatus === 'expired' || profile.trialDaysUsed >= 3;
  const currentDay = Math.min(profile.trialDaysUsed + 1, 3);

  return (
    <div
      id="trial-status-banner"
      className={`${
        isExpired
          ? 'bg-rose-900/95 border-b border-rose-800 text-rose-50'
          : 'bg-amber-900/90 border-b border-amber-800/80 text-amber-50'
      } px-4 py-3 transition-colors shadow-sm`}
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
        {/* Trial status info */}
        <div className="flex items-center gap-2.5">
          {isExpired ? (
            <AlertCircle className="w-5 h-5 text-rose-300 shrink-0 animate-pulse" />
          ) : (
            <Clock className="w-5 h-5 text-amber-300 shrink-0" />
          )}
          <div>
            {isExpired ? (
              <span>
                <strong className="font-semibold text-rose-200">Seu teste grátis de 3 dias expirou!</strong> Assine no Kiwify por apenas <strong>R$ 14,90/mês</strong> para desbloquear os 150 Salmos e orações exclusivas.
              </span>
            ) : (
              <span>
                <strong className="font-semibold text-amber-200">Dia {currentDay} de 3 do seu Teste Gratuito.</strong> Aproveite a degustação. Todos os recursos completos no plano Kiwify por <strong>R$ 14,90/mês</strong>.
              </span>
            )}
          </div>
        </div>

        {/* Actions & Simulator controls */}
        <div className="flex items-center gap-2.5 flex-wrap justify-center sm:justify-end w-full md:w-auto">
          {/* Developer/tester simulator buttons */}
          <div className="flex items-center gap-1 bg-black/30 px-2 py-1 rounded-md text-[11px] text-stone-200">
            <span className="text-stone-400 mr-1 hidden lg:inline">Simular:</span>
            {[0, 1, 2, 3].map((d) => (
              <button
                key={d}
                onClick={() => onSimulateDay(d)}
                className={`px-1.5 py-0.5 rounded transition ${
                  profile.trialDaysUsed === d && !profile.kiwifyTransactionId
                    ? 'bg-amber-500 text-stone-950 font-bold'
                    : 'hover:bg-white/10 text-stone-300'
                }`}
                title={d >= 3 ? 'Simular 4º dia (Teste expirado)' : `Simular Dia ${d + 1}`}
              >
                {d >= 3 ? 'Expirado' : `D${d + 1}`}
              </button>
            ))}
          </div>

          <button
            id="btn-subscribe-trial-banner"
            onClick={onOpenCheckout}
            className={`inline-flex items-center gap-1.5 font-semibold px-3.5 py-1.5 rounded-lg shadow-md transition transform active:scale-95 ${
              isExpired
                ? 'bg-amber-400 hover:bg-amber-300 text-stone-950'
                : 'bg-amber-500 hover:bg-amber-400 text-stone-950'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Assinar R$ 14,90</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
