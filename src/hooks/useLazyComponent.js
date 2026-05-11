import { useState, useEffect, useRef } from "react";

/**
 * Hook para carregar componentes lazy apenas quando a seção está próxima de ficar visível
 * 
 * Isso reduz a cadeia crítica ao adiar o carregamento de componentes abaixo do fold
 * até que o usuário role até eles.
 * 
 * @param {number} rootMargin - Margem em pixels antes de iniciar o carregamento (padrão: 200px)
 * @returns {[boolean, React.RefObject]} - [shouldLoad, ref] - se deve carregar e ref para o elemento
 */
export function useLazyComponent(rootMargin = "200px") {
  const [shouldLoad, setShouldLoad] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    // Se já deve carregar, não precisa observar
    if (shouldLoad) return;

    // Verificar suporte a Intersection Observer
    if (!("IntersectionObserver" in window)) {
      // Fallback: carregar imediatamente em browsers antigos
      setShouldLoad(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldLoad(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin, // Iniciar carregamento 200px antes de ficar visível
        threshold: 0.01, // Disparar quando 1% estiver visível
      }
    );

    const currentRef = ref.current;

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
      observer.disconnect();
    };
  }, [shouldLoad, rootMargin]);

  return [shouldLoad, ref];
}
