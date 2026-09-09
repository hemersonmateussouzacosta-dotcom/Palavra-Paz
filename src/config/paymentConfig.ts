// Configuração do Link de Pagamento Oficial da Kiwify
export const DEFAULT_KIWIFY_CHECKOUT_URL = 'https://pay.kiwify.com.br/vxSeONK';
export const DEFAULT_ADFREE_CHECKOUT_URL = 'https://pay.kiwify.com.br/vxSeONK';

const STORAGE_KEY_KIWIFY_URL = 'palavra_paz_kiwify_checkout_url';
const STORAGE_KEY_ADFREE_URL = 'palavra_paz_adfree_checkout_url';

/**
 * Obtém a URL oficial ativa do checkout Kiwify:
 * Retorna sempre o link oficial configurado https://pay.kiwify.com.br/vxSeONK
 */
export function getKiwifyCheckoutUrl(): string {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_KIWIFY_URL);
    // Se o valor salvo anteriormente for o link antigo de placeholder, limpa e usa o oficial
    if (saved && saved.includes('assinatura-devocional-palavra-paz')) {
      localStorage.removeItem(STORAGE_KEY_KIWIFY_URL);
      return DEFAULT_KIWIFY_CHECKOUT_URL;
    }
    if (saved && saved.trim()) {
      return saved.trim();
    }
  } catch {
    // Caso o localStorage não esteja acessível
  }

  return DEFAULT_KIWIFY_CHECKOUT_URL;
}

/**
 * Salva a URL de checkout Kiwify localmente se necessário
 */
export function saveKiwifyCheckoutUrl(url: string): void {
  try {
    if (!url || !url.trim() || url.includes('assinatura-devocional-palavra-paz')) {
      localStorage.setItem(STORAGE_KEY_KIWIFY_URL, DEFAULT_KIWIFY_CHECKOUT_URL);
    } else {
      localStorage.setItem(STORAGE_KEY_KIWIFY_URL, url.trim());
    }
  } catch (e) {
    console.error('Erro ao salvar URL do Kiwify:', e);
  }
}

/**
 * Obtém a URL do checkout para o Plano Sem Anúncios (Ad-Free)
 */
export function getAdFreeCheckoutUrl(): string {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_ADFREE_URL);
    if (saved && saved.trim()) {
      return saved.trim();
    }
  } catch {
    // Fallback
  }
  return DEFAULT_ADFREE_CHECKOUT_URL;
}

/**
 * Salva a URL do checkout do Plano Sem Anúncios (Ad-Free)
 */
export function saveAdFreeCheckoutUrl(url: string): void {
  try {
    if (!url || !url.trim()) {
      localStorage.setItem(STORAGE_KEY_ADFREE_URL, DEFAULT_ADFREE_CHECKOUT_URL);
    } else {
      localStorage.setItem(STORAGE_KEY_ADFREE_URL, url.trim());
    }
  } catch (e) {
    console.error('Erro ao salvar URL do Plano Ad-Free:', e);
  }
}
