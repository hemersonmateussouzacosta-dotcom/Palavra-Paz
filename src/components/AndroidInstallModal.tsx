import React, { useState } from 'react';
import {
  Smartphone,
  Download,
  CheckCircle2,
  X,
  ExternalLink,
  Sparkles,
  Share2,
  Copy,
  Check,
  ShieldCheck,
  Zap,
  Layers
} from 'lucide-react';

interface AndroidInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  isInstallable: boolean;
  isInstalled: boolean;
  onInstall: () => Promise<boolean>;
}

export const AndroidInstallModal: React.FC<AndroidInstallModalProps> = ({
  isOpen,
  onClose,
  isInstallable,
  isInstalled,
  onInstall
}) => {
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [installing, setInstalling] = useState(false);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.origin : '';

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2500);
  };

  const handleDirectInstall = async () => {
    setInstalling(true);
    await onInstall();
    setInstalling(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="bg-stone-50 border border-amber-200/80 rounded-3xl max-w-lg w-full p-5 sm:p-7 shadow-2xl relative text-stone-800 my-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-2 rounded-full hover:bg-stone-200 transition"
          aria-label="Fechar modal de instalação Android"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3.5 mb-5 border-b border-stone-200 pb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-amber-500 text-white flex items-center justify-center shadow-md shadow-emerald-900/20 shrink-0">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                Android App &bull; PWA Oficial
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-950">
              Transformar em App Android
            </h2>
            <p className="text-xs text-stone-600">
              Instale o Palavra &amp; Paz no seu celular com ícone na tela inicial e tela cheia nativa.
            </p>
          </div>
        </div>

        {/* Status / Direct Button */}
        {isInstalled ? (
          <div className="bg-emerald-100 border border-emerald-300 text-emerald-900 p-4 rounded-2xl flex items-center gap-3 mb-5">
            <CheckCircle2 className="w-6 h-6 text-emerald-700 shrink-0" />
            <div>
              <strong className="block text-sm font-bold text-emerald-950">
                Aplicativo já instalado no seu dispositivo!
              </strong>
              <span className="text-xs">
                Você já está utilizando o Palavra &amp; Paz como aplicativo independente.
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-3 mb-5">
            {isInstallable && (
              <button
                onClick={handleDirectInstall}
                disabled={installing}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold text-sm rounded-2xl shadow-lg shadow-emerald-900/20 transition flex items-center justify-center gap-2 transform active:scale-98"
              >
                <Download className="w-5 h-5" />
                <span>{installing ? 'Instalando...' : 'Instalar Aplicativo no Android Agora'}</span>
              </button>
            )}
          </div>
        )}

        {/* Step by Step Manual Guide */}
        <div className="space-y-4">
          <h3 className="font-serif font-bold text-sm text-stone-900 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Como instalar pelo navegador no Android (Passo a Passo)</span>
          </h3>

          <div className="grid grid-cols-1 gap-2.5 text-xs text-stone-700">
            <div className="bg-white border border-stone-200 p-3 rounded-xl flex items-start gap-3 shadow-xs">
              <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-900 font-bold flex items-center justify-center shrink-0 text-xs">
                1
              </span>
              <div>
                <strong className="text-stone-900 block">Abra no Chrome ou navegador do Android</strong>
                <span>Acesse o link do aplicativo no seu smartphone Android.</span>
              </div>
            </div>

            <div className="bg-white border border-stone-200 p-3 rounded-xl flex items-start gap-3 shadow-xs">
              <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-900 font-bold flex items-center justify-center shrink-0 text-xs">
                2
              </span>
              <div>
                <strong className="text-stone-900 block">Toque nos 3 pontinhos (⋮) do navegador</strong>
                <span>No canto superior direito da tela do seu navegador.</span>
              </div>
            </div>

            <div className="bg-white border border-stone-200 p-3 rounded-xl flex items-start gap-3 shadow-xs">
              <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-900 font-bold flex items-center justify-center shrink-0 text-xs">
                3
              </span>
              <div>
                <strong className="text-stone-900 block">Selecione &ldquo;Instalar aplicativo&rdquo; ou &ldquo;Adicionar à tela inicial&rdquo;</strong>
                <span>O Android fará o download e adicionará o ícone dourado do Palavra &amp; Paz na sua tela de apps.</span>
              </div>
            </div>

            <div className="bg-white border border-stone-200 p-3 rounded-xl flex items-start gap-3 shadow-xs">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-xs">
                ✓
              </span>
              <div>
                <strong className="text-stone-900 block">Pronto! Funciona como App Nativo</strong>
                <span>Abre em tela cheia sem barras de navegador, funciona offline e mantém seu login e histórico salvos.</span>
              </div>
            </div>
          </div>

          {/* Gerar APK para Google Play Store */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 p-4 rounded-2xl text-xs space-y-2.5">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-700 shrink-0" />
              <strong className="text-stone-900 font-bold">
                Deseja gerar o arquivo .APK instalável ou publicar na Google Play?
              </strong>
            </div>
            <p className="text-stone-600 leading-relaxed">
              O aplicativo já está configurado com <strong>Web App Manifest</strong>, ícones Android de 192px/512px e <strong>Service Worker</strong> para cache offline. Você pode gerar o arquivo <strong>.APK</strong> ou <strong>.AAB</strong> diretamente usando o <strong>PWABuilder</strong> da Microsoft:
            </p>
            <div className="flex flex-col sm:flex-row gap-2 pt-1">
              <button
                onClick={handleCopyUrl}
                className="px-3 py-2 bg-white border border-amber-300 rounded-xl hover:bg-amber-100 text-stone-800 font-semibold flex items-center justify-center gap-1.5 transition text-xs"
              >
                {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedUrl ? 'Link Copiado!' : 'Copiar Link do App'}</span>
              </button>

              <a
                href="https://www.pwabuilder.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 bg-stone-900 hover:bg-stone-800 text-amber-200 rounded-xl font-semibold flex items-center justify-center gap-1.5 transition text-xs"
              >
                <span>Abrir PWABuilder (Gerar APK)</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="mt-5 pt-4 border-t border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-1 text-[11px] text-stone-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Compatível com Android 8.0+</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-700 text-xs font-semibold rounded-xl transition"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
