import React, { useState } from 'react';
import { Bell, Check, Clock, Volume2, X, AlertCircle, Sparkles } from 'lucide-react';
import { NotificationService } from '../services/notificationService';
import { NotificationSettings } from '../types';
import { getTodayVerse } from '../data/versesData';
import { soundService } from '../services/soundService';

interface MorningNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MorningNotificationModal: React.FC<MorningNotificationModalProps> = ({
  isOpen,
  onClose
}) => {
  const [settings, setSettings] = useState<NotificationSettings>(NotificationService.getSettings());
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [testSent, setTestSent] = useState(false);

  if (!isOpen) return null;

  const todayVerse = getTodayVerse();

  const handleRequestPermission = async () => {
    const granted = await NotificationService.requestPermission();
    setSettings((prev) => ({ ...prev, hasPermission: granted, enabled: granted }));
    if (granted) {
      soundService.playChime(587, 2.5);
      setStatusMessage('Permissão concedida com sucesso! Você receberá os versículos.');
    } else {
      setStatusMessage('Permissão não concedida. Verifique as configurações do seu navegador.');
    }
  };

  const handleSave = () => {
    NotificationService.saveSettings(settings);
    setStatusMessage('Configurações de alarme matinal salvas com sucesso!');
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const handleTestNotification = () => {
    soundService.playChime(528, 3);
    const sent = NotificationService.showDailyVerseNotification(
      todayVerse.reference,
      todayVerse.text
    );
    if (sent) {
      setTestSent(true);
      setStatusMessage('Notificação enviada ao seu sistema!');
    } else {
      // Fallback display if in iframe or denied
      setStatusMessage(`[Simulação de Notificação] ☀️ ${todayVerse.reference}: "${todayVerse.text}"`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-stone-50 border border-stone-200 rounded-2xl max-w-md w-full p-6 shadow-2xl relative text-stone-800">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-1 rounded-lg"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-stone-900 text-lg">Notificação Matinal</h3>
            <p className="text-xs text-stone-500">Comece o dia alimentando sua fé</p>
          </div>
        </div>

        <p className="text-sm text-stone-600 mb-4 leading-relaxed">
          Receba diariamente pela manhã o versículo do dia com reflexão inspiradora direto no seu dispositivo para preparar o seu coração.
        </p>

        {/* Permission status card */}
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3.5 mb-4 text-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-amber-900">Permissão de Notificação:</span>
            {settings.hasPermission ? (
              <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-full">
                <Check className="w-3 h-3" /> Ativada
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-stone-600 bg-stone-200 px-2 py-0.5 rounded-full">
                Não solicitada
              </span>
            )}
          </div>
          {!settings.hasPermission && (
            <button
              onClick={handleRequestPermission}
              className="w-full mt-1 bg-amber-600 hover:bg-amber-700 text-white font-medium py-1.5 px-3 rounded-lg transition text-xs shadow-sm flex items-center justify-center gap-1.5"
            >
              <Bell className="w-3.5 h-3.5" />
              Autorizar Notificações no Navegador
            </button>
          )}
        </div>

        {/* Morning time picker */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-stone-700 mb-1.5 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-amber-600" />
            Horário de envio pela manhã:
          </label>
          <div className="grid grid-cols-4 gap-2">
            {['06:00', '06:30', '07:00', '08:00'].map((time) => (
              <button
                key={time}
                type="button"
                onClick={() => setSettings({ ...settings, morningTime: time })}
                className={`py-2 px-2 text-xs font-medium rounded-lg border transition ${
                  settings.morningTime === time
                    ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                    : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-100'
                }`}
              >
                {time}
              </button>
            ))}
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-xs text-stone-500">Ou digite outro horário:</span>
            <input
              type="time"
              value={settings.morningTime}
              onChange={(e) => setSettings({ ...settings, morningTime: e.target.value })}
              className="px-2 py-1 text-xs border border-stone-300 rounded bg-white"
            />
          </div>
        </div>

        {/* Test button */}
        <div className="border-t border-stone-200 pt-3 mb-4 flex items-center justify-between">
          <button
            type="button"
            onClick={handleTestNotification}
            className="text-xs text-amber-700 hover:text-amber-800 font-semibold flex items-center gap-1.5 py-1 px-2.5 rounded-lg border border-amber-300 bg-amber-50/50 hover:bg-amber-100 transition"
          >
            <Volume2 className="w-3.5 h-3.5" />
            Testar Alerta Agora
          </button>
          <span className="text-[11px] text-stone-400">
            {testSent ? 'Campainha e alerta disparados!' : 'Dispara campainha e texto'}
          </span>
        </div>

        {statusMessage && (
          <div className="mb-4 p-2.5 rounded-lg bg-stone-100 border border-stone-200 text-xs text-stone-700 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>{statusMessage}</span>
          </div>
        )}

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 text-xs font-medium border border-stone-300 text-stone-600 rounded-xl hover:bg-stone-100 transition"
          >
            Fechar
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 py-2 text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-md transition"
          >
            Salvar Preferências
          </button>
        </div>
      </div>
    </div>
  );
};
