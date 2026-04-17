import { useEffect } from 'react'
import Simulator from './Simulator'
import PreQualForm from '../shared/PreQualForm'
import { useWhatsAppWithTag } from '../../hooks/useWhatsAppWithTag'
import { SHARED } from '../../utils/consignado-lp/angles'
import { trackEvent } from '../../utils/metaPixel'
import './Hero.css'

const ICON_MAP = {
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

export default function Hero({ angleData, tag }) {
  const { openWhatsAppWithSimulator, openWhatsAppWithFgts } = useWhatsAppWithTag(tag)
  const { hero, trustBadges, mode } = angleData
  const isFgts = mode === 'antecipado'

  useEffect(() => {
    trackEvent('ViewContent', {
      content_name: isFgts ? `LP FGTS ${tag}` : `LP ${tag}`,
      content_category: isFgts ? 'antecipacao-fgts' : 'consignado-clt',
    })
  }, [tag, isFgts])

  const handleSimulate = (value, term, result) => {
    if (isFgts) {
      // In 'antecipado' mode, `result` is the net amount (see Simulator)
      openWhatsAppWithFgts(value, result)
    } else {
      openWhatsAppWithSimulator(value, term, result)
    }
  }

  return (
    <section id="hero-consignado" className="hero-consignado">
      <div className="hero-consignado-bg" aria-hidden="true" />
      <div className="hero-consignado-decoration-1" aria-hidden="true" />
      <div className="hero-consignado-decoration-2" aria-hidden="true" />

      <div className="hero-consignado-container">
        <div className="hero-consignado-grid">
          <div className="hero-consignado-content">
            <span className="hero-consignado-badge">{hero.badge}</span>
            <h1 className="hero-consignado-title">{hero.headline}</h1>
            <p className="hero-consignado-subheadline">{hero.subheadline}</p>

            <div className="hero-consignado-rates">
              {isFgts ? (
                <>
                  <p>Antecipação via <strong>saque-aniversário</strong> | Taxas a partir de <strong>1,29% a.m.</strong></p>
                  <p className="hero-consignado-rates-disclaimer">
                    Necessário adesão ao saque-aniversário. Valor liberado por banco parceiro autorizado pela Caixa.
                  </p>
                </>
              ) : (
                <>
                  <p>Taxas a partir de <strong>1,49% a.m.</strong> | CET a partir de <strong>29,90% a.a.</strong></p>
                  <p className="hero-consignado-rates-disclaimer">
                    Condições sujeitas a análise de crédito. A Fenix Cred atua como correspondente bancário.
                  </p>
                </>
              )}
            </div>

            <div className="hero-consignado-trust">
              {trustBadges.map((badge, i) => (
                <div key={i} className="trust-badge-lp">
                  <span className="trust-badge-lp-icon">{ICON_MAP[badge.icon]}</span>
                  <span className="trust-badge-lp-text">{badge.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-consignado-simulator">
            {/* Pre-qualification form is CLT-specific (margem consignável) — skip for FGTS */}
            {!isFgts && (
              <PreQualForm
                sourceTag={tag}
                whatsAppNumber={SHARED.whatsappNumber}
                variant="light"
                title="Veja em 20s se você se qualifica"
              />
            )}
            <Simulator tag={tag} onSimulate={handleSimulate} mode={isFgts ? 'antecipado' : 'parcelado'} />
          </div>
        </div>
      </div>
    </section>
  )
}
