import { useState, useCallback, useRef, useEffect } from 'react'
import { WHATSAPP_NUMBER } from '../../utils/credito-clt/constants'
import { trackEvent, generateEventId } from '../../utils/metaPixel'
import { sendServerEvent } from '../../utils/metaCAPI'
import './Questionnaire.css'

const QUESTIONS = [
  {
    id: 'q1',
    text: 'Você trabalha de carteira assinada?',
    options: [
      { label: 'Sim', value: true },
      { label: 'Não', value: false },
    ],
    rejectOnFalse: true,
  },
  {
    id: 'q2',
    text: 'Você está empregado há mais de 3 meses?',
    options: [
      { label: 'Sim', value: true },
      { label: 'Não', value: false },
    ],
    rejectOnFalse: true,
  },
  {
    id: 'q3',
    text: 'A empresa onde você trabalha existe há mais de 2 anos?',
    options: [
      { label: 'Sim', value: true },
      { label: 'Não', value: false },
    ],
    rejectOnFalse: true,
  },
  {
    id: 'q4',
    text: 'Você já fez empréstimo consignado CLT antes?',
    options: [
      { label: 'Sim, já fiz', value: 'yes' },
      { label: 'Não, nunca fiz', value: 'no' },
    ],
    rejectOnFalse: false,
  },
  {
    id: 'q5',
    text: 'Você tem margem consignável disponível?',
    options: [
      { label: 'Sim, tenho margem', value: true },
      { label: 'Não tenho / Não sei', value: false },
    ],
    rejectOnFalse: 'margin',
  },
]

/**
 * Questionário interativo de pré-qualificação
 * Fluxo: 5 perguntas -> pré-aprovação -> input valor -> WhatsApp
 */
export default function Questionnaire() {
  const [screen, setScreen] = useState('intro') // intro, q0-q4, approved, rejected, rejected-margin
  const [questionIndex, setQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [value, setValue] = useState('')
  const [animDir, setAnimDir] = useState('right') // animation direction
  const sectionRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  // Intersection observer for entrance animation
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

  const startQuiz = useCallback(() => {
    setAnimDir('right')
    setScreen('question')
    setQuestionIndex(0)
    setAnswers({})
    setValue('')

    const eventId = generateEventId()
    trackEvent('InitiateCheckout', { content_name: 'Quiz Simulação CLT' }, eventId)
    sendServerEvent('InitiateCheckout', eventId)
  }, [])

  const handleAnswer = useCallback((questionId, answerValue) => {
    const newAnswers = { ...answers, [questionId]: answerValue }
    setAnswers(newAnswers)

    const question = QUESTIONS[questionIndex]

    // Check rejection
    if (question.rejectOnFalse === true && answerValue === false) {
      setAnimDir('right')
      setScreen('rejected')
      return
    }
    if (question.rejectOnFalse === 'margin' && answerValue === false) {
      setAnimDir('right')
      setScreen('rejected-margin')
      return
    }

    // Next question or approved
    if (questionIndex < QUESTIONS.length - 1) {
      setAnimDir('right')
      setQuestionIndex(questionIndex + 1)
    } else {
      setAnimDir('right')
      setScreen('approved')

      // Mostrar botão flutuante de WhatsApp
      window.dispatchEvent(new Event('quiz-completed'))

      // Meta Pixel + CAPI: Lead com valor para otimização por valor
      const eventId = generateEventId()
      trackEvent('Lead', {
        content_name: 'Quiz Simulação CLT - Pré-aprovado',
        value: 1,
        currency: 'BRL',
      }, eventId)
      sendServerEvent('Lead', eventId, {}, {
        value: 1,
        currency: 'BRL',
        content_name: 'quiz_pre_aprovado',
      })
    }
  }, [answers, questionIndex])

  const handleReset = useCallback(() => {
    setAnimDir('left')
    setScreen('intro')
    setQuestionIndex(0)
    setAnswers({})
    setValue('')
  }, [])

  const formatCurrency = useCallback((raw) => {
    const digits = raw.replace(/\D/g, '')
    if (!digits) return ''
    const number = parseInt(digits, 10) / 100
    return number.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })
  }, [])

  const handleValueChange = useCallback((e) => {
    const formatted = formatCurrency(e.target.value)
    setValue(formatted)
  }, [formatCurrency])

  const handleWhatsApp = useCallback(() => {
    const returning = answers.q4 === 'yes'
    const valueText = value || 'a definir'

    const profileParts = []
    if (returning) profileParts.push('Já fiz consignado CLT antes')
    else profileParts.push('Primeira vez fazendo consignado CLT')
    if (answers.q5 === true) profileParts.push('Tenho margem disponível')

    // Ler tag do utm_content para identificar criativo de origem
    const utmContent = new URLSearchParams(window.location.search).get('utm_content') || ''
    const tagPrefix = utmContent ? `(${utmContent}) ` : ''

    const message = encodeURIComponent(
      `${tagPrefix}Olá! Fui pré-aprovado na simulação de empréstimo consignado CLT.\n\nValor desejado: ${valueText}\n${profileParts.join('\n')}`
    )

    // Meta Pixel + CAPI: Contact (para conversão personalizada "Contato WhatsApp")
    const contactEventId = generateEventId()
    trackEvent('Contact', { content_name: 'Quiz Simulação CLT - WhatsApp', content_category: 'whatsapp' }, contactEventId)
    sendServerEvent('Contact', contactEventId, { page: 'Quiz Simulação CLT' })

    // Meta Pixel + CAPI: CompleteRegistration
    const parsedValue = parseFloat((value || '0').replace(/\D/g, '')) / 100
    const eventId = generateEventId()
    trackEvent('CompleteRegistration', {
      value: parsedValue,
      currency: 'BRL',
      content_name: 'Quiz Simulação CLT - WhatsApp',
    }, eventId)
    sendServerEvent('CompleteRegistration', eventId, {}, {
      value: parsedValue,
      currency: 'BRL',
    })

    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`,
      '_blank',
      'noopener,noreferrer'
    )
  }, [answers, value])

  const progress = screen === 'question'
    ? ((questionIndex + 1) / QUESTIONS.length) * 100
    : screen === 'approved'
      ? 100
      : 0

  return (
    <section
      id="questionario-clt"
      className={`sim-quiz ${isVisible ? 'sim-quiz--visible' : ''}`}
      ref={sectionRef}
    >
      <div className="sim-quiz-bg" aria-hidden="true" />

      <div className="sim-quiz-container">
        {/* Intro Screen */}
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
              Veja se você se qualifica
            </h2>
            <p className="sim-quiz-intro-text">
              Responda 5 perguntas rápidas e descubra se você pode contratar
              o empréstimo consignado CLT com as melhores condições.
            </p>
            <button
              className="sim-quiz-start-btn"
              onClick={startQuiz}
              aria-label="Iniciar questionário de pré-qualificação"
            >
              Começar simulação
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

        {/* Question Screen */}
        {screen === 'question' && (
          <div
            className={`sim-quiz-screen sim-quiz-question sim-anim-${animDir}`}
            key={`q-${questionIndex}`}
          >
            {/* Progress */}
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

            {/* Step dots */}
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

            {/* Help text for margin question */}
            {QUESTIONS[questionIndex].id === 'q5' && (
              <p className="sim-quiz-help">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                </svg>
                A margem consignável é a porcentagem do salário disponível
                para desconto. Consulte seu holerite ou RH.
              </p>
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
              Você foi pré-aprovado!
            </h3>
            <p className="sim-quiz-approved-text">
              Tudo certo! Você atende aos requisitos para a simulação do empréstimo consignado CLT.
            </p>

            <div className="sim-quiz-value-group">
              <label htmlFor="sim-valor" className="sim-quiz-value-label">
                Quanto você precisa?
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
              />
            </div>

            <button
              className="sim-quiz-whatsapp-btn"
              onClick={handleWhatsApp}
              aria-label="Continuar pelo WhatsApp"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              Continuar no WhatsApp
            </button>

            <span className="sim-quiz-approved-note">
              Você será atendido por um consultor especializado
            </span>
          </div>
        )}

        {/* Rejected Screen */}
        {screen === 'rejected' && (
          <div className="sim-quiz-screen sim-quiz-rejected" key="rejected">
            <div className="sim-quiz-rejected-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
                <line x1="9" y1="9" x2="9.01" y2="9" />
                <line x1="15" y1="9" x2="15.01" y2="9" />
              </svg>
            </div>
            <h3 className="sim-quiz-rejected-title">
              Poxa, que pena!
            </h3>
            <p className="sim-quiz-rejected-text">
              Infelizmente, você não atende aos requisitos para o empréstimo
              consignado CLT neste momento. Mas fique à vontade para voltar
              quando sua situação mudar!
            </p>
            <button className="sim-quiz-reset-btn" onClick={handleReset}>
              Voltar ao início
            </button>
          </div>
        )}

        {/* Rejected - No Margin Screen */}
        {screen === 'rejected-margin' && (
          <div className="sim-quiz-screen sim-quiz-rejected" key="rejected-margin">
            <div className="sim-quiz-rejected-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
                <line x1="9" y1="9" x2="9.01" y2="9" />
                <line x1="15" y1="9" x2="15.01" y2="9" />
              </svg>
            </div>
            <h3 className="sim-quiz-rejected-title">
              Poxa, que pena!
            </h3>
            <p className="sim-quiz-rejected-text">
              Sem margem consignável disponível não é possível contratar o
              empréstimo neste momento. Verifique com o RH da sua empresa
              ou no seu holerite.
            </p>
            <button className="sim-quiz-reset-btn" onClick={handleReset}>
              Voltar ao início
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
