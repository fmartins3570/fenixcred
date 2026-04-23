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
      linkText: 'Simular crédito consignado CLT',
      rate: 'A partir de 1,49% a.m.',
    },
    {
      id: 2,
      title: 'Antecipação do FGTS',
      description: 'Antecipe seu FGTS de forma simples e segura. Liberação rápida, sem burocracia e com as melhores condições do mercado. Atendemos todo Brasil.',
      icon: '💰',
      linkText: 'Antecipar FGTS agora',
      rate: 'A partir de 1,29% a.m.',
    },
    {
      id: 3,
      title: 'Crédito com Garantia de Imóvel',
      description: 'Use seu imóvel como garantia e consiga crédito com as menores taxas do mercado. Imóvel quitado ou financiado. Você continua morando normalmente.',
      icon: '🏠',
      linkText: 'Simular crédito imobiliário',
      rate: 'A partir de 1,09% a.m.',
      href: 'https://app.creditas.com/home-equity/solicitacao/informacoes-pessoais?utm_medium=affiliates&utm_source=HII588383&utm_campaign=[hr]-crm&utm_term=always-on&utm_content=lp',
      external: true,
    },
    {
      id: 4,
      title: 'Crédito com Garantia de Veículo',
      description: 'Use seu veículo quitado como garantia e consiga crédito com taxas reduzidas. Você continua usando o carro normalmente.',
      icon: '🚗',
      linkText: 'Simular crédito veicular',
      rate: 'A partir de 1,49% a.m.',
      href: 'https://app.creditas.com/auto-refi/solicitacao/informacoes-pessoais?utm_medium=affiliates&utm_source=HII588383&utm_campaign=[ar]-crm&utm_term=always-on&utm_content=lp',
      external: true,
    },
  ]

  return (
    <section id="servicos" className="services">
      <div className="services-container">
        <div className="services-header">
          <h2 className="section-title">Soluções de crédito para você</h2>
          <p className="section-subtitle">
            Consignado CLT, antecipação FGTS e crédito com garantia de imóvel ou veículo. Atendemos todo Brasil.
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
              <p className="service-rate">{service.rate}</p>
              {service.external ? (
                <a
                  href={service.href}
                  className="service-link"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent('ViewContent', { content_name: service.title })}
                >
                  {service.linkText} →
                </a>
              ) : (
                <a href="#contato" className="service-link" onClick={() => trackEvent('ViewContent', { content_name: service.title })}>
                  {service.linkText} →
                </a>
              )}
            </div>
          ))}
        </div>

        {/* Disclaimer de taxas — compliance Meta Ads */}
        <p className="services-disclaimer">
          * Taxas e condições sujeitas a análise de crédito pela instituição financeira parceira. CET a partir de 29,90% a.a. A Fenix Cred atua como correspondente bancário nos termos da Resolução nº 3.954/2011 do Banco Central do Brasil.
        </p>
      </div>

      {/* Links Internos - Conteúdo Relacionado */}
      <RelatedContent currentSection="servicos" maxLinks={5} />
    </section>
  )
}

export default Services

