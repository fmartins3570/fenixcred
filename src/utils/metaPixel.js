/**
 * Meta Pixel Utility - FenixCred
 *
 * Helper centralizado para disparar eventos do Meta Pixel (fbq).
 * O pixel já está carregado no index.html (ID: 2877752735949899).
 *
 * Every standard event also fires the GA4 equivalent via trackGA4Event.
 */

import { trackGA4Event, trackGA4CustomEvent } from './analytics'

export const generateEventId = () => crypto.randomUUID()

export const getMetaCookies = () => {
  const cookies = document.cookie.split('; ')
  const get = (name) => {
    const c = cookies.find((c) => c.startsWith(name + '='))
    return c ? decodeURIComponent(c.split('=')[1]) : ''
  }

  let fbc = get('_fbc')
  const fbp = get('_fbp')

  // Se não tem _fbc cookie mas tem fbclid na URL, gera o fbc manualmente
  // Formato: fb.1.{timestamp}.{fbclid}
  if (!fbc) {
    const params = new URLSearchParams(window.location.search)
    const fbclid = params.get('fbclid')
    if (fbclid) {
      fbc = `fb.1.${Date.now()}.${fbclid}`
      document.cookie = `_fbc=${fbc}; max-age=${90 * 24 * 60 * 60}; path=/; SameSite=Lax`
    }
  }

  return { fbc, fbp }
}

/**
 * Dispara um evento padrão do Meta Pixel (ex: Contact, Lead, ViewContent)
 * Also fires the GA4 equivalent (e.g. Lead → generate_lead)
 */
export const trackEvent = (eventName, params = {}, eventId) => {
  if (typeof window !== 'undefined' && window.fbq) {
    const options = eventId ? { eventID: eventId } : {}
    window.fbq('track', eventName, params, options)
  }
  trackGA4Event(eventName, params)
}

/**
 * Dispara um evento customizado do Meta Pixel (ex: FAQ_Open, SocialClick)
 * Also fires the same event name to GA4
 */
export const trackCustomEvent = (eventName, params = {}, eventId) => {
  if (typeof window !== 'undefined' && window.fbq) {
    const options = eventId ? { eventID: eventId } : {}
    window.fbq('trackCustom', eventName, params, options)
  }
  trackGA4CustomEvent(eventName, params)
}
