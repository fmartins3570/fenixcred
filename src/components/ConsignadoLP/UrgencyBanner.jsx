import { useState, useEffect } from 'react'
import './UrgencyBanner.css'

const DEADLINE = new Date('2026-10-31T23:59:59')

function getDaysRemaining() {
  const now = new Date()
  const diff = DEADLINE - now
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

export default function UrgencyBanner() {
  const [days, setDays] = useState(getDaysRemaining)

  useEffect(() => {
    const timer = setInterval(() => setDays(getDaysRemaining()), 60000)
    return () => clearInterval(timer)
  }, [])

  if (days <= 0) return null

  return (
    <div className="urgency-banner" role="alert">
      <div className="urgency-banner-container">
        <div className="urgency-banner-icon" aria-hidden="true">⏳</div>
        <div className="urgency-banner-content">
          <p className="urgency-banner-headline">
            <strong>Até 31 de outubro:</strong> antecipe até <strong>5 anos</strong> do Saque-Aniversário
          </p>
          <p className="urgency-banner-sub">
            Depois, cai para 3 anos. Faltam <strong className="urgency-banner-days">{days} dias</strong>.
          </p>
        </div>
      </div>
    </div>
  )
}
