/**
 * Componente SchemaJSON - Schema.org JSON-LD para SEO
 *
 * Adiciona dados estruturados para:
 * - LocalBusiness / FinancialService
 * - FAQPage
 *
 * Melhora visibilidade em buscadores e LLMs
 */
function SchemaJSON() {
  // Schema LocalBusiness (otimizado para SEO local)
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Fênix Cred Soluções Financeiras",
    legalName: "H.I INTERMEDIACAO FINANCEIRA LTDA - ME",
    image: "https://fenixcredbr.com.br/assets/logo-fenix-cred.webp",
    description:
      "Crédito consignado, FGTS e empréstimos pessoais com atendimento personalizado na Zona Leste de São Paulo desde 2008",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Av. do Oratório, 4098",
      addressLocality: "São Paulo",
      addressRegion: "SP",
      postalCode: "03220-200",
      addressCountry: "BR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "-23.5505",
      longitude: "-46.4578",
    },
    telephone: "+55 11 91708-2143",
    email: "contato@fenixcredbr.com.br",
    url: "https://fenixcredbr.com.br",
    logo: "https://fenixcredbr.com.br/assets/logo-fenix-cred.webp",
    foundingDate: "2008",
    areaServed: [
      {
        "@type": "City",
        name: "São Paulo",
      },
    ],
    serviceType: [
      "Crédito Consignado",
      "Empréstimo FGTS",
      "Empréstimo Pessoal",
      "Cartão de Crédito Consignado",
    ],
    priceRange: "$$$",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "18:00",
      },
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "200",
      bestRating: "5",
      worstRating: "1",
    },
    sameAs: [
      "https://www.facebook.com/fenixcred",
      "https://www.instagram.com/fenixcred",
      "https://www.linkedin.com/company/fenixcred",
    ],
  };

  // Schema Organization
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Fênix Cred – Soluções Financeiras",
    legalName: "H.I INTERMEDIACAO FINANCEIRA LTDA - ME",
    url: "https://fenixcredbr.com.br",
    logo: "https://fenixcredbr.com.br/assets/logo-fenix-cred.webp",
    foundingDate: "2018",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+55-11-91708-2143",
      contactType: "customer service",
      areaServed: "BR",
      availableLanguage: "Portuguese",
    },
    sameAs: [
      "https://www.facebook.com/fenixcred",
      "https://www.instagram.com/fenixcred",
      "https://www.linkedin.com/company/fenixcred",
    ],
  };

  // Schema BreadcrumbList
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://fenixcredbr.com.br/#inicio",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Sobre Nós",
        item: "https://fenixcredbr.com.br/#sobre",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Serviços",
        item: "https://fenixcredbr.com.br/#servicos",
      },
      {
        "@type": "ListItem",
        position: 4,
        name: "FAQ",
        item: "https://fenixcredbr.com.br/#faq",
      },
      {
        "@type": "ListItem",
        position: 5,
        name: "Contato",
        item: "https://fenixcredbr.com.br/#contato",
      },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "O que é crédito consignado?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "O crédito consignado é um empréstimo onde o desconto das parcelas é feito diretamente na folha de pagamento. Oferecido pela Fênix Cred em São Paulo com as melhores taxas do mercado.",
        },
      },
      {
        "@type": "Question",
        name: "Quem pode contratar crédito consignado?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Aposentados e pensionistas INSS, servidores públicos federais, estaduais e municipais, e funcionários de empresas privadas. Atendemos em São Paulo desde 2008.",
        },
      },
      {
        "@type": "Question",
        name: "Como contratar crédito consignado em São Paulo?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Entre em contato conosco via WhatsApp (11) 91708-2143 ou preencha nosso formulário. Nossa equipe em São Paulo entrará em contato em até 24h.",
        },
      },
      {
        "@type": "Question",
        name: "Crédito consignado para aposentado INSS em São Paulo – como contratar?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Aposentados e pensionistas do INSS podem contratar crédito consignado na Fênix Cred. Basta entrar em contato via WhatsApp (11) 91708-2143. Atendemos na Zona Leste de São Paulo com aprovação em até 24h.",
        },
      },
      {
        "@type": "Question",
        name: "Qual é o melhor consignado em São Paulo?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A Fênix Cred é referência em crédito consignado em São Paulo desde 2008, com mais de 200 mil clientes satisfeitos e nota 4.9 no Google. Oferecemos as melhores taxas e atendimento humanizado na Zona Leste.",
        },
      },
      {
        "@type": "Question",
        name: "Atendemos crédito consignado na Zona Leste de São Paulo?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sim! A Fênix Cred está localizada na Zona Leste de São Paulo, no Jardim Guairaca (Av. do Oratório, 4098). Atendemos toda a região, incluindo Vila Prudente, Vila Formosa e entorno.",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}

export default SchemaJSON;
