import { useEffect, useState } from 'react'
import Logo from '../Logo'
import Scoreboard from './Scoreboard'
import Metodologia from './Metodologia'
import Producao from './Producao'
import FunilFgts from './FunilFgts'
import Margem from './Margem'
import Alocacao from './Alocacao'
import Riscos from './Riscos'
import Rodape from './Rodape'
import './Investidores.css'

/**
 * Investor data panel — /investidores
 *
 * A presentation of indicators, not a pitch. Each block is: the numbers, the
 * chart, the source, and a factual reading of what the number says. No thesis,
 * no persuasion, no forecast.
 *
 * Deliberately NOT a marketing landing page:
 * - noindex/nofollow, and kept out of the sitemap. Material for a named
 *   audience, not for search.
 * - no lead capture, no cookie banner, and no tracking: main.jsx skips Pixel,
 *   GA4 and the CAPI PageView on this route, so investor traffic never enters
 *   the dataset the page reports on.
 */

const RAIL = [
  { id: 'scoreboard', label: 'Painel' },
  { id: 'metodologia', label: 'Como medimos' },
  { id: 'producao', label: '01 · Originação' },
  { id: 'funil', label: '02 · Funil FGTS' },
  { id: 'margem', label: '03 · Margem' },
  { id: 'alocacao', label: '04 · Alocação' },
  { id: 'riscos', label: 'Riscos' },
  { id: 'fontes', label: 'Fontes' },
]

function ProgressRail() {
  const [active, setActive] = useState('')

  useEffect(() => {
    const sections = RAIL.map((r) => document.getElementById(r.id)).filter(Boolean)
    if (!sections.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActive(visible.target.id)
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    )

    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  return (
    <nav className="inv-rail" aria-label="Índice dos indicadores">
      <ol>
        {RAIL.map((r) => (
          <li key={r.id} className={active === r.id ? 'is-active' : ''}>
            <a href={`#${r.id}`}>
              <span className="inv-rail-dot" aria-hidden="true" />
              <span className="inv-rail-label">{r.label}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}

export default function Investidores() {
  useEffect(() => {
    const previousTitle = document.title
    document.title = 'Fenix Cred — Indicadores da operação'

    const setMeta = (attr, key, content) => {
      let tag = document.querySelector(`meta[${attr}="${key}"]`)
      const created = !tag
      if (!tag) {
        tag = document.createElement('meta')
        tag.setAttribute(attr, key)
        document.head.appendChild(tag)
      }
      const previous = tag.getAttribute('content')
      tag.setAttribute('content', content)
      return { tag, previous, created }
    }

    // Investor material: keep it out of the index.
    const robots = setMeta('name', 'robots', 'noindex, nofollow')
    const description = setMeta(
      'name',
      'description',
      'Fenix Cred — indicadores da operação de crédito CLT e FGTS. Dados primários, referência jun/2026.'
    )

    return () => {
      document.title = previousTitle
      for (const m of [robots, description]) {
        if (m.created) m.tag.remove()
        else if (m.previous !== null) m.tag.setAttribute('content', m.previous)
      }
    }
  }, [])

  return (
    <div className="inv-page">
      <header className="inv-header">
        <div className="inv-container inv-header-inner">
          <a href="/" className="inv-header-logo" aria-label="Fenix Cred — página inicial">
            <Logo size="small" />
          </a>
          <span className="inv-header-tag">Indicadores da operação · ref. jun/2026</span>
          <a href="#fontes" className="inv-header-cta">
            Fontes
          </a>
        </div>
      </header>

      <ProgressRail />

      <main>
        <Scoreboard />
        <Metodologia />
        <Producao />
        <FunilFgts />
        <Margem />
        <Alocacao />
        <Riscos />
        <Rodape />
      </main>
    </div>
  )
}
