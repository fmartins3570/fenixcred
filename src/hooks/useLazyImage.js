import { useEffect, useRef, useState } from 'react';

/**
 * Hook para lazy loading de imagens com Intersection Observer
 * 
 * Fallback para browsers antigos que não suportam loading="lazy"
 * 
 * @param {boolean} enabled - Se o lazy loading está habilitado
 * @returns {Object} - { imgRef, isLoaded }
 */
export function useLazyImage(enabled = true) {
  const imgRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!enabled || !imgRef.current) return;

    const currentImgRef = imgRef.current;

    // Se o browser suporta loading="lazy", não precisa do observer
    if ('loading' in HTMLImageElement.prototype) {
      return;
    }

    // Fallback: Intersection Observer para browsers antigos
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = entry.target;
              if (img.dataset.src) {
                img.src = img.dataset.src;
                img.classList.add('loaded');
                setIsLoaded(true);
                imageObserver.unobserve(img);
              }
            }
          });
        },
        { rootMargin: '50px' }
      );

      if (imgRef.current) {
        imageObserver.observe(currentImgRef);
      }

      return () => {
        if (currentImgRef) {
          imageObserver.unobserve(currentImgRef);
        }
        imageObserver.disconnect();
      };
    } else {
      // Fallback final: carregar imediatamente em browsers muito antigos
      if (currentImgRef && currentImgRef.dataset.src) {
        currentImgRef.src = currentImgRef.dataset.src;
        setIsLoaded(true);
      }
    }
  }, [enabled]);

  return { imgRef, isLoaded };
}
