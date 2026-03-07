import { useState } from 'react'
import { useWhatsApp } from '../../hooks/credito-clt/useWhatsApp'
import { maskPhone, maskCurrency } from '../../utils/credito-clt/formValidation'
import { trackEvent, generateEventId } from '../../utils/metaPixel'
import { sendServerEvent } from '../../utils/metaCAPI'
import './FinalCTA.css'

export default function FinalCTA() {
  const { openWhatsAppWithFormData } = useWhatsApp()
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    amount: '',
    city: '',
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    let newValue = value

    // Aplicar máscaras
    if (name === 'phone') {
      newValue = maskPhone(value)
    } else if (name === 'amount') {
      newValue = maskCurrency(value)
    }

    setFormData(prev => ({ ...prev, [name]: newValue }))
    // Limpar erro do campo
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validate = () => {
    const newErrors = {}

    if (formData.name.length < 3) {
      newErrors.name = 'Nome deve ter ao menos 3 caracteres'
    }

    const phoneNumbers = formData.phone.replace(/\D/g, '')
    if (phoneNumbers.length < 10 || phoneNumbers.length > 11) {
      newErrors.phone = 'Telefone inválido'
    }

    const amountNumbers = formData.amount.replace(/\D/g, '')
    if (!amountNumbers || parseInt(amountNumbers, 10) === 0) {
      newErrors.amount = 'Informe o valor desejado'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validate()) {
      return
    }

    setIsSubmitting(true)
    const numericValue = parseInt(formData.amount.replace(/\D/g, ''), 10) / 100 || 0
    const eventId = generateEventId()
    trackEvent('Lead', { content_name: 'FinalCTA Form', value: numericValue, currency: 'BRL' }, eventId)
    sendServerEvent('Lead', eventId, {
      name: formData.name.trim(),
      phone: formData.phone.replace(/\D/g, ''),
      city: formData.city.trim(),
      page: window.location.pathname,
    }, { value: numericValue, currency: 'BRL' })
    openWhatsAppWithFormData(
      formData.name,
      formData.phone,
      formData.amount,
      formData.city
    )
    
    // Reset após um delay
    setTimeout(() => {
      setIsSubmitting(false)
      setFormData({ name: '', phone: '', amount: '', city: '' })
    }, 1000)
  }

  return (
    <section id="final-cta-clt" className="final-cta-clt">
      {/* Decorative elements */}
      <div className="final-cta-decoration-1" aria-hidden="true" />
      <div className="final-cta-decoration-2" aria-hidden="true" />

      <div className="final-cta-container">
        <div className="final-cta-content">
          {/* Header */}
          <div className="final-cta-header">
            <h2 className="final-cta-title">
              Conquiste Seu Crédito{' '}
              <span className="final-cta-title-highlight">Hoje Mesmo</span>
            </h2>
            <p className="final-cta-description">
              Atendimento ágil, taxas justas e resposta em minutos.
              Preencha o formulário ou fale diretamente no WhatsApp!
            </p>
          </div>

          <div className="final-cta-grid">
            {/* Formulário */}
            <div className="final-cta-form-wrapper">
              <div className="final-cta-form-card">
                <h3 className="final-cta-form-title">Simule seu crédito agora</h3>
                
                <form onSubmit={handleSubmit} className="final-cta-form">
                  <div className="form-group">
                    <label htmlFor="name" className="form-label">
                      Seu nome completo <span className="required">*</span>
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      className={`form-input ${errors.name ? 'error' : ''}`}
                      placeholder="Digite seu nome"
                      required
                    />
                    {errors.name && (
                      <span className="form-error">{errors.name}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone" className="form-label">
                      Telefone com WhatsApp <span className="required">*</span>
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`form-input ${errors.phone ? 'error' : ''}`}
                      placeholder="(11) 99999-9999"
                      required
                    />
                    {errors.phone && (
                      <span className="form-error">{errors.phone}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="amount" className="form-label">
                      Valor desejado <span className="required">*</span>
                    </label>
                    <input
                      id="amount"
                      name="amount"
                      type="text"
                      value={formData.amount}
                      onChange={handleChange}
                      className={`form-input ${errors.amount ? 'error' : ''}`}
                      placeholder="R$ 10.000,00"
                      required
                    />
                    {errors.amount && (
                      <span className="form-error">{errors.amount}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="city" className="form-label">
                      Cidade (opcional)
                    </label>
                    <input
                      id="city"
                      name="city"
                      type="text"
                      value={formData.city}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="São Paulo"
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn-submit-form"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner" aria-hidden="true" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                        </svg>
                        Enviar para WhatsApp
                      </>
                    )}
                  </button>

                  <p className="form-disclaimer">
                    Ao enviar, você concorda com nossa{' '}
                    <a href="#politica-privacidade" className="form-link">
                      Política de Privacidade
                    </a>
                  </p>
                </form>
              </div>
            </div>

            {/* Alternativa WhatsApp */}
            <div className="final-cta-whatsapp">
              <p className="final-cta-whatsapp-text">
                Prefere falar diretamente com um consultor?
              </p>

              <button
                className="btn-whatsapp-large"
                onClick={() => openWhatsAppWithFormData('', '', '', '')}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                Falar no WhatsApp
              </button>

              {/* Informações de contato */}
              <div className="final-cta-contact-info">
                <div className="contact-info-item">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                  </svg>
                  <span>(11) 91708-2143</span>
                </div>
                <div className="contact-info-item">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                  </svg>
                  <span>Segunda a Sexta, 9h às 18h</span>
                </div>
              </div>

              {/* Trust elements */}
              <div className="final-cta-trust">
                <p className="final-cta-trust-text">
                  Atendemos trabalhadores CLT de todo Brasil
                </p>
                <div className="final-cta-rating">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      className="rating-star"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                  <span className="rating-text">4.8/5 no Google</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
