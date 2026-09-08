// Configuração do Link de Pagamento da Kiwify
// Você pode alterar o link padrão abaixo ou usar a variável de ambiente VITE_KIWIFY_CHECKOUT_URL.
// Além disso, é possível colar e salvar o link diretamente pela interface do aplicativo.

export const DEFAULT_KIWIFY_CHECKOUT_URL = 'https://pay.kiwify.com.br/assinatura-devocional-palavra-paz';

const STORAGE_KEY_KIWIFY_URL = 'palavra_paz_kiwify_checkout_url';

/**
 * Obtém a URL ativa do checkout Kiwify:
 * 1º Verifica se o usuário salvou uma URL personalizada nas preferências locais (localStorage)
 * 2º Verifica se foi definida a variável de ambiente VITE_KIWIFY_CHECKOUT_URL
 * 3º Retorna o valor padrão DEFAULT_KIWIFY_CHECKOUT_URL
 */
export function getKiwifyCheckoutUrl(): string {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_KIWIFY_URL);
    if (saved && saved.trim()) {
      return saved.trim();
    }
  } catch {
    // Caso o localStorage não esteja acessível
  }

  // Verifica se foi definida variável de ambiente
  try {
    const meta = import.meta as unknown as { env?: Record<string, string | undefined> };
    if (meta?.env?.VITE_KIWIFY_CHECKOUT_URL) {
      return meta.env.VITE_KIWIFY_CHECKOUT_URL;
    }
  } catch {
    // Fallback
  }

  return DEFAULT_KIWIFY_CHECKOUT_URL;
}

/**
 * Salva uma nova URL de checkout Kiwify localmente
 */
export function saveKiwifyCheckoutUrl(url: string): void {
  try {
    if (!url || !url.trim()) {
      localStorage.removeItem(STORAGE_KEY_KIWIFY_URL);
    } else {
      localStorage.setItem(STORAGE_KEY_KIWIFY_URL, url.trim());
    }
  } catch (e) {
    console.error('Erro ao salvar URL do Kiwify no localStorage:', e);
  }
}
