/**
 * Meta Conversions API (CAPI) - FenixCred
 *
 * Envia eventos server-side via Google Apps Script para deduplicação
 * com o Meta Pixel browser-side.
 */

import { getMetaCookies } from './metaPixel'
import { hasConsented } from './cookieConsent'

const APPS_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbwCTd-uGRPNFW7fXDq73huWHkOGW_11-3qyyum8YxH6xl8VzWju1tZCso6hDleFKZvf/exec'

// Cache do IP — captura uma vez e reutiliza
let cachedIP = ''
function getClientIP() {
  if (cachedIP) return Promise.resolve(cachedIP)
  return fetch('https://api.ipify.org?format=text')
    .then((r) => r.text())
    .then((ip) => { cachedIP = ip; return ip })
    .catch(() => '')
}

// External ID — identificação única do visitante persistida no localStorage
function getExternalId() {
  const key = 'fenix_external_id'
  let id = localStorage.getItem(key)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(key, id)
  }
  return id
}

/**
 * Envia evento para o Google Apps Script que:
 * 1. Salva na planilha Google Sheets
 * 2. Encaminha para a Conversions API do Meta (com hashing SHA-256 server-side)
 *
 * @param {string} eventName - Nome do evento (Lead, CompleteRegistration, Contact)
 * @param {string} eventId - UUID compartilhado com o pixel browser para deduplicação
 * @param {Object} userData - Dados do usuário { name, phone, purposes }
 * @param {Object} customData - Dados customizados { value, currency }
 */
export function sendServerEvent(eventName, eventId, userData = {}, customData = {}) {

  const { fbc, fbp } = getMetaCookies()

  getClientIP().then((ip) => {
    const params = new URLSearchParams({
      event_name: eventName,
      event_id: eventId,
      event_source_url: window.location.href,
      fbc,
      fbp,
      client_user_agent: navigator.userAgent,
      external_id: getExternalId(),
      ...(ip && { client_ip_address: ip }),
      ...(userData.name && { name: userData.name }),
      ...(userData.phone && { phone: userData.phone }),
      ...(userData.city && { city: userData.city }),
      ...(userData.purposes && { purposes: userData.purposes }),
      ...(userData.page && { page: userData.page }),
      ...(customData.value != null && { value: String(customData.value) }),
      ...(customData.currency && { currency: customData.currency }),
    })

    const url = `${APPS_SCRIPT_URL}?${params}`

    if (navigator.sendBeacon) {
      navigator.sendBeacon(url)
    } else {
      new Image().src = url
    }
  })
}
