import { WHATSAPP_NUMBER } from '../../utils/credito-clt/constants'
import { trackEvent, generateEventId } from '../../utils/metaPixel'
import { sendServerEvent } from '../../utils/metaCAPI'
import { tagMessage } from '../../utils/utmParams'

/**
 * Hook para integração com WhatsApp
 */
function getSavedLeadPII() {
  try {
    const raw = localStorage.getItem('fenix_lead_data')
    if (!raw) return {}
    const data = JSON.parse(raw)
    return {
      ...(data.name && { name: data.name }),
      ...(data.phone && { phone: data.phone.replace(/\D/g, '') }),
    }
  } catch { return {} }
}

export function useWhatsApp() {
  const phoneNumber = WHATSAPP_NUMBER

  const openWhatsApp = (message = '(clt) Olá, gostaria de simular um crédito CLT', trackingName = 'WhatsApp CLT') => {
    const eventId = generateEventId()
    trackEvent('Contact', { content_name: trackingName, content_category: 'whatsapp' }, eventId)
    sendServerEvent('Contact', eventId, { ...getSavedLeadPII(), page: trackingName }, {
      content_name: trackingName,
      content_category: 'whatsapp',
    })
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
