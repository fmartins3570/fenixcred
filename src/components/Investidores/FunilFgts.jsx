import { Kicker, Leitura, SourceNote } from './ui'
import { useInView } from './hooks'
import { FGTS_7D, FGTS_DAILY, fmtBRLCents, fmtInt } from './data'

/**
 * FGTS funnel, 7 days — and the time series that qualifies the 1,63x ROAS.
 *
 * The ROAS tile in the scoreboard is only honest next to this chart: every one
 * of the 9 sales lands inside the CLT outage window. Reporting the return
 * without the window would be reporting a number we know does not repeat.
 */

const WATERFALL = [
  { label: 'Comissão (40%)', value: FGTS_7D.commission, kind: 'in' },
  { label: 'Mídia Meta', value: -FGTS_7D.spend, kind: 'out' },
  { label: 'Líquido', value: FGTS_7D.net, kind: 'net' },
]

export default function FunilFgts() {
  const [ref, inView] = useInView()

  const maxSales = Math.max(...FGTS_DAILY.map((d) => d.sales))
  const totalCols = FGTS_DAILY.reduce((sum, d) => sum + d.span, 0)
  const maxFlow = Math.max(...WATERFALL.map((w) => Math.abs(w.value)))

  return (
    <section className="inv-section inv-funil" id="funil" ref={ref}>
      <div className="inv-container">
        <Kicker>Indicador 02 · Funil FGTS · 21 a 27/jun</Kicker>
        <h2 className="inv-h2">
          O retorno do FGTS <span className="inv-hl">e a janela que o produziu.</span>
        </h2>

        <div className="inv-funil-top">
          <dl className="inv-facts">
            <div>
              <dt>Leads</dt>
              <dd>{fmtInt(FGTS_7D.leads)}</dd>
            </div>
            <div>
              <dt>Propostas pagas</dt>
              <dd>{FGTS_7D.paid}</dd>
            </div>
            <div>
              <dt>Conversão lead → pago</dt>
              <dd className="inv-facts-bad">0,4%</dd>
            </div>
            <div>
              <dt>Ticket médio</dt>
              <dd>{fmtBRLCents(FGTS_7D.avgTicket)}</dd>
            </div>
            <div>
              <dt>Banco</dt>
              <dd>{FGTS_7D.bank}</dd>
            </div>
            <div>
              <dt>ROAS sobre comissão</dt>
              <dd>1,63x</dd>
            </div>
          </dl>

          <figure className="inv-waterfall">
            <figcaption>
              <span className="inv-chart-title">A conta dos 7 dias</span>
              <span className="inv-chart-unit">R$ · 21 a 27/jun</span>
            </figcaption>
            {WATERFALL.map((w) => (
              <div key={w.label} className="inv-waterfall-row">
                <span className="inv-waterfall-label">{w.label}</span>
                <div className="inv-waterfall-track">
                  <div
                    className={`inv-waterfall-bar inv-waterfall-bar--${w.kind}`}
                    style={{ '--w': `${(Math.abs(w.value) / maxFlow) * 100}%` }}
                  />
                </div>
                <span className={`inv-waterfall-value inv-waterfall-value--${w.kind}`}>
                  {w.value < 0 ? '−' : '+'}
                  {fmtBRLCents(Math.abs(w.value))}
                </span>
              </div>
            ))}
          </figure>
        </div>

        <figure className={`inv-outage ${inView ? 'is-visible' : ''}`}>
          <figcaption className="inv-outage-head">
            <span className="inv-chart-title">Vendas de FGTS por dia</span>
            <span className="inv-chart-unit">21 a 27/jun · dashboard VendeAI</span>
          </figcaption>

          <div className="inv-outage-plot" style={{ '--cols': totalCols }}>
            {FGTS_DAILY.map((d) => (
              <div
                key={d.day}
                className={`inv-outage-col ${d.outage ? 'is-outage' : ''}`}
                style={{ '--span': d.span }}
              >
                <div className="inv-outage-bar-area">
                  {d.sales > 0 ? (
                    <div
                      className="inv-outage-bar"
                      style={{ '--h': `${(d.sales / maxSales) * 100}%` }}
                    >
                      <span className="inv-outage-value">{d.sales} vendas</span>
                    </div>
                  ) : (
                    <div className="inv-outage-ghost">
                      <span className="inv-outage-zero">0</span>
                    </div>
                  )}
                </div>
                <span className="inv-outage-day">{d.day}/jun</span>
              </div>
            ))}

            <div className="inv-outage-band" aria-hidden="true">
              <span>Outage do CLT</span>
            </div>
          </div>

          <p className="inv-outage-annotation">
            <span className="inv-outage-annotation-mark" aria-hidden="true" />
            Dentro da faixa, o bot rerroteia CLT → FGTS. Fora dela, de 24 a 27/jun, o CLT volta e o
            FGTS zera.
          </p>
        </figure>
        <SourceNote>
          A fonte registra 9 vendas, todas em 22–23/jun, sem quebra por dia — por isso os dois dias
          aparecem como bloco único de 9, e não como um split inventado. Dias sem venda são
          desenhados como barra-fantasma para que o vazio seja visível, não ausente.
        </SourceNote>

        <Leitura>
          As 9 vendas ocorreram todas em 22–23/jun, dentro da janela de outage do CLT, quando o bot
          reroteava CLT → FGTS. De 24 a 27/jun: zero. Portanto o{' '}
          <strong>ROAS de 1,63x é de janela de fallback</strong> — não é performance replicável, e
          a conversão direta de 0,4% indica que orçamento adicional compraria leads que
          majoritariamente não fecham. Hoje o FGTS opera como piso de R$ 80/dia.
        </Leitura>
      </div>
    </section>
  )
}
