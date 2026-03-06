import { benefits } from '../../utils/credito-clt/constants'
import './Benefits.css'

/**
 * Benefits Section
 * Grid de 6 benefícios com ícones
 */
export default function Benefits() {
  const iconMap = {
    TrendingDown: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 18l2.29-2.29-4.88-4.88-4 4L2 7.41 3.41 6l6 6 4-4 6.3 6.29L22 12v6z" />
      </svg>
    ),
    Clock: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
      </svg>
    ),
    ShieldCheck: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-1 16l-5-5 1.41-1.41L11 14.17l7.59-7.59L20 8l-9 9z" />
      </svg>
    ),
    Wallet: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
        <path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V5c0-1.1.9-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h9zM12 16h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
      </svg>
    ),
    Smartphone: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z" />
      </svg>
    ),
    Users: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
      </svg>
    ),
  }

  return (
    <section id="beneficios-clt" className="benefits-clt">
      <div className="benefits-clt-container">
        {/* Header */}
        <div className="benefits-clt-header">
          <span className="benefits-clt-badge">Vantagens Exclusivas</span>
          <h2 className="benefits-clt-title">
            Por que escolher a <span className="benefits-clt-title-highlight">Fênix Cred</span>?
          </h2>
          <p className="benefits-clt-description">
            Oferecemos as melhores condições do mercado para trabalhadores CLT.
            Conheça os benefícios do nosso crédito consignado CLT.
          </p>
        </div>

        {/* Grid de Benefícios */}
        <div className="benefits-clt-grid">
          {benefits.map((benefit, index) => (
            <div key={index} className="benefit-card" data-spotlight>
              {/* Ícone */}
              <div className="benefit-icon-wrapper">
                {iconMap[benefit.icon]}
              </div>

              {/* Título */}
              <h3 className="benefit-title">{benefit.title}</h3>

              {/* Descrição */}
              <p className="benefit-description">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
