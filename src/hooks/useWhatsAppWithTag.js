import { SHARED } from '../utils/consignado-lp/angles'
import { trackEvent, generateEventId } from '../utils/metaPixel'
import { sendServerEvent } from '../utils/metaCAPI'
import { tagMessage } from '../utils/utmParams'

/**
 * Hook for opening WhatsApp with a tracking tag prefix.
 * Tags allow n8n to identify lead source in CAPI events.
 *
 * @param {string} tag - Tracking tag (e.g. 'neg', 'vel', 'ger')
 * @returns {{ openWhatsApp: Function, openWhatsAppWithSimulator: Function }}
 */
export function useWhatsAppWithTag(tag) {
  const phoneNumber = SHARED.whatsappNumber

  /**
   * Open WhatsApp with tagged message
   * @param {string} message - Message text (tag is prepended automatically)
   * @param {string} trackingName - Name for Meta Pixel event
   */
  const openWhatsApp = (
    message = 'Olá! Gostaria de simular um consignado CLT.',
    trackingName = `WhatsApp ${tag}`
  ) => {
    const taggedMessage = tagMessage(`(${tag})${message}`)
    const eventId = generateEventId()

    trackEvent('Contact', {
      content_name: trackingName,
      content_category: 'whatsapp',
    }, eventId)

    sendServerEvent('Contact', eventId, {
      page: window.location.pathname,
    })

    const encoded = encodeURIComponent(taggedMessage)
    window.open(
      `https://wa.me/${phoneNumber}?text=${encoded}`,
      '_blank',
      'noopener,noreferrer'
    )
  }

  /**
   * Open WhatsApp with simulator data included in the message
   * @param {number} value - Loan amount
   * @param {number} term - Term in months
   * @param {number} installment - Estimated monthly installment
   */
  const openWhatsAppWithSimulator = (value, term, installment) => {
    const formattedValue = value.toLocaleString('pt-BR')
    const formattedInstallment = installment.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })

    const message = `Olá! Gostaria de simular um consignado CLT.\nValor: R$ ${formattedValue} | Prazo: ${term}x | Parcela estimada: R$ ${formattedInstallment}`

    const eventId = generateEventId()

    trackEvent('Contact', {
      content_name: `WhatsApp Simulador ${tag}`,
      content_category: 'whatsapp',
      value: value,
      currency: 'BRL',
    }, eventId)

    sendServerEvent('Contact', eventId, {
      page: window.location.pathname,
    }, {
      value: value,
      currency: 'BRL',
    })

    const taggedMessage = tagMessage(`(${tag})${message}`)
    const encoded = encodeURIComponent(taggedMessage)
    window.open(
      `https://wa.me/${phoneNumber}?text=${encoded}`,
      '_blank',
      'noopener,noreferrer'
    )
  }

  return {
    openWhatsApp,
    openWhatsAppWithSimulator,
    phoneNumber,
  }
}

export default useWhatsAppWithTag
