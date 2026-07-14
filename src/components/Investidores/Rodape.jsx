import { COMPANY, REFERENCE, SOURCES } from './data'

/**
 * Provenance footer. No ask, no pitch — this is a data panel. The only offer
 * here is to open the sources, which is what the numbers are worth.
 */
export default function Rodape() {
  return (
    <section className="inv-section inv-rodape" id="fontes">
      <div className="inv-container">
        <div className="inv-rodape-audit">
          <div>
            <h2 className="inv-rodape-title">Auditoria dos números</h2>
            <p>
              Cada indicador desta página pode ser conferido na fonte, ao vivo: a conta Meta Ads
              (act_1234061875532331), a base <code>leads.db</code> (tabelas <code>proposals</code> e{' '}
              <code>events</code>, via SSH) e o dashboard VendeAI.
            </p>
          </div>
          <a
            href={`mailto:${COMPANY.email}?subject=Auditoria%20dos%20indicadores%20-%20Fenix%20Cred`}
            className="inv-btn inv-btn--primary"
          >
            Solicitar acesso às fontes
          </a>
        </div>

        <footer className="inv-integrity">
          <p>
            <strong>{COMPANY.name}</strong> — {COMPANY.legal} · CNPJ {COMPANY.cnpj} ·{' '}
            {COMPANY.role}.
          </p>
          <p>
            {REFERENCE.label} · {REFERENCE.report}. {REFERENCE.cut}.
          </p>
          <p>Fontes primárias: {SOURCES.join(' · ')}.</p>
          <p className="inv-integrity-final">
            Não há nesta página projeção de receita, valuation ou estimativa de tamanho de mercado —
            apenas o que a base registrou.
          </p>
        </footer>
      </div>
    </section>
  )
}
