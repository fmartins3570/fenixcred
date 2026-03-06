import { WHATSAPP_NUMBER } from '../../utils/credito-clt/constants'

/**
 * Hook para integração com WhatsApp
 */
export function useWhatsApp() {
  const phoneNumber = WHATSAPP_NUMBER

  const openWhatsApp = (message = 'Olá, gostaria de simular um crédito CLT') => {
    const encodedMessage = encodeURIComponent(message)
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
