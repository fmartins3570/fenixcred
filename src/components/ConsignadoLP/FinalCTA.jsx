import { useWhatsAppWithTag } from '../../hooks/useWhatsAppWithTag'
import './FinalCTA.css'

export default function FinalCTA({ tag, ctaText }) {
  const { openWhatsApp } = useWhatsAppWithTag(tag)

  const handleClick = () => {
    openWhatsApp(
      'Olá! Gostaria de simular um consignado CLT.',
      `FinalCTA ${tag}`
    )
  }

  return (
    <section id="final-cta-consignado" className="final-cta-consignado">
      <div className="final-cta-consignado-decoration-1" aria-hidden="true" />
      <div className="final-cta-consignado-decoration-2" aria-hidden="true" />

      <div className="final-cta-consignado-container">
        <h2 className="final-cta-consignado-title">
          Conquiste Seu Crédito{' '}
          <span className="final-cta-consignado-highlight">Hoje Mesmo</span>
        </h2>
        <p className="final-cta-consignado-description">
          Atendimento ágil, taxas justas e resposta em minutos.
        </p>

        <button type="button" className="final-cta-consignado-btn" onClick={handleClick}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
          </svg>
          {ctaText}
        </button>

        <div className="final-cta-consignado-contact">
          <span>(11) 91708-2143</span>
          <span>Segunda a Sexta, 9h às 18h</span>
        </div>

        <div className="final-cta-consignado-trust">
          <div className="final-cta-consignado-rating">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="rating-star">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
            ))}
            <span>4.8/5 no Google</span>
          </div>
        </div>
      </div>
    </section>
  )
}
