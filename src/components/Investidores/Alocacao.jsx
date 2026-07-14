import { Kicker, Leitura, SourceNote } from './ui'
import { useInView } from './hooks'
import { ALLOCATION, KPIS, MARGIN, fmtBRL } from './data'

/**
 * Allocation — the answer to the silent question ("what do you do with the
 * cheque?") and the proof that the discipline of Claim 03 survives new money.
 *
 * The FGTS floor segment is drawn at EXACTLY the same height in both phases.
 * That constancy is the whole argument, made without a line of copy: the R$
 * 80/day floor does not move when capital arrives.
 */

const { phase1, phase2, gate } = ALLOCATION

/** Pixel height of the tallest phase. Every segment is scaled against it. */
const PLOT_H = 340

/**
 * Heights are computed in PIXELS against the SAME denominator (the larger
 * phase's total), never as a percentage of each phase's own total. That is what
 * makes the R$ 80/day FGTS floor render at exactly the same height in both
 * phases — the constancy is the argument, and a per-phase percentage would
 * silently destroy it.
 */
function PhaseBar({ phase, max }) {
  return (
    <div className="inv-phase">
      <div className="inv-phase-stack" style={{ '--h': `${(phase.total / max) * PLOT_H}px` }}>
        {phase.lines.map((line) => (
          <div
            key={line.name}
            className={`inv-phase-seg inv-phase-seg--${line.kind}`}
            style={{ '--seg': `${(line.value / max) * PLOT_H}px` }}
            title={`${line.name}: ${fmtBRL(line.value)}/dia`}
          >
            <span className="inv-phase-seg-label">
              <span className="inv-phase-seg-name">{line.name}</span>
              <span className="inv-phase-seg-value">{fmtBRL(line.value)}/dia</span>
            </span>
          </div>
        ))}
      </div>

      <div className="inv-phase-foot">
        <span className="inv-phase-total">≈ {fmtBRL(phase.total)}/dia</span>
        <span className="inv-phase-name">{phase.label}</span>
      </div>
    </div>
  )
}

export default function Alocacao() {
  const [ref, inView] = useInView()
  const max = Math.max(phase1.total, phase2.total)

  return (
    <section className="inv-section inv-alocacao" id="alocacao" ref={ref}>
      <div className="inv-container">
        <Kicker>Indicador 04 · Alocação de mídia</Kicker>
        <h2 className="inv-h2">
          Investimento diário, <span className="inv-hl">por fase e por gatilho.</span>
        </h2>

        <figure className={`inv-phases ${inView ? 'is-visible' : ''}`}>
          <figcaption className="inv-chart-unit inv-phases-caption">
            Investimento diário em mídia · R$/dia · escala real
          </figcaption>

          <div className="inv-phases-plot">
            <PhaseBar phase={phase1} max={max} />

            <div className="inv-gate">
              <span className="inv-gate-post" aria-hidden="true" />
              <span className="inv-gate-label">{gate}</span>
              <span className="inv-gate-back" aria-hidden="true">
                <svg width="100%" height="24" viewBox="0 0 120 24" fill="none" aria-hidden="true">
                  <path
                    d="M112 12 H12"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                  />
                  <path
                    d="M18 6 L10 12 L18 18"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>Se o sinal não vier na janela, o orçamento volta sozinho ao piso.</span>
              </span>
            </div>

            <PhaseBar phase={phase2} max={max} />
          </div>
        </figure>

        <p className="inv-phases-note">
          O segmento do FGTS tem <strong>a mesma altura nas duas fases</strong>: R$ 80/dia,
          inalterado. Só o CLT escala.
        </p>
        <SourceNote>
          Alturas em escala real contra o mesmo denominador. Gatilhos avaliados em janelas de
          48–72h, com re-pausa automática — sem decisão discricionária no meio do caminho.
        </SourceNote>

        <div className="inv-cockpit">
          <h3 className="inv-sub-h3">Os 7 KPIs monitorados diariamente</h3>
          <ul>
            {KPIS.map((k, i) => (
              <li key={k.name} className={k.hero ? 'is-hero' : ''}>
                <span className="inv-cockpit-n" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="inv-cockpit-name">{k.name}</span>
                <span className="inv-cockpit-target">{k.target}</span>
                {k.hero && (
                  <span className="inv-cockpit-progress" aria-hidden="true">
                    <span
                      className="inv-cockpit-progress-fill"
                      style={{ width: `${(MARGIN.currentRate / MARGIN.historicalRate) * 100}%` }}
                    />
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>

        <Leitura>
          A operação roda hoje a ~R$ 140/dia e sobe para ~R$ 330/dia apenas se o gatilho confirmar
          a volta do saldo do CLT em 48–72h; se não confirmar, o orçamento volta sozinho ao piso. O
          FGTS permanece em R$ 80/dia nas duas fases — <strong>o que escala é o CLT</strong>. Os 7
          KPIs abaixo são a instrumentação que aciona esse gatilho.
        </Leitura>
      </div>
    </section>
  )
}
