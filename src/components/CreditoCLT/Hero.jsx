import { useWhatsApp } from '../../hooks/credito-clt/useWhatsApp'
import { useLeadData } from '../../hooks/credito-clt/useLeadData'
import { PURPOSES } from './LeadPopup'
import './Hero.css'

import modeloImage400w from '../../assets/modelo_fenix_cred-400wp2 copy.webp'
import modeloImage525w from '../../assets/modelo_fenix_cred-525wp2 copy.webp'
import modeloImage1050w from '../../assets/modelo_fenix_cred-1050wp2 copy.webp'
import modeloImage400wp2 from '../../assets/modelo_fenix_cred-400wp2 copy.webp'
import modeloImage525wp2 from '../../assets/modelo_fenix_cred-525wp2 copy.webp'
import modeloImage1050wp2 from '../../assets/modelo_fenix_cred-1050wp2 copy.webp'

const PURPOSE_CONTENT = {
  dividas: {
    badge: 'Proposta personalizada',
    headline: 'vamos te ajudar a se livrar das dívidas',
    subheadline: 'Com parcelas que cabem no seu bolso e desconto direto na folha, você retoma o controle financeiro sem estresse.',
    cta: 'Quero quitar minhas dívidas',
  },
  contas: {
    badge: 'Proposta personalizada',
    headline: 'chega de contas acumulando',
    subheadline: 'Coloque tudo em dia com condições que não pesam no orçamento. Sem burocracia, sem consulta ao SPC.',
    cta: 'Quero colocar as contas em dia',
  },
  veiculo: {
    badge: 'Proposta personalizada',
    headline: 'seu veículo próprio está mais perto do que imagina',
    subheadline: 'Carro ou moto com crédito consignado CLT: taxas muito menores que financiamento de concessionária.',
    cta: 'Quero comprar meu veículo',
  },
  reforma: {
    badge: 'Proposta personalizada',
    headline: 'hora de transformar sua casa',
    subheadline: 'Reforma com planejamento e parcelas fixas. Valorize seu patrimônio com as melhores condições.',
    cta: 'Quero reformar minha casa',
  },
  saude: {
    badge: 'Proposta personalizada',
    headline: 'cuide do que importa sem preocupação',
    subheadline: 'Dinheiro rápido na conta para resolver a urgência. Aprovação em minutos, sem burocracia.',
    cta: 'Preciso resolver uma urgência',
  },
  viagem: {
    badge: 'Proposta personalizada',
    headline: 'sua próxima viagem começa aqui',
    subheadline: 'Realize o plano sem comprometer seu mês. Parcelas leves com desconto em folha.',
    cta: 'Quero planejar minha viagem',
  },
  negocio: {
    badge: 'Proposta personalizada',
    headline: 'invista no seu crescimento',
    subheadline: 'Capital para seu negócio com as melhores taxas do mercado. Sem comprometer o fluxo de caixa.',
    cta: 'Quero investir no meu negócio',
  },
  outro: {
    badge: 'Proposta personalizada',
    headline: 'temos a solução ideal pra você',
    subheadline: 'Crédito consignado CLT com condições personalizadas para o que você precisar.',
    cta: 'Quero simular meu crédito CLT',
  },
}

/**
 * Hero Section - Above the Fold
 * Landing page de crédito consignado CLT
 *
 * @param {boolean} personalized - Se true, exibe conteúdo personalizado quando lead capturado
 */
export default function Hero({ personalized = false }) {
  const { openWhatsAppForSimulation } = useWhatsApp()
  const { leadData, firstName, isCaptured } = useLeadData()

  const showPersonalized = personalized && isCaptured
  const primaryPurpose = leadData?.purposes?.[0] || 'outro'
  const content = PURPOSE_CONTENT[primaryPurpose] || PURPOSE_CONTENT.outro
  const otherPurposes = (leadData?.purposes || []).slice(1)

  const handlePersonalizedWhatsApp = () => {
    const selectedLabels = PURPOSES
      .filter((p) => (leadData?.purposes || []).includes(p.id))
      .map((p) => p.label)

    const purposeText = selectedLabels.length
      ? `\nMotivo(s): ${selectedLabels.join(', ')}`
      : ''

    const message = encodeURIComponent(
      `Olá! Meu nome é ${leadData.name}.${purposeText}\nGostaria de simular um crédito consignado CLT.`
    )

    window.open(
      `https://wa.me/5511917082143?text=${message}`,
      '_blank',
      'noopener,noreferrer'
    )
  }

  return (
    <section id="hero-clt" className="hero-clt">
      <div className="hero-clt-bg" aria-hidden="true" />
      <div className="hero-clt-decoration-1" aria-hidden="true" />
      <div className="hero-clt-decoration-2" aria-hidden="true" />

      <div className="hero-clt-container">
        <div className="hero-clt-grid">
          {/* Coluna Esquerda - Texto */}
          <div className="hero-clt-content">
            {showPersonalized ? (
              <>
                <span className="hero-clt-badge hero-clt-badge--personalized">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  {content.badge}
                </span>

                <h1 className="hero-clt-title">
                  <span className="hero-clt-title-highlight">{firstName}</span>, {content.headline}
                </h1>

                <p className="hero-clt-subheadline">
                  {content.subheadline}
                </p>

                {otherPurposes.length > 0 && (
                  <div className="hero-clt-extra-purposes">
                    {otherPurposes.map((pId) => {
                      const p = PURPOSES.find((x) => x.id === pId)
                      if (!p) return null
                      return (
                        <span key={pId} className="hero-clt-extra-tag">
                          <span>{p.icon}</span> {p.label}
                        </span>
                      )
                    })}
                  </div>
                )}

                <div className="hero-clt-cta">
                  <button
                    className="btn-whatsapp-hero"
                    onClick={handlePersonalizedWhatsApp}
                    aria-label={content.cta}
                  >
                    <svg
                      className="whatsapp-icon"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                    {content.cta}
                  </button>
                </div>

                <div className="hero-clt-trust">
                  <TrustBadge icon="shield" text="Sem consulta SPC/Serasa" />
                  <TrustBadge icon="clock" text="Aprovação em minutos" />
                  <TrustBadge icon="check" text="100% Online" />
                </div>
              </>
            ) : (
              <>
                <span className="hero-clt-badge">
                  ⭐ Correspondente bancário desde 2018
                </span>

                <h1 className="hero-clt-title">
                  Crédito Consignado CLT com Aprovação em{' '}
                  <span className="hero-clt-title-highlight">minutos</span>
                </h1>

                <p className="hero-clt-subheadline">
                  Taxas justas, desconto em folha e dinheiro na conta.{' '}
                  <strong>Sem consulta ao SPC/Serasa.</strong>{' '}
                  Atendemos trabalhadores CLT de todo Brasil!
                </p>

                <div className="hero-clt-cta">
                  <button
                    className="btn-whatsapp-hero"
                    onClick={openWhatsAppForSimulation}
                    aria-label="Simular meu crédito CLT agora no WhatsApp"
                  >
                    <svg
                      className="whatsapp-icon"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                    Simular Meu Crédito CLT Agora
                  </button>
                </div>

                <div className="hero-clt-trust">
                  <TrustBadge icon="clock" text="Aprovação em minutos" />
                  <TrustBadge icon="check" text="100% Online" />
                  <TrustBadge icon="shield" text="Sem burocracia" />
                </div>
              </>
            )}
          </div>

          {/* Coluna Direita - Imagem da Modelo */}
          <div className="hero-clt-image-wrapper">
            <div className="hero-clt-circle" data-spotlight-frame aria-hidden="true" />
            <picture>
              <source
                srcSet={`${modeloImage400w} 1x, ${modeloImage400wp2} 2x`}
                media="(max-width: 640px)"
                type="image/webp"
              />
              <source
                srcSet={`${modeloImage525w} 1x, ${modeloImage525wp2} 2x`}
                media="(min-width: 641px) and (max-width: 1024px)"
                type="image/webp"
              />
              <source
                srcSet={`${modeloImage525w} 1x, ${modeloImage525wp2} 2x`}
                media="(min-width: 1025px)"
                type="image/webp"
              />
              <img
                src={modeloImage525w}
                srcSet={`${modeloImage400w} 400w, ${modeloImage400wp2} 800w, ${modeloImage525w} 525w, ${modeloImage525wp2} 1050w, ${modeloImage1050w} 1050w, ${modeloImage1050wp2} 2100w`}
                sizes="(max-width: 640px) 400px, (max-width: 1024px) 525px, 525px"
                alt="Fênix Cred – correspondente bancário de crédito consignado CLT"
                className="hero-clt-model-image"
                loading="eager"
                fetchPriority="high"
                decoding="async"
                width="525"
                height="783"
              />
            </picture>
          </div>
        </div>
      </div>
    </section>
  )
}

function TrustBadge({ icon, text }) {
  const iconMap = {
    clock: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
      </svg>
    ),
    check: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
      </svg>
    ),
    shield: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
      </svg>
    ),
  }

  return (
    <div className="trust-badge">
      <span className="trust-badge-icon">{iconMap[icon]}</span>
      <span className="trust-badge-text">{text}</span>
    </div>
  )
}
