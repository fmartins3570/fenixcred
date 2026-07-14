import { StatTile, TileGroup } from './ui'
import { COMPANY, PRODUCTS, PRODUCTION, FGTS_7D, MARGIN, REFERENCE, SOURCES, fmtPct } from './data'

/**
 * The scoreboard. Opens the page with the indicators themselves — including the
 * one that is off target — rather than with an argument about them.
 */
export default function Scoreboard() {
  const { clt, fgts } = PRODUCTS

  return (
    <section className="inv-scoreboard" id="scoreboard">
      <div className="inv-scoreboard-glow" aria-hidden="true" />
      <div className="inv-scoreboard-grid-lines" aria-hidden="true" />

      <div className="inv-container inv-scoreboard-inner">
        <header className="inv-scoreboard-head">
          <p className="inv-eyebrow">
            {COMPANY.name} · {COMPANY.legal} · CNPJ {COMPANY.cnpj} · {COMPANY.role}
          </p>
          <h1 className="inv-scoreboard-title">
            Indicadores da operação
            <span className="inv-scoreboard-period">{REFERENCE.label}</span>
          </h1>
          <p className="inv-scoreboard-sub">
            Crédito consignado CLT e antecipação FGTS, do anúncio pago à comissão paga pelo banco.
            Todos os números abaixo vêm de fonte primária — nenhum é projeção, estimativa ou
            arredondamento.
          </p>
          <ul className="inv-scoreboard-sources">
            {SOURCES.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </header>

        <TileGroup title="Originação — Crédito CLT" unit="30 dias · base CAPI, tabela proposals">
          <StatTile value={clt.offered} prefix="R$ " label="Valor ofertado" />
          <StatTile value={clt.proposals} label="Propostas com saldo" />
          <StatTile value={clt.avgTicket} prefix="R$ " label="Ticket médio" />
          <StatTile
            value={clt.commissionPool}
            prefix="R$ "
            label="Pool de comissão"
            note="2,5% · R$ 83,60 por proposta"
          />
        </TileGroup>

        <TileGroup title="Originação — Antecipação FGTS" unit="30 dias · base CAPI, tabela proposals">
          <StatTile value={fgts.offered} prefix="R$ " label="Valor ofertado" />
          <StatTile value={fgts.proposals} label="Propostas com saldo" />
          <StatTile value={fgts.avgTicket} prefix="R$ " label="Ticket médio" />
          <StatTile
            value={fgts.commissionPool}
            prefix="R$ "
            label="Pool de comissão"
            note="40% · R$ 102,40 por proposta"
          />
        </TileGroup>

        <TileGroup title="Eficiência e resultado" unit="produção mensal · funil FGTS de 7 dias">
          <StatTile
            value={PRODUCTION.monthly}
            prefix="R$ "
            label="Produção mensal realizada"
            note="Junho, pré-outage do CLT"
          />
          <StatTile
            value={MARGIN.currentRate}
            suffix="%"
            decimals={1}
            tone="alert"
            label="Taxa Simulação → Saldo (CLT)"
            note={`Abaixo da meta · histórico ${fmtPct(MARGIN.historicalRate)}`}
          />
          <StatTile
            value={FGTS_7D.conversion}
            suffix="%"
            decimals={1}
            label="Conversão lead → pago (FGTS)"
            note={`${FGTS_7D.leads.toLocaleString('pt-BR')} leads · ${FGTS_7D.paid} pagas`}
          />
          <StatTile
            value={FGTS_7D.roas}
            suffix="x"
            decimals={2}
            label="ROAS sobre comissão (FGTS)"
            note="7 dias · ver ressalva no funil"
          />
        </TileGroup>
      </div>
    </section>
  )
}
