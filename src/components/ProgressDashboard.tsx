import React, { useState } from 'react';
import { Award, Flame, Clock, Calendar, Heart, Download, Shield, Sparkles, CheckCircle2, User, Edit3, Trash2, Lock, ArrowRight, WifiOff } from 'lucide-react';
import { PracticeLog, UserProfile } from '../types';
import { StorageService } from '../services/storageService';

interface ProgressDashboardProps {
  profile: UserProfile;
  practiceLogs: PracticeLog[];
  onProfileUpdate: (updated: UserProfile) => void;
  onOpenCheckout: () => void;
  onOpenAdmin?: () => void;
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({
  profile,
  practiceLogs,
  onProfileUpdate,
  onOpenCheckout,
  onOpenAdmin
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [userName, setUserName] = useState(profile.name);
  const [dailyGoal, setDailyGoal] = useState(profile.dailyGoalMinutes);

  const totalMinutesPrayed = Math.round(
    practiceLogs.reduce((acc, log) => acc + log.durationSeconds, 0) / 60
  );

  // Minutes today
  const todayStr = new Date().toISOString().split('T')[0];
  const minutesToday = Math.round(
    practiceLogs
      .filter((l) => l.timestamp.startsWith(todayStr))
      .reduce((acc, log) => acc + log.durationSeconds, 0) / 60
  );

  const goalPercent = Math.min(100, Math.round((minutesToday / (profile.dailyGoalMinutes || 15)) * 100));

  const handleSaveName = () => {
    const updated = { ...profile, name: userName.trim() || 'Irmão(ã) em Cristo', dailyGoalMinutes: dailyGoal };
    StorageService.saveProfile(updated);
    onProfileUpdate(updated);
    setIsEditingName(false);
  };

  const isPremium = profile.subscriptionStatus === 'premium';

  return (
    <div id="progress-dashboard-container" className="space-y-6">
      {/* Profile Header & Goal Card */}
      <div className="bg-gradient-to-br from-stone-900 via-stone-800 to-amber-950 text-stone-100 rounded-3xl p-6 sm:p-8 border border-stone-800 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-stone-950 font-bold text-xl shadow-lg">
              <User className="w-7 h-7" />
            </div>
            <div>
              {isEditingName ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="px-2.5 py-1 text-sm bg-stone-800 border border-stone-600 rounded-lg text-white"
                  />
                  <button
                    onClick={handleSaveName}
                    className="text-xs bg-amber-500 text-stone-950 px-2.5 py-1 rounded-lg font-bold"
                  >
                    Salvar
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-amber-100">
                    {profile.name}
                  </h2>
                  <button
                    onClick={() => setIsEditingName(true)}
                    className="text-stone-400 hover:text-amber-300 p-1"
                    title="Editar nome"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
              )}
              <p className="text-xs text-stone-400">
                Membro desde {new Date(profile.startDate).toLocaleDateString('pt-BR')} &bull; Jornada Devocional
              </p>
            </div>
          </div>

          {/* Subscription Status Badge */}
          <div className="flex items-center gap-2">
            {isPremium ? (
              <div className="bg-amber-500/20 border border-amber-500/40 text-amber-300 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-amber-400" />
                <span>Assinatura Kiwify Ativa (R$ 14,90/mês)</span>
              </div>
            ) : (
              <button
                onClick={onOpenCheckout}
                className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-3.5 py-1.5 rounded-xl text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Plano Gratuito &bull; Assinar Kiwify (R$ 14,90/mês)</span>
              </button>
            )}
          </div>
        </div>

        {/* Daily Goal Bar */}
        <div className="bg-stone-800/80 border border-stone-700/80 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2 text-xs sm:text-sm">
            <span className="font-semibold text-stone-200">
              Meta Diária de Oração & Meditação
            </span>
            <span className="text-amber-400 font-bold">
              {minutesToday} de {profile.dailyGoalMinutes} min hoje ({goalPercent}%)
            </span>
          </div>
          <div className="w-full h-3 bg-stone-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-500 rounded-full"
              style={{ width: `${goalPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm text-stone-800">
          <div className="flex items-center justify-between text-amber-600 mb-2">
            <Clock className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Total</span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-stone-900">
            {totalMinutesPrayed}
          </div>
          <p className="text-xs text-stone-500 mt-1">Minutos dedicados a Deus</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm text-stone-800">
          <div className="flex items-center justify-between text-orange-500 mb-2">
            <Flame className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Constância</span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-stone-900">
            {profile.streakDays}
          </div>
          <p className="text-xs text-stone-500 mt-1">Dias seguidos de oração</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm text-stone-800">
          <div className="flex items-center justify-between text-emerald-600 mb-2">
            <Award className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Práticas</span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-stone-900">
            {practiceLogs.length}
          </div>
          <p className="text-xs text-stone-500 mt-1">Sessões registradas</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm text-stone-800">
          <div className="flex items-center justify-between text-rose-500 mb-2">
            <Download className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Offline</span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-stone-900">
            {isPremium ? profile.savedOfflineIds.length : '0 (Bloqueado)'}
          </div>
          <p className="text-xs text-stone-500 mt-1">Itens salvos offline</p>
        </div>
      </div>

      {/* Offline Saved Content Library */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 shadow-sm">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5 text-amber-600" />
            <h3 className="font-serif font-bold text-lg text-stone-900">
              Biblioteca Offline (Acesso Sem Internet)
            </h3>
          </div>
          {isPremium ? (
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              {profile.savedOfflineIds.length} itens salvos no dispositivo
            </span>
          ) : (
            <span className="text-xs font-bold text-amber-900 bg-amber-100 px-2.5 py-1 rounded-full border border-amber-200 flex items-center gap-1">
              <Lock className="w-3 h-3 text-amber-700" />
              Recurso Kiwify Premium
            </span>
          )}
        </div>

        {!isPremium ? (
          <div className="p-5 bg-gradient-to-r from-amber-50 to-stone-50 border border-amber-200 rounded-2xl text-stone-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1 max-w-md">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                <WifiOff className="w-4 h-4 text-amber-700" />
                <span>Modo Offline Bloqueado no Plano Gratuito</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Para guardar orações, os 150 Salmos e estudos bíblicos e ler em viagens, retiros e lugares sem internet, assine a versão premium Kiwify por <strong>R$ 14,90/mês</strong>.
              </p>
            </div>
            <button
              onClick={onOpenCheckout}
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs shadow transition shrink-0 flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Desbloquear Modo Offline</span>
            </button>
          </div>
        ) : profile.savedOfflineIds.length === 0 ? (
          <p className="text-xs text-stone-500 italic">
            Nenhum item salvo ainda. Clique no ícone de download dentro das orações ou Salmos para tê-los offline.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {profile.savedOfflineIds.map((id) => (
              <div
                key={id}
                className="p-3 bg-amber-50/60 border border-amber-200/80 rounded-xl flex items-center justify-between text-xs text-stone-800"
              >
                <div className="truncate">
                  <span className="font-semibold block truncate">
                    {id.startsWith('salmo-') ? `Salmo ${id.replace('salmo-', '')}` : id.replace('oracao-', 'Oração: ').replace('-', ' ')}
                  </span>
                  <span className="text-[10px] text-emerald-700 flex items-center gap-1 font-medium">
                    <CheckCircle2 className="w-3 h-3" /> Disponível sem rede
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Freemium Benefits Highlight Card */}
      <div className="bg-gradient-to-br from-amber-50 via-white to-amber-100/50 border border-amber-200/80 rounded-2xl p-5 sm:p-6 shadow-sm">
        <h3 className="font-serif font-bold text-lg text-stone-900 mb-2 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-600" />
          <span>Benefícios do Modelo de Assinatura Kiwify (R$ 14,90/mês)</span>
        </h3>
        <p className="text-xs text-stone-600 mb-4">
          A assinatura oficial Kiwify desbloqueia o ecossistema espiritual completo para fortalecer sua comunhão diária.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-white border border-stone-200 rounded-xl p-3.5 space-y-2">
            <div className="font-bold text-stone-700 uppercase tracking-wider text-[11px] pb-1 border-b border-stone-100">
              Versão Gratuita
            </div>
            <div className="text-stone-600 flex items-start gap-2">
              <span className="text-emerald-600 font-bold">✓</span>
              <span>Versículo diário com notificação matinal</span>
            </div>
            <div className="text-stone-600 flex items-start gap-2">
              <span className="text-emerald-600 font-bold">✓</span>
              <span>1 oração da manhã e 1 da tarde gratuitas</span>
            </div>
            <div className="text-stone-400 flex items-start gap-2">
              <span className="text-rose-500 font-bold">✕</span>
              <span>Contém anúncios recorrentes durante a leitura</span>
            </div>
            <div className="text-stone-400 flex items-start gap-2">
              <span className="text-rose-500 font-bold">✕</span>
              <span>Salmos e estudos teológicos bloqueados</span>
            </div>
            <div className="text-stone-400 flex items-start gap-2">
              <span className="text-rose-500 font-bold">✕</span>
              <span>Sem download ou modo offline</span>
            </div>
          </div>

          <div className="bg-amber-100/40 border border-amber-300 rounded-xl p-3.5 space-y-2">
            <div className="font-bold text-amber-900 uppercase tracking-wider text-[11px] pb-1 border-b border-amber-200">
              👑 Assinante Kiwify Premium (R$ 14,90/mês)
            </div>
            <div className="text-stone-800 flex items-start gap-2">
              <span className="text-emerald-600 font-bold">✓</span>
              <span><strong>Todos os 150 Salmos</strong> com exegese e áudio</span>
            </div>
            <div className="text-stone-800 flex items-start gap-2">
              <span className="text-emerald-600 font-bold">✓</span>
              <span><strong>Todas as orações</strong> (acalmar alma, cura, noite)</span>
            </div>
            <div className="text-stone-800 flex items-start gap-2">
              <span className="text-emerald-600 font-bold">✓</span>
              <span><strong>Estudos avançados</strong> com narração em áudio</span>
            </div>
            <div className="text-stone-800 flex items-start gap-2">
              <span className="text-emerald-600 font-bold">✓</span>
              <span><strong>100% sem anúncios</strong> comerciais</span>
            </div>
            <div className="text-stone-800 flex items-start gap-2">
              <span className="text-emerald-600 font-bold">✓</span>
              <span><strong>Modo Offline Ilimitado</strong> em todo o conteúdo</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Practice History */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif font-bold text-lg text-stone-900">
            Histórico Recente de Práticas
          </h3>
          <span className="text-xs text-stone-500">
            Registrado com o cronômetro & meditação
          </span>
        </div>

        <div className="divide-y divide-stone-100">
          {practiceLogs.map((log) => (
            <div key={log.id} className="py-3 flex items-center justify-between gap-3 text-xs sm:text-sm">
              <div>
                <span className="font-semibold text-stone-900 block">
                  {log.title}
                </span>
                <span className="text-stone-500 text-xs">
                  {new Date(log.timestamp).toLocaleString('pt-BR', {
                    day: '2-digit',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                  {log.notes && ` • "${log.notes}"`}
                </span>
              </div>
              <div className="font-mono font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 shrink-0">
                {Math.round(log.durationSeconds / 60)} min
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Admin Access Panel Entry */}
      {onOpenAdmin && (
        <div className="bg-stone-50 rounded-2xl p-4 sm:p-5 border border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-700">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-stone-900 block text-sm font-serif">
                Painel do Administrador &bull; Controle Total
              </span>
              <span className="text-stone-500">
                Gerencie o link Kiwify, os 365 devocionais diários e parâmetros da plataforma.
              </span>
            </div>
          </div>
          <button
            onClick={onOpenAdmin}
            className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-amber-300 font-bold rounded-xl transition shadow-sm text-xs shrink-0 flex items-center gap-1.5"
          >
            <span>Acessar Painel ADM</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
