/**
 * Google Analytics Utility - Versão Minimalista
 * 
 * O Google Analytics já está carregado no index.html
 * Esta função apenas garante que está inicializado corretamente
 */

/**
 * Inicializa o Google Analytics (se ainda não foi inicializado)
 * O script já está no index.html, esta função apenas verifica
 */
export const initGA = () => {
  // Se gtag já existe, não precisa fazer nada
  if (window.gtag && window.dataLayer) {
    return;
  }

  // Garantir que dataLayer existe
  if (!window.dataLayer) {
    window.dataLayer = window.dataLayer || [];
  }

  // Se gtag não existe, definir (fallback caso script não tenha carregado)
  if (!window.gtag) {
    window.gtag = function() {
      window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
  }
};
