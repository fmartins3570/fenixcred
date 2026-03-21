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
      <div className="cookie-banner" role="dialog" aria-label="Consentimento de cookies">
        <div className="cookie-banner-content">
          <p className="cookie-banner-text">
            Utilizamos cookies para melhorar sua experiência e mensurar campanhas.
            Saiba mais na nossa{' '}
            <a href="/politica-privacidade">Política de Privacidade</a>.
          </p>
          <div className="cookie-banner-actions">
            <button className="cookie-btn cookie-btn-accept" onClick={handleAccept}>
              Aceitar todos
            </button>
            <button className="cookie-btn cookie-btn-reject" onClick={handleReject}>
              Apenas essenciais
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
