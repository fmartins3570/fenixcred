#!/usr/bin/env node

/**
 * Prerender das rotas de artigos.
 *
 * O site é uma SPA: sem este passo, /artigos/<slug> devolve o index.html
 * genérico e o crawler só vê título e texto depois de executar o JS.
 * Aqui geramos dist/artigos/<slug>/index.html com head correto, JSON-LD e o
 * corpo do artigo em HTML. O React monta com createRoot e substitui a marcação
 * no cliente, então não há risco de hydration mismatch.
 *
 * Uso: node scripts/prerender-artigos.js (após inject-resource-hints.js)
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { ARTIGOS, formatDateLong, getRelatedArtigos } from "../src/data/artigos.js";
import { ARTIGOS_CONTENT } from "../src/data/artigos-content.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITE = "https://fenixcredbr.com.br";
const distPath = path.join(__dirname, "..", "dist");
const templatePath = path.join(distPath, "index.html");

const escapeAttr = (value) =>
  String(value).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

const escapeText = (value) =>
  String(value).replace(/&(?!#?\w+;)/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/* ---------- head ---------- */

function setTag(html, pattern, replacement) {
  return pattern.test(html) ? html.replace(pattern, replacement) : html;
}

function applyHead(html, { title, description, url, image, imageAlt, type, jsonLd }) {
  let out = html;

  out = setTag(out, /<title>[\s\S]*?<\/title>/, `<title>${escapeText(title)}</title>`);
  out = setTag(
    out,
    /<meta[^>]*name="description"[^>]*>/,
    `<meta name="description" content="${escapeAttr(description)}" />`,
  );
  out = setTag(
    out,
    /<link[^>]*rel="canonical"[^>]*>/,
    `<link rel="canonical" href="${escapeAttr(url)}" />`,
  );
  out = setTag(out, /<meta[^>]*property="og:url"[^>]*>/, `<meta property="og:url" content="${escapeAttr(url)}" />`);
  out = setTag(out, /<meta[^>]*property="og:type"[^>]*>/, `<meta property="og:type" content="${type}" />`);
  out = setTag(
    out,
    /<meta[^>]*property="og:title"[^>]*>/,
    `<meta property="og:title" content="${escapeAttr(title)}" />`,
  );
  out = setTag(
    out,
    /<meta[^>]*property="og:description"[^>]*>/,
    `<meta property="og:description" content="${escapeAttr(description)}" />`,
  );
  out = setTag(
    out,
    /<meta[^>]*property="og:image"(?![^>]*(width|height))[^>]*>/,
    `<meta property="og:image" content="${escapeAttr(image)}" />`,
  );
  out = setTag(
    out,
    /<meta[^>]*name="twitter:title"[^>]*>/,
    `<meta name="twitter:title" content="${escapeAttr(title)}" />`,
  );
  out = setTag(
    out,
    /<meta[^>]*name="twitter:description"[^>]*>/,
    `<meta name="twitter:description" content="${escapeAttr(description)}" />`,
  );
  out = setTag(
    out,
    /<meta[^>]*name="twitter:image"[^>]*>/,
    `<meta name="twitter:image" content="${escapeAttr(image)}" />`,
  );
  out = setTag(out, /<meta[^>]*name="twitter:url"[^>]*>/, `<meta name="twitter:url" content="${escapeAttr(url)}" />`);

  if (imageAlt) {
    out = out.replace(
      "</head>",
      `  <meta property="og:image:alt" content="${escapeAttr(imageAlt)}" />\n  </head>`,
    );
  }

  const blocks = jsonLd
    .map((node) => `<script type="application/ld+json">${JSON.stringify(node)}</script>`)
    .join("\n    ");

  return out.replace("</head>", `  ${blocks}\n  </head>`);
}

/* ---------- corpo (mesmas regras do ArticleBody.jsx) ---------- */

const isListItem = (p) => /^[-•]\s+/.test(p);
const isOrderedItem = (p) => /^\d+\.\s+/.test(p);
const isTable = (p) => /^<table[\s>]/i.test(p);
const HEADING_TAG = /^<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>$/i;
const isSafeHref = (href) => /^\/(?!\/)/.test(href) || /^https:\/\//i.test(href);

function renderInline(text) {
  return text
    .replace(/\s{2,}/g, " ")
    .trim()
    .split(/(\[[^\]]+\]\([^)\s]+\)|\*\*\*[^*]+\*\*\*|\*\*[^*]+\*\*|\*[^*]+\*)/g)
    .map((part) => {
      const link = /^\[([^\]]+)\]\(([^)\s]+)\)$/.exec(part);
      if (link) {
        const href = link[2].trim();
        const label = escapeText(link[1].trim());
        if (!isSafeHref(href)) return label;
        const attrs = href.startsWith("https://") ? ' target="_blank" rel="noopener noreferrer"' : "";
        return `<a href="${escapeAttr(href)}"${attrs}>${label}</a>`;
      }
      const bold = /^\*\*\*?([^*]+)\*\*\*?$/.exec(part);
      if (bold) return `<strong>${escapeText(bold[1].trim())}</strong>`;
      const italic = /^\*([^*]+)\*$/.exec(part);
      if (italic) return `<em>${escapeText(italic[1].trim())}</em>`;
      return escapeText(part);
    })
    .join("");
}

function renderSections(sections) {
  const out = [];

  sections.forEach((section) => {
    let bullets = [];
    let ordered = [];

    const flushBullets = () => {
      if (!bullets.length) return;
      out.push(`<ul>${bullets.map((b) => `<li>${renderInline(b)}</li>`).join("")}</ul>`);
      bullets = [];
    };
    const flushOrdered = () => {
      if (!ordered.length) return;
      out.push(`<ol>${ordered.map((o) => `<li>${renderInline(o)}</li>`).join("")}</ol>`);
      ordered = [];
    };
    const flushLists = () => {
      flushBullets();
      flushOrdered();
    };

    if (section.heading) out.push(`<h2>${escapeText(section.heading)}</h2>`);

    section.paragraphs.forEach((raw) => {
      const p = raw.trim();
      if (!p) return;

      if (isTable(p)) {
        flushLists();
        out.push(`<div class="artigos-table-wrap">${p.replace("<table", '<table class="artigos-table"')}</div>`);
        return;
      }

      const heading = HEADING_TAG.exec(p);
      if (heading) {
        flushLists();
        const level = Number(heading[1]) <= 4 ? 2 : 3;
        const text = heading[2].replace(/<[^>]+>/g, "").trim();
        out.push(`<h${level}>${escapeText(text)}</h${level}>`);
        return;
      }

      if (isListItem(p)) {
        flushOrdered();
        bullets.push(p.replace(/^[-•]\s+/, ""));
        return;
      }
      if (isOrderedItem(p)) {
        flushBullets();
        ordered.push(p.replace(/^\d+\.\s+/, ""));
        return;
      }

      flushLists();
      out.push(`<p>${renderInline(p)}</p>`);
    });

    flushLists();
  });

  return out.join("\n");
}

/* ---------- páginas ---------- */

function articleJsonLd(artigo, url) {
  return [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: artigo.titulo,
      description: artigo.descricao,
      datePublished: artigo.data,
      dateModified: artigo.data,
      inLanguage: "pt-BR",
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      image: `${SITE}${artigo.imagem}`,
      author: { "@type": "Organization", name: artigo.autor, url: SITE },
      publisher: {
        "@type": "Organization",
        name: "Fênix Cred",
        url: SITE,
        logo: { "@type": "ImageObject", url: `${SITE}/favicon_fenix_cred.webp` },
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
        { "@type": "ListItem", position: 2, name: "Artigos", item: `${SITE}/artigos` },
        { "@type": "ListItem", position: 3, name: artigo.titulo, item: url },
      ],
    },
  ];
}

function renderArticlePage(template, artigo) {
  const url = `${SITE}/artigos/${artigo.slug}`;
  const sections = ARTIGOS_CONTENT[artigo.slug];
  if (!sections) return null;

  const related = getRelatedArtigos(artigo.slug)
    .map((r) => `<li><a href="/artigos/${r.slug}">${escapeText(r.titulo)}</a></li>`)
    .join("");

  const body = `<div class="App artigos-page"><main><article class="artigos-article">
      <nav aria-label="Trilha"><ol><li><a href="/">Home</a></li><li><a href="/artigos">Artigos</a></li><li>${escapeText(artigo.titulo)}</li></ol></nav>
      <h1>${escapeText(artigo.titulo)}</h1>
      <p class="artigos-lead">${escapeText(artigo.descricao)}</p>
      <p class="artigos-meta">${escapeText(artigo.autor)} — <time datetime="${artigo.data}">${escapeText(formatDateLong(artigo.data))}</time></p>
      <img src="${escapeAttr(artigo.imagem)}" alt="${escapeAttr(artigo.alt)}" width="1200" height="630" />
      <div class="artigos-prose">
${renderSections(sections)}
      </div>
      <aside><h2>Leia também</h2><ul>${related}</ul></aside>
      <p><a href="https://api.whatsapp.com/send?phone=5511917082143">Simular pelo WhatsApp</a></p>
    </article></main></div>`;

  const html = applyHead(template, {
    title: artigo.seo_title?.trim() || `${artigo.titulo} | Fênix Cred`,
    description: artigo.meta_description?.trim() || artigo.descricao,
    url,
    image: `${SITE}${artigo.imagem}`,
    imageAlt: artigo.alt,
    type: "article",
    jsonLd: articleJsonLd(artigo, url),
  });

  return html.replace('<div id="root"></div>', `<div id="root">${body}</div>`);
}

function renderListingPage(template) {
  const url = `${SITE}/artigos`;
  const title = "Artigos sobre crédito CLT e FGTS | Fênix Cred";
  const description =
    "Artigos da Fênix Cred sobre consignado CLT, antecipação de FGTS e crédito para quem está negativado. Conteúdo prático para decidir com clareza.";

  const cards = ARTIGOS.map(
    (artigo) => `<li><article>
        <a href="/artigos/${artigo.slug}"><img src="${escapeAttr(artigo.imagem)}" alt="${escapeAttr(artigo.alt)}" width="600" height="315" /></a>
        <h2><a href="/artigos/${artigo.slug}">${escapeText(artigo.titulo)}</a></h2>
        <p>${escapeText(artigo.descricao)}</p>
        <time datetime="${artigo.data}">${escapeText(formatDateLong(artigo.data))}</time>
      </article></li>`,
  ).join("\n");

  const body = `<div class="App artigos-page"><main>
      <h1>Artigos sobre crédito CLT e FGTS</h1>
      <p>${escapeText(description)}</p>
      <ul class="artigos-grid">${cards}</ul>
    </main></div>`;

  const html = applyHead(template, {
    title,
    description,
    url,
    image: `${SITE}${ARTIGOS[0].imagem}`,
    imageAlt: ARTIGOS[0].alt,
    type: "website",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: title,
        description,
        url,
        isPartOf: { "@type": "WebSite", name: "Fênix Cred", url: SITE },
        hasPart: ARTIGOS.map((artigo) => ({
          "@type": "Article",
          headline: artigo.titulo,
          url: `${SITE}/artigos/${artigo.slug}`,
          datePublished: artigo.data,
        })),
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
          { "@type": "ListItem", position: 2, name: "Artigos", item: url },
        ],
      },
    ],
  });

  return html.replace('<div id="root"></div>', `<div id="root">${body}</div>`);
}

/* ---------- execução ---------- */

try {
  const template = fs.readFileSync(templatePath, "utf-8");
  if (!template.includes('<div id="root"></div>')) {
    throw new Error('index.html sem <div id="root"></div> — prerender abortado');
  }

  const artigosDir = path.join(distPath, "artigos");
  fs.mkdirSync(artigosDir, { recursive: true });
  fs.writeFileSync(path.join(artigosDir, "index.html"), renderListingPage(template), "utf-8");

  let count = 0;
  const skipped = [];

  ARTIGOS.forEach((artigo) => {
    const page = renderArticlePage(template, artigo);
    if (!page) {
      skipped.push(artigo.slug);
      return;
    }
    const dir = path.join(artigosDir, artigo.slug);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, "index.html"), page, "utf-8");
    count += 1;
  });

  console.log(`✅ Prerender de artigos: ${count} páginas + listagem`);
  if (skipped.length) {
    console.log(`⚠️  Sem corpo em artigos-content.js (não prerenderizados): ${skipped.join(", ")}`);
  }
} catch (error) {
  console.error("❌ Erro no prerender de artigos:", error.message);
  process.exit(1);
}
