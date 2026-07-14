import { Kicker, Leitura, SourceNote, StatTile } from './ui'
import { useInView } from './hooks'
import { HISTORY, INVESTMENT, TRACKING_START, fmtBRL, fmtBRLCents, fmtInt } from './data'

/**
 * The operation, month by month.
 *
 * Two charts, never one. Spend is in reais and sales are a count: putting them
 * on a single plot with two y-scales would invent a correlation the data does
 * not contain. They share the same x categories and sit one above the other —
 * small multiples, so the eye can still line the months up.
 *
 * The pre-CAPI months are the delicate part. Feb and Mar have real spend and no
 * telemetry, because the CAPI server only went live on 19/apr. Plotting a 0 for
 * their sales would read as "we spent and sold nothing", which is false. They
 * are drawn as an explicit hatched gap labelled "sem telemetria" instead.
 */

const money = HISTORY.map((m) => m.spend)
const maxSpend = Math.max(...money)
const maxSales = Math.max(...HISTORY.map((m) => m.sales || 0))

/** Cost per sale, only where both numbers exist. */
function costPerSale(m) {
  if (!m.sales) return null
  return m.spend / m.sales
}

export default function Historico() {
  const [ref, inView] = useInView()

  return (
    <section className="inv-section inv-historico" id="historico" ref={ref}>
      <div className="inv-container">
        <Kicker>Histórico · fev/2026 a 14/jul/2026</Kicker>
        <h2 className="inv-h2">
          O que já foi investido <span className="inv-hl">e o que a operação devolveu.</span>
        </h2>

        <div className="inv-group-grid inv-historico-tiles">
          <StatTile
            value={INVESTMENT.mediaSpend}
            prefix="R$ "
            decimals={2}
            label="Investido em mídia"
            note={`Meta Ads · ${INVESTMENT.since} a ${INVESTMENT.until}`}
          />
          <StatTile
            value={INVESTMENT.reach}
            label="Pessoas alcançadas"
            note={`${fmtInt(INVESTMENT.impressions)} impressões · ${fmtInt(INVESTMENT.clicks)} cliques`}
          />
          <StatTile
            value={INVESTMENT.people}
            label="Pessoas na base"
            note="Telefones únicos registrados na CAPI"
          />
          <StatTile
            value={INVESTMENT.sales}
            label="Vendas registradas"
            note={`${fmtBRLCents(INVESTMENT.costPerSale)} de mídia por venda`}
          />
        </div>

        {/* ── Chart 1: investment ── */}
        <figure className={`inv-serie ${inView ? 'is-visible' : ''}`}>
          <figcaption>
            <span className="inv-chart-title">Investimento em mídia por mês</span>
            <span className="inv-chart-unit">R$ · Meta Ads API</span>
          </figcaption>

          <div className="inv-serie-plot">
            {HISTORY.map((m, i) => (
              <div key={m.month} className="inv-serie-col" style={{ '--i': i }}>
                <div className="inv-serie-bar-area">
                  <div
                    className="inv-serie-bar inv-serie-bar--spend"
                    style={{ '--h': `${(m.spend / maxSpend) * 100}%` }}
                  />
                </div>
                <span className="inv-serie-value">{fmtBRL(m.spend)}</span>
                <span className="inv-serie-month">{m.month}</span>
              </div>
            ))}
          </div>
        </figure>

        {/* ── Chart 2: sales, same months, own scale ── */}
        <figure className={`inv-serie inv-serie--sales ${inView ? 'is-visible' : ''}`}>
          <figcaption>
            <span className="inv-chart-title">Vendas por mês</span>
            <span className="inv-chart-unit">
              nº de contratos pagos · base CAPI · escala própria, não compartilha eixo com o
              investimento
            </span>
          </figcaption>

          <div className="inv-serie-plot">
            {HISTORY.map((m, i) => (
              <div key={m.month} className="inv-serie-col" style={{ '--i': i }}>
                <div className="inv-serie-bar-area">
                  {m.tracked !== 'full' ? (
                    <div className="inv-serie-gap" title="Mês sem funil confiável">
                      <span>{m.tracked === 'partial' ? 'parcial' : 'sem telemetria'}</span>
                    </div>
                  ) : (
                    <div
                      className="inv-serie-bar inv-serie-bar--sales"
                      style={{ '--h': `${((m.sales || 0) / maxSales) * 100}%` }}
                    />
                  )}
                </div>
                <span className="inv-serie-value">{m.tracked !== 'full' ? '—' : m.sales || 0}</span>
                <span className="inv-serie-month">{m.month}</span>
              </div>
            ))}
          </div>
        </figure>

        <SourceNote>
          A barra de vendas de fev, mar e abr não é zero: é uma lacuna. O servidor de CAPI entrou no
          ar em {TRACKING_START}, então fev e mar têm investimento real e nenhuma telemetria de
          funil, e abril tem telemetria parcial (11 dias) sem número de funil confiável. Julho é mês
          em curso (1 a 14).
        </SourceNote>

        {/* ── The table ── */}
        <div className="inv-tabela-wrap">
          <table className="inv-tabela">
            <caption className="inv-chart-unit">
              Mês a mês · investimento pela Meta Ads API, funil pela base CAPI
            </caption>
            <thead>
              <tr>
                <th scope="col">Mês</th>
                <th scope="col">Investimento</th>
                <th scope="col">Conversas</th>
                <th scope="col">Propostas com saldo</th>
                <th scope="col">Vendas</th>
                <th scope="col">Custo por venda</th>
              </tr>
            </thead>
            <tbody>
              {HISTORY.map((m) => {
                const cps = costPerSale(m)
                // Any month without full telemetry gets the gap treatment, so a
                // cell never shows a blank that could read as a real zero.
                const gap = m.tracked !== 'full'
                return (
                  <tr key={m.month} className={gap ? 'is-untracked' : ''}>
                    <th scope="row">
                      {m.label}
                      {m.note && <span className="inv-tabela-note">{m.note}</span>}
                    </th>
                    <td>{fmtBRLCents(m.spend)}</td>
                    <td>{m.conversations ? fmtInt(m.conversations) : <Gap on={gap} tracked={m.tracked} />}</td>
                    <td>{m.proposals ? fmtInt(m.proposals) : <Gap on={gap} tracked={m.tracked} />}</td>
                    <td>{m.sales ? fmtInt(m.sales) : <Gap on={gap} tracked={m.tracked} />}</td>
                    <td>{cps ? fmtBRLCents(cps) : <Gap on={gap} tracked={m.tracked} />}</td>
                  </tr>
                )
              })}
            </tbody>
            <tfoot>
              <tr>
                <th scope="row">Total</th>
                <td>{fmtBRLCents(INVESTMENT.mediaSpend)}</td>
                <td>{fmtInt(INVESTMENT.people)}</td>
                <td>{fmtInt(INVESTMENT.proposals)}</td>
                <td>{fmtInt(INVESTMENT.sales)}</td>
                <td>{fmtBRLCents(INVESTMENT.costPerSale)}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <SourceNote>
          &quot;Conversas&quot; são pessoas distintas que interagiram no mês (chat_id único na base
          CAPI); o total é o número de telefones únicos registrados, não a soma das colunas, porque
          a mesma pessoa pode voltar em mais de um mês. &quot;Investimento&quot; é mídia paga na
          Meta — não inclui assinaturas, infraestrutura, honorários ou horas, que não estão em
          nenhuma das fontes consultadas.
        </SourceNote>

        <Leitura>
          Foram {fmtBRLCents(INVESTMENT.mediaSpend)} em mídia desde {INVESTMENT.since}, que
          alcançaram {fmtInt(INVESTMENT.reach)} pessoas e trouxeram {fmtInt(INVESTMENT.people)} para
          a base. Nos três meses com telemetria completa, isso virou{' '}
          {fmtInt(INVESTMENT.proposals)} propostas com saldo, {fmtBRL(INVESTMENT.offered)} ofertados
          em crédito e {INVESTMENT.sales} contratos pagos, a{' '}
          {fmtBRLCents(INVESTMENT.costPerSale)} de mídia por venda. O custo por venda caiu de{' '}
          {fmtBRLCents(8925.15 / 45)} em maio para {fmtBRLCents(10050.4 / 55)} em junho; julho ainda
          está em curso e o número do mês só fecha no dia 31.
        </Leitura>
      </div>
    </section>
  )
}

/** An explicit gap, never a zero: the month was not measured, not empty. */
function Gap({ on, tracked }) {
  if (!on) return <span>—</span>
  const label = tracked === 'partial' ? 'parcial' : 'sem telemetria'
  return (
    <span className="inv-gap-cell" title="Mês sem funil confiável">
      {label}
    </span>
  )
}
