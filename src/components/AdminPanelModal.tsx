import React, { useState } from 'react';
import {
  ShieldAlert,
  Lock,
  Unlock,
  KeyRound,
  X,
  Sparkles,
  Save,
  Check,
  Calendar,
  PlusCircle,
  Edit3,
  Trash2,
  ExternalLink,
  Users,
  DollarSign,
  Bell,
  RefreshCw,
  Clock,
  Eye,
  EyeOff,
  History,
  BarChart3,
  Filter,
  Search,
  FileDown,
  Headphones,
  BookOpen,
  Heart,
  Sun,
  Volume2,
  BookMarked,
  CheckCircle2,
  Instagram,
  Smartphone
} from 'lucide-react';
import { AppAdminConfig, DailyVerse, UserProfile, ContentViewLog, ContentViewType } from '../types';
import { StorageService } from '../services/storageService';
import { saveKiwifyCheckoutUrl } from '../config/paymentConfig';
import {
  getAllAvailableVerses,
  saveCustomVerse,
  deleteCustomVerse,
  BASE_DAILY_VERSES
} from '../data/versesData';
import { soundService } from '../services/soundService';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onProfileUpdate: (updated: UserProfile) => void;
  onVerseUpdated?: () => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  profile,
  onProfileUpdate,
  onVerseUpdated
}) => {
  const [adminConfig, setAdminConfig] = useState<AppAdminConfig>(StorageService.getAdminConfig());
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(StorageService.isAdminLoggedIn());
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [activeTab, setActiveTab] = useState<'config' | 'historico' | 'devocionais' | 'usuarios'>('config');
  const [showAdminPinConfig, setShowAdminPinConfig] = useState(false);

  // Viewing History state
  const [viewHistory, setViewHistory] = useState<ContentViewLog[]>(() => StorageService.getViewHistory());
  const [historyFilterType, setHistoryFilterType] = useState<string>('todos');
  const [historyFilterPlan, setHistoryFilterPlan] = useState<'todos' | 'free' | 'premium'>('todos');
  const [historySearch, setHistorySearch] = useState<string>('');

  // Feedback notifications
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  // Custom verse form state
  const [isEditingVerse, setIsEditingVerse] = useState(false);
  const [verseForm, setVerseForm] = useState<DailyVerse>({
    id: 'v-custom-' + Date.now(),
    date: new Date().toISOString().split('T')[0],
    reference: '',
    text: '',
    reflection: '',
    actionPrompt: '',
    theme: 'Paz Interior & Fé'
  });

  const [availableVerses, setAvailableVerses] = useState<DailyVerse[]>(getAllAvailableVerses());

  if (!isOpen) return null;

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const targetPin = (adminConfig.adminPin || '1478').trim();
    if (pinInput.trim() === targetPin) {
      setIsAuthenticated(true);
      StorageService.setAdminLoggedIn(true);
      setPinError(false);
      setPinInput('');
      soundService.playChime(528, 1);
    } else {
      setPinError(true);
      soundService.playChime(300, 0.5);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    StorageService.setAdminLoggedIn(false);
  };

  const handleSaveConfig = () => {
    StorageService.saveAdminConfig(adminConfig);
    saveKiwifyCheckoutUrl(adminConfig.kiwifyCheckoutUrl);
    setSaveSuccess('Configurações salvas com sucesso!');
    soundService.playChime(528, 1.2);
    setTimeout(() => setSaveSuccess(null), 3000);
  };

  const handleSaveVerse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verseForm.reference.trim() || !verseForm.text.trim()) {
      alert('Por favor, preencha a referência bíblica e o texto.');
      return;
    }

    const verseToSave = {
      ...verseForm,
      id: verseForm.id || 'v-custom-' + Date.now()
    };

    saveCustomVerse(verseToSave);
    setAvailableVerses(getAllAvailableVerses());
    setIsEditingVerse(false);
    setSaveSuccess('Devocional salvo com sucesso!');
    soundService.playChime(528, 1.2);
    setTimeout(() => setSaveSuccess(null), 3000);
    if (onVerseUpdated) onVerseUpdated();
  };

  const handleDeleteVerse = (id: string) => {
    if (confirm('Deseja realmente excluir este devocional personalizado?')) {
      deleteCustomVerse(id);
      setAvailableVerses(getAllAvailableVerses());
      if (onVerseUpdated) onVerseUpdated();
    }
  };

  const handleSimulateUserStatus = (status: 'free' | 'premium') => {
    if (status === 'premium') {
      const updated = StorageService.activatePremium('KWFY-ADMIN-TEST');
      onProfileUpdate(updated);
    } else {
      const updated = StorageService.cancelOrResetSubscription();
      onProfileUpdate(updated);
    }
    soundService.playChime(528, 0.8);
  };

  // Histórico de Visualizações - Funções Auxiliares
  const handleRefreshHistory = () => {
    const logs = StorageService.getViewHistory();
    setViewHistory(logs);
    soundService.playChime(528, 0.8);
    setSaveSuccess('Histórico de visualização atualizado!');
    setTimeout(() => setSaveSuccess(null), 2500);
  };

  const handleClearHistory = () => {
    if (confirm('Deseja realmente limpar todo o histórico de visualizações registradas?')) {
      StorageService.clearViewHistory();
      setViewHistory([]);
      soundService.playChime(300, 0.5);
      setSaveSuccess('Histórico de visualizações foi limpo.');
      setTimeout(() => setSaveSuccess(null), 2500);
    }
  };

  const handleExportHistoryCSV = () => {
    if (viewHistory.length === 0) {
      alert('Não há registros de visualização para exportar.');
      return;
    }
    const headers = ['ID', 'Tipo', 'Título', 'Subtítulo', 'Categoria', 'Status_Usuario', 'Data_Hora_ISO'];
    const rows = viewHistory.map((item) => [
      `"${item.id}"`,
      `"${item.type}"`,
      `"${(item.title || '').replace(/"/g, '""')}"`,
      `"${(item.subtitle || '').replace(/"/g, '""')}"`,
      `"${(item.category || '').replace(/"/g, '""')}"`,
      `"${item.userStatus}"`,
      `"${item.timestamp}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `historico_visualizacoes_palavra_e_paz_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    soundService.playChime(528, 1);
  };

  const handleSimulateTestView = (type: ContentViewType) => {
    const sampleItems: Record<ContentViewType, { title: string; subtitle: string; category: string }> = {
      versiculo: { title: 'Versículo: Filipenses 4:6-7', subtitle: 'Não andeis ansiosos de coisa alguma...', category: 'Paz Interior' },
      salmo: { title: 'Salmo 46', subtitle: 'Deus é o nosso refúgio e fortaleza, socorro bem presente', category: 'Refúgio Divino' },
      oracao: { title: 'Oração para Acalmar o Coração', subtitle: 'Salmos 62:1 - Somente em Deus descansa a alma', category: 'acalmar_alma' },
      meditacao: { title: 'Respiração & Serenidade com Cristo', subtitle: '5 min de quietude e oração silenciosa', category: 'Paz Interior' },
      estudo: { title: 'Estudo: Vencendo o Medo pela Palavra', subtitle: 'Passagens chave sobre coragem cristã e paz', category: 'Vida de Fé' },
      cronometro: { title: 'Momento de Intercessão & Louvor', subtitle: '15 min no cronômetro de oração', category: 'Cronômetro Devocional' },
      audio: { title: 'Áudio do Salmo 23', subtitle: 'Narração de voz acolhedora com harpa celestial', category: 'Áudios Bíblicos' }
    };
    const sample = sampleItems[type] || sampleItems.salmo;
    StorageService.recordView({
      type,
      title: sample.title,
      subtitle: sample.subtitle,
      category: sample.category
    });
    setViewHistory(StorageService.getViewHistory());
    soundService.playChime(528, 1);
    setSaveSuccess(`Visualização de "${sample.title}" registrada com sucesso!`);
    setTimeout(() => setSaveSuccess(null), 2500);
  };

  const formatRelativeTime = (isoString: string) => {
    try {
      const then = new Date(isoString).getTime();
      const now = Date.now();
      const diffSec = Math.floor((now - then) / 1000);
      if (diffSec < 45) return 'Agora mesmo';
      const diffMin = Math.floor(diffSec / 60);
      if (diffMin < 60) return `há ${diffMin} min`;
      const diffHours = Math.floor(diffMin / 60);
      if (diffHours < 24) return `há ${diffHours} ${diffHours === 1 ? 'hora' : 'horas'}`;
      const diffDays = Math.floor(diffHours / 24);
      if (diffDays === 1) return 'Ontem';
      if (diffDays < 7) return `há ${diffDays} dias`;
      return new Date(isoString).toLocaleDateString('pt-BR');
    } catch {
      return '';
    }
  };

  const formatExactDateTime = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch {
      return isoString;
    }
  };

  // Filtragem de histórico
  const filteredHistory = viewHistory.filter((item) => {
    if (historyFilterType !== 'todos') {
      if (historyFilterType === 'audio') {
        if (item.type !== 'audio' && !item.metadata?.audioListened) return false;
      } else if (item.type !== historyFilterType) {
        return false;
      }
    }
    if (historyFilterPlan !== 'todos' && item.userStatus !== historyFilterPlan) {
      return false;
    }
    if (historySearch.trim()) {
      const q = historySearch.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchSub = item.subtitle?.toLowerCase().includes(q) || false;
      const matchCat = item.category?.toLowerCase().includes(q) || false;
      if (!matchTitle && !matchSub && !matchCat) return false;
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded-3xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl relative text-stone-800 dark:text-stone-200 my-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 p-2 rounded-full hover:bg-stone-200 dark:hover:bg-stone-800 transition"
          aria-label="Fechar painel de administração"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5 border-b border-stone-200 dark:border-stone-800 pb-4">
          <div className="w-11 h-11 rounded-2xl bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <span>Painel do Administrador</span>
              <span className="text-xs font-mono bg-stone-800 dark:bg-stone-700 text-amber-300 px-2 py-0.5 rounded font-semibold">
                ADM
              </span>
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Controle de links, 365 devocionais diários e parâmetros do aplicativo
            </p>
          </div>
        </div>

        {/* PIN Screen if not authenticated */}
        {!isAuthenticated ? (
          <div className="py-8 px-4 text-center max-w-sm mx-auto space-y-4">
            <div className="w-14 h-14 bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700/60 rounded-full flex items-center justify-center mx-auto text-amber-800 dark:text-amber-300">
              <KeyRound className="w-7 h-7" />
            </div>

            <div>
              <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100">
                Acesso Restrito ao Administrador
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                Digite o PIN de segurança para gerenciar o painel administrativo.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-3">
              <input
                type="password"
                maxLength={8}
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setPinError(false);
                }}
                placeholder="••••"
                className="w-full text-center tracking-widest text-2xl font-mono px-4 py-2.5 border border-stone-300 dark:border-stone-700 rounded-xl bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                autoFocus
              />

              {pinError && (
                <p className="text-xs text-rose-600 dark:text-rose-400 font-semibold">
                  PIN incorreto! Por favor, tente novamente.
                </p>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-sm transition shadow flex items-center justify-center gap-2"
              >
                <Unlock className="w-4 h-4" />
                <span>Entrar no Painel</span>
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Admin Dashboard */
          <div className="space-y-5">
            {/* Success Toast */}
            {saveSuccess && (
              <div className="p-3 bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200 rounded-xl text-xs font-semibold flex items-center justify-between animate-fadeIn">
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                  {saveSuccess}
                </span>
                <button onClick={() => setSaveSuccess(null)} className="text-emerald-700 dark:text-emerald-400">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Navigation Tabs */}
            <div className="flex border-b border-stone-200 dark:border-stone-800 gap-2">
              <button
                onClick={() => setActiveTab('config')}
                className={`pb-2 px-3 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
                  activeTab === 'config'
                    ? 'border-amber-600 text-amber-900 dark:text-amber-300'
                    : 'border-transparent text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
                }`}
              >
                <DollarSign className="w-3.5 h-3.5" />
                <span>Kiwify & Geral</span>
              </button>

              <button
                onClick={() => {
                  setViewHistory(StorageService.getViewHistory());
                  setActiveTab('historico');
                }}
                className={`pb-2 px-3 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
                  activeTab === 'historico'
                    ? 'border-amber-600 text-amber-900 dark:text-amber-300'
                    : 'border-transparent text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
                }`}
              >
                <Eye className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>Histórico de Visualização</span>
                <span className="text-[10px] bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 font-bold px-1.5 py-0.5 rounded-full border border-amber-300 dark:border-amber-700/60">
                  {viewHistory.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('devocionais')}
                className={`pb-2 px-3 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
                  activeTab === 'devocionais'
                    ? 'border-amber-600 text-amber-900 dark:text-amber-300'
                    : 'border-transparent text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>365 Devocionais Diários</span>
              </button>

              <button
                onClick={() => setActiveTab('usuarios')}
                className={`pb-2 px-3 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
                  activeTab === 'usuarios'
                    ? 'border-amber-600 text-amber-900 dark:text-amber-300'
                    : 'border-transparent text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Simulador de Usuários</span>
              </button>

              <div className="ml-auto">
                <button
                  onClick={handleLogout}
                  className="text-stone-400 hover:text-rose-600 text-[11px] flex items-center gap-1 py-1"
                  title="Sair do modo administrador"
                >
                  <Lock className="w-3 h-3" />
                  <span>Sair do ADM</span>
                </button>
              </div>
            </div>

            {/* TAB 1: General & Kiwify Config */}
            {activeTab === 'config' && (
              <div className="space-y-4 text-xs sm:text-sm animate-fadeIn">
                <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 space-y-3">
                  <h4 className="font-serif font-bold text-stone-900 text-sm flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>Configuração do Checkout Kiwify</span>
                  </h4>

                  {/* Official Kiwify Payment Link Status Card */}
                  <div className="bg-white border border-amber-300/80 rounded-xl p-3.5 shadow-sm space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                        <Check className="w-4 h-4 text-emerald-600" />
                        Link Oficial de Pagamento Kiwify:
                      </span>
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                        Ativo &bull; R$ 14,90
                      </span>
                    </div>

                    <div className="p-2.5 bg-stone-100/90 rounded-lg border border-stone-200 flex items-center justify-between gap-2">
                      <span className="font-mono text-xs text-amber-950 font-semibold truncate select-all">
                        https://pay.kiwify.com.br/vxSeONK
                      </span>
                      <a
                        href="https://pay.kiwify.com.br/vxSeONK"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-[11px] font-bold transition shadow-sm"
                      >
                        <span>Testar Link</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <p className="text-[11px] text-stone-500">
                      Este link oficial é utilizado diretamente em todos os botões de assinatura Kiwify do aplicativo.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Preço Exibido (R$):
                      </label>
                      <input
                        type="text"
                        value={adminConfig.subscriptionPrice}
                        onChange={(e) =>
                          setAdminConfig({ ...adminConfig, subscriptionPrice: e.target.value })
                        }
                        className="w-full px-3 py-1.5 text-xs border border-stone-300 rounded-xl bg-white"
                        placeholder="14,90"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-semibold text-stone-700">
                          PIN de Acesso Admin:
                        </label>
                        <button
                          type="button"
                          onClick={() => setShowAdminPinConfig(!showAdminPinConfig)}
                          className="text-[11px] text-amber-700 hover:text-amber-900 flex items-center gap-1 font-medium"
                        >
                          {showAdminPinConfig ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                          <span>{showAdminPinConfig ? 'Ocultar' : 'Ver PIN'}</span>
                        </button>
                      </div>
                      <input
                        type={showAdminPinConfig ? 'text' : 'password'}
                        value={adminConfig.adminPin}
                        onChange={(e) =>
                          setAdminConfig({ ...adminConfig, adminPin: e.target.value })
                        }
                        className="w-full px-3 py-1.5 text-xs border border-stone-300 rounded-xl bg-white font-mono tracking-wider"
                        placeholder="••••"
                      />
                    </div>
                  </div>
                </div>

                {/* Announcement Banner for All Users */}
                <div className="bg-white border border-stone-200 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-serif font-bold text-stone-900 text-sm flex items-center gap-1.5">
                      <Bell className="w-4 h-4 text-amber-600" />
                      <span>Mensagem / Aviso Geral aos Fiéis</span>
                    </h4>
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
                      <input
                        type="checkbox"
                        checked={adminConfig.announcementActive}
                        onChange={(e) =>
                          setAdminConfig({ ...adminConfig, announcementActive: e.target.checked })
                        }
                        className="rounded text-amber-600 focus:ring-amber-500"
                      />
                      <span>{adminConfig.announcementActive ? 'Aviso Ativo' : 'Aviso Desativado'}</span>
                    </label>
                  </div>

                  <div>
                    <input
                      type="text"
                      value={adminConfig.announcementBanner}
                      onChange={(e) =>
                        setAdminConfig({ ...adminConfig, announcementBanner: e.target.value })
                      }
                      placeholder="Ex: Novo devocional sobre Cura e Salmos de Davi já disponível!"
                      className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl bg-white"
                    />
                    <p className="text-[10px] text-stone-500 mt-1">
                      Quando ativado, esse comunicado aparece no topo para todos os visitantes do aplicativo.
                    </p>
                  </div>
                </div>

                {/* Instagram Community Configuration */}
                <div className="bg-white border border-stone-200 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-serif font-bold text-stone-900 text-sm flex items-center gap-1.5">
                      <Instagram className="w-4 h-4 text-pink-600" />
                      <span>Comunidade &amp; Instagram Oficial</span>
                    </h4>
                    <a
                      href={adminConfig.instagramUrl || 'https://www.instagram.com/verdadeiraluzcaminho?stkn=YXB6ZG51czJuZjNm'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-pink-600 hover:text-pink-800 font-semibold flex items-center gap-1 hover:underline"
                    >
                      <span>Abrir perfil</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <div className="space-y-2.5">
                    <div>
                      <label className="block font-semibold text-stone-700 text-xs mb-1">
                        Link Completo do Instagram para Seguir:
                      </label>
                      <input
                        type="url"
                        value={adminConfig.instagramUrl || ''}
                        onChange={(e) =>
                          setAdminConfig({ ...adminConfig, instagramUrl: e.target.value })
                        }
                        placeholder="https://www.instagram.com/verdadeiraluzcaminho?stkn=YXB6ZG51czJuZjNm"
                        className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl bg-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 text-xs mb-1">
                        Nome de Usuário (@handle):
                      </label>
                      <input
                        type="text"
                        value={adminConfig.instagramHandle || ''}
                        onChange={(e) =>
                          setAdminConfig({ ...adminConfig, instagramHandle: e.target.value })
                        }
                        placeholder="@verdadeiraluzcaminho"
                        className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl bg-white font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Android & PWA Application Setup Status */}
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/80 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-serif font-bold text-stone-900 text-sm flex items-center gap-1.5">
                      <Smartphone className="w-4 h-4 text-emerald-600" />
                      <span>Aplicativo Android &amp; PWA (Status &amp; Publicação)</span>
                    </h4>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                      Pronto para Android
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    O aplicativo está 100% configurado com <strong>Web App Manifest</strong>, ícones de 192px/512px, modo <em>standalone</em> (sem barras de navegador) e <strong>Service Worker</strong> para cache offline. Usuários de Android podem instalar diretamente no celular ou você pode gerar o arquivo <strong>.APK</strong> para a Google Play Store.
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <a
                      href="https://www.pwabuilder.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 transition"
                    >
                      <span>Gerar APK com PWABuilder</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    onClick={handleSaveConfig}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>Salvar Configurações</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB: Histórico de Visualizações */}
            {activeTab === 'historico' && (
              <div className="space-y-4 text-xs sm:text-sm animate-fadeIn">
                {/* Header with description and actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-gradient-to-r from-amber-50 to-stone-50 border border-amber-200 rounded-2xl">
                  <div>
                    <h4 className="font-serif font-bold text-stone-900 text-sm flex items-center gap-1.5">
                      <History className="w-4 h-4 text-amber-700" />
                      <span>Histórico de Visualizações e Leituras</span>
                    </h4>
                    <p className="text-[11px] text-stone-600 mt-0.5">
                      Acompanhe em tempo real o que os fiéis e assinantes estão acessando no aplicativo.
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      onClick={handleRefreshHistory}
                      className="px-2.5 py-1.5 bg-white hover:bg-stone-100 border border-stone-300 rounded-xl text-stone-700 font-bold text-[11px] flex items-center gap-1 transition shadow-xs"
                      title="Recarregar registros mais recentes"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-stone-600" />
                      <span>Atualizar</span>
                    </button>

                    <button
                      onClick={handleExportHistoryCSV}
                      className="px-2.5 py-1.5 bg-white hover:bg-stone-100 border border-stone-300 rounded-xl text-stone-700 font-bold text-[11px] flex items-center gap-1 transition shadow-xs"
                      title="Baixar histórico em planilha CSV"
                    >
                      <FileDown className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Exportar CSV</span>
                    </button>

                    {viewHistory.length > 0 && (
                      <button
                        onClick={handleClearHistory}
                        className="px-2.5 py-1.5 bg-white hover:bg-rose-50 border border-stone-300 hover:border-rose-300 rounded-xl text-rose-600 font-bold text-[11px] flex items-center gap-1 transition shadow-xs"
                        title="Limpar todos os registros de histórico"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                        <span>Limpar</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* KPI Metrics Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="bg-white border border-stone-200 rounded-2xl p-3 shadow-xs">
                    <div className="flex items-center justify-between text-stone-500 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider">Total Acessos</span>
                      <Eye className="w-3.5 h-3.5 text-amber-600" />
                    </div>
                    <div className="text-xl font-serif font-bold text-stone-900">{viewHistory.length}</div>
                    <div className="text-[10px] text-stone-400 mt-0.5">leituras registradas</div>
                  </div>

                  <div className="bg-white border border-stone-200 rounded-2xl p-3 shadow-xs">
                    <div className="flex items-center justify-between text-stone-500 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider">Salmos Lidos</span>
                      <BookOpen className="w-3.5 h-3.5 text-purple-600" />
                    </div>
                    <div className="text-xl font-serif font-bold text-stone-900">
                      {viewHistory.filter(v => v.type === 'salmo').length}
                    </div>
                    <div className="text-[10px] text-stone-400 mt-0.5">capítulos abertos</div>
                  </div>

                  <div className="bg-white border border-stone-200 rounded-2xl p-3 shadow-xs">
                    <div className="flex items-center justify-between text-stone-500 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider">Orações / Paz</span>
                      <Heart className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                    <div className="text-xl font-serif font-bold text-stone-900">
                      {viewHistory.filter(v => v.type === 'oracao' || v.type === 'meditacao').length}
                    </div>
                    <div className="text-[10px] text-stone-400 mt-0.5">momentos de devoção</div>
                  </div>

                  <div className="bg-white border border-stone-200 rounded-2xl p-3 shadow-xs">
                    <div className="flex items-center justify-between text-stone-500 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider">Narrações Áudio</span>
                      <Headphones className="w-3.5 h-3.5 text-orange-600" />
                    </div>
                    <div className="text-xl font-serif font-bold text-stone-900">
                      {viewHistory.filter(v => v.type === 'audio' || v.metadata?.audioListened).length}
                    </div>
                    <div className="text-[10px] text-stone-400 mt-0.5">vozes reproduzidas</div>
                  </div>
                </div>

                {/* Filters & Search Toolbar */}
                <div className="bg-white border border-stone-200 rounded-2xl p-3 space-y-2.5">
                  <div className="flex flex-col sm:flex-row gap-2">
                    {/* Search input */}
                    <div className="relative flex-1">
                      <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                      <input
                        type="text"
                        value={historySearch}
                        onChange={(e) => setHistorySearch(e.target.value)}
                        placeholder="Buscar por salmo, versículo, título ou categoria..."
                        className="w-full pl-9 pr-7 py-1.5 text-xs border border-stone-300 rounded-xl bg-stone-50/50 focus:bg-white focus:ring-1 focus:ring-amber-500 outline-none"
                      />
                      {historySearch && (
                        <button
                          onClick={() => setHistorySearch('')}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>

                    {/* Plan filter */}
                    <div className="flex items-center gap-1">
                      <select
                        value={historyFilterPlan}
                        onChange={(e) => setHistoryFilterPlan(e.target.value as any)}
                        className="px-2.5 py-1.5 text-xs font-medium border border-stone-300 rounded-xl bg-white text-stone-700 outline-none"
                      >
                        <option value="todos">Todos os Planos</option>
                        <option value="free">Usuários Gratuitos</option>
                        <option value="premium">👑 Assinantes Kiwify</option>
                      </select>
                    </div>
                  </div>

                  {/* Content type chips */}
                  <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-stone-100">
                    <span className="text-[11px] font-semibold text-stone-500 mr-1 flex items-center gap-1">
                      <Filter className="w-3 h-3" /> Tipo:
                    </span>

                    {[
                      { id: 'todos', label: 'Todos', count: viewHistory.length },
                      { id: 'versiculo', label: 'Versículos', count: viewHistory.filter(v => v.type === 'versiculo').length },
                      { id: 'salmo', label: 'Salmos', count: viewHistory.filter(v => v.type === 'salmo').length },
                      { id: 'oracao', label: 'Orações', count: viewHistory.filter(v => v.type === 'oracao').length },
                      { id: 'meditacao', label: 'Meditações', count: viewHistory.filter(v => v.type === 'meditacao').length },
                      { id: 'estudo', label: 'Estudos', count: viewHistory.filter(v => v.type === 'estudo').length },
                      { id: 'audio', label: 'Áudio', count: viewHistory.filter(v => v.type === 'audio').length },
                      { id: 'cronometro', label: 'Cronômetro', count: viewHistory.filter(v => v.type === 'cronometro').length }
                    ].map((btn) => (
                      <button
                        key={btn.id}
                        onClick={() => setHistoryFilterType(btn.id)}
                        className={`px-2 py-0.5 rounded-lg text-[11px] font-bold transition flex items-center gap-1 ${
                          historyFilterType === btn.id
                            ? 'bg-amber-700 text-white shadow-xs'
                            : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                        }`}
                      >
                        <span>{btn.label}</span>
                        <span className={`text-[9px] px-1 rounded-full ${
                          historyFilterType === btn.id ? 'bg-amber-800 text-amber-100' : 'bg-stone-200 text-stone-500'
                        }`}>
                          {btn.count}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Simulation & Test Bar */}
                <div className="flex items-center justify-between p-2.5 bg-amber-50/50 border border-amber-200/60 rounded-xl text-[11px] text-stone-600 flex-wrap gap-2">
                  <span className="font-semibold text-amber-900 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Testar simulação de acesso:</span>
                  </span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      onClick={() => handleSimulateTestView('salmo')}
                      className="px-2 py-0.5 bg-white border border-amber-300 hover:bg-amber-100 text-amber-900 rounded-md font-medium text-[10px] transition cursor-pointer"
                    >
                      + Salmo 46
                    </button>
                    <button
                      onClick={() => handleSimulateTestView('versiculo')}
                      className="px-2 py-0.5 bg-white border border-amber-300 hover:bg-amber-100 text-amber-900 rounded-md font-medium text-[10px] transition cursor-pointer"
                    >
                      + Filipenses 4:6
                    </button>
                    <button
                      onClick={() => handleSimulateTestView('oracao')}
                      className="px-2 py-0.5 bg-white border border-amber-300 hover:bg-amber-100 text-amber-900 rounded-md font-medium text-[10px] transition cursor-pointer"
                    >
                      + Oração Acalmar Alma
                    </button>
                    <button
                      onClick={() => handleSimulateTestView('audio')}
                      className="px-2 py-0.5 bg-white border border-amber-300 hover:bg-amber-100 text-amber-900 rounded-md font-medium text-[10px] transition cursor-pointer"
                    >
                      + Narração Áudio
                    </button>
                  </div>
                </div>

                {/* History Log List */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-stone-500 px-1">
                    <span>Registros de Acesso ({filteredHistory.length} encontrados)</span>
                    <span>Ordem cronológica (mais recentes primeiro)</span>
                  </div>

                  {filteredHistory.length === 0 ? (
                    <div className="p-8 text-center bg-white border border-stone-200 rounded-2xl text-stone-500 space-y-2">
                      <History className="w-8 h-8 mx-auto text-stone-300" />
                      <p className="font-semibold text-xs text-stone-700">Nenhum registro encontrado</p>
                      <p className="text-[11px] text-stone-400">
                        {viewHistory.length === 0
                          ? 'À medida que os fiéis navegarem pelos versículos, salmos e orações, as visualizações aparecerão aqui automaticamente.'
                          : 'Tente alterar os filtros de busca ou tipo para visualizar os dados.'}
                      </p>
                      {viewHistory.length > 0 && (
                        <button
                          onClick={() => {
                            setHistoryFilterType('todos');
                            setHistoryFilterPlan('todos');
                            setHistorySearch('');
                          }}
                          className="mt-2 px-3 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs rounded-lg font-bold transition cursor-pointer"
                        >
                          Limpar Filtros
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="max-h-[380px] overflow-y-auto space-y-2 pr-1 divide-y divide-stone-100">
                      {filteredHistory.map((item) => {
                        const typeStyles: Record<ContentViewType, { label: string; bg: string; text: string; border: string; icon: React.ReactNode }> = {
                          salmo: {
                            label: 'Salmo',
                            bg: 'bg-purple-100',
                            text: 'text-purple-800',
                            border: 'border-purple-200',
                            icon: <BookOpen className="w-3.5 h-3.5 text-purple-700" />
                          },
                          versiculo: {
                            label: 'Versículo',
                            bg: 'bg-amber-100',
                            text: 'text-amber-800',
                            border: 'border-amber-200',
                            icon: <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                          },
                          oracao: {
                            label: 'Oração',
                            bg: 'bg-emerald-100',
                            text: 'text-emerald-800',
                            border: 'border-emerald-200',
                            icon: <Heart className="w-3.5 h-3.5 text-emerald-700" />
                          },
                          meditacao: {
                            label: 'Meditação',
                            bg: 'bg-indigo-100',
                            text: 'text-indigo-800',
                            border: 'border-indigo-200',
                            icon: <Sun className="w-3.5 h-3.5 text-indigo-700" />
                          },
                          estudo: {
                            label: 'Estudo',
                            bg: 'bg-blue-100',
                            text: 'text-blue-800',
                            border: 'border-blue-200',
                            icon: <BookMarked className="w-3.5 h-3.5 text-blue-700" />
                          },
                          audio: {
                            label: 'Áudio',
                            bg: 'bg-orange-100',
                            text: 'text-orange-800',
                            border: 'border-orange-200',
                            icon: <Volume2 className="w-3.5 h-3.5 text-orange-700" />
                          },
                          cronometro: {
                            label: 'Cronômetro',
                            bg: 'bg-teal-100',
                            text: 'text-teal-800',
                            border: 'border-teal-200',
                            icon: <Clock className="w-3.5 h-3.5 text-teal-700" />
                          }
                        };

                        const style = typeStyles[item.type] || typeStyles.salmo;
                        const isPremiumUser = item.userStatus === 'premium';

                        return (
                          <div
                            key={item.id}
                            className="pt-2 first:pt-0 bg-white hover:bg-stone-50/80 border border-stone-200/80 rounded-xl p-2.5 transition shadow-2xs flex items-start gap-2.5"
                          >
                            {/* Icon badge */}
                            <div className={`p-2 rounded-xl border shrink-0 ${style.bg} ${style.border}`}>
                              {style.icon}
                            </div>

                            {/* Center Content Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className={`text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded-md border ${style.bg} ${style.text} ${style.border}`}>
                                  {style.label}
                                </span>

                                <h5 className="text-xs font-bold text-stone-900 truncate">
                                  {item.title}
                                </h5>

                                {item.category && (
                                  <span className="text-[10px] text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded-md">
                                    {item.category}
                                  </span>
                                )}
                              </div>

                              {item.subtitle && (
                                <p className="text-[11px] text-stone-600 line-clamp-1 mt-0.5">
                                  {item.subtitle}
                                </p>
                              )}

                              <div className="flex items-center gap-2 mt-1 text-[10px] text-stone-400">
                                <span>{formatExactDateTime(item.timestamp)}</span>
                                {item.metadata?.durationSeconds && (
                                  <span>• {Math.round(item.metadata.durationSeconds / 60)} min</span>
                                )}
                              </div>
                            </div>

                            {/* Right Plan & Timestamp */}
                            <div className="text-right shrink-0 flex flex-col items-end gap-1">
                              <span className="text-[10px] font-bold text-amber-900 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-md whitespace-nowrap">
                                {formatRelativeTime(item.timestamp)}
                              </span>

                              <span
                                className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-1 ${
                                  isPremiumUser
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                    : 'bg-stone-100 text-stone-600 border border-stone-200'
                                }`}
                              >
                                {isPremiumUser ? '👑 Kiwify Premium' : 'Gratuito'}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: 365 Daily Devotionals Management */}
            {activeTab === 'devocionais' && (
              <div className="space-y-4 text-xs sm:text-sm animate-fadeIn">
                <div className="p-3.5 bg-gradient-to-r from-amber-50 to-stone-50 border border-amber-200 rounded-2xl text-stone-800 space-y-1.5">
                  <div className="font-bold text-xs text-amber-950 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-amber-700" />
                    <span>Como funciona o conteúdo novo todos os dias:</span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    <strong>Sim, todo dia tem coisa nova!</strong> O aplicativo calcula o dia do calendário anual (1 a 365) e exibe automaticamente um novo versículo, reflexão e prática diária para a data atual. Você pode conferir os devocionais cadastrados abaixo ou adicionar mensagens personalizadas para datas especiais!
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-stone-700">
                    Total no catálogo: {availableVerses.length} devocionais disponíveis
                  </span>
                  <button
                    onClick={() => {
                      setVerseForm({
                        id: 'v-custom-' + Date.now(),
                        date: new Date().toISOString().split('T')[0],
                        reference: '',
                        text: '',
                        reflection: '',
                        actionPrompt: '',
                        theme: 'Paz Interior & Fé'
                      });
                      setIsEditingVerse(true);
                    }}
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition flex items-center gap-1 shadow-sm"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Adicionar Novo Devocional</span>
                  </button>
                </div>

                {/* Form to Add or Edit Verse */}
                {isEditingVerse && (
                  <form onSubmit={handleSaveVerse} className="p-4 bg-white border border-amber-300 rounded-2xl space-y-3 shadow-sm">
                    <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                      <span className="font-bold text-xs text-stone-900 flex items-center gap-1.5">
                        <Edit3 className="w-3.5 h-3.5 text-amber-600" />
                        <span>Cadastrar / Editar Devocional do Dia</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsEditingVerse(false)}
                        className="text-stone-400 hover:text-stone-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                          Data do Calendário (AAAA-MM-DD):
                        </label>
                        <input
                          type="date"
                          value={verseForm.date}
                          onChange={(e) => setVerseForm({ ...verseForm, date: e.target.value })}
                          className="w-full px-2.5 py-1.5 text-xs border rounded-lg bg-white"
                          required
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                          Referência Bíblica (ex: Salmos 91:1-2):
                        </label>
                        <input
                          type="text"
                          value={verseForm.reference}
                          onChange={(e) => setVerseForm({ ...verseForm, reference: e.target.value })}
                          placeholder="Livro Capítulo:Versículo"
                          className="w-full px-2.5 py-1.5 text-xs border rounded-lg bg-white"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                        Texto da Sagrada Escritura:
                      </label>
                      <textarea
                        rows={2}
                        value={verseForm.text}
                        onChange={(e) => setVerseForm({ ...verseForm, text: e.target.value })}
                        placeholder="Digite o versículo bíblico..."
                        className="w-full px-2.5 py-1.5 text-xs border rounded-lg bg-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                        Reflexão Devocional:
                      </label>
                      <textarea
                        rows={2}
                        value={verseForm.reflection}
                        onChange={(e) => setVerseForm({ ...verseForm, reflection: e.target.value })}
                        placeholder="Mensagem espiritual para acalmar o coração..."
                        className="w-full px-2.5 py-1.5 text-xs border rounded-lg bg-white"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                          Prática Devocional para Hoje:
                        </label>
                        <input
                          type="text"
                          value={verseForm.actionPrompt}
                          onChange={(e) => setVerseForm({ ...verseForm, actionPrompt: e.target.value })}
                          placeholder="Ex: Agradeça a Deus por 3 bênçãos..."
                          className="w-full px-2.5 py-1.5 text-xs border rounded-lg bg-white"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                          Tema Espiritual:
                        </label>
                        <input
                          type="text"
                          value={verseForm.theme}
                          onChange={(e) => setVerseForm({ ...verseForm, theme: e.target.value })}
                          placeholder="Ex: Paz Interior, Cura, Força"
                          className="w-full px-2.5 py-1.5 text-xs border rounded-lg bg-white"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsEditingVerse(false)}
                        className="px-3 py-1.5 border border-stone-300 rounded-lg text-xs text-stone-600 hover:bg-stone-100"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow"
                      >
                        Salvar Devocional
                      </button>
                    </div>
                  </form>
                )}

                {/* List of Devotionals */}
                <div className="max-h-72 overflow-y-auto space-y-2 border border-stone-200 rounded-2xl p-2 bg-white divide-y divide-stone-100">
                  {availableVerses.map((v) => {
                    const isCustom = v.id.startsWith('v-custom-');
                    return (
                      <div key={v.id} className="p-2.5 flex items-start justify-between gap-3 text-xs">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-amber-900 font-serif">
                              {v.reference}
                            </span>
                            <span className="text-[10px] bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded border">
                              {v.date}
                            </span>
                            <span className="text-[10px] text-amber-700 font-medium">
                              {v.theme}
                            </span>
                            {isCustom && (
                              <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 rounded">
                                Personalizado
                              </span>
                            )}
                          </div>
                          <p className="text-stone-600 italic line-clamp-1">
                            &ldquo;{v.text}&rdquo;
                          </p>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => {
                              setVerseForm(v);
                              setIsEditingVerse(true);
                            }}
                            className="p-1 text-stone-400 hover:text-amber-700 rounded"
                            title="Editar este devocional"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          {isCustom && (
                            <button
                              onClick={() => handleDeleteVerse(v.id)}
                              className="p-1 text-stone-400 hover:text-rose-600 rounded"
                              title="Excluir este devocional"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 3: User Simulator & Testing */}
            {activeTab === 'usuarios' && (
              <div className="space-y-4 text-xs sm:text-sm animate-fadeIn">
                <div className="p-4 bg-white border border-stone-200 rounded-2xl space-y-3">
                  <h4 className="font-serif font-bold text-stone-900 text-sm flex items-center gap-1.5">
                    <RefreshCw className="w-4 h-4 text-amber-600" />
                    <span>Simular Estado de Assinatura (Auditoria de Teste)</span>
                  </h4>
                  <p className="text-xs text-stone-600">
                    Use os botões abaixo para ver exatamente como o aplicativo se comporta na visão de cada tipo de usuário:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <button
                      onClick={() => handleSimulateUserStatus('free')}
                      className={`p-3.5 rounded-xl border text-xs font-semibold text-center transition ${
                        profile.subscriptionStatus !== 'premium'
                          ? 'bg-amber-100 border-amber-400 text-amber-900 font-bold shadow-sm'
                          : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      <div className="font-bold text-sm">Plano Gratuito</div>
                      <div className="text-[11px] text-stone-500 mt-0.5">Versículo diário, orações básicas e anúncios</div>
                    </button>

                    <button
                      onClick={() => handleSimulateUserStatus('premium')}
                      className={`p-3.5 rounded-xl border text-xs font-semibold text-center transition ${
                        profile.subscriptionStatus === 'premium'
                          ? 'bg-emerald-100 border-emerald-400 text-emerald-900 font-bold shadow-sm'
                          : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      <div className="font-bold text-sm text-emerald-700">👑 Assinante Kiwify Premium</div>
                      <div className="text-[11px] text-stone-500 mt-0.5">Todos os 150 Salmos, sem anúncios e áudios</div>
                    </button>
                  </div>
                </div>

                {/* Quick Info & Direct Links */}
                <div className="p-3.5 bg-stone-100 rounded-xl text-xs text-stone-600 flex items-center justify-between">
                  <span>
                    Status Atual: <strong>{profile.subscriptionStatus.toUpperCase()}</strong> ({profile.name})
                  </span>
                  <button
                    onClick={() => {
                      if (confirm('Deseja resetar os dados de histórico para o estado inicial?')) {
                        localStorage.clear();
                        window.location.reload();
                      }
                    }}
                    className="text-rose-600 hover:underline text-[11px]"
                  >
                    Resetar Todos os Dados Locais
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
