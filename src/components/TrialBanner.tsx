import React from 'react';
import { Sparkles, ShieldCheck, ArrowRight, BookOpen } from 'lucide-react';
import { UserProfile } from '../types';

interface TrialBannerProps {
  profile: UserProfile;
  onOpenCheckout: () => void;
  onSimulateDay?: (day: number) => void;
}

export const TrialBanner: React.FC<TrialBannerProps> = ({
  profile,
  onOpenCheckout
}) => {
  const isPremium = profile.subscriptionStatus === 'premium';

  if (isPremium) {
    return (
      <div id="premium-active-banner" className="bg-gradient-to-r from-amber-800 via-amber-700 to-amber-900 text-amber-50 px-4 py-2.5 text-xs sm:text-sm font-medium shadow-inner flex items-center justify-between">
        <div className="max-w-6xl mx-auto w-full flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-300 shrink-0" />
            <span>
              <strong>Plano Premium Ativo:</strong> Acesso ilimitado a todos os 150 Salmos, orações completas, narração em áudio e modo offline.
            </span>
          </div>
          <span className="text-amber-200 text-xs hidden md:inline font-mono">
            {profile.kiwifyTransactionId ? `Kiwify: ${profile.kiwifyTransactionId}` : 'Assinatura Ativa'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      id="subscription-status-banner"
      className="bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 border-b border-amber-800/60 text-amber-50 px-4 py-2.5 shadow-sm transition-colors"
    >
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
        {/* Value proposition info */}
        <div className="flex items-center gap-2.5 text-center sm:text-left">
          <div className="w-6 h-6 rounded-full bg-amber-500/20 border border-amber-400/30 flex items-center justify-center shrink-0 text-amber-300">
            <BookOpen className="w-3.5 h-3.5" />
          </div>
          <div>
            <span>
              <strong className="font-semibold text-amber-300">Desbloqueie Todos os 150 Salmos &amp; Orações Exclusivas.</strong> Aprofunde sua intimidade diária com Deus por apenas <strong>R$ 14,90/mês</strong> na Kiwify.
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            id="btn-subscribe-banner"
            onClick={onOpenCheckout}
            className="inline-flex items-center gap-1.5 font-bold px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-stone-950 shadow-md transition text-xs sm:text-sm cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-stone-950" />
            <span>Assinar por R$ 14,90</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
