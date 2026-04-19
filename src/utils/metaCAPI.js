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

// External ID — identificação única do visitante persistida no localStorage
export function getExternalId() {
  const key = 'fenix_external_id'
  let id = localStorage.getItem(key)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(key, id)
  }
  return id
}

/**
 * Envia evento para o CAPI Server que:
 * 1. Valida e enriquece os dados (IP real, hashing SHA-256)
 * 2. Encaminha para a Conversions API do Meta (graph.facebook.com/v22.0)
 *
 * @param {string} eventName - Nome do evento (Lead, CompleteRegistration, Contact)
 * @param {string} eventId - UUID compartilhado com o pixel browser para deduplicação
 * @param {Object} userData - Dados do usuário { name, phone, city, state, purposes, page }
 * @param {Object} customData - Dados customizados { value, currency }
 */
export function sendServerEvent(eventName, eventId, userData = {}, customData = {}) {
  const { fbc, fbp } = getMetaCookies()

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
      country: 'br',
      ...(userData.name && { name: userData.name }),
      ...(userData.phone && { phone: userData.phone }),
      ...(userData.city && { city: userData.city }),
      ...(userData.state && { state: userData.state }),
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
  }).catch(() => {})
}
