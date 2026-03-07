import { useState, useEffect, useCallback } from 'react'
import { useLeadData } from '../../hooks/credito-clt/useLeadData'
import { trackEvent, trackCustomEvent, generateEventId } from '../../utils/metaPixel'
import { sendServerEvent } from '../../utils/metaCAPI'
import './LeadPopup.css'

export const PURPOSES = [
  { id: 'organizar', icon: '📊', label: 'Organizar as finanças' },
  { id: 'veiculo', icon: '🚗', label: 'Comprar veículo' },
  { id: 'reforma', icon: '🏠', label: 'Reforma da casa' },
  { id: 'viagem', icon: '✈️', label: 'Fazer uma viagem' },
  { id: 'negocio', icon: '💼', label: 'Investir no negócio' },
  { id: 'educacao', icon: '📚', label: 'Educação e cursos' },
  { id: 'projeto', icon: '🎯', label: 'Realizar um projeto' },
  { id: 'outro', icon: '📌', label: 'Outro motivo' },
]

const SESSION_KEY = 'fenix_lead_popup_shown'

function formatPhone(value) {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 2) return digits.length ? `(${digits}` : ''
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

export default function LeadPopup() {
  const { isCaptured, saveLead } = useLeadData()
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(1)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [purposes, setPurposes] = useState([])
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (isCaptured || sessionStorage.getItem(SESSION_KEY)) return
    const timer = setTimeout(() => {
      setOpen(true)
      trackCustomEvent('LeadPopupView', {})
    }, 500)
    return () => clearTimeout(timer)
  }, [isCaptured])

  const dismissPopup = useCallback(() => {
    trackCustomEvent('LeadPopupDismissed', { step })
    setOpen(false)
  }, [step])

  useEffect(() => {
    if (!open) return
    const handleEsc = (e) => {
      if (e.key === 'Escape') dismissPopup()
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [open, dismissPopup])

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  const validateStep1 = useCallback(() => {
    const newErrors = {}
    const trimmedName = name.trim()
    if (!trimmedName || trimmedName.length < 3) {
      newErrors.name = 'Informe seu nome completo'
    }
    const digits = phone.replace(/\D/g, '')
    if (digits.length < 10 || digits.length > 11) {
      newErrors.phone = 'Informe um WhatsApp válido'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [name, phone])

  const handleStep1Submit = (e) => {
    e.preventDefault()
    if (!validateStep1()) return
    const eventId = generateEventId()
    trackEvent('Lead', { content_name: 'LeadPopup Step1', value: 0, currency: 'BRL' }, eventId)
    sendServerEvent('Lead', eventId, {
      name: name.trim(),
      phone: phone.replace(/\D/g, ''),
      page: window.location.pathname,
    }, { value: 0, currency: 'BRL' })
    setStep(2)
  }

  const togglePurpose = (id) => {
    setPurposes((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    )
  }

  const finishCapture = (selectedPurposes) => {
    const eventId = generateEventId()
    trackEvent('CompleteRegistration', { content_name: 'LeadPopup Complete', status: true }, eventId)
    const leadData = {
      name: name.trim(),
      phone: phone.replace(/\D/g, ''),
      purposes: selectedPurposes,
      capturedAt: new Date().toISOString(),
    }
    saveLead(leadData)
    sessionStorage.setItem(SESSION_KEY, '1')
    setOpen(false)

    sendServerEvent('CompleteRegistration', eventId, {
      name: leadData.name,
      phone: leadData.phone,
      purposes: selectedPurposes.join(', '),
      page: window.location.pathname,
    }, { value: 0, currency: 'BRL' })
  }

  if (!open) return null

  return (
    <div className="lead-overlay" role="dialog" aria-modal="true" aria-label="Simule seu crédito CLT">
      <div className="lead-overlay-bg" onClick={dismissPopup} />

      <div className="lead-modal">
        <button className="lead-close" onClick={dismissPopup} aria-label="Fechar">
          ✕
        </button>

        <div className="lead-steps" aria-hidden="true">
          <div className={`lead-step-dot ${step === 1 ? 'active' : 'done'}`} />
          <div className={`lead-step-dot ${step === 2 ? 'active' : ''}`} />
        </div>

        {step === 1 && (
          <div className="lead-body">
            <div className="lead-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>

            <h2 className="lead-title">Simule seu crédito CLT agora</h2>
            <p className="lead-subtitle">Preencha seus dados para receber uma proposta personalizada</p>

            <form className="lead-form" onSubmit={handleStep1Submit} noValidate>
              <div className="lead-field">
                <label className="lead-label" htmlFor="lead-name">Nome completo</label>
                <input
                  id="lead-name"
                  className={`lead-input ${errors.name ? 'error' : ''}`}
                  type="text"
                  placeholder="Seu nome completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoFocus
                  autoComplete="name"
                />
                {errors.name && <span className="lead-error">{errors.name}</span>}
              </div>

              <div className="lead-field">
                <label className="lead-label" htmlFor="lead-phone">WhatsApp</label>
                <input
                  id="lead-phone"
                  className={`lead-input ${errors.phone ? 'error' : ''}`}
                  type="tel"
                  placeholder="(11) 99999-9999"
                  value={phone}
                  onChange={(e) => setPhone(formatPhone(e.target.value))}
                  autoComplete="tel"
                  inputMode="numeric"
                />
                {errors.phone && <span className="lead-error">{errors.phone}</span>}
              </div>

              <button type="submit" className="lead-submit lead-submit-primary">
                Continuar
              </button>
            </form>
          </div>
        )}

        {step === 2 && (
          <div className="lead-body lead-step-enter">
            <div className="lead-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
                <rect x="9" y="3" width="6" height="4" rx="1" />
                <path d="M9 14l2 2 4-4" />
              </svg>
            </div>

            <h2 className="lead-title">Qual o motivo do crédito?</h2>
            <p className="lead-subtitle">Selecione um ou mais motivos para personalizarmos sua proposta</p>

            <div className="lead-purposes">
              {PURPOSES.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className={`lead-purpose-btn ${purposes.includes(p.id) ? 'selected' : ''}`}
                  onClick={() => togglePurpose(p.id)}
                >
                  <span className="lead-purpose-icon">{p.icon}</span>
                  {p.label}
                  <span className="lead-purpose-check">
                    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2.5 6l2.5 2.5 4.5-5" />
                    </svg>
                  </span>
                </button>
              ))}
            </div>

            <button
              type="button"
              className="lead-submit lead-submit-primary"
              onClick={() => finishCapture(purposes)}
              style={{ marginTop: '1rem' }}
            >
              Ver minha proposta personalizada
            </button>

            <button type="button" className="lead-skip" onClick={() => finishCapture([])}>
              Pular esta etapa
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
