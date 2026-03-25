import Logo from '../Logo'
import '../Header.css'

/**
 * Header simplificado para landing pages CLT
 * Apenas logo + CTA para questionário (sem WhatsApp direto para forçar fluxo do quiz)
 */
export default function HeaderCLT() {
  const scrollToQuiz = () => {
    const el = document.getElementById('questionario-clt')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header className="header">
      <div className="header-container">
        <a href="#hero-clt" className="logo-link">
          <Logo size="medium" />
        </a>

        <button
          className="btn-whatsapp-header"
          onClick={scrollToQuiz}
          aria-label="Simular crédito consignado CLT"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
            <rect x="9" y="3" width="6" height="4" rx="1" />
            <path d="M9 14l2 2 4-4" />
          </svg>
          Simular Agora
        </button>
      </div>
    </header>
  )
}
