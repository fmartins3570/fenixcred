import { Kicker } from './ui'
import { RISKS, SOURCES } from './data'

/**
 * Close the due diligence before it opens. An experienced investor is already
 * listing the risks; the page lists them first — and every mitigation uses a
 * mechanism that is ALREADY running (probe, trigger, floor, multi-bank cascade,
 * daily KPI, Purchase carrying the real commission). No future promises.
 */
export default function Riscos() {
  return (
    <section className="inv-section inv-riscos" id="riscos">
      <div className="inv-container">
        <Kicker>Riscos · detector · freio</Kicker>
        <h2 className="inv-h2">
          O que pode derrubar os números <span className="inv-hl">e o KPI que avisa antes.</span>
        </h2>
        <p className="inv-riscos-sub">
          Cada risco está pareado com o indicador que o denuncia e com o mecanismo que já está em
          operação para contê-lo.
        </p>

        <div className="inv-matrix">
          <div className="inv-matrix-head" aria-hidden="true">
            <span>Risco</span>
            <span>Detector</span>
            <span>Freio já armado</span>
          </div>

          {RISKS.map((r) => (
            <article key={r.id} className="inv-matrix-row">
              <div className="inv-matrix-risk">
                <span className="inv-matrix-id" aria-hidden="true">
                  {r.id}
                </span>
                <span className="inv-matrix-pulse" aria-hidden="true" />
                <h3>{r.risk}</h3>
              </div>
              <div className="inv-matrix-detector">
                <span className="inv-matrix-mobile-label">Detector</span>
                {r.detector}
              </div>
              <div className="inv-matrix-brake">
                <span className="inv-matrix-mobile-label">Freio já armado</span>
                {r.brake}
              </div>
            </article>
          ))}
        </div>

        <div className="inv-sources">
          <span className="inv-sources-seal">Dados primários · auditáveis</span>
          <ul>
            {SOURCES.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
