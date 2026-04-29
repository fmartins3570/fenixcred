import { useState, useCallback, useRef, useEffect, useMemo } from 'react'
import { WHATSAPP_NUMBER } from '../../utils/credito-clt/constants'
import { trackEvent, trackCustomEvent, generateEventId } from '../../utils/metaPixel'
import { sendServerEvent, getExternalId } from '../../utils/metaCAPI'
import { tagMessage } from '../../utils/utmParams'
import { CREDITAS_LINKS, trackCreditasRedirect, trackCreditasRecoveryView } from '../../utils/creditas'
import {
  DEFAULT_MONTHLY_RATE,
  MIN_LOAN_VALUE,
  MAX_LOAN_VALUE,
  buildScenarios,
  formatBRL,
  parseBRL,
} from '../../utils/credito-clt/finance'
import {
  MONTHS,
  YEAR_OPTIONS,
  calcTenureMonths,
  tenureBucket,
  tenurePhrase,
  leadQuality,
} from '../../utils/tenure'
import '../SimulacaoCLT/Questionnaire.css'
import '../SimulacaoCredito/Recovery.css'
import './QuestionnaireV3.css'

const CLT_MARGIN_PERCENT = 0.35
const MIN_MARGIN_THRESHOLD = 100

function rejectionReason(questionId) {
  if (questionId === 'q1') return 'not_clt'
  if (questionId === 'q3') return 'company_young'
  if (questionId === 'q4') return 'no_margin'
  if (questionId === 'calculator') return 'margin_insufficient'
  return 'unknown'
}

function consignadoMarginKey(answer) {
  if (answer === 'none' || answer === 'low') return 'sim'
  if (answer === 'unknown') return 'naosei'
  return 'nao'
}

const QUESTIONS = [
  {
    id: 'q1',
    text: 'Voce trabalha de carteira assinada?',
    type: 'boolean',
    options: [
      { label: 'Sim', value: true },
      { label: 'Nao', value: false },
    ],
    rejectOnFalse: true,
  },
  {
    id: 'q2',
    text: 'Quando voce entrou na empresa atual?',
    type: 'tenure',
  },
  {
    id: 'q3',
    text: 'A empresa onde voce trabalha existe ha mais de 2 anos?',
    type: 'boolean',
    options: [
      { label: 'Sim', value: true },
      { label: 'Nao', value: false },
    ],
    rejectOnFalse: true,
  },
  {
    id: 'q4',
    text: 'Voce tem algum emprestimo consignado descontando no holerite hoje?',
    type: 'consignado',
    options: [
      { label: 'Nao, nenhum', value: 'none' },
      { label: 'Sim, parcela baixa (ate R$ 200)', value: 'low' },
      { label: 'Sim, parcela alta (acima de R$ 200)', value: 'high' },
      { label: 'Nao sei', value: 'unknown' },
    ],
  },
]

const SCENARIO_DEBOUNCE_MS = 200

export default function QuestionnaireV3() {
  const [screen, setScreen] = useState('intro')
  const [questionIndex, setQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [value, setValue] = useState('')
  const [debouncedValue, setDebouncedValue] = useState(0)
  const [selectedTerm, setSelectedTerm] = useState(24)
  const [rejectedAt, setRejectedAt] = useState(null)
  const [animDir, setAnimDir] = useState('right')
  const [tenureMonth, setTenureMonth] = useState('')
  const [tenureYear, setTenureYear] = useState('')
  const sectionRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  // Calculator state
  const [salaryInput, setSalaryInput] = useState('')
  const [deductionInput, setDeductionInput] = useState('')
  const [calculatedMargin, setCalculatedMargin] = useState(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const parsed = parseBRL(value)
    const timer = setTimeout(() => setDebouncedValue(parsed), SCENARIO_DEBOUNCE_MS)
    return () => clearTimeout(timer)
  }, [value])

  const rawNumericValue = useMemo(() => parseBRL(value), [value])
  const isValueValid = rawNumericValue >= MIN_LOAN_VALUE && rawNumericValue <= MAX_LOAN_VALUE

  const scenarios = useMemo(() => {
    if (debouncedValue < MIN_LOAN_VALUE || debouncedValue > MAX_LOAN_VALUE) return []
    return buildScenarios(debouncedValue, DEFAULT_MONTHLY_RATE)
  }, [debouncedValue])

  const selectedScenario = useMemo(
    () => scenarios.find((s) => s.term === selectedTerm) || scenarios[1] || null,
    [scenarios, selectedTerm]
  )

  const startQuiz = useCallback(() => {
    setAnimDir('right')
    setScreen('question')
    setQuestionIndex(0)
    setAnswers({})
    setRejectedAt(null)
    setValue('')
    setDebouncedValue(0)
    setSelectedTerm(24)
    setSalaryInput('')
    setDeductionInput('')
    setCalculatedMargin(null)
    setTenureMonth('')
    setTenureYear('')

    const eventId = generateEventId()
    trackEvent('InitiateCheckout', { content_name: 'Quiz Simulacao CLT V3', quiz_version: 'v3' }, eventId)
    sendServerEvent('InitiateCheckout', eventId)
  }, [])

  const handleAnswer = useCallback((questionId, answerValue) => {
    const newAnswers = { ...answers, [questionId]: answerValue }
    setAnswers(newAnswers)

    const question = QUESTIONS[questionIndex]

    const isRejection =
      (question.type === 'boolean' && question.rejectOnFalse === true && answerValue === false) ||
      (question.type === 'consignado' && answerValue === 'high')

    let answerLabel
    if (question.type === 'tenure') {
      answerLabel = `${answerValue.tenureMonths}m (${answerValue.bucket})`
    } else if (question.options) {
      answerLabel = question.options.find((o) => o.value === answerValue)?.label || String(answerValue)
    } else {
      answerLabel = String(answerValue)
    }

    trackCustomEvent('QuizAnswer', {
      question_id: questionId,
      question_text: question.text,
      answer: answerLabel,
      step: questionIndex + 1,
      qualified: !isRejection,
      quiz_version: 'v3',
    })

    if (question.type === 'tenure') {
      trackCustomEvent('PreQualTenure', {
        content_name: 'Quiz Simulacao CLT V3',
        tenure_months: answerValue.tenureMonths,
        tenure_bucket: answerValue.bucket,
      })
    }

    if (isRejection) {
      setAnimDir('right')
      setRejectedAt(questionId)
      setScreen('recovery')
      return
    }

    if (questionIndex < QUESTIONS.length - 1) {
      setAnimDir('right')
      setQuestionIndex(questionIndex + 1)
    } else {
      // After last question → calculator screen (not approved yet)
      setAnimDir('right')
      setScreen('calculator')

      // Pre-fill deduction if Q4 = 'none'
      if (answerValue === 'none') {
        setDeductionInput('R$ 0,00')
      }
    }
  }, [answers, questionIndex])

  const handleCalculateMargin = useCallback(() => {
    const salary = parseBRL(salaryInput)
    const deduction = parseBRL(deductionInput)

    if (salary <= 0) return

    const maxMargin = salary * CLT_MARGIN_PERCENT
    const available = Math.max(0, maxMargin - deduction)
    setCalculatedMargin(available)

    trackCustomEvent('MarginCalculated', {
      salary,
      deduction,
      margin_available: available,
      margin_sufficient: available >= MIN_MARGIN_THRESHOLD,
      quiz_version: 'v3',
    })
  }, [salaryInput, deductionInput])

  const handleMarginApproved = useCallback(() => {
    setAnimDir('right')
    setScreen('approved')

    window.dispatchEvent(new Event('quiz-completed'))

    const qqEventId = generateEventId()
    trackCustomEvent('QuizQualified', {
      content_name: 'Quiz Simulacao CLT V3 - Pre-aprovado',
      quiz_version: 'v3',
      margin_available: calculatedMargin,
      consignado_status: answers.q4,
    }, qqEventId)
    sendServerEvent('QuizQualified', qqEventId, {
      page: '/simulacao-clt-v3',
    })
  }, [calculatedMargin, answers])

  const handleMarginRejected = useCallback(() => {
    setAnimDir('right')
    setRejectedAt('calculator')
    setScreen('recovery')
  }, [])

  const handleTenureContinue = useCallback(() => {
    if (!tenureMonth || !tenureYear) return
    const months = calcTenureMonths(tenureMonth, tenureYear)
    const bucket = tenureBucket(months)
    handleAnswer('q2', {
      month: tenureMonth,
      year: tenureYear,
      tenureMonths: months,
      bucket,
    })
  }, [tenureMonth, tenureYear, handleAnswer])

  const handleReset = useCallback(() => {
    setAnimDir('left')
    setScreen('intro')
    setQuestionIndex(0)
    setAnswers({})
    setRejectedAt(null)
    setValue('')
    setDebouncedValue(0)
    setSelectedTerm(24)
    setSalaryInput('')
    setDeductionInput('')
    setCalculatedMargin(null)
  }, [])

  const handleCreditasClick = useCallback((product) => {
    trackCreditasRedirect(product, rejectionReason(rejectedAt), 'Quiz Simulacao CLT V3')
  }, [rejectedAt])

  useEffect(() => {
    if (screen === 'recovery') {
      trackCreditasRecoveryView(rejectionReason(rejectedAt), 'Quiz Simulacao CLT V3')
    }
  }, [screen, rejectedAt])

  const formatCurrencyFromDigits = useCallback((raw) => {
    const digits = String(raw).replace(/\D/g, '')
    if (!digits) return ''
    const number = parseInt(digits, 10) / 100
    return number.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })
  }, [])

  const handleValueChange = useCallback((e) => {
    setValue(formatCurrencyFromDigits(e.target.value))
  }, [formatCurrencyFromDigits])

  const handleSalaryInputChange = useCallback((e) => {
    setSalaryInput(formatCurrencyFromDigits(e.target.value))
    setCalculatedMargin(null)
  }, [formatCurrencyFromDigits])

  const handleDeductionInputChange = useCallback((e) => {
    setDeductionInput(formatCurrencyFromDigits(e.target.value))
    setCalculatedMargin(null)
  }, [formatCurrencyFromDigits])

  const handleSelectTerm = useCallback((term) => {
    setSelectedTerm(term)
  }, [])

  const handleWhatsApp = useCallback(() => {
    const parsedValue = rawNumericValue
    const hasValidScenario = isValueValid && selectedScenario

    const tenureData = answers.q2 || {}
    const tenureMonths = tenureData.tenureMonths ?? null
    const bucket = tenureData.bucket || 'unknown'

    const consignadoStatus = answers.q4
    const marginKey = consignadoMarginKey(consignadoStatus)
    const quality = leadQuality(marginKey, tenureMonths)
    const phrase = tenurePhrase(tenureMonths)

    const valueText = parsedValue > 0 ? formatBRL(parsedValue) : 'a definir'

    const profileParts = []
    if (phrase) profileParts.push(`CLT ${phrase} na empresa atual`)

    if (consignadoStatus === 'none') profileParts.push('Sem consignado ativo no holerite')
    else if (consignadoStatus === 'low') profileParts.push('Consignado ativo, parcela baixa')
    else if (consignadoStatus === 'unknown') profileParts.push('Nao sabe se tem consignado ativo')

    if (calculatedMargin > 0) {
      profileParts.push(`Margem verificada: ${formatBRL(calculatedMargin)}/mes`)
    }

    const refToken = getExternalId().slice(0, 8)
    const leadTag = `quiz-v3-${marginKey}-${bucket}-${refToken}`

    let baseMsg
    if (hasValidScenario) {
      baseMsg = `(${leadTag}) Ola, fiz a pre-simulacao e escolhi ${formatBRL(parsedValue)} em ${selectedScenario.term} meses (parcela de ${formatBRL(selectedScenario.installment)}). Pode me ajudar?\n\n${profileParts.join('\n')}`
    } else {
      baseMsg = `(${leadTag}) Ola! Fui pre-aprovado na simulacao de emprestimo consignado CLT.\n\nValor desejado: ${valueText}\n${profileParts.join('\n')}`
    }

    const message = encodeURIComponent(tagMessage(baseMsg))

    const contactEventId = generateEventId()
    trackEvent('Contact', { content_name: 'Quiz Simulacao CLT V3 - WhatsApp', content_category: 'whatsapp', quiz_version: 'v3' }, contactEventId)
    sendServerEvent('Contact', contactEventId, { page: 'Quiz Simulacao CLT V3' })

    const extraData = {
      value: parsedValue,
      currency: 'BRL',
      content_name: 'Quiz Simulacao CLT V3 - WhatsApp',
      customer_type: consignadoStatus === 'none' ? 'new' : 'returning',
      lead_quality: quality,
      tenure_months: tenureMonths,
      tenure_bucket: bucket,
      has_margin: marginKey,
      margin_verified: calculatedMargin,
      consignado_status: consignadoStatus,
      quiz_version: 'v3',
    }

    const leadEventId = generateEventId()
    trackEvent('Lead', extraData, leadEventId)
    sendServerEvent('Lead', leadEventId, {
      purposes: `quiz-v3:${marginKey}:${bucket}`,
    }, extraData)

    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`,
      '_blank',
      'noopener,noreferrer'
    )
  }, [answers, rawNumericValue, isValueValid, selectedScenario, calculatedMargin])

  const progress = screen === 'question'
    ? ((questionIndex + 1) / QUESTIONS.length) * 100
    : screen === 'calculator'
      ? 90
      : screen === 'approved'
        ? 100
        : 0

  const marginIsSufficient = calculatedMargin !== null && calculatedMargin >= MIN_MARGIN_THRESHOLD
  const marginIsInsufficient = calculatedMargin !== null && calculatedMargin < MIN_MARGIN_THRESHOLD

  return (
    <section
      id="questionario-clt"
      className={`sim-quiz ${isVisible ? 'sim-quiz--visible' : ''}`}
      ref={sectionRef}
    >
      <div className="sim-quiz-bg" aria-hidden="true" />

      <div className="sim-quiz-container">
        {/* Intro */}
        {screen === 'intro' && (
          <div className="sim-quiz-screen sim-quiz-intro" key="intro">
            <div className="sim-quiz-intro-icon" aria-hidden="true">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
                <rect x="9" y="3" width="6" height="4" rx="1" />
                <path d="M9 14l2 2 4-4" />
              </svg>
            </div>
            <h2 className="sim-quiz-intro-title">
              Veja se voce se qualifica
            </h2>
            <p className="sim-quiz-intro-text">
              Responda 4 perguntas rapidas e verifique sua margem para
              contratar o emprestimo consignado CLT com as melhores condicoes.
            </p>
            <button
              className="sim-quiz-start-btn"
              onClick={startQuiz}
              aria-label="Iniciar questionario de pre-qualificacao"
            >
              Comecar simulacao
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" />
                <path d="M12 5l7 7-7 7" />
              </svg>
            </button>
            <span className="sim-quiz-intro-note">
              Leva menos de 1 minuto. Sem compromisso.
            </span>
          </div>
        )}

        {/* Questions */}
        {screen === 'question' && (
          <div
            className={`sim-quiz-screen sim-quiz-question sim-anim-${animDir}`}
            key={`q-${questionIndex}`}
          >
            <div className="sim-quiz-progress">
              <div className="sim-quiz-progress-bar">
                <div
                  className="sim-quiz-progress-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="sim-quiz-progress-label">
                {questionIndex + 1} de {QUESTIONS.length}
              </span>
            </div>

            <div className="sim-quiz-dots">
              {QUESTIONS.map((q, i) => (
                <span
                  key={q.id}
                  className={`sim-quiz-dot ${
                    i < questionIndex ? 'sim-quiz-dot--done' :
                    i === questionIndex ? 'sim-quiz-dot--active' : ''
                  }`}
                />
              ))}
            </div>

            <h3 className="sim-quiz-question-text">
              {QUESTIONS[questionIndex].text}
            </h3>

            {QUESTIONS[questionIndex].type === 'tenure' ? (
              <div className="sim-quiz-tenure">
                <div className="sim-quiz-tenure-grid">
                  <label className="sim-quiz-tenure-field">
                    <span className="sim-quiz-tenure-label">Mes</span>
                    <select
                      className="sim-quiz-tenure-select"
                      value={tenureMonth}
                      onChange={(e) => setTenureMonth(e.target.value)}
                      aria-label="Mes de admissao"
                    >
                      <option value="">Selecione</option>
                      {MONTHS.map((m) => (
                        <option key={m.value} value={m.value}>{m.label}</option>
                      ))}
                    </select>
                  </label>
                  <label className="sim-quiz-tenure-field">
                    <span className="sim-quiz-tenure-label">Ano</span>
                    <select
                      className="sim-quiz-tenure-select"
                      value={tenureYear}
                      onChange={(e) => setTenureYear(e.target.value)}
                      aria-label="Ano de admissao"
                    >
                      <option value="">Selecione</option>
                      {YEAR_OPTIONS.map((y) => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </label>
                </div>

                {tenureMonth && tenureYear && (
                  <p className="sim-quiz-tenure-hint">
                    {tenurePhrase(calcTenureMonths(tenureMonth, tenureYear))} na empresa atual
                  </p>
                )}

                <button
                  type="button"
                  className="sim-quiz-tenure-btn"
                  onClick={handleTenureContinue}
                  disabled={!tenureMonth || !tenureYear}
                  aria-label="Continuar"
                >
                  Continuar
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14" />
                    <path d="M12 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="sim-quiz-options">
                {QUESTIONS[questionIndex].options.map((opt) => (
                  <button
                    key={String(opt.value)}
                    className="sim-quiz-option-btn"
                    onClick={() => handleAnswer(QUESTIONS[questionIndex].id, opt.value)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}

            {QUESTIONS[questionIndex].id === 'q4' && (
              <p className="sim-quiz-help">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                </svg>
                Verifique no seu holerite se existe algum desconto de
                emprestimo consignado.
              </p>
            )}
          </div>
        )}

        {/* Calculator Screen — mandatory margin check */}
        {screen === 'calculator' && (
          <div className="sim-quiz-screen sim-quiz-calculator" key="calculator">
            <div className="sim-v3-calc-icon" aria-hidden="true">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="4" y="2" width="16" height="20" rx="2" />
                <line x1="8" y1="6" x2="16" y2="6" />
                <line x1="8" y1="10" x2="10" y2="10" />
                <line x1="12" y1="10" x2="14" y2="10" />
                <line x1="8" y1="14" x2="10" y2="14" />
                <line x1="12" y1="14" x2="14" y2="14" />
                <line x1="8" y1="18" x2="14" y2="18" />
              </svg>
            </div>

            <h3 className="sim-v3-calc-title">
              Vamos verificar sua margem
            </h3>
            <p className="sim-v3-calc-text">
              Informe seu salario e descontos atuais para calcular
              a margem disponivel para consignado.
            </p>

            <div className="sim-v3-calc-form">
              <label className="sim-v3-calc-field">
                <span className="sim-v3-calc-label">Salario bruto mensal</span>
                <input
                  type="text"
                  inputMode="numeric"
                  className="sim-quiz-value-input"
                  placeholder="R$ 0,00"
                  value={salaryInput}
                  onChange={handleSalaryInputChange}
                  autoFocus
                />
              </label>

              <label className="sim-v3-calc-field">
                <span className="sim-v3-calc-label">
                  Desconto de consignado no holerite
                  {answers.q4 === 'none' && (
                    <span className="sim-v3-calc-prefilled"> (voce informou que nao tem)</span>
                  )}
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  className="sim-quiz-value-input"
                  placeholder="R$ 0,00"
                  value={deductionInput}
                  onChange={handleDeductionInputChange}
                />
              </label>

              <span className="sim-v3-calc-hint">
                Margem CLT = 35% do salario bruto - descontos de consignado atuais
              </span>

              <button
                type="button"
                className="sim-quiz-tenure-btn"
                onClick={handleCalculateMargin}
                disabled={!salaryInput}
              >
                Calcular margem
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" />
                  <path d="M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Margin result */}
            {marginIsSufficient && (
              <div className="sim-v3-calc-result sim-v3-calc-result--ok">
                <div className="sim-v3-calc-result-icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <p className="sim-v3-calc-result-text">
                  Margem disponivel: <strong>{formatBRL(calculatedMargin)}/mes</strong>
                </p>
                <button
                  type="button"
                  className="sim-quiz-start-btn"
                  onClick={handleMarginApproved}
                >
                  Continuar para simulacao
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14" />
                    <path d="M12 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}

            {marginIsInsufficient && (
              <div className="sim-v3-calc-result sim-v3-calc-result--fail">
                <div className="sim-v3-calc-result-icon sim-v3-calc-result-icon--fail">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="15" y1="9" x2="9" y2="15" />
                    <line x1="9" y1="9" x2="15" y2="15" />
                  </svg>
                </div>
                <p className="sim-v3-calc-result-text">
                  Margem disponivel: <strong>{formatBRL(calculatedMargin)}/mes</strong>
                </p>
                <p className="sim-v3-calc-result-sub">
                  Margem minima necessaria: {formatBRL(MIN_MARGIN_THRESHOLD)}/mes.
                  Sua margem atual nao e suficiente para um novo consignado.
                </p>
                <button
                  type="button"
                  className="sim-quiz-start-btn"
                  onClick={handleMarginRejected}
                >
                  Ver outras opcoes de credito
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14" />
                    <path d="M12 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Approved Screen */}
        {screen === 'approved' && (
          <div className="sim-quiz-screen sim-quiz-approved" key="approved">
            <div className="sim-quiz-approved-icon">
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>

            <h3 className="sim-quiz-approved-title">
              Voce foi pre-aprovado!
            </h3>
            <p className="sim-quiz-approved-text">
              Margem verificada: <strong>{formatBRL(calculatedMargin)}/mes</strong>.
              Simule abaixo o valor e o prazo ideal para voce.
              Taxa a partir de <strong>1,49% ao mes</strong>.
            </p>

            <div className="sim-quiz-value-group">
              <label htmlFor="sim-valor" className="sim-quiz-value-label">
                Quanto voce precisa?
              </label>
              <input
                id="sim-valor"
                type="text"
                inputMode="numeric"
                className="sim-quiz-value-input"
                placeholder="R$ 0,00"
                value={value}
                onChange={handleValueChange}
                autoFocus
                aria-describedby="sim-valor-help"
              />
              <span id="sim-valor-help" className="sim-quiz-value-hint">
                Entre {formatBRL(MIN_LOAN_VALUE)} e {formatBRL(MAX_LOAN_VALUE)}
              </span>
            </div>

            <div
              className="sim-quiz-scenarios-wrap"
              aria-live="polite"
              aria-atomic="true"
            >
              {rawNumericValue > 0 && !isValueValid && (
                <p className="sim-quiz-scenarios-empty">
                  {rawNumericValue < MIN_LOAN_VALUE
                    ? `Valor minimo: ${formatBRL(MIN_LOAN_VALUE)}.`
                    : `Valor maximo: ${formatBRL(MAX_LOAN_VALUE)}.`}
                </p>
              )}

              {isValueValid && scenarios.length > 0 && (
                <>
                  <p className="sim-quiz-scenarios-intro">
                    Escolha o prazo que cabe no seu bolso:
                  </p>
                  <div className="sim-quiz-scenarios" role="radiogroup" aria-label="Opcoes de prazo">
                    {scenarios.map((s) => {
                      const isSelected = s.term === selectedTerm
                      return (
                        <button
                          key={s.term}
                          type="button"
                          role="radio"
                          aria-checked={isSelected}
                          className={`sim-quiz-scenario-card ${isSelected ? 'sim-quiz-scenario-card--selected' : ''}`}
                          onClick={() => handleSelectTerm(s.term)}
                        >
                          <span className="sim-quiz-scenario-term">
                            {s.term}x
                          </span>
                          <span className="sim-quiz-scenario-installment">
                            {formatBRL(s.installment)}
                            <small>/mes</small>
                          </span>
                          <span className="sim-quiz-scenario-total">
                            Total: {formatBRL(s.total)}
                          </span>
                          {s.savingsVsPersonal > 0 && (
                            <span className="sim-quiz-scenario-savings">
                              Economia de {formatBRL(s.savingsVsPersonal)} vs credito pessoal
                            </span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </>
              )}
            </div>

            <button
              className="sim-quiz-whatsapp-btn"
              onClick={handleWhatsApp}
              aria-label="Falar com consultor no WhatsApp"
              disabled={!isValueValid}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              Falar com consultor no WhatsApp
            </button>

            <span className="sim-quiz-approved-note">
              {isValueValid
                ? 'Voce sera atendido por um consultor especializado'
                : 'Informe um valor entre R$ 1.000 e R$ 50.000 para ver as parcelas'}
            </span>

            <p className="sim-quiz-disclaimer">
              * Simulacao estimada com taxa referencial de 1,49% a.m.
              (Tabela Price). Taxa final sujeita a analise de credito.
            </p>
          </div>
        )}

        {/* Recovery Screen */}
        {screen === 'recovery' && (
          <div className="sim-quiz-screen sim-quiz-recovery" key="recovery">
            <div className="sim-recovery-icon" aria-hidden="true">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v4" />
                <path d="M12 18v4" />
                <path d="M4.93 4.93l2.83 2.83" />
                <path d="M16.24 16.24l2.83 2.83" />
                <path d="M2 12h4" />
                <path d="M18 12h4" />
                <path d="M4.93 19.07l2.83-2.83" />
                <path d="M16.24 7.76l2.83-2.83" />
              </svg>
            </div>

            <h3 className="sim-recovery-title">
              {rejectedAt === 'calculator'
                ? 'Sua margem consignavel esta insuficiente'
                : rejectedAt === 'q4'
                  ? 'Sua margem consignavel pode estar comprometida'
                  : 'O consignado CLT nao se aplica agora, mas temos outras opcoes!'}
            </h3>
            <p className="sim-recovery-text">
              {rejectedAt === 'calculator'
                ? `Com margem de ${formatBRL(calculatedMargin)}/mes, nao e possivel contratar um novo consignado. Mas voce pode conseguir credito usando seu imovel ou veiculo como garantia.`
                : rejectedAt === 'q4'
                  ? 'Com uma parcela alta de consignado ativo, sua margem pode estar esgotada. Mas voce pode conseguir credito usando seu imovel ou veiculo como garantia, com taxas ainda menores.'
                  : 'Voce pode conseguir credito usando seu imovel ou veiculo como garantia, com taxas ainda menores e sem precisar de carteira assinada.'}
            </p>

            <div className="sim-recovery-cards">
              <button
                type="button"
                className="sim-recovery-card sim-recovery-card--home"
                onClick={() => handleCreditasClick('home')}
              >
                <span className="sim-recovery-card-icon" aria-hidden="true">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                </span>
                <span className="sim-recovery-card-title">Credito com Garantia de Imovel</span>
                <span className="sim-recovery-card-rate">Taxas a partir de 1,09% a.m.</span>
                <span className="sim-recovery-card-desc">
                  Use seu imovel como garantia e consiga credito com as menores taxas do mercado. Imovel quitado ou financiado.
                </span>
                <span className="sim-recovery-card-cta">
                  Simular agora
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14" />
                    <path d="M12 5l7 7-7 7" />
                  </svg>
                </span>
              </button>

              <button
                type="button"
                className="sim-recovery-card sim-recovery-card--auto"
                onClick={() => handleCreditasClick('auto')}
              >
                <span className="sim-recovery-card-icon" aria-hidden="true">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 17m-2 0a2 2 0 104 0 2 2 0 10-4 0" />
                    <path d="M17 17m-2 0a2 2 0 104 0 2 2 0 10-4 0" />
                    <path d="M5 17H3v-6l2-5h9l4 5h1a2 2 0 012 2v4h-2" />
                    <path d="M9 17h6" />
                    <line x1="14" y1="6" x2="14" y2="11" />
                  </svg>
                </span>
                <span className="sim-recovery-card-title">Credito com Garantia de Veiculo</span>
                <span className="sim-recovery-card-rate">Taxas a partir de 1,49% a.m.</span>
                <span className="sim-recovery-card-desc">
                  Use seu veiculo quitado como garantia. Voce continua usando o carro normalmente.
                </span>
                <span className="sim-recovery-card-cta">
                  Simular agora
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14" />
                    <path d="M12 5l7 7-7 7" />
                  </svg>
                </span>
              </button>
            </div>

            <div className="sim-recovery-footer">
              <p className="sim-recovery-partner">
                Em parceria com <strong>Creditas</strong> — a maior plataforma de credito com garantia do Brasil
              </p>
              <button className="sim-quiz-reset-btn" onClick={handleReset}>
                Voltar ao inicio
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
