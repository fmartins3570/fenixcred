/**
 * Cookie Consent - LGPD
 *
 * Gerencia consentimento de cookies de marketing (Meta Pixel + Google Analytics).
 * Armazena preferência no localStorage para persistir entre sessões.
 */

const CONSENT_KEY = 'fenix_cookie_consent'

export function getConsent() {
  return localStorage.getItem(CONSENT_KEY)
}

export function setConsent(accepted) {
  localStorage.setItem(CONSENT_KEY, accepted ? 'accepted' : 'refused')
}

export function hasConsented() {
  return getConsent() === 'accepted'
}

export function hasResponded() {
  return getConsent() !== null
}

export function loadTrackingScripts() {
  if (typeof window === 'undefined') return
  if (window.__loadMetaPixel) window.__loadMetaPixel()
  if (window.__loadGA) window.__loadGA()
}
