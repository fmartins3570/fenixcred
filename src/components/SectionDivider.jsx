import './SectionDivider.css'

/**
 * Componente SectionDivider - Linha divisória com efeito de sombra luminosa
 * 
 * Usado para separar visualmente as seções do site
 * com um efeito de brilho na cor de destaque (#FDB147)
 */
function SectionDivider() {
  return (
    <div className="section-divider">
      <div className="divider-line"></div>
      <div className="divider-glow"></div>
    </div>
  )
}

export default SectionDivider

