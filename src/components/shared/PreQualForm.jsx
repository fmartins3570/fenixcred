import { useEffect, useMemo, useRef, useState } from 'react'
import { trackEvent, trackCustomEvent, generateEventId } from '../../utils/metaPixel'
import { sendServerEvent } from '../../utils/metaCAPI'
import { tagMessage } from '../../utils/utmParams'
import './PreQualForm.css'

/**
 * Pre-qualification micro-form — 3 steps (CLT / Margin / Amount)
 *
 * Filters leads BEFORE the WhatsApp handoff so VendeAI receives a pre-qualified
 * audience with a lead-quality tag. Replaces blind "Simular" handoffs on CLT LPs.
 *
 * Steps:
 *   1. clt: 'sim' | 'nao'           (rejects 'nao' with an FGTS fallback)
 *   2. margin: 'sim' | 'nao' | 'naosei' (none rejects; tag varies)
 *   3. amount: predefined brackets
 *
 * Tracking:
 *   - ViewContent fires when the form first becomes visible (IntersectionObserver).
 *   - Lead (+ QuizQualified for top-tier) fires when user clicks the WhatsApp CTA.
 *   - GA4 mirror is automatic via trackEvent / trackCustomEvent.
 *
 * @param {string} sourceTag   - Base UTM-like tag for VendeAI (e.g. 'neg', 'vel', 'ger', 'clt')
 * @param {string} whatsAppNumber - International WhatsApp number (no '+'), e.g. '5511917082143'
 * @param {string} variant     - 'light' (default, uses page palette) | 'yellow' (CLT pages)
 * @param {string} [title]     - Optional card title override
 * @param {function} [onQualifyStart] - Called once when user interacts for the first time
 *                                     (used by CreditoCLT personalized to defer LeadPopup)
 */
const AMOUNT_OPTIONS = [
  { value: 1000, label: 'R$ 1.000' },
  { value: 3000, label: 'R$ 3.000' },
  { value: 5000, label: 'R$ 5.000' },
  { value: 10000, label: 'R$ 10.000' },
  { value: 20000, label: 'R$ 20.000' },
  { value: 30000, label: 'R$ 30.000+' },
]

function buildWhatsAppMessage({ clt, margin, amount }) {
  const formatted = amount.toLocaleString('pt-BR')
  if (clt !== 'sim') return ''
  if (margin === 'sim') {
    return `Olá, sou CLT ativo com margem, preciso de R$ ${formatted}.`
  }
  if (margin === 'nao') {
    return `Olá, sou CLT mas não tenho certeza da margem, preciso de R$ ${formatted}.`
  }
  // naosei
  return `Olá, sou CLT e preciso verificar minha margem, quero R$ ${formatted}.`
}

function buildLeadTag(sourceTag, margin) {
  // Lead-quality suffix — lets CAPI/VendeAI filter traffic by qualification
  // ex: neg-prequal-sim, clt-prequal-naosei
  return `${sourceTag}-prequal-${margin}`
}

export default function PreQualForm({
  sourceTag,
  whatsAppNumber,
  variant = 'light',
  title = 'Simule em 20 segundos',
  onQualifyStart,
}) {
  const [step, setStep] = useState(1)
  const [clt, setClt] = useState(null)
  const [margin, setMargin] = useState(null)
  const [amount, setAmount] = useState(null)
  const [rejected, setRejected] = useState(false)

  const rootRef = useRef(null)
  const viewFired = useRef(false)
  const startFired = useRef(false)

  // ViewContent when the form first becomes visible
  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !viewFired.current) {
          viewFired.current = true
          trackEvent('ViewContent', {
            content_name: `PreQualForm ${sourceTag}`,
            content_category: 'prequalification',
          })
          observer.disconnect()
        }
      },
      { threshold: 0.4 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [sourceTag])

  const notifyStart = () => {
    if (startFired.current) return
    startFired.current = true
    trackCustomEvent('PreQualStart', { content_name: `PreQualForm ${sourceTag}` })
    if (typeof onQualifyStart === 'function') onQualifyStart()
  }

  const handleClt = (value) => {
    notifyStart()
    setClt(value)
    if (value === 'nao') {
      setRejected(true)
      trackCustomEvent('PreQualRejected', {
        content_name: `PreQualForm ${sourceTag}`,
        reason: 'not_clt',
      })
      return
    }
    setStep(2)
  }

  const handleMargin = (value) => {
    setMargin(value)
    setStep(3)
  }

  const handleAmount = (value) => {
    setAmount(value)
  }

  const handleRestart = () => {
    setStep(1)
    setClt(null)
    setMargin(null)
    setAmount(null)
    setRejected(false)
  }

  const canSubmit = clt === 'sim' && margin && amount

  const handleSubmit = () => {
    if (!canSubmit) return

    const eventId = generateEventId()
    const leadTag = buildLeadTag(sourceTag, margin)

    // Meta Pixel — Lead (browser)
    trackEvent(
      'Lead',
      {
        content_name: `PreQualForm ${sourceTag}`,
        content_category: 'prequalification',
        value: amount,
        currency: 'BRL',
        lead_quality: margin === 'sim' ? 'top' : margin === 'naosei' ? 'mid' : 'low',
      },
      eventId
    )

    // Meta CAPI — Lead (server-side, deduped by eventId)
    sendServerEvent(
      'Lead',
      eventId,
      {
        page: window.location.pathname,
        purposes: `prequal:${margin}`,
      },
      { value: amount, currency: 'BRL' }
    )

    // Top-tier signal for custom audiences / lookalikes
    if (margin === 'sim') {
      const qEventId = generateEventId()
      trackCustomEvent(
        'QuizQualified',
        {
          content_name: `PreQualForm ${sourceTag}`,
          value: amount,
          currency: 'BRL',
        },
        qEventId
      )
    }

    const body = buildWhatsAppMessage({ clt, margin, amount })
    const tagged = tagMessage(`(${leadTag}) ${body}`)
    const encoded = encodeURIComponent(tagged)

    window.open(
      `https://wa.me/${whatsAppNumber}?text=${encoded}`,
      '_blank',
      'noopener,noreferrer'
    )
  }

  const variantClass = variant === 'yellow' ? 'prequal-form--yellow' : 'prequal-form--light'

  const progress = useMemo(() => {
    if (rejected) return 100
    return Math.min((step / 3) * 100, 100)
  }, [step, rejected])

  return (
    <div
      ref={rootRef}
      className={`prequal-form ${variantClass}`}
      role="form"
      aria-label="Pré-qualificação de crédito CLT"
    >
      <div className="prequal-form__head">
        <h3 className="prequal-form__title">{title}</h3>
        {!rejected && (
          <p className="prequal-form__subtitle">
            Responda 3 perguntas rápidas para ver se você se qualifica
          </p>
        )}
        <div className="prequal-form__progress" aria-hidden="true">
          <div
            className="prequal-form__progress-bar"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {rejected ? (
        <div className="prequal-form__body prequal-form__body--rejected">
          <div className="prequal-form__icon" aria-hidden="true">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <p className="prequal-form__reject-msg">
            No momento atendemos apenas trabalhadores <strong>CLT ativos</strong>.
            Em breve teremos soluções para você.
          </p>
          <div className="prequal-form__actions">
            <a
              className="prequal-form__btn prequal-form__btn--secondary"
              href="/antecipacao-fgts"
              aria-label="Ver solução de antecipação FGTS"
            >
              Ver FGTS
            </a>
            <button
              type="button"
              className="prequal-form__btn prequal-form__btn--ghost"
              onClick={handleRestart}
            >
              Voltar
            </button>
          </div>
        </div>
      ) : (
        <div className="prequal-form__body">
          {step === 1 && (
            <fieldset className="prequal-form__step">
              <legend className="prequal-form__label">Você é CLT ativo?</legend>
              <div className="prequal-form__options prequal-form__options--two">
                <button
                  type="button"
                  className={`prequal-form__option ${clt === 'sim' ? 'is-selected' : ''}`}
                  onClick={() => handleClt('sim')}
                  aria-pressed={clt === 'sim'}
                  aria-label="Sou CLT ativo"
                >
                  Sim
                </button>
                <button
                  type="button"
                  className="prequal-form__option"
                  onClick={() => handleClt('nao')}
                  aria-label="Não sou CLT ativo"
                >
                  Não
                </button>
              </div>
            </fieldset>
          )}

          {step === 2 && (
            <fieldset className="prequal-form__step">
              <legend className="prequal-form__label">
                Tem margem consignável disponível?
              </legend>
              <div className="prequal-form__options prequal-form__options--three">
                <button
                  type="button"
                  className={`prequal-form__option ${margin === 'sim' ? 'is-selected' : ''}`}
                  onClick={() => handleMargin('sim')}
                  aria-pressed={margin === 'sim'}
                >
                  Sim
                </button>
                <button
                  type="button"
                  className={`prequal-form__option ${margin === 'nao' ? 'is-selected' : ''}`}
                  onClick={() => handleMargin('nao')}
                  aria-pressed={margin === 'nao'}
                >
                  Não
                </button>
                <button
                  type="button"
                  className={`prequal-form__option ${margin === 'naosei' ? 'is-selected' : ''}`}
                  onClick={() => handleMargin('naosei')}
                  aria-pressed={margin === 'naosei'}
                >
                  Não sei
                </button>
              </div>
              {margin === 'nao' && (
                <p className="prequal-form__hint">
                  Tudo bem — podemos ajudar a verificar sua margem direto com o banco.
                </p>
              )}
              <button
                type="button"
                className="prequal-form__back"
                onClick={() => setStep(1)}
                aria-label="Voltar"
              >
                ← Voltar
              </button>
            </fieldset>
          )}

          {step === 3 && (
            <fieldset className="prequal-form__step">
              <legend className="prequal-form__label">Qual valor você precisa?</legend>
              <div className="prequal-form__amounts">
                {AMOUNT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    className={`prequal-form__amount ${amount === opt.value ? 'is-selected' : ''}`}
                    onClick={() => handleAmount(opt.value)}
                    aria-pressed={amount === opt.value}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              <button
                type="button"
                className="prequal-form__btn prequal-form__btn--primary"
                onClick={handleSubmit}
                disabled={!canSubmit}
                aria-label="Continuar no WhatsApp com dados pré-preenchidos"
              >
                <svg
                  className="prequal-form__wa-icon"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  aria-hidden="true"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                Continuar no WhatsApp
              </button>

              <button
                type="button"
                className="prequal-form__back"
                onClick={() => setStep(2)}
                aria-label="Voltar"
              >
                ← Voltar
              </button>
            </fieldset>
          )}
        </div>
      )}
    </div>
  )
}
