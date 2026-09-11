import React, { useState, useEffect } from 'react';
import { Sparkles, ExternalLink, X, BookOpen, ShieldCheck } from 'lucide-react';

interface AdBannerProps {
  isPremium?: boolean;
  isAdFree?: boolean;
  adsEnabled?: boolean;
  adsenseClientId?: string;
  adsenseSlotId?: string;
  adsenseLayoutKey?: string;
  adsenseFormat?: string;
  onOpenCheckout?: () => void;
  variant?: 'horizontal' | 'card';
  className?: string;
}

interface SponsorAd {
  id: string;
  tag: string;
  title: string;
  description: string;
  actionText: string;
  url: string;
  accentColor: string;
}

const SPONSOR_ADS: SponsorAd[] = [
  {
    id: 'ad-biblia',
    tag: 'Livraria Cristã Parceira',
    title: 'Bíblia de Estudos com Notas & Comentários',
    description: 'Edição especial com mapas bíblicos, notas explicativas e capa nobre. Entregas para todo o Brasil.',
    actionText: 'Conhecer Edição',
    url: 'https://pay.kiwify.com.br/vxSeONK',
    accentColor: 'amber'
  },
  {
    id: 'ad-teologia',
    tag: 'Formação & Discipulado',
    title: 'Curso Bíblico de Teologia & Vida com Deus',
    description: 'Aprofunde o seu conhecimento nas Escrituras Sagradas com aulas práticas online para obreiros e membros.',
    actionText: 'Saiba Mais',
    url: 'https://pay.kiwify.com.br/vxSeONK',
    accentColor: 'emerald'
  },
  {
    id: 'ad-louvor',
    tag: 'Música & Adoração',
    title: 'Hinos Sagrados & Cânticos de Louvor',
    description: 'Coletânea especial de louvores instrumentais e partituras para edificação e adoração cristã.',
    actionText: 'Conhecer',
    url: 'https://pay.kiwify.com.br/vxSeONK',
    accentColor: 'indigo'
  }
];

export const AdBanner: React.FC<AdBannerProps> = ({
  isPremium = false,
  isAdFree = false,
  adsEnabled = true,
  adsenseClientId = 'ca-pub-9818196034021498',
  adsenseSlotId = '6092163378',
  adsenseLayoutKey = '-gw-3+1f-3d+2z',
  adsenseFormat = 'fluid',
  onOpenCheckout,
  variant = 'horizontal',
  className = ''
}) => {
  const [dismissed, setDismissed] = useState(false);

  // If Google AdSense client ID is configured, ensure script and initialize ad slot
  useEffect(() => {
    if (adsenseClientId && typeof window !== 'undefined' && !isPremium && !isAdFree && adsEnabled) {
      const existingScript = document.getElementById('google-adsense-script');
      if (!existingScript) {
        const script = document.createElement('script');
        script.id = 'google-adsense-script';
        script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClientId}`;
        script.async = true;
        script.crossOrigin = 'anonymous';
        document.head.appendChild(script);
      }
      
      const timer = setTimeout(() => {
        try {
          // @ts-ignore
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
          // Ignora caso o AdSense bloqueie repetição em dev ou se o bloco já tiver sido processado
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [adsenseClientId, adsenseSlotId, isPremium, isAdFree, adsEnabled]);

  // Pick an ad based on date or default to first
  const dayIndex = typeof window !== 'undefined' ? new Date().getDate() % SPONSOR_ADS.length : 0;
  const currentAd = SPONSOR_ADS[dayIndex] || SPONSOR_ADS[0];

  // If user has Premium, Ad-Free plan, or Ads are disabled by admin, render nothing
  if (isPremium || isAdFree || !adsEnabled || dismissed) {
    return null;
  }

  // Google AdSense custom unit when configured
  if (adsenseClientId) {
    return (
      <aside
        aria-label="Espaço Publicitário Google AdSense"
        className={`bg-stone-50 dark:bg-stone-900/80 rounded-2xl border border-stone-200 dark:border-stone-800 p-3 shadow-xs relative text-xs text-center overflow-hidden ${className}`}
      >
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-[9px] font-bold uppercase tracking-wider text-stone-500 bg-stone-100 dark:bg-stone-800 px-1.5 py-0.5 rounded">
            Google AdSense &bull; Patrocinado
          </span>
          <div className="flex items-center gap-2">
            {onOpenCheckout && (
              <button
                onClick={onOpenCheckout}
                className="text-[10px] text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 font-semibold"
              >
                <ShieldCheck className="w-3 h-3" />
                <span>Plano Sem Anúncios</span>
              </button>
            )}
            <button
              onClick={() => setDismissed(true)}
              className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 p-0.5 rounded"
              title="Dispensar"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        <div className="min-h-[90px] flex items-center justify-center bg-white dark:bg-stone-950/50 rounded-xl border border-dashed border-stone-200 dark:border-stone-800 p-2">
          <ins
            className="adsbygoogle"
            style={{ display: 'block', minWidth: '250px', width: '100%' }}
            data-ad-client={adsenseClientId}
            data-ad-slot={adsenseSlotId || '6092163378'}
            data-ad-format={adsenseFormat || 'fluid'}
            data-ad-layout-key={adsenseLayoutKey || '-gw-3+1f-3d+2z'}
          />
        </div>
      </aside>
    );
  }

  if (variant === 'card') {
    return (
      <aside
        aria-label="Espaço Publicitário Discreto"
        className={`bg-stone-50 dark:bg-stone-900/80 rounded-2xl border border-stone-200 dark:border-stone-800 p-4 shadow-xs relative text-xs ${className}`}
      >
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-600 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded border border-stone-200 dark:border-stone-700">
            Anúncio Patrocinado
          </span>
          <button
            onClick={() => setDismissed(true)}
            className="text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200 p-1 rounded-md transition"
            title="Dispensar este anúncio nesta sessão"
            aria-label="Dispensar anúncio"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 flex items-center justify-center shrink-0 border border-amber-200 dark:border-amber-800/60">
            <BookOpen className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <h4 className="font-serif font-bold text-stone-900 dark:text-stone-100 text-sm leading-tight">
              {currentAd.title}
            </h4>
            <p className="text-stone-600 dark:text-stone-400 text-xs mt-1 leading-relaxed">
              {currentAd.description}
            </p>
            <div className="mt-3 flex items-center justify-between flex-wrap gap-2">
              <a
                href={currentAd.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-900 dark:bg-stone-100 text-amber-200 dark:text-stone-900 font-bold text-xs hover:bg-stone-800 transition"
              >
                <span>{currentAd.actionText}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              {onOpenCheckout && (
                <button
                  onClick={onOpenCheckout}
                  className="text-[11px] text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1 font-medium"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Plano Sem Anúncios (Ad-Free)</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </aside>
    );
  }

  // Default 'horizontal' variant
  return (
    <aside
      aria-label="Espaço Publicitário Discreto"
      className={`bg-stone-50/90 dark:bg-stone-900/70 rounded-2xl border border-stone-200/80 dark:border-stone-800 p-3.5 sm:p-4 shadow-xs relative text-xs ${className}`}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[9px] font-bold uppercase tracking-wider text-stone-600 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 px-1.5 py-0.5 rounded border border-stone-200 dark:border-stone-700">
                Publicidade
              </span>
              <span className="text-[11px] font-semibold text-stone-700 dark:text-stone-300">
                {currentAd.tag}
              </span>
            </div>
            <h4 className="font-serif font-bold text-stone-900 dark:text-stone-100 text-xs sm:text-sm">
              {currentAd.title}
            </h4>
            <p className="text-stone-600 dark:text-stone-400 text-[11px] sm:text-xs line-clamp-1">
              {currentAd.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
          <a
            href={currentAd.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-900 dark:bg-stone-100 text-amber-200 dark:text-stone-900 font-bold text-[11px] sm:text-xs hover:bg-stone-800 transition"
          >
            <span>{currentAd.actionText}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          {onOpenCheckout && (
            <button
              onClick={onOpenCheckout}
              className="inline-flex items-center gap-1 text-[11px] text-amber-700 dark:text-amber-400 hover:text-amber-800 transition px-2 py-1 font-semibold"
              title="Assine o Plano Ad-Free para remover anúncios"
            >
              <ShieldCheck className="w-3 h-3" />
              <span>Plano Sem Anúncios</span>
            </button>
          )}
          <button
            onClick={() => setDismissed(true)}
            className="text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200 p-1 rounded transition"
            title="Dispensar anúncio"
            aria-label="Dispensar anúncio"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
