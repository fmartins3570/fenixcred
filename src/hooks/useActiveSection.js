import { useState, useEffect, useRef } from 'react'

/**
 * Hook personalizado para detectar a seção ativa no scroll
 * 
 * Otimizado para evitar reflows forçados usando IntersectionObserver
 * ao invés de ler propriedades geométricas durante scroll
 * 
 * Retorna o ID da seção que está atualmente visível na viewport
 */
export function useActiveSection() {
  const [activeSection, setActiveSection] = useState('inicio')
  const observerRef = useRef(null)
  const sectionsRef = useRef([])

  useEffect(() => {
    // Verificar suporte a IntersectionObserver
    if (!('IntersectionObserver' in window)) {
      // Fallback para browsers antigos (menos eficiente mas funcional)
      const sections = document.querySelectorAll('section[id]')
      
      let ticking = false
      const handleScroll = () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            const scrollPosition = window.scrollY + 100

            sections.forEach((section) => {
              const sectionTop = section.offsetTop
              const sectionHeight = section.offsetHeight
              const sectionId = section.getAttribute('id')

              if (
                scrollPosition >= sectionTop &&
                scrollPosition < sectionTop + sectionHeight
              ) {
                setActiveSection(sectionId)
              }
            })
            
            ticking = false
          })
          ticking = true
        }
      }

      window.addEventListener('scroll', handleScroll, { passive: true })
      handleScroll()

      return () => window.removeEventListener('scroll', handleScroll)
    }

    // Usar IntersectionObserver (mais eficiente, sem reflows forçados)
    const sections = document.querySelectorAll('section[id]')
    sectionsRef.current = Array.from(sections)

    // Criar observer com rootMargin para considerar header fixo
    observerRef.current = new IntersectionObserver(
      (entries) => {
        // Encontrar a seção mais visível
        let maxRatio = 0
        let mostVisibleSection = null

        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio
            mostVisibleSection = entry.target.getAttribute('id')
          }
        })

        // Se encontrou uma seção visível, atualizar
        if (mostVisibleSection) {
          setActiveSection(mostVisibleSection)
        }
      },
      {
        root: null,
        rootMargin: '-100px 0px -50% 0px', // Offset para header fixo
        threshold: [0, 0.1, 0.5, 1.0] // Múltiplos thresholds para melhor detecção
      }
    )

    // Observar todas as seções
    sectionsRef.current.forEach((section) => {
      observerRef.current.observe(section)
    })

    // Cleanup
    return () => {
      if (observerRef.current) {
        sectionsRef.current.forEach((section) => {
          observerRef.current.unobserve(section)
        })
        observerRef.current.disconnect()
      }
    }
  }, [])

  return activeSection
}

