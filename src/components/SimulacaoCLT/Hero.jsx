import './Hero.css'

const BENEFITS = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="6" width="20" height="12" rx="2" />
        <path d="M2 10h20" />
        <path d="M6 14h4" />
      </svg>
    ),
    text: 'Desconto em folha',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
        <polyline points="16 7 22 7 22 13" />
      </svg>
    ),
    text: 'Taxas reduzidas',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    text: 'Pagamento rápido',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
        <line x1="12" y1="18" x2="12.01" y2="18" />
      </svg>
    ),
    text: 'Contrato 100% digital',
  },
]

/**
 * Hero section da LP de Simulação CLT
 * Badge + título + subtítulo + grid de benefícios + CTA
 */
export default function Hero() {
  const scrollToQuestionnaire = () => {
    const el = document.getElementById('questionario-clt')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <section id="hero-simulacao" className="sim-hero">
      {/* Background decorations */}
      <div className="sim-hero-bg" aria-hidden="true" />
      <div className="sim-hero-glow-1" aria-hidden="true" />
      <div className="sim-hero-glow-2" aria-hidden="true" />

      <div className="sim-hero-container">
        <span className="sim-hero-badge">Consignado CLT</span>

        <h1 className="sim-hero-title">
          Empréstimo consignado para quem trabalha de{' '}
          <span className="sim-hero-highlight">carteira assinada</span>
        </h1>

        <p className="sim-hero-subtitle">
          Desconto direto na folha, taxas reduzidas e liberação rápida.
          Simule agora sem compromisso.
        </p>

        <div className="sim-hero-benefits">
          {BENEFITS.map((b) => (
            <div key={b.text} className="sim-benefit-card" data-spotlight>
              <span className="sim-benefit-icon">{b.icon}</span>
              <span className="sim-benefit-text">{b.text}</span>
            </div>
          ))}
        </div>

        <button
          className="sim-hero-cta"
          onClick={scrollToQuestionnaire}
          aria-label="Iniciar simulação de consignado CLT"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" />
            <path d="M12 5l7 7-7 7" />
          </svg>
          Simular agora
        </button>

        <div className="sim-hero-trust">
          <span className="sim-hero-trust-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>
            Sem consulta SPC/Serasa
          </span>
          <span className="sim-hero-trust-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
            Nome sujo pode solicitar
          </span>
          <span className="sim-hero-trust-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>
            Aprovação em minutos
          </span>
        </div>
      </div>
    </section>
  )
}
