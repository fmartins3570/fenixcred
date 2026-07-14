import { Kicker, Leitura, MargemBar, SourceNote } from './ui'
import { PORTARIA, MARGIN, fmtPct } from './data'

/**
 * The approval-rate indicator — the worst number in the operation — paired with
 * the regulatory change that acts on it. Both are facts with dates; neither is a
 * forecast, and the bar never moves past the operation's own historical rate.
 */
export default function Margem() {
  return (
    <section className="inv-section inv-margem-section" id="margem">
      <div className="inv-container">
        <Kicker>Indicador 03 · Taxa de aprovação de margem (CLT)</Kicker>
        <h2 className="inv-h2">
          {fmtPct(MARGIN.noBalancePct)} das simulações{' '}
          <span className="inv-hl">voltam sem saldo.</span>
        </h2>

        <MargemBar />
        <SourceNote>
          Taxa Simulação → Saldo · funil VendeAI · ref. jun/2026. O marcador é a média histórica da
          própria operação ({fmtPct(MARGIN.historicalRate)}), único ponto de referência que o dado
          oferece. Nada além dele é plotado.
        </SourceNote>

        <div className="inv-where">
          <h3 className="inv-sub-h3">Onde o indicador não trava — e a instrumentação mostra</h3>
          <ul>
            <li>
              <strong>Aquisição</strong> — o lead chega e conversa.
            </li>
            <li>
              <strong>Bot</strong> — a simulação roda, o CPF é consultado.
            </li>
            <li>
              <strong>Tracking</strong> — os eventos batem, browser e servidor, com dedup.
            </li>
            <li>
              <strong>Produto</strong> — o ticket de R$ 3.346 é real.
            </li>
          </ul>
          <p className="inv-where-verdict">
            <strong>Trava na margem.</strong> O banco avalia o risco do trabalhador CLT e devolve
            &quot;sem saldo / sem margem&quot;. É a única variável da cadeia fora do controle da
            Fenix.
          </p>
        </div>

        <div className="inv-lever">
          <header>
            <h3 className="inv-sub-h3">
              Alavanca regulatória · Portaria MTE {PORTARIA.number} · vigente desde{' '}
              {PORTARIA.inForce}
            </h3>
          </header>

          <div className="inv-lever-grid">
            <ul className="inv-guarantees-list">
              {PORTARIA.guarantees.map((g) => (
                <li key={g.what}>
                  <span className="inv-guarantee-pct">{g.pct}</span>
                  <span className="inv-guarantee-what">{g.what}</span>
                </li>
              ))}
            </ul>

            <div className="inv-ratecap">
              <span className="inv-ratecap-value">{PORTARIA.rateCap}</span>
              <span className="inv-ratecap-unit">ao mês</span>
              <span className="inv-ratecap-label">
                Teto de juros para operações com essas garantias — cerca de metade da taxa anterior.
              </span>
            </div>
          </div>

          <p className="inv-lever-note">
            As obrigações operacionais criadas pela portaria — Portal Emprega Brasil, eSocial e FGTS
            Digital — recaem sobre o <strong>empregador</strong>, não sobre o correspondente
            bancário.
          </p>
        </div>

        <Leitura>
          Este é o indicador mais distante da meta e o de maior alavancagem: voltar de{' '}
          {fmtPct(MARGIN.currentRate)} para os {fmtPct(MARGIN.historicalRate)} históricos mais que
          dobraria as propostas com saldo <strong>sem aumentar um real de mídia</strong>. Mais
          garantia reduz o risco percebido pelo banco e amplia a margem aprovada — que é
          literalmente o nome do gargalo. Ressalva: a portaria está vigente, mas{' '}
          <strong>a habilitação depende de cada banco e ainda está em curso</strong>; o que o dado
          sustenta é a direção, não a data da virada.
        </Leitura>
      </div>
    </section>
  )
}
