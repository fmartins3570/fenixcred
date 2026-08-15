/**
 * Article catalog — same data-driven model as Mariano Santana's blog.ts.
 * Listing, detail, sitemap and related posts all read from ARTIGOS.
 */

export const ARTIGOS = [
  {
    slug: "credito-consignado-clt-como-funciona",
    titulo: "Crédito consignado CLT: o que é, como funciona e quem pode contratar",
    descricao:
      "Entenda o Crédito do Trabalhador (eConsignado): margem de 35%, contratação pela CTPS Digital, teto de juros e o que muda na prática para quem é CLT.",
    autor: "Fênix Cred",
    data: "2026-08-12",
    tags: ["Crédito CLT"],
    imagem: "/images/artigos/credito-consignado-clt-como-funciona.webp",
    alt: "Trabalhador CLT analisa no celular uma simulação de crédito consignado em ambiente escuro com luz dourada",
    seo_title: "Crédito consignado CLT: como funciona em 2026 | Fênix Cred",
    meta_description:
      "Guia do consignado CLT em 2026: quem pode contratar, margem de 35%, teto de juros, documentos e o caminho até o dinheiro cair na conta.",
  },
  {
    slug: "antecipacao-fgts-como-funciona",
    titulo: "Antecipação de FGTS: como funciona e o que mudou nas regras de 2026",
    descricao:
      "Saque-aniversário, limite por parcela, carência de 90 dias e a mudança de novembro de 2026. Veja o que dá para antecipar e o que vale a pena avaliar antes.",
    autor: "Fênix Cred",
    data: "2026-08-10",
    tags: ["FGTS"],
    imagem: "/images/artigos/antecipacao-fgts-como-funciona.webp",
    alt: "Mãos de trabalhador seguram o celular sobre a mesa para consultar o saldo do FGTS",
    seo_title: "Antecipação de FGTS em 2026: regras, limites e como contratar",
    meta_description:
      "Regras da antecipação do saque-aniversário do FGTS em 2026: teto de R$ 500 por parcela, 5 saques até outubro e 3 a partir de novembro. Veja como contratar.",
  },
  {
    slug: "consignado-para-negativado",
    titulo: "Consignado para negativado: é possível contratar com o nome sujo?",
    descricao:
      "Quem está negativado ainda pode ter caminho no consignado CLT porque o desconto sai da folha. Entenda o que pesa na análise e o que não é garantia.",
    autor: "Fênix Cred",
    data: "2026-08-06",
    tags: ["Negativado"],
    imagem: "/images/artigos/consignado-para-negativado.webp",
    alt: "Pessoa revisa documentos à mesa à noite, com expressão aliviada sob luz dourada",
    seo_title: "Consignado para negativado em 2026: o que é possível",
    meta_description:
      "Negativado pode contratar consignado CLT? Veja por que a folha de pagamento muda a análise, o que ainda é exigido e como simular sem compromisso.",
  },
  {
    slug: "quanto-tempo-demora-consignado-clt",
    titulo: "Quanto tempo demora o crédito consignado CLT para cair na conta?",
    descricao:
      "Do pedido à liberação: o que costuma ser rápido, o que trava o processo e como se preparar para o dinheiro cair sem surpresa.",
    autor: "Fênix Cred",
    data: "2026-08-04",
    tags: ["Crédito CLT"],
    imagem: "/images/artigos/quanto-tempo-demora-consignado-clt.webp",
    alt: "Mesa vista de cima com celular, relógio e xícara — espera pela liberação do crédito",
    seo_title: "Quanto tempo demora o consignado CLT para cair? | Fênix Cred",
    meta_description:
      "Prazo do consignado CLT: simulação, documentos, análise e depósito. Veja o que acelera e o que atrasa a liberação do crédito.",
  },
  {
    slug: "documentos-para-consignado-clt",
    titulo: "Documentos para contratar consignado CLT: checklist completo",
    descricao:
      "RG ou CNH, CPF, comprovante de residência, contracheque e dados bancários. O checklist para não perder tempo na contratação.",
    autor: "Fênix Cred",
    data: "2026-08-01",
    tags: ["Crédito CLT"],
    imagem: "/images/artigos/documentos-para-consignado-clt.webp",
    alt: "Pasta, documentos e óculos organizados sobre mesa escura com iluminação dourada",
    seo_title: "Documentos para consignado CLT: checklist 2026",
    meta_description:
      "Lista de documentos para consignado CLT: identidade, comprovantes, contracheque e CTPS Digital. Prepare tudo antes de simular.",
  },
];

export function getArtigoBySlug(slug) {
  return ARTIGOS.find((artigo) => artigo.slug === slug);
}

export function getRelatedArtigos(slug, limit = 3) {
  const current = getArtigoBySlug(slug);
  if (!current) return ARTIGOS.slice(0, limit);
  return ARTIGOS.filter((artigo) => artigo.slug !== slug)
    .map((artigo) => ({
      artigo,
      shared: artigo.tags.filter((tag) => current.tags.includes(tag)).length,
    }))
    .sort((a, b) => b.shared - a.shared || b.artigo.data.localeCompare(a.artigo.data))
    .slice(0, limit)
    .map((item) => item.artigo);
}

export function formatDateLong(isoDate) {
  return new Date(`${isoDate}T12:00:00`).toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
