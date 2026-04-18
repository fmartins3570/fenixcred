import { useEffect, useMemo, useRef, useState } from 'react'
import { trackEvent, trackCustomEvent, generateEventId } from '../../utils/metaPixel'
import { sendServerEvent } from '../../utils/metaCAPI'
import { tagMessage } from '../../utils/utmParams'
import './PreQualForm.css'

/**
 * Pre-qualification micro-form — 4 steps (CLT / Tenure / Margin / Amount)
 *
 * Filters leads BEFORE the WhatsApp handoff so VendeAI receives a pre-qualified
 * audience with lead-quality + tenure-bucket tags. Tenure (CLT admission month/year)
 * lets the bot route to the correct bank cascade on the first try — most banks have
 * a minimum-tenure rule (Facta ≥ 3m, Pan ≥ 6m, Mercantil ≥ 12m).
 *
 * Steps:
 *   1. clt:     'sim' | 'nao'                          (rejects 'nao' with FGTS fallback)
 *   2. tenure:  { month, year } → tenure_months number (routing signal; no rejection)
 *   3. margin:  'sim' | 'nao' | 'naosei'               (main quality signal)
 *   4. amount:  predefined brackets
 *
 * @param {string} sourceTag        - Base UTM-like tag for VendeAI (neg/vel/ger/clt)
 * @param {string} whatsAppNumber   - International WhatsApp number, e.g. '5511917082143'
 * @param {string} variant          - 'light' | 'yellow'
 * @param {string} [title]          - Optional card title override
 * @param {function} [onQualifyStart] - Called once on first interaction (used by LeadPopup defer)
 */
const AMOUNT_OPTIONS = [
  { value: 1000, label: 'R$ 1.000' },
  { value: 3000, label: 'R$ 3.000' },
  { value: 5000, label: 'R$ 5.000' },
  { value: 10000, label: 'R$ 10.000' },
  { value: 20000, label: 'R$ 20.000' },
  { value: 30000, label: 'R$ 30.000+' },
]

const MONTHS = [
  { value: 1, label: 'Janeiro' },
  { value: 2, label: 'Fevereiro' },
  { value: 3, label: 'Março' },
  { value: 4, label: 'Abril' },
  { value: 5, label: 'Maio' },
  { value: 6, label: 'Junho' },
  { value: 7, label: 'Julho' },
  { value: 8, label: 'Agosto' },
  { value: 9, label: 'Setembro' },
  { value: 10, label: 'Outubro' },
  { value: 11, label: 'Novembro' },
  { value: 12, label: 'Dezembro' },
]

const CURRENT_YEAR = new Date().getFullYear()
const YEAR_OPTIONS = Array.from({ length: 30 }, (_, i) => CURRENT_YEAR - i)

function calcTenureMonths(month, year) {
  if (!month || !year) return null
  const now = new Date()
  const current = now.getFullYear() * 12 + now.getMonth()
  const admission = Number(year) * 12 + (Number(month) - 1)
  return Math.max(0, current - admission)
}

function tenureBucket(months) {
  if (months == null) return 'unknown'
  if (months < 3) return 't0-2m'
  if (months < 6) return 't3-5m'
  if (months < 12) return 't6-11m'
  if (months < 24) return 't12-23m'
  return 't24m+'
}

function tenurePhrase(months) {
  if (months == null) return ''
  if (months === 0) return 'há menos de 1 mês'
  if (months === 1) return 'há 1 mês'
  if (months < 12) return `há ${months} meses`
  const years = Math.floor(months / 12)
  const rest = months % 12
  if (years === 1 && rest === 0) return 'há 1 ano'
  if (rest === 0) return `há ${years} anos`
  if (years === 1) return `há 1 ano e ${rest} ${rest === 1 ? 'mês' : 'meses'}`
  return `há ${years} anos e ${rest} ${rest === 1 ? 'mês' : 'meses'}`
}

function leadQuality(margin, months) {
  const hasTenureData = months != null
  if (margin === 'sim') {
    if (hasTenureData && months >= 6) return 'top'
    if (hasTenureData && months >= 3) return 'high'
    return 'mid-new'
  }
  if (margin === 'naosei') {
    if (hasTenureData && months >= 6) return 'mid'
    return 'mid-new'
  }
  return 'low'
}

function buildWhatsAppMessage({ clt, margin, amount, tenureMonths }) {
  if (clt !== 'sim') return ''
  const formatted = amount.toLocaleString('pt-BR')
  const phrase = tenurePhrase(tenureMonths)
  const tenurePart = phrase ? ` ${phrase} na empresa atual` : ''
  if (margin === 'sim') {
    return `Olá, sou CLT ativo${tenurePart}, com margem disponível. Preciso de R$ ${formatted}.`
  }
  if (margin === 'nao') {
    return `Olá, sou CLT ativo${tenurePart}, mas não tenho margem no momento. Preciso de R$ ${formatted}.`
  }
  return `Olá, sou CLT ativo${tenurePart} e quero verificar minha margem. Preciso de R$ ${formatted}.`
}

function buildLeadTag(sourceTag, margin, bucket) {
  return `${sourceTag}-prequal-${margin}-${bucket}`
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
  const [month, setMonth] = useState('')
  const [year, setYear] = useState('')
  const [margin, setMargin] = useState(null)
  const [amount, setAmount] = useState(null)
  const [rejected, setRejected] = useState(false)

  const rootRef = useRef(null)
  const viewFired = useRef(false)
  const startFired = useRef(false)

  const tenureMonths = useMemo(() => calcTenureMonths(month, year), [month, year])
  const bucket = useMemo(() => tenureBucket(tenureMonths), [tenureMonths])

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

  const handleTenureContinue = () => {
    if (!month || !year) return
    trackCustomEvent('PreQualTenure', {
      content_name: `PreQualForm ${sourceTag}`,
      tenure_months: tenureMonths,
      tenure_bucket: bucket,
    })
    setStep(3)
  }

  const handleMargin = (value) => {
    setMargin(value)
    setStep(4)
  }

  const handleAmount = (value) => {
    setAmount(value)
  }

  const handleRestart = () => {
    setStep(1)
    setClt(null)
    setMonth('')
    setYear('')
    setMargin(null)
    setAmount(null)
    setRejected(false)
  }

  const canSubmit = clt === 'sim' && tenureMonths != null && margin && amount

  const handleSubmit = () => {
    if (!canSubmit) return

    const eventId = generateEventId()
    const quality = leadQuality(margin, tenureMonths)
    const leadTag = buildLeadTag(sourceTag, margin, bucket)

    const extraData = {
      value: amount,
      currency: 'BRL',
      lead_quality: quality,
      tenure_months: tenureMonths,
      tenure_bucket: bucket,
      has_margin: margin,
    }

    // Meta Pixel — Lead (browser)
    trackEvent(
      'Lead',
      {
        content_name: `PreQualForm ${sourceTag}`,
        content_category: 'prequalification',
        ...extraData,
      },
      eventId
    )

    // Meta CAPI — Lead (server-side, deduped by eventId)
    sendServerEvent(
      'Lead',
      eventId,
      {
        page: window.location.pathname,
        purposes: `prequal:${margin}:${bucket}`,
      },
      extraData
    )

    // Top-tier signal (margem=sim + >=3m) for custom audiences / lookalikes
    if (quality === 'top' || quality === 'high') {
      const qEventId = generateEventId()
      trackCustomEvent(
        'QuizQualified',
        {
          content_name: `PreQualForm ${sourceTag}`,
          ...extraData,
        },
        qEventId
      )
    }

    const body = buildWhatsAppMessage({ clt, margin, amount, tenureMonths })
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
    return Math.min((step / 4) * 100, 100)
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
            Responda 4 perguntas rápidas para ver se você se qualifica
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
                Quando você entrou na empresa atual?
              </legend>
              <div className="prequal-form__tenure-grid">
                <label className="prequal-form__select-wrapper">
                  <span className="prequal-form__select-label">Mês</span>
                  <select
                    className="prequal-form__select"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    aria-label="Mês de admissão"
                  >
                    <option value="">Selecione</option>
                    {MONTHS.map((m) => (
                      <option key={m.value} value={m.value}>
                        {m.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="prequal-form__select-wrapper">
                  <span className="prequal-form__select-label">Ano</span>
                  <select
                    className="prequal-form__select"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    aria-label="Ano de admissão"
                  >
                    <option value="">Selecione</option>
                    {YEAR_OPTIONS.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              {tenureMonths != null && (
                <p className="prequal-form__hint">
                  {tenureMonths < 3 && (
                    <>Carência estendida disponível — até 84 dias para o primeiro pagamento.</>
                  )}
                  {tenureMonths >= 3 && tenureMonths < 12 && (
                    <>Perfeito — várias condições disponíveis para você.</>
                  )}
                  {tenureMonths >= 12 && (
                    <>Excelente — {tenurePhrase(tenureMonths)}. Acesso às melhores taxas.</>
                  )}
                </p>
              )}

              <button
                type="button"
                className="prequal-form__btn prequal-form__btn--primary"
                onClick={handleTenureContinue}
                disabled={!month || !year}
                aria-label="Continuar"
              >
                Continuar
              </button>

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
                onClick={() => setStep(2)}
                aria-label="Voltar"
              >
                ← Voltar
              </button>
            </fieldset>
          )}

          {step === 4 && (
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
                onClick={() => setStep(3)}
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
