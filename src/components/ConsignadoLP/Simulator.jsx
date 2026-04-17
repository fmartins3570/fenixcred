import { useState, useCallback } from 'react'
import {
  SIMULATOR_CONFIG,
  FGTS_SIMULATOR_CONFIG,
  calculateInstallment,
  calculateFgtsNet,
  formatCurrency,
} from '../../utils/consignado-lp/simulator-config'
import { trackCustomEvent } from '../../utils/metaPixel'
import './Simulator.css'

/**
 * Credit simulator for ConsignadoLP landing pages.
 * Supports two modes:
 *  - 'parcelado' (default): consignado CLT flow with term selection + monthly installment
 *  - 'antecipado': FGTS anticipation flow with no term, shows net amount after fees
 *
 * @param {Object} props
 * @param {string} props.tag - Tracking tag (e.g. 'neg', 'vel', 'ger', 'fgts')
 * @param {Function} props.onSimulate - Called with (value, term, installmentOrNet)
 * @param {'parcelado'|'antecipado'} [props.mode='parcelado']
 */
export default function Simulator({ tag, onSimulate, mode = 'parcelado' }) {
  const isFgts = mode === 'antecipado'
  const config = isFgts ? FGTS_SIMULATOR_CONFIG : SIMULATOR_CONFIG

  const [value, setValue] = useState(config.defaultValue)
  // Only used in parcelado mode
  const [term, setTerm] = useState(isFgts ? null : SIMULATOR_CONFIG.defaultTerm)

  // Result value: installment for parcelado, net amount for antecipado
  const result = isFgts
    ? calculateFgtsNet(value)
    : calculateInstallment(value, term)

  const handleValueChange = useCallback((e) => {
    setValue(Number(e.target.value))
  }, [])

  const handleValueChangeEnd = useCallback(() => {
    trackCustomEvent('CustomizeProduct', {
      content_name: `Simulador ${tag}`,
      value: value,
    })
  }, [tag, value])

  const handleTermChange = useCallback((newTerm) => {
    setTerm(newTerm)
  }, [])

  const handleSimulate = () => {
    onSimulate(value, term, result)
  }

  const fillPercent = ((value - config.minValue) / (config.maxValue - config.minValue)) * 100

  return (
    <div className="simulator">
      <div className="simulator-card">
        <h3 className="simulator-title">
          {isFgts ? 'Simule sua antecipação' : 'Simule seu crédito'}
        </h3>

        <div className="simulator-value-display">
          <span className="simulator-value-label">
            {isFgts ? 'Valor desejado (FGTS)' : 'Valor desejado'}
          </span>
          <span className="simulator-value-amount">{formatCurrency(value)}</span>
        </div>

        <div className="simulator-slider-wrapper">
          <input
            type="range"
            min={config.minValue}
            max={config.maxValue}
            step={config.step}
            value={value}
            onChange={handleValueChange}
            onMouseUp={handleValueChangeEnd}
            onTouchEnd={handleValueChangeEnd}
            className="simulator-slider"
            style={{ '--fill-percent': `${fillPercent}%` }}
            aria-label={isFgts ? 'Valor da antecipação FGTS' : 'Valor do empréstimo'}
          />
          <div className="simulator-slider-labels">
            <span>{formatCurrency(config.minValue)}</span>
            <span>{formatCurrency(config.maxValue)}</span>
          </div>
        </div>

        {/* Term selection — only for parcelado (consignado) mode */}
        {!isFgts && (
          <div className="simulator-terms">
            <span className="simulator-terms-label">Prazo em meses</span>
            <div className="simulator-terms-grid">
              {SIMULATOR_CONFIG.terms.map((t) => (
                <button
                  key={t}
                  type="button"
                  className={`simulator-term-btn ${t === term ? 'active' : ''}`}
                  onClick={() => handleTermChange(t)}
                  aria-pressed={t === term}
                >
                  {t}x
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="simulator-result">
          <span className="simulator-result-label">
            {isFgts ? 'Valor líquido após antecipação' : 'Parcela estimada'}
          </span>
          <span className="simulator-result-value">
            {formatCurrency(result)}
            {!isFgts && <span className="simulator-result-period">/mês</span>}
          </span>
        </div>

        <button type="button" className="simulator-cta" onClick={handleSimulate} aria-label="Simular no WhatsApp">
          <svg className="whatsapp-icon" fill="currentColor" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
          </svg>
          Simular no WhatsApp
        </button>

        <p className="simulator-disclaimer">
          Simulação meramente ilustrativa. Valores sujeitos a análise da instituição financeira parceira.
        </p>
      </div>
    </div>
  )
}
