import { useState, useCallback } from 'react'
import { SIMULATOR_CONFIG, calculateInstallment, formatCurrency } from '../../utils/consignado-lp/simulator-config'
import { trackCustomEvent } from '../../utils/metaPixel'
import './Simulator.css'

export default function Simulator({ tag, onSimulate }) {
  const { minValue, maxValue, step, defaultValue, terms, defaultTerm } = SIMULATOR_CONFIG

  const [value, setValue] = useState(defaultValue)
  const [term, setTerm] = useState(defaultTerm)

  const installment = calculateInstallment(value, term)

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
    onSimulate(value, term, installment)
  }

  const fillPercent = ((value - minValue) / (maxValue - minValue)) * 100

  return (
    <div className="simulator">
      <div className="simulator-card">
        <h3 className="simulator-title">Simule seu crédito</h3>

        <div className="simulator-value-display">
          <span className="simulator-value-label">Valor desejado</span>
          <span className="simulator-value-amount">{formatCurrency(value)}</span>
        </div>

        <div className="simulator-slider-wrapper">
          <input
            type="range"
            min={minValue}
            max={maxValue}
            step={step}
            value={value}
            onChange={handleValueChange}
            onMouseUp={handleValueChangeEnd}
            onTouchEnd={handleValueChangeEnd}
            className="simulator-slider"
            style={{ '--fill-percent': `${fillPercent}%` }}
            aria-label="Valor do empréstimo"
          />
          <div className="simulator-slider-labels">
            <span>{formatCurrency(minValue)}</span>
            <span>{formatCurrency(maxValue)}</span>
          </div>
        </div>

        <div className="simulator-terms">
          <span className="simulator-terms-label">Prazo em meses</span>
          <div className="simulator-terms-grid">
            {terms.map((t) => (
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

        <div className="simulator-result">
          <span className="simulator-result-label">Parcela estimada</span>
          <span className="simulator-result-value">
            {formatCurrency(installment)}
            <span className="simulator-result-period">/mês</span>
          </span>
        </div>

        <button type="button" className="simulator-cta" onClick={handleSimulate} aria-label="Simular no WhatsApp">
          <svg className="whatsapp-icon" fill="currentColor" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
          </svg>
          Simular no WhatsApp
        </button>

        <p className="simulator-disclaimer">
          Simulação meramente ilustrativa. Valores sujeitos a análise de crédito pela instituição financeira parceira.
        </p>
      </div>
    </div>
  )
}
