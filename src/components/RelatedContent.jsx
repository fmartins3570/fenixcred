import { useMemo } from "react";
import "./RelatedContent.css";

/**
 * Componente RelatedContent - Links Internos Automáticos
 * 
 * Exibe 5 links para conteúdo relacionado usando schema.org ItemList
 * Melhora descoberta de conteúdo e aumenta crawl budget
 * 
 * @param {string} currentSection - ID da seção atual (ex: "sobre", "servicos")
 * @param {number} maxLinks - Número máximo de links (padrão: 5)
 */
function RelatedContent({ currentSection = "", maxLinks = 5 }) {
  // Base de dados de todas as seções do site
  const allSections = useMemo(() => [
    {
      id: "inicio",
      title: "Início",
      url: "#inicio",
      description: "Página inicial - Crédito CLT e Antecipação FGTS",
      category: "principal",
      priority: 1.0
    },
    {
      id: "sobre",
      title: "Sobre Nós",
      url: "#sobre",
      description: "Porque escolher a FenixCred para crédito CLT",
      category: "institucional",
      priority: 0.9
    },
    {
      id: "servicos",
      title: "Nossos Serviços",
      url: "#servicos",
      description: "Soluções de crédito consignado para o CLT e Antecipação do FGTS",
      category: "servicos",
      priority: 1.0
    },
    {
      id: "depoimentos",
      title: "Avaliações dos Clientes",
      url: "#depoimentos",
      description: "O que nossos clientes dizem - Avaliações reais do Google",
      category: "social-proof",
      priority: 0.8
    },
    {
      id: "parceiros",
      title: "Nossos Parceiros",
      url: "#parceiros",
      description: "Parceiros e instituições financeiras",
      category: "institucional",
      priority: 0.7
    },
    {
      id: "faq",
      title: "Perguntas Frequentes",
      url: "#faq",
      description: "Tire suas dúvidas sobre crédito CLT e Antecipação FGTS",
      category: "informacao",
      priority: 0.9
    },
    {
      id: "trabalhe-conosco",
      title: "Trabalhe Conosco",
      url: "#trabalhe-conosco",
      description: "Oportunidades de trabalho na Fênix Cred",
      category: "institucional",
      priority: 0.6
    },
    {
      id: "politica-privacidade",
      title: "Política de Privacidade",
      url: "#politica-privacidade",
      description: "Política de privacidade e proteção de dados",
      category: "legal",
      priority: 0.5
    }
  ], []);

  // Lógica de seleção de conteúdo relacionado
  const relatedLinks = useMemo(() => {
    // Filtrar seção atual
    const availableSections = allSections.filter(
      (section) => section.id !== currentSection
    );

    // Priorizar por categoria similar
    const currentSectionData = allSections.find(
      (s) => s.id === currentSection
    );
    const currentCategory = currentSectionData?.category || "";

    // Separar por prioridade
    const sameCategory = availableSections.filter(
      (s) => s.category === currentCategory
    );
    const differentCategory = availableSections.filter(
      (s) => s.category !== currentCategory
    );

    // Ordenar por prioridade
    const sortedSameCategory = sameCategory.sort((a, b) => b.priority - a.priority);
    const sortedDifferent = differentCategory.sort((a, b) => b.priority - a.priority);

    // Combinar: mesma categoria primeiro, depois outras
    const combined = [...sortedSameCategory, ...sortedDifferent];

    // Randomização leve (pegar primeiros N, mas com pequena variação)
    const shuffled = [...combined].sort(() => Math.random() - 0.3);
    
    // Retornar até maxLinks
    return shuffled.slice(0, maxLinks);
  }, [currentSection, allSections, maxLinks]);

  // Não exibir se não houver links relacionados
  if (relatedLinks.length === 0) {
    return null;
  }

  return (
    <nav
      className="related-content"
      itemScope
      itemType="https://schema.org/ItemList"
      aria-label="Conteúdo relacionado"
    >
      <div className="related-content-container">
        <h3 className="related-content-title" itemProp="name">
          Conteúdo Relacionado
        </h3>
        <p className="related-content-subtitle">
          Explore mais sobre nossos serviços e soluções
        </p>
        
        <ul className="related-content-list" itemProp="itemListElement">
          {relatedLinks.map((link, index) => (
            <li
              key={link.id}
              itemScope
              itemType="https://schema.org/ListItem"
              className="related-content-item"
            >
              <meta itemProp="position" content={index + 1} />
              <a
                href={link.url}
                itemProp="url"
                className="related-content-link"
                aria-label={`Ir para ${link.title} - ${link.description}`}
              >
                <span className="related-content-link-icon">→</span>
                <div className="related-content-link-content">
                  <span itemProp="name" className="related-content-link-title">
                    {link.title}
                  </span>
                  <span className="related-content-link-description">
                    {link.description}
                  </span>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

export default RelatedContent;
