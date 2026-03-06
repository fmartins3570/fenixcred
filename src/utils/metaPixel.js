/**
 * Meta Pixel Utility - FenixCred
 *
 * Helper centralizado para disparar eventos do Meta Pixel (fbq).
 * O pixel já está carregado no index.html (ID: 2877752735949899).
 */

/**
 * Dispara um evento padrão do Meta Pixel (ex: Contact, Lead, ViewContent)
 */
export const trackEvent = (eventName, params = {}) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, params)
  }
}

/**
 * Dispara um evento customizado do Meta Pixel (ex: FAQ_Open, SocialClick)
 */
export const trackCustomEvent = (eventName, params = {}) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('trackCustom', eventName, params)
  }
}
