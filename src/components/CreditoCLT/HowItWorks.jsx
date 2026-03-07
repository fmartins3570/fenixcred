import { steps } from '../../utils/credito-clt/constants'
import { useViewContent } from '../../hooks/useViewContent'
import './HowItWorks.css'

const iconMap = {
  FileText: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
      <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
    </svg>
  ),
  Search: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
      <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
    </svg>
  ),
  PenTool: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
      <path d="M2.53 19.65l1.34.56v-9.03l-2.43 5.86c-.41 1.02.08 2.19 1.09 2.61zm19.5-3.7L17.07 3.98c-.31-.75-1.04-1.21-1.81-1.23-.26 0-.53.04-.79.15L7.1 5.95c-.75.31-1.21 1.03-1.23 1.8-.01.27.04.54.15.8l4.96 11.97c.31.76 1.05 1.22 1.83 1.23.26 0 .52-.05.77-.15l7.36-3.05c1.02-.42 1.51-1.59 1.09-2.6zM7.88 8.75c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-2 11c0 1.1.9 2 2 2h1.45l-3.45-8.34v6.34z" />
    </svg>
  ),
  Banknote: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
    </svg>
  ),
}

export default function HowItWorks() {
  const sectionRef = useViewContent('HowItWorks')
  return (
    <section id="como-funciona-clt" className="how-it-works-clt" ref={sectionRef}>
      <div className="how-it-works-container">
        {/* Header */}
        <div className="how-it-works-header">
          <span className="how-it-works-badge">Processo Simples</span>
          <h2 className="how-it-works-title">
            Como funciona o <span className="how-it-works-title-highlight">Crédito CLT</span>?
          </h2>
          <p className="how-it-works-description">
            Em apenas 4 passos simples, você consegue seu crédito consignado CLT.
            Todo o processo é feito 100% online, sem burocracia.
          </p>
        </div>

        {/* Timeline de Passos */}
        <div className="how-it-works-timeline">
          {/* Linha conectora - Desktop */}
          <div className="how-it-works-line" aria-hidden="true" />

          <div className="how-it-works-grid">
            {steps.map((step, index) => {
              const Icon = iconMap[step.icon]
              
              return (
                <div key={index} className="step-card-wrapper">
                  {/* Card do Passo */}
                  <div className="step-card" data-spotlight>
                    {/* Badge com número - Canto superior direito */}
                    <span className="step-number-badge">{step.number}</span>
                    
                    {/* Ícone do passo */}
                    <div className="step-icon-wrapper">
                      <div className="step-icon-circle">
                        {Icon}
                      </div>
                    </div>

                    {/* Título */}
                    <h3 className="step-title">{step.title}</h3>

                    {/* Descrição */}
                    <p className="step-description">{step.description}</p>
                  </div>

                  {/* Seta para o próximo - Mobile/Tablet */}
                  {index < steps.length - 1 && (
                    <div className="step-arrow" aria-hidden="true">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17 8l4 4m0 0l-4 4m4-4H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
