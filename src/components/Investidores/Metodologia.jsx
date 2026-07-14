import { Kicker } from './ui'

/**
 * Not a sales section — a methodology note. In an indicator panel, the reader is
 * entitled to know how each number is measured before trusting it. Kept to one
 * compact strip: provenance, not architecture tourism.
 */

const CHAIN = [
  { stage: 'Anúncio', tool: 'Meta Ads · act_1234061875532331' },
  { stage: 'Conversa', tool: 'WhatsApp · CTWA e landing pages' },
  { stage: 'Simulação', tool: 'Bot VendeAI · consulta de saldo e margem' },
  { stage: 'Originação', tool: 'C6 · Facta · Presença · 2S Consig' },
]

const GUARANTEES = [
  {
    title: 'Medição server-side',
    body: 'Meta Conversions API em VPS dedicado, hashing SHA-256 no servidor. Bloqueador de anúncio no navegador não derruba o evento.',
  },
  {
    title: 'Sem contagem dupla',
    body: 'O Pixel dispara no navegador e no servidor, com deduplicação por event_id. O mesmo lead nunca é contado duas vezes.',
  },
  {
    title: 'Base própria',
    body: 'SQLite leads.db, tabelas proposals e events. O histórico é nosso, não da plataforma de anúncio — por isso é auditável.',
  },
  {
    title: 'Valor = comissão real',
    body: 'QualifiedLead, OrderCreated e Purchase carregam value igual à comissão real do banco que originou a proposta. Não é o valor do empréstimo.',
  },
]

export default function Metodologia() {
  return (
    <section className="inv-section inv-metodologia" id="metodologia">
      <div className="inv-container">
        <Kicker>Como estes números são medidos</Kicker>
        <h2 className="inv-h2">
          A cadeia do dado, <span className="inv-hl">do clique à comissão.</span>
        </h2>

        <ol className="inv-chain-flow">
          {CHAIN.map((c, i) => (
            <li key={c.stage}>
              <span className="inv-chain-flow-n" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="inv-chain-flow-stage">{c.stage}</span>
              <span className="inv-chain-flow-tool">{c.tool}</span>
            </li>
          ))}
        </ol>

        <div className="inv-guards">
          {GUARANTEES.map((g) => (
            <article key={g.title} className="inv-guard">
              <h3>{g.title}</h3>
              <p>{g.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
