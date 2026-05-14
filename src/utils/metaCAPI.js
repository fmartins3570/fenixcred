/**
 * Meta Conversions API (CAPI) - FenixCred
 *
 * Envia eventos server-side via CAPI Server (VPS) para deduplicação
 * com o Meta Pixel browser-side. O servidor faz SHA-256 hashing,
 * captura IP real via X-Forwarded-For e retry com backoff.
 */

import { getMetaCookies } from './metaPixel'

const CAPI_URL = 'https://painel.martinsfelipe.com/api/capi/meta'
const CLIENT_ID = 'fenixcred'

export function getExternalId() {
  const key = 'fenix_external_id'
  let id = localStorage.getItem(key)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(key, id)
  }
  return id
}

function splitName(fullName) {
  if (!fullName) return {}
  const parts = fullName.trim().split(/\s+/)
  const result = { fn: parts[0].toLowerCase() }
  if (parts.length > 1) result.ln = parts.slice(1).join(' ').toLowerCase()
  return result
}

function normalizePhone(raw) {
  if (!raw) return undefined
  const digits = raw.replace(/\D/g, '')
  if (digits.length === 10 || digits.length === 11) return '55' + digits
  if (digits.length === 12 || digits.length === 13) return digits
  return undefined
}

// Merge PII from all capture flows (Quiz, LeadPopup, EmailCapture)
function enrichUserData(callerData = {}) {
  const stored = JSON.parse(localStorage.getItem('fenix_lead_data') || '{}')
  const storedEmail = localStorage.getItem('email')

  const email = callerData.email || stored.email || storedEmail
  const phone = callerData.phone || stored.phone || stored.whatsappNumber
  const name = callerData.name || stored.name || localStorage.getItem('name')
  const { fn, ln } = splitName(name)

  return {
    ...(email && { em: email.toLowerCase().trim() }),
    ...(normalizePhone(phone) && { ph: normalizePhone(phone) }),
    ...(fn && { fn }),
    ...(ln && { ln }),
    ...(callerData.city && { ct: callerData.city.toLowerCase().trim() }),
    ...(callerData.state && { st: callerData.state.toLowerCase().trim() }),
    country: 'br',
  }
}

export function sendServerEvent(eventName, eventId, userData = {}, customData = {}) {
  const { fbc, fbp } = getMetaCookies()
  const enriched = enrichUserData(userData)

  const payload = {
    client_id: CLIENT_ID,
    event_name: eventName,
    event_id: eventId,
    event_source_url: window.location.href,
    user_data: {
      fbc,
      fbp,
      external_id: getExternalId(),
      client_user_agent: navigator.userAgent,
      ...enriched,
    },
    custom_data: {
      ...(userData.purposes && { purposes: userData.purposes }),
      ...(userData.page && { page: userData.page }),
      ...customData,
    },
  }

  fetch(CAPI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    keepalive: true,
  }).catch((err) => {
    if (typeof console !== 'undefined' && console.warn) {
      console.warn('[CAPI]', eventName, err.message || err)
    }
  })
}
