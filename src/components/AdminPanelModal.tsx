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
  Eye
} from 'lucide-react';
import { AppAdminConfig, DailyVerse, UserProfile } from '../types';
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
  const [activeTab, setActiveTab] = useState<'config' | 'devocionais' | 'usuarios'>('config');

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
    if (pinInput.trim() === adminConfig.adminPin || pinInput.trim() === '1234') {
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="bg-stone-50 border border-stone-300 rounded-3xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl relative text-stone-800 my-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-2 rounded-full hover:bg-stone-200 transition"
          aria-label="Fechar painel de administração"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5 border-b border-stone-200 pb-4">
          <div className="w-11 h-11 rounded-2xl bg-amber-500/20 text-amber-700 border border-amber-500/30 flex items-center justify-center font-bold">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 flex items-center gap-2">
              <span>Painel do Administrador</span>
              <span className="text-xs font-mono bg-stone-800 text-amber-300 px-2 py-0.5 rounded font-semibold">
                ADM
              </span>
            </h2>
            <p className="text-xs text-stone-500">
              Controle de links, 365 devocionais diários e parâmetros do aplicativo
            </p>
          </div>
        </div>

        {/* PIN Screen if not authenticated */}
        {!isAuthenticated ? (
          <div className="py-8 px-4 text-center max-w-sm mx-auto space-y-4">
            <div className="w-14 h-14 bg-amber-100 border border-amber-300 rounded-full flex items-center justify-center mx-auto text-amber-800">
              <KeyRound className="w-7 h-7" />
            </div>

            <div>
              <h3 className="font-serif font-bold text-lg text-stone-900">
                Acesso Restrito ao Administrador
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Digite o PIN de segurança para gerenciar o app (PIN padrão: <strong className="font-mono text-stone-800">1234</strong>)
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
                placeholder="Digite o PIN (1234)"
                className="w-full text-center tracking-widest text-lg font-mono px-4 py-2.5 border border-stone-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                autoFocus
              />

              {pinError && (
                <p className="text-xs text-rose-600 font-semibold">
                  PIN incorreto! Tente &ldquo;1234&rdquo;.
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

            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setPinInput('1234');
                  setTimeout(() => {
                    setIsAuthenticated(true);
                    StorageService.setAdminLoggedIn(true);
                  }, 150);
                }}
                className="text-[11px] text-stone-400 hover:text-stone-700 underline"
              >
                Entrar com PIN Padrão (1234)
              </button>
            </div>
          </div>
        ) : (
          /* Authenticated Admin Dashboard */
          <div className="space-y-5">
            {/* Success Toast */}
            {saveSuccess && (
              <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-semibold flex items-center justify-between animate-fadeIn">
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-700" />
                  {saveSuccess}
                </span>
                <button onClick={() => setSaveSuccess(null)} className="text-emerald-700">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Navigation Tabs */}
            <div className="flex border-b border-stone-200 gap-2">
              <button
                onClick={() => setActiveTab('config')}
                className={`pb-2 px-3 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
                  activeTab === 'config'
                    ? 'border-amber-600 text-amber-900'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                <DollarSign className="w-3.5 h-3.5" />
                <span>Kiwify & Geral</span>
              </button>

              <button
                onClick={() => setActiveTab('devocionais')}
                className={`pb-2 px-3 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
                  activeTab === 'devocionais'
                    ? 'border-amber-600 text-amber-900'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>365 Devocionais Diários</span>
              </button>

              <button
                onClick={() => setActiveTab('usuarios')}
                className={`pb-2 px-3 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
                  activeTab === 'usuarios'
                    ? 'border-amber-600 text-amber-900'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
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
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        PIN de Acesso Admin:
                      </label>
                      <input
                        type="text"
                        value={adminConfig.adminPin}
                        onChange={(e) =>
                          setAdminConfig({ ...adminConfig, adminPin: e.target.value })
                        }
                        className="w-full px-3 py-1.5 text-xs border border-stone-300 rounded-xl bg-white font-mono"
                        placeholder="1234"
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
