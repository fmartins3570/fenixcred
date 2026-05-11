/**
 * Utilitário para lazy loading de imagens com Intersection Observer
 * 
 * Fallback para browsers antigos que não suportam loading="lazy"
 * Executa automaticamente quando o DOM está pronto
 */

export function initLazyImages() {
  // Se o browser suporta loading="lazy" nativo, não precisa do observer
  if ('loading' in HTMLImageElement.prototype) {
    return;
  }

  // Fallback: Intersection Observer para browsers antigos
  if (!('IntersectionObserver' in window)) {
    // Fallback final: carregar todas as imagens imediatamente em browsers muito antigos
    document.querySelectorAll('img[data-src]').forEach((img) => {
      if (img.dataset.src) {
        img.src = img.dataset.src;
        img.classList.add('loaded');
      }
    });
    return;
  }

  const imageObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.classList.add('loaded');
            imageObserver.unobserve(img);
          }
        }
      });
    },
    { rootMargin: '50px' }
  );

  // Observar todas as imagens com data-src
  document.querySelectorAll('img[data-src]').forEach((img) => {
    imageObserver.observe(img);
  });
}

// Executar quando o DOM estiver pronto
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLazyImages);
  } else {
    initLazyImages();
  }
}
