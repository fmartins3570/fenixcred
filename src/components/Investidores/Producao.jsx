import { Kicker, Leitura, SourceNote } from './ui'
import { useInView } from './hooks'
import { PRODUCTS, MULTIPLES, fmtBRL, fmtBRLCents, fmtInt } from './data'

/**
 * CLT vs FGTS, 30 days.
 *
 * Chart note: the "paradox" panel is TWO charts sharing a mirrored centre line,
 * each with its own unit and its own scale — deliberately NOT a dual-axis plot,
 * which would invent a correlation the data does not contain.
 */

const { clt, fgts } = PRODUCTS

const ROWS = [
  {
    label: 'Comissão por proposta',
    unit: 'R$',
    clt: clt.commissionPerProposal,
    fgts: fgts.commissionPerProposal,
    fmt: fmtBRLCents,
    note: 'Única linha em que o FGTS lidera.',
  },
  {
    label: 'Propostas com saldo',
    unit: '30 dias',
    clt: clt.proposals,
    fgts: fgts.proposals,
    fmt: fmtInt,
  },
  { label: 'Ticket médio', unit: 'R$', clt: clt.avgTicket, fgts: fgts.avgTicket, fmt: fmtBRL },
  { label: 'Valor ofertado', unit: '30 dias', clt: clt.offered, fgts: fgts.offered, fmt: fmtBRL },
]

function Legend() {
  return (
    <div className="inv-legend">
      <span className="inv-legend-item">
        <i className="inv-swatch inv-swatch--clt" aria-hidden="true" />
        Crédito CLT · comissão 2,5%
      </span>
      <span className="inv-legend-item">
        <i className="inv-swatch inv-swatch--fgts" aria-hidden="true" />
        Antecipação FGTS · comissão 40%
      </span>
    </div>
  )
}

export default function Producao() {
  const [ref, inView] = useInView()

  const maxPct = Math.max(clt.commissionPct, fgts.commissionPct)
  const maxPool = Math.max(clt.commissionPool, fgts.commissionPool)

  return (
    <section className="inv-section inv-producao" id="producao" ref={ref}>
      <div className="inv-container">
        <Kicker>Indicador 01 · Originação por produto · 30 dias</Kicker>
        <h2 className="inv-h2">
          Percentual de comissão <span className="inv-hl">× dinheiro gerado.</span>
        </h2>

        <Legend />

        {/* Values sit OUTSIDE the bars: the 2,5% bar is a sliver and a label
            inside it would be unreadable. */}
        <div className={`inv-paradoxo ${inView ? 'is-visible' : ''}`}>
          <figure className="inv-paradoxo-panel inv-paradoxo-panel--left">
            <figcaption>
              <span className="inv-chart-title">Percentual de comissão</span>
              <span className="inv-chart-unit">% sobre o valor liberado</span>
            </figcaption>

            <div className="inv-mirror-row">
              <span className="inv-mirror-value">40%</span>
              <div className="inv-mirror-track">
                <div
                  className="inv-mirror-bar inv-mirror-bar--muted"
                  style={{ '--w': `${(fgts.commissionPct / maxPct) * 100}%` }}
                />
              </div>
              <span className="inv-mirror-name">FGTS</span>
            </div>

            <div className="inv-mirror-row">
              <span className="inv-mirror-value">2,5%</span>
              <div className="inv-mirror-track">
                <div
                  className="inv-mirror-bar inv-mirror-bar--muted"
                  style={{ '--w': `${(clt.commissionPct / maxPct) * 100}%` }}
                />
              </div>
              <span className="inv-mirror-name">CLT</span>
            </div>
          </figure>

          <div className="inv-paradoxo-axis" aria-hidden="true" />

          <figure className="inv-paradoxo-panel inv-paradoxo-panel--right">
            <figcaption>
              <span className="inv-chart-title">Pool de comissão gerado</span>
              <span className="inv-chart-unit">30 dias · R$</span>
            </figcaption>

            <div className="inv-mirror-row">
              <span className="inv-mirror-name">FGTS</span>
              <div className="inv-mirror-track">
                <div
                  className="inv-mirror-bar inv-mirror-bar--fgts"
                  style={{ '--w': `${(fgts.commissionPool / maxPool) * 100}%` }}
                />
              </div>
              <span className="inv-mirror-value">{fmtBRL(fgts.commissionPool)}</span>
            </div>

            <div className="inv-mirror-row">
              <span className="inv-mirror-name">CLT</span>
              <div className="inv-mirror-track">
                <div
                  className="inv-mirror-bar inv-mirror-bar--clt"
                  style={{ '--w': `${(clt.commissionPool / maxPool) * 100}%` }}
                />
              </div>
              <span className="inv-mirror-value">{fmtBRL(clt.commissionPool)}</span>
            </div>
          </figure>
        </div>

        <SourceNote>
          Duas escalas distintas, dois gráficos distintos: percentual e valor não compartilham
          eixo. Fonte: CAPI leads.db, tabela proposals · 30 dias · ref. jun/2026.
        </SourceNote>

        <div className={`inv-compare ${inView ? 'is-visible' : ''}`}>
          {ROWS.map((row) => {
            const max = Math.max(row.clt, row.fgts)
            return (
              <div key={row.label} className="inv-compare-row">
                <div className="inv-compare-head">
                  <h3>{row.label}</h3>
                  <span className="inv-chart-unit">{row.unit}</span>
                  {row.note && <span className="inv-compare-note">{row.note}</span>}
                </div>

                <div className="inv-compare-bars">
                  <div className="inv-bar-line">
                    <span className="inv-bar-name">CLT</span>
                    <div className="inv-bar-track">
                      <div
                        className="inv-bar inv-bar--clt"
                        style={{ '--w': `${(row.clt / max) * 100}%` }}
                      />
                    </div>
                    <span className="inv-bar-value">{row.fmt(row.clt)}</span>
                  </div>

                  <div className="inv-bar-line">
                    <span className="inv-bar-name">FGTS</span>
                    <div className="inv-bar-track">
                      <div
                        className="inv-bar inv-bar--fgts"
                        style={{ '--w': `${(row.fgts / max) * 100}%` }}
                      />
                    </div>
                    <span className="inv-bar-value">{row.fmt(row.fgts)}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        <SourceNote>
          Barras em escala real, eixo em zero, sem truncamento. Fonte: CAPI leads.db · 30 dias ·
          ref. jun/2026.
        </SourceNote>

        <div className="inv-multiples">
          {MULTIPLES.map((m) => (
            <div key={m.value} className="inv-multiple">
              <span className="inv-multiple-value">{m.value}</span>
              <span className="inv-multiple-label">{m.label}</span>
            </div>
          ))}
        </div>

        <Leitura>
          O FGTS lidera em comissão por proposta ({fmtBRLCents(fgts.commissionPerProposal)} contra{' '}
          {fmtBRLCents(clt.commissionPerProposal)}), mas o CLT monta 5,4x mais propostas com um
          ticket 13x maior. O pool de comissão do CLT fica 4,4x acima do FGTS. Num negócio de
          comissão, o resultado é <strong>nº de fechamentos × ticket × %</strong> — o percentual
          isolado não ordena os produtos.
        </Leitura>
      </div>
    </section>
  )
}
