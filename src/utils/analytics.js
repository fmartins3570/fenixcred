/**
 * Google Analytics Utility
 *
 * Mirrors Meta Pixel events to GA4 recommended event names.
 * GA4 script is loaded in index.html after cookie consent.
 */

// Meta Pixel event name → GA4 recommended event name
const EVENT_MAP = {
  Lead: 'generate_lead',
  Contact: 'contact',
  CompleteRegistration: 'sign_up',
  ViewContent: 'view_item',
  InitiateCheckout: 'begin_checkout',
  Purchase: 'purchase',
}

/**
 * Send an event to GA4 using the equivalent recommended event name.
 * Called automatically from metaPixel.trackEvent — no need to call directly.
 *
 * @param {string} metaEventName - Meta Pixel event name (e.g. 'Lead')
 * @param {object} params - Event parameters (forwarded as-is)
 */
export const trackGA4Event = (metaEventName, params = {}) => {
  if (typeof window === 'undefined' || !window.gtag) return

  const ga4Name = EVENT_MAP[metaEventName] || metaEventName.toLowerCase()

  window.gtag('event', ga4Name, {
    ...params,
    event_source: 'website',
  })
}

/**
 * Send a custom event to GA4 (for events not in the standard mapping).
 *
 * @param {string} eventName - Custom event name
 * @param {object} params - Event parameters
 */
export const trackGA4CustomEvent = (eventName, params = {}) => {
  if (typeof window === 'undefined' || !window.gtag) return

  window.gtag('event', eventName.toLowerCase(), {
    ...params,
    event_source: 'website',
  })
}
