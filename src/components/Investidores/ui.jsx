import { useInView, useCountUp } from './hooks'
import { MARGIN, fmtPct } from './data'

/** Small mono label that opens every block. */
export function Kicker({ children }) {
  return <p className="inv-kicker">{children}</p>
}

/**
 * The factual reading of an indicator — what the number says, not what we want
 * it to mean. This is a data panel, not a pitch: no persuasion here.
 */
export function Leitura({ children }) {
  return (
    <aside className="inv-leitura">
      <span className="inv-leitura-label">Leitura</span>
      <p>{children}</p>
    </aside>
  )
}

/** Provenance line under a chart. Every chart on this page carries one. */
export function SourceNote({ children }) {
  return <p className="inv-source">{children}</p>
}

/**
 * Stat tile. `tone="alert"` is reserved for the indicator that is off target
 * (the 3,7% approval rate) and always ships with a written label, never colour
 * alone.
 */
export function StatTile({
  value,
  prefix = '',
  suffix = '',
  decimals = 0,
  label,
  note,
  tone = 'default',
}) {
  const [ref, inView] = useInView()
  const animated = useCountUp(value, inView)

  const display = animated.toLocaleString('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })

  return (
    <div ref={ref} className={`inv-tile inv-tile--${tone}`}>
      <p className="inv-tile-value">
        {prefix && <span className="inv-tile-affix">{prefix}</span>}
        {display}
        {suffix && <span className="inv-tile-affix">{suffix}</span>}
      </p>
      <p className="inv-tile-label">{label}</p>
      {note && <p className="inv-tile-note">{note}</p>}
    </div>
  )
}

/** A titled group of tiles — the unit the scoreboard is built from. */
export function TileGroup({ title, unit, children }) {
  return (
    <section className="inv-group">
      <header className="inv-group-head">
        <h3>{title}</h3>
        {unit && <span className="inv-chart-unit">{unit}</span>}
      </header>
      <div className="inv-group-grid">{children}</div>
    </section>
  )
}

/**
 * Approval-rate bar: 3,7% of CLT simulations come back with a balance, 96,3% do
 * not. The dashed marker is the operation's own historical rate (8,3%) — the
 * only reference point on the chart, because it is the only one the data has.
 * Nothing here is projected.
 */
export function MargemBar() {
  const [ref, inView] = useInView()

  const vars = {
    '--rate': `${MARGIN.currentRate}%`,
    '--target': `${MARGIN.historicalRate}%`,
  }

  return (
    <figure ref={ref} className={`inv-margem ${inView ? 'is-visible' : ''}`} style={vars}>
      <div className="inv-margem-scale" aria-hidden="true">
        <span>0%</span>
        <span>100%</span>
      </div>

      <div className="inv-margem-track">
        <div className="inv-margem-fill" />
        <div className="inv-margem-void" />

        <div className="inv-margem-marker" style={{ left: `${MARGIN.historicalRate}%` }}>
          <span className="inv-margem-marker-label">
            Média histórica <strong>{fmtPct(MARGIN.historicalRate)}</strong>
          </span>
        </div>
      </div>

      <figcaption className="inv-margem-legend">
        <span className="inv-legend-item">
          <i className="inv-swatch inv-swatch--fill" aria-hidden="true" />
          Simulações com saldo — <strong>{fmtPct(MARGIN.currentRate)}</strong>
        </span>
        <span className="inv-legend-item">
          <i className="inv-swatch inv-swatch--void" aria-hidden="true" />
          Voltam sem saldo / sem margem — <strong>{fmtPct(MARGIN.noBalancePct)}</strong>
        </span>
      </figcaption>
    </figure>
  )
}
