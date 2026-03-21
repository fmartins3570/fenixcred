import { useState } from 'react'
import { setConsent, hasResponded, loadTrackingScripts } from '../utils/cookieConsent'
import './CookieBanner.css'

export default function CookieBanner() {
  const [visible, setVisible] = useState(!hasResponded())

  if (!visible) return null

  const handleAccept = () => {
    setConsent(true)
    loadTrackingScripts()
    setVisible(false)
  }

  const handleReject = () => {
    setConsent(false)
    loadTrackingScripts()
    setVisible(false)
  }

  return (
    <>
      <div className="cookie-overlay" aria-hidden="true" />
      <div className="cookie-modal" role="dialog" aria-label="Consentimento de cookies" aria-modal="true">
        <div className="cookie-modal-icon" aria-hidden="true">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
        </div>
        <h3 className="cookie-modal-title">Sua privacidade importa</h3>
        <p className="cookie-modal-text">
          Utilizamos cookies para personalizar sua experiência e mensurar o
          desempenho das nossas campanhas. Ao continuar, você concorda com
          nossa{' '}
          <a href="/politica-privacidade">Política de Privacidade</a>.
        </p>
        <div className="cookie-modal-actions">
          <button className="cookie-btn cookie-btn-accept" onClick={handleAccept}>
            Aceitar e continuar
          </button>
          <button className="cookie-btn cookie-btn-reject" onClick={handleReject}>
            Apenas essenciais
          </button>
        </div>
      </div>
    </>
  )
}
