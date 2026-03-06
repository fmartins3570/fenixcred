import { useMemo } from "react";
import "./Breadcrumb.css";

/**
 * Componente Breadcrumb - Navegação hierárquica semântica
 * 
 * Exibe breadcrumbs com schema.org/BreadcrumbList para melhor SEO
 * e crawlability. Melhora descoberta de conteúdo e estrutura de navegação.
 * 
 * @param {Array} items - Array de objetos { name, url, isActive }
 * @param {string} currentSection - ID da seção atual (opcional, para auto-gerar)
 */
function Breadcrumb({ items = null, currentSection = "" }) {
  // Base de dados de seções para auto-geração
  const baseUrl = "https://fenixcredbr.com.br";
  
  const sectionsData = useMemo(() => ({
    inicio: {
      name: "Início",
      url: `${baseUrl}/#inicio`,
      urlHash: "#inicio",
      category: null,
    },
    sobre: {
      name: "Sobre Nós",
      url: `${baseUrl}/#sobre`,
      urlHash: "#sobre",
      category: "Institucional",
    },
    servicos: {
      name: "Nossos Serviços",
      url: `${baseUrl}/#servicos`,
      urlHash: "#servicos",
      category: "Serviços",
    },
    depoimentos: {
      name: "Avaliações",
      url: `${baseUrl}/#depoimentos`,
      urlHash: "#depoimentos",
      category: "Clientes",
    },
    parceiros: {
      name: "Parceiros",
      url: `${baseUrl}/#parceiros`,
      urlHash: "#parceiros",
      category: "Institucional",
    },
    faq: {
      name: "Perguntas Frequentes",
      url: `${baseUrl}/#faq`,
      urlHash: "#faq",
      category: "Informações",
    },
    "trabalhe-conosco": {
      name: "Trabalhe Conosco",
      url: `${baseUrl}/#trabalhe-conosco`,
      urlHash: "#trabalhe-conosco",
      category: "Institucional",
    },
    "politica-privacidade": {
      name: "Política de Privacidade",
      url: `${baseUrl}/#politica-privacidade`,
      urlHash: "#politica-privacidade",
      category: "Legal",
    },
  }), []);

  // Auto-gerar breadcrumbs se items não for fornecido
  const breadcrumbItems = useMemo(() => {
    if (items) {
      return items;
    }

    // Se currentSection fornecido, gerar automaticamente
    if (currentSection && sectionsData[currentSection]) {
      const section = sectionsData[currentSection];
      const items = [
        {
          name: "Início",
          url: sectionsData.inicio.urlHash, // Usar hash para navegação
          urlAbsolute: sectionsData.inicio.url, // URL absoluta para schema.org
          isActive: false,
        },
      ];

      // Adicionar categoria se existir
      if (section.category) {
        items.push({
          name: section.category,
          url: null, // Categoria não tem link
          urlAbsolute: null,
          isActive: false,
        });
      }

      // Adicionar seção atual
      items.push({
        name: section.name,
        url: section.urlHash, // Usar hash para navegação
        urlAbsolute: section.url, // URL absoluta para schema.org
        isActive: true,
      });

      return items;
    }

    // Fallback: apenas Início
    return [
      {
        name: "Início",
        url: "#inicio",
        urlAbsolute: `${baseUrl}/#inicio`,
        isActive: true,
      },
    ];
  }, [items, currentSection, sectionsData]);

  // Não exibir se houver apenas 1 item (página inicial)
  if (breadcrumbItems.length <= 1) {
    return null;
  }

  return (
    <nav
      className="breadcrumb"
      aria-label="Breadcrumb"
      itemScope
      itemType="https://schema.org/BreadcrumbList"
    >
      <div className="breadcrumb-container">
        <ol className="breadcrumb-list">
          {breadcrumbItems.map((item, index) => (
            <li
              key={index}
              className="breadcrumb-item"
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
              {item.isActive || !item.url ? (
                // Último item (atual) - sem link
                <span
                  className="breadcrumb-link breadcrumb-link-active"
                  itemProp="name"
                  aria-current="page"
                >
                  {item.name}
                </span>
              ) : (
                // Itens anteriores - com link
                <a
                  href={item.url}
                  className="breadcrumb-link"
                  itemProp="item"
                  itemType="https://schema.org/WebPage"
                >
                  <span itemProp="name">{item.name}</span>
                </a>
              )}
              <meta itemProp="position" content={index + 1} />
              {index < breadcrumbItems.length - 1 && (
                <span className="breadcrumb-separator" aria-hidden="true">
                  ›
                </span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}

export default Breadcrumb;
