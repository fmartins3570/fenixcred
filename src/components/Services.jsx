import './Services.css'
import RelatedContent from './RelatedContent'
import { trackEvent } from '../utils/metaPixel'

/**
 * Componente Services - Seção de serviços oferecidos
 * 
 * Este componente exibe os diferentes serviços/produtos da empresa.
 * Usa um array de objetos para armazenar as informações dos serviços,
 * facilitando a manutenção e adição de novos serviços no futuro.
 */
function Services() {
  // Array com os serviços oferecidos
  // Cada objeto representa um serviço com título, descrição e ícone
  // Foco em Crédito CLT e Antecipação do FGTS
  const services = [
    {
      id: 1,
      title: 'Consignado para o CLT',
      description: 'Crédito consignado para trabalhadores com carteira assinada. Desconto direto na folha de pagamento, taxas justas e aprovação rápida. Atendemos todo Brasil.',
      icon: '📋',
      linkText: 'Simular crédito consignado CLT'
    },
    {
      id: 2,
      title: 'Antecipação do FGTS',
      description: 'Antecipe seu FGTS de forma simples e segura. Liberação rápida, sem burocracia e com as melhores condições do mercado. Atendemos todo Brasil.',
      icon: '💰',
      linkText: 'Antecipar FGTS agora'
    },
    {
      id: 3,
      title: 'Crédito Consignado',
      description: 'Crédito consignado com as melhores taxas do mercado. Desconto direto na folha, aprovação em até 24h e condições que cabem no seu bolso.',
      icon: '💳',
      linkText: 'Simular crédito consignado'
    }
  ]

  return (
    <section id="servicos" className="services">
      <div className="services-container">
        <div className="services-header">
          <h2 className="section-title">Soluções de crédito consignado para o CLT e Antecipação do FGTS</h2>
          <p className="section-subtitle">
            Oferecemos soluções financeiras completas para todo Brasil
          </p>
        </div>

        <div className="services-grid">
          {/* 
            map() percorre o array de serviços e cria um card para cada um
            key={service.id} é necessário para o React identificar cada elemento
          */}
          {services.map((service) => (
            <div key={service.id} className="service-card" data-spotlight>
              <div className="service-icon" aria-label={`Ícone de ${service.title} – ${service.title} em São Paulo`}>{service.icon}</div>
              <h3 className="service-title">{service.title}</h3>
              <p className="service-description">{service.description}</p>
              <a href="#contato" className="service-link" onClick={() => trackEvent('ViewContent', { content_name: service.title })}>
                {service.linkText} →
              </a>
            </div>
          ))}
        </div>
      </div>
      
      {/* Links Internos - Conteúdo Relacionado */}
      <RelatedContent currentSection="servicos" maxLinks={5} />
    </section>
  )
}

export default Services

