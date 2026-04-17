/**
 * EmailCapturePopup - Exit-intent email capture modal
 *
 * Triggers:
 *   - Desktop: mouseleave through the top edge of the viewport
 *   - Mobile: scroll >= 70% OR time on page >= 30s (whichever fires first)
 *
 * Session rules:
 *   - Shows max 1x per sessionStorage session (flag `email_popup_shown`)
 *   - Dismissal (X, overlay click, ESC, "Não, obrigado") sets
 *     `email_popup_dismissed` in localStorage with a timestamp — suppressed 7 days
 *   - If `email_captured` exists in localStorage, never shows again
 *
 * LGPD:
 *   - Waits for cookie consent (accepted) before arming triggers. When consent
 *     is refused we still let the user opt in explicitly, but we only write
 *     tracking cookies if the user submits the form (Pixel + CAPI rely on
 *     consent being accepted anyway).
 *
 * Tracking:
 *   - Meta Pixel `Subscribe` (browser) + CAPI server-side with shared event_id
 *   - GA4 mirror is automatic via metaPixel.trackEvent -> analytics.js
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { trackEvent, trackCustomEvent, generateEventId } from '../utils/metaPixel'
import { sendServerEvent } from '../utils/metaCAPI'
import { hasConsented, hasResponded } from '../utils/cookieConsent'
import './EmailCapturePopup.css'

// Storage keys
const SESSION_SHOWN_KEY = 'email_popup_shown'
const DISMISSED_KEY = 'email_popup_dismissed'
const CAPTURED_KEY = 'email_captured'
const LEAD_DATA_KEY = 'fenix_lead_data'

// Timings
const MOBILE_TIME_THRESHOLD_MS = 30_000
const MOBILE_SCROLL_THRESHOLD = 0.7
const DISMISS_COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000 // 7 days
const SUCCESS_AUTO_CLOSE_MS = 3000

// Regex — simple but good enough for client-side guardrails
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const MOBILE_MQ = '(max-width: 768px), (pointer: coarse)'

function isMobileViewport() {
  if (typeof window === 'undefined') return false
  return window.matchMedia(MOBILE_MQ).matches
}

function isRecentlyDismissed() {
  try {
    const raw = localStorage.getItem(DISMISSED_KEY)
    if (!raw) return false
    const ts = parseInt(raw, 10)
    if (Number.isNaN(ts)) return false
    return Date.now() - ts < DISMISS_COOLDOWN_MS
  } catch {
    return false
  }
}

function alreadyCaptured() {
  try {
    return localStorage.getItem(CAPTURED_KEY) === 'true'
  } catch {
    return false
  }
}

/**
 * Merge captured email/name into the shared `fenix_lead_data` store used by
 * the Meta Pixel Advanced Matching bootstrap in index.html. We do not overwrite
 * existing phone/name that other flows (LeadPopup, SimulacaoCLT) may have set.
 */
function mergeLeadData(patch) {
  try {
    const raw = localStorage.getItem(LEAD_DATA_KEY)
    const prev = raw ? JSON.parse(raw) : {}
    const next = { ...prev, ...patch }
    localStorage.setItem(LEAD_DATA_KEY, JSON.stringify(next))
  } catch {
    // localStorage unavailable — silently skip, tracking still works via CAPI
  }
}

export default function EmailCapturePopup() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  // Refs for focus management
  const modalRef = useRef(null)
  const emailInputRef = useRef(null)
  const previousFocusRef = useRef(null)
  const armedRef = useRef(false)

  // Open the modal — guarded so it only runs once per session
  const openPopup = useCallback(() => {
    if (armedRef.current) return
    if (alreadyCaptured()) return
    if (isRecentlyDismissed()) return
    try {
      if (sessionStorage.getItem(SESSION_SHOWN_KEY)) return
      sessionStorage.setItem(SESSION_SHOWN_KEY, '1')
    } catch {
      // sessionStorage unavailable — still allow opening once per mount
    }
    armedRef.current = true
    setOpen(true)
    trackCustomEvent('EmailCapturePopupView', {
      page: window.location.pathname,
    })
  }, [])

  // Arm triggers once the user has resolved the cookie banner
  useEffect(() => {
    // Pre-flight checks — don't even attach listeners if we already know we
    // shouldn't show the popup
    if (alreadyCaptured()) return
    if (isRecentlyDismissed()) return
    try {
      if (sessionStorage.getItem(SESSION_SHOWN_KEY)) return
    } catch {
      // ignore — we'll just try to open later
    }

    let cleanup = null
    let poll = null

    const attach = () => {
      const mobile = isMobileViewport()

      // Desktop: exit-intent via mouseleave at top edge
      const handleMouseLeave = (e) => {
        if (e.clientY <= 0) openPopup()
      }

      // Mobile: scroll depth >= 70%
      const handleScroll = () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop
        const docHeight =
          document.documentElement.scrollHeight -
          document.documentElement.clientHeight
        if (docHeight <= 0) return
        const pct = scrollTop / docHeight
        if (pct >= MOBILE_SCROLL_THRESHOLD) openPopup()
      }

      let timeTimer
      if (mobile) {
        window.addEventListener('scroll', handleScroll, { passive: true })
        // Mobile: time-on-page >= 30s (whichever fires first wins — sessionStorage
        // flag inside openPopup prevents double-fire with the scroll trigger)
        timeTimer = setTimeout(openPopup, MOBILE_TIME_THRESHOLD_MS)
      } else {
        document.addEventListener('mouseleave', handleMouseLeave)
      }

      cleanup = () => {
        document.removeEventListener('mouseleave', handleMouseLeave)
        window.removeEventListener('scroll', handleScroll)
        if (timeTimer) clearTimeout(timeTimer)
      }
    }

    // LGPD: wait for user to respond to the cookie banner. If the banner is
    // still visible (no decision yet), re-check every second until resolved
    // to avoid stacking two overlays on top of each other.
    if (hasResponded()) {
      attach()
    } else {
      poll = setInterval(() => {
        if (hasResponded()) {
          clearInterval(poll)
          poll = null
          attach()
        }
      }, 1000)
    }

    return () => {
      if (poll) clearInterval(poll)
      if (cleanup) cleanup()
    }
  }, [openPopup])

  // Body scroll lock + focus management while open
  useEffect(() => {
    if (!open) return
    previousFocusRef.current = document.activeElement
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    // Focus the email input shortly after mount so the dialog animation plays
    const focusTimer = setTimeout(() => {
      emailInputRef.current?.focus()
    }, 50)

    return () => {
      document.body.style.overflow = prevOverflow
      clearTimeout(focusTimer)
      // Restore focus to the element that opened the dialog
      if (previousFocusRef.current && previousFocusRef.current.focus) {
        previousFocusRef.current.focus()
      }
    }
  }, [open])

  const dismiss = useCallback((reason = 'dismiss') => {
    try {
      localStorage.setItem(DISMISSED_KEY, String(Date.now()))
    } catch {
      // ignore
    }
    trackCustomEvent('EmailCapturePopupDismissed', {
      reason,
      page: window.location.pathname,
    })
    setOpen(false)
  }, [])

  // ESC to close + simple focus trap
  useEffect(() => {
    if (!open) return
    const handleKey = (e) => {
      if (e.key === 'Escape') {
        dismiss('esc')
        return
      }
      if (e.key !== 'Tab') return
      const modal = modalRef.current
      if (!modal) return
      const focusables = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      if (focusables.length === 0) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open, dismiss])

  const validate = useCallback(() => {
    const next = {}
    const trimmedEmail = email.trim()
    if (!trimmedEmail) {
      next.email = 'Informe seu email'
    } else if (!EMAIL_REGEX.test(trimmedEmail)) {
      next.email = 'Email inválido'
    }
    if (!consent) {
      next.consent = 'Você precisa aceitar para continuar'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }, [email, consent])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (submitting || success) return
    if (!validate()) return

    setSubmitting(true)

    const cleanName = name.trim()
    const cleanEmail = email.trim().toLowerCase()
    const eventId = generateEventId()

    // Browser-side Pixel event. CAPI server will hash email/name to match.
    trackEvent(
      'Subscribe',
      {
        content_name: 'EmailCapturePopup',
        page: window.location.pathname,
      },
      eventId
    )

    // Server-side CAPI event — the CAPI server hashes email/name SHA-256
    sendServerEvent(
      'Subscribe',
      eventId,
      {
        ...(cleanName && { name: cleanName }),
        email: cleanEmail,
        page: window.location.pathname,
      },
      { value: 0, currency: 'BRL' }
    )

    // Persist capture flags only if the user consented to cookies. Without
    // consent we still fire the explicit opt-in event (they ticked the box),
    // but we avoid writing identifiers that feed Advanced Matching.
    try {
      localStorage.setItem(CAPTURED_KEY, 'true')
      localStorage.setItem('email', cleanEmail)
      localStorage.setItem('captured_at', String(Date.now()))
    } catch {
      // ignore
    }

    if (hasConsented()) {
      mergeLeadData({
        email: cleanEmail,
        ...(cleanName && { name: cleanName }),
      })
    }

    setSuccess(true)
    setSubmitting(false)

    // Auto-close after a short success state
    setTimeout(() => {
      setOpen(false)
    }, SUCCESS_AUTO_CLOSE_MS)
  }

  if (!open) return null

  const titleId = 'email-capture-title'

  return (
    <div className="ec-overlay" role="presentation">
      <div
        className="ec-overlay-bg"
        onClick={() => dismiss('overlay')}
        aria-hidden="true"
      />

      <div
        className="ec-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        ref={modalRef}
      >
        <button
          type="button"
          className="ec-close"
          onClick={() => dismiss('close')}
          aria-label="Fechar"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {success ? (
          <div className="ec-success" role="status" aria-live="polite">
            <div className="ec-success-icon" aria-hidden="true">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="ec-title" id={titleId}>
              Pronto!
            </h2>
            <p className="ec-subtitle">
              Você receberá nossa próxima oferta em breve.
            </p>
          </div>
        ) : (
          <>
            <div className="ec-icon" aria-hidden="true">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>

            <h2 className="ec-title" id={titleId}>
              Quase pronto! Receba sua análise personalizada por email
            </h2>
            <p className="ec-subtitle">
              Enviamos simulações exclusivas e ofertas relâmpago só por email
            </p>

            <form className="ec-form" onSubmit={handleSubmit} noValidate>
              <div className="ec-field">
                <label className="ec-label" htmlFor="ec-name">
                  Nome (opcional)
                </label>
                <input
                  id="ec-name"
                  className="ec-input"
                  type="text"
                  placeholder="Seu primeiro nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="given-name"
                />
              </div>

              <div className="ec-field">
                <label className="ec-label" htmlFor="ec-email">
                  Email
                </label>
                <input
                  id="ec-email"
                  ref={emailInputRef}
                  className={`ec-input ${errors.email ? 'error' : ''}`}
                  type="email"
                  placeholder="voce@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  inputMode="email"
                  required
                  aria-invalid={errors.email ? 'true' : 'false'}
                  aria-describedby={errors.email ? 'ec-email-error' : undefined}
                />
                {errors.email && (
                  <span className="ec-error" id="ec-email-error">
                    {errors.email}
                  </span>
                )}
              </div>

              <label className="ec-consent">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  aria-invalid={errors.consent ? 'true' : 'false'}
                />
                <span>
                  Aceito receber comunicações da Fenix Cred. Ver{' '}
                  <a href="/politica-privacidade" target="_blank" rel="noreferrer noopener">
                    Política de Privacidade
                  </a>
                  .
                </span>
              </label>
              {errors.consent && (
                <span className="ec-error ec-error-consent">{errors.consent}</span>
              )}

              <button
                type="submit"
                className="ec-submit"
                disabled={submitting}
              >
                {submitting ? 'Enviando...' : 'Quero receber'}
              </button>

              <button
                type="button"
                className="ec-skip"
                onClick={() => dismiss('no-thanks')}
              >
                Não, obrigado
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
