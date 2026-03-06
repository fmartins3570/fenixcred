import { useState, useEffect } from 'react'
import './BackToTop.css'

/**
 * Componente BackToTop - Botão para voltar ao topo da página
 * 
 * Aparece quando o usuário rola a página para baixo
 * Implementa smooth scroll para melhor UX
 */
function BackToTop() {
  const [isVisible, setIsVisible] = useState(false)

  // Mostra/esconde o botão baseado na posição do scroll
  // Otimizado com requestAnimationFrame para evitar reflows forçados
  useEffect(() => {
    let ticking = false

    const toggleVisibility = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          // Usar pageYOffset dentro de requestAnimationFrame evita reflow forçado
          setIsVisible(window.pageYOffset > 300)
          ticking = false
        })
        ticking = true
      }
    }

    // Usar { passive: true } para melhor performance
    window.addEventListener('scroll', toggleVisibility, { passive: true })
    
    // Verificar estado inicial
    toggleVisibility()

    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  // Função para voltar ao topo com smooth scroll
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <button
      className={`back-to-top ${isVisible ? 'visible' : ''}`}
      onClick={scrollToTop}
      aria-label="Voltar ao topo da página"
      title="Voltar ao topo"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/>
      </svg>
    </button>
  )
}

export default BackToTop

