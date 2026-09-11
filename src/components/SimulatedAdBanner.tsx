import React, { useState, useEffect } from 'react';
import { ExternalLink, Sparkles, X, RotateCcw, VolumeX, ShieldAlert } from 'lucide-react';

interface SimulatedAdBannerProps {
  onUpgradeClick: () => void;
  variant?: 'inline' | 'card' | 'recurring-ticker';
}

const SPONSORS = [
  {
    tag: 'Livraria Bíblica Ágape',
    title: 'Bíblias de Estudo Sagradas com 30% OFF',
    desc: 'Comentários históricos e mapas bíblicos com frete grátis em compras acima de R$ 99.',
    cta: 'Aproveitar Cupom DEVOCIONAL'
  },
  {
    tag: 'Seminário Teológico Aliança',
    title: 'Curso Livre de Teologia Sistemática & Grego',
    desc: 'Aulas 100% online com certificado reconhecido. Inscrições abertas para este mês.',
    cta: 'Conhecer Turmas'
  },
  {
    tag: 'Música & Louvor',
    title: 'Coletânea de Hinos Clássicos Instrumental',
    desc: 'Mais de 500 hinos tocados suavemente ao piano para momentos de oração e comunhão no lar.',
    cta: 'Ouvir Prévia'
  },
  {
    tag: 'Editora Fonte de Águas Vivas',
    title: 'Box Especial: Vida de Oração de Homens e Mulheres de Deus',
    desc: 'Biografias inspiradoras de Spurgeon, George Müller e Watchman Nee em capa dura.',
    cta: 'Garantir Exemplar'
  }
];

export const SimulatedAdBanner: React.FC<SimulatedAdBannerProps> = ({
  onUpgradeClick,
  variant = 'inline'
}) => {
  const [closed, setClosed] = useState(false);
  const [adIndex, setAdIndex] = useState(0);
  const [secondsUntilNext, setSecondsUntilNext] = useState(15);

  // Recurring ad rotation every 15 seconds
  useEffect(() => {
    if (closed) return;

    const timer = setInterval(() => {
      setSecondsUntilNext((prev) => {
        if (prev <= 1) {
          setAdIndex((curr) => (curr + 1) % SPONSORS.length);
          return 15;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [closed]);

  if (closed) {
    return (
      <div className="my-2 p-2 bg-stone-200/60 rounded-xl text-center text-[11px] text-stone-500 flex items-center justify-center gap-2">
        <span>Anúncio ocultado temporariamente.</span>
        <button
          onClick={onUpgradeClick}
          className="text-amber-800 font-bold underline hover:text-amber-900"
        >
          Remova todos os anúncios definitivamente por R$ 14,90/mês
        </button>
      </div>
    );
  }

  const currentSponsor = SPONSORS[adIndex];

  if (variant === 'recurring-ticker') {
    return (
      <div id="simulated-recurring-ticker" className="my-3 p-3 bg-amber-50/90 border border-amber-200 rounded-xl shadow-sm text-stone-800 animate-fadeIn">
        <div className="flex items-center justify-between gap-2 mb-1.5 text-[10px]">
          <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded">
            <span>Anúncio Recorrente &bull; Versão Gratuita</span>
          </div>
          <span className="text-stone-500 font-mono text-[10px]">
            Próximo anúncio em: {secondsUntilNext}s
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <strong className="text-xs font-serif font-bold text-stone-900 block">
              {currentSponsor.title}
            </strong>
            <p className="text-[11px] text-stone-600 line-clamp-1">
              {currentSponsor.desc}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-between sm:justify-end pt-1 sm:pt-0">
            <span className="text-[10px] text-stone-400">Patrocinado</span>
            <button
              onClick={onUpgradeClick}
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-2.5 py-1 rounded-lg text-[11px] shadow transition flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3" />
              <span>Remover Anúncios (R$ 14,90)</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div id="simulated-ad-card" className="relative my-4 p-4 rounded-2xl border border-stone-300 bg-stone-100/95 text-stone-800 shadow-sm overflow-hidden animate-fadeIn">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] font-bold uppercase tracking-wider text-stone-600 bg-stone-200 px-1.5 py-0.5 rounded">
              Publicidade Recorrente
            </span>
            <span className="text-[10px] text-stone-500">
              Patrocinador da Versão Gratuita ({adIndex + 1}/{SPONSORS.length})
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-stone-400">
              Próximo em {secondsUntilNext}s
            </span>
            <button
              onClick={() => setClosed(true)}
              className="text-stone-400 hover:text-stone-700 p-0.5"
              title="Fechar anúncio"
              aria-label="Fechar anúncio"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <h4 className="text-sm font-bold font-serif text-stone-900 mb-1">
          {currentSponsor.title}
        </h4>
        <p className="text-xs text-stone-600 mb-3 leading-relaxed">
          {currentSponsor.desc}
        </p>

        <div className="flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-stone-200 text-xs">
          <button
            onClick={onUpgradeClick}
            className="font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1 hover:underline text-xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Orar em silêncio sem anúncios no Kiwify (R$ 14,90/mês)
          </button>
          <span className="text-[10px] text-stone-400 flex items-center gap-1">
            Anúncio patrocinado <ExternalLink className="w-3 h-3" />
          </span>
        </div>
      </div>
    );
  }

  // Default Inline Variant
  return (
    <div id="simulated-ad-inline" className="my-3 py-2 px-3 bg-stone-100 border border-stone-200 rounded-xl flex items-center justify-between text-xs text-stone-700 gap-2">
      <div className="flex items-center gap-2 overflow-hidden">
        <span className="text-[9px] font-bold uppercase tracking-wide bg-stone-200 text-stone-600 px-1.5 py-0.5 rounded shrink-0">
          Anúncio ({secondsUntilNext}s)
        </span>
        <span className="truncate text-stone-700 font-medium text-[11px]">
          {currentSponsor.tag}: {currentSponsor.title}
        </span>
      </div>
      <button
        onClick={onUpgradeClick}
        className="text-amber-800 font-semibold hover:text-amber-950 shrink-0 text-[11px] underline flex items-center gap-1"
      >
        Tirar anúncios (R$ 14,90)
      </button>
    </div>
  );
};
