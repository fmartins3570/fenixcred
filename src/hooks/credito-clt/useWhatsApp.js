import { WHATSAPP_NUMBER } from '../../utils/credito-clt/constants'
import { trackEvent, generateEventId } from '../../utils/metaPixel'
import { sendServerEvent } from '../../utils/metaCAPI'
import { tagMessage } from '../../utils/utmParams'

/**
 * Hook para integração com WhatsApp
 */
export function useWhatsApp() {
  const phoneNumber = WHATSAPP_NUMBER

  const openWhatsApp = (message = '(clt) Olá, gostaria de simular um crédito CLT', trackingName = 'WhatsApp CLT') => {
    const eventId = generateEventId()
    trackEvent('Contact', { content_name: trackingName, content_category: 'whatsapp' }, eventId)
    sendServerEvent('Contact', eventId, { page: trackingName })
    const encodedMessage = encodeURIComponent(tagMessage(message))
    const url = `https://wa.me/${phoneNumber}?text=${encodedMessage}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const openWhatsAppWithFormData = (name, phone, amount, city) => {
    let message = `Olá! Meu nome é ${name}`
    
    if (city) {
      message += `, sou de ${city}`
    }
    
    message += `. Meu telefone é ${phone}. Gostaria de simular um crédito consignado CLT no valor de ${amount}.`
    
    openWhatsApp(message)
  }

  const openWhatsAppForSimulation = () => {
    const message = 'Olá! Gostaria de simular um crédito consignado CLT. Sou trabalhador CLT.'
    openWhatsApp(message)
  }

  return {
    openWhatsApp,
    openWhatsAppWithFormData,
    openWhatsAppForSimulation,
    phoneNumber,
  }
}

export default useWhatsApp
