/**
 * Meta Conversions API (CAPI) - FenixCred
 *
 * Envia eventos server-side via Google Apps Script para deduplicação
 * com o Meta Pixel browser-side.
 */

import { getMetaCookies } from './metaPixel'

const APPS_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbyuYC4ZdGBohpfJM1Zr0JFHA3WTg-_95Z4sC9EQ9JOEEzYdcRnfNMLfASBoOr3rq-Cl/exec'

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
      country: 'br',
      ...(ip && { client_ip_address: ip }),
      ...(userData.name && { name: userData.name }),
      ...(userData.phone && { phone: userData.phone }),
      ...(userData.city && { city: userData.city }),
      ...(userData.state && { state: userData.state }),
      ...(userData.purposes && { purposes: userData.purposes }),
      ...(userData.page && { page: userData.page }),
      ...(customData.value != null && { value: String(customData.value) }),
      ...(customData.currency && { currency: customData.currency }),
    })

    const url = `${APPS_SCRIPT_URL}?${params}`

    // Use GET (not sendBeacon which sends POST) so Apps Script doGet() handles it.
    // keepalive ensures the request survives page navigation (like sendBeacon).
    if (typeof fetch !== 'undefined') {
      fetch(url, { method: 'GET', mode: 'no-cors', keepalive: true }).catch(() => {})
    } else {
      new Image().src = url
    }
  })
}
