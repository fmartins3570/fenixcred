import { useLayoutEffect } from "react";

const SITE = "https://fenixcredbr.com.br";

const DEFAULTS = {
  title: "Crédito CLT e Antecipação FGTS | Fênix Cred São Paulo",
  description:
    "Crédito CLT e Antecipação do FGTS de forma simples e segura. +90 mil clientes atendidos ao mês. Nota 4.8 no Google. Atendemos todo Brasil desde 2018. Simule!",
  canonical: `${SITE}/`,
  type: "website",
  image: `${SITE}/assets/logo-fenix-cred.webp`,
  imageAlt: "Fênix Cred - Soluções Financeiras",
};

function upsertMeta(attr, key, content) {
  if (!content) return;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLink(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

function upsertJsonLd(id, data) {
  let el = document.getElementById(id);
  if (!data) {
    if (el) el.remove();
    return;
  }
  if (!el) {
    el = document.createElement("script");
    el.type = "application/ld+json";
    el.id = id;
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

/**
 * Updates document title, description, canonical, Open Graph and JSON-LD
 * for SPA article routes. Restores homepage defaults on unmount.
 */
export function usePageMeta({
  title,
  description,
  path,
  type = "website",
  image,
  imageAlt,
  publishedTime,
  author,
  jsonLd = [],
}) {
  const jsonLdKey = JSON.stringify(jsonLd);

  useLayoutEffect(() => {
    const schemas = jsonLdKey ? JSON.parse(jsonLdKey) : [];
    const canonical = path ? `${SITE}${path}` : DEFAULTS.canonical;
    const ogImage = image
      ? image.startsWith("http")
        ? image
        : `${SITE}${image}`
      : DEFAULTS.image;

    document.title = title || DEFAULTS.title;
    upsertMeta("name", "description", description || DEFAULTS.description);
    upsertLink("canonical", canonical);
    upsertMeta("property", "og:type", type);
    upsertMeta("property", "og:title", title || DEFAULTS.title);
    upsertMeta("property", "og:description", description || DEFAULTS.description);
    upsertMeta("property", "og:url", canonical);
    upsertMeta("property", "og:locale", "pt_BR");
    upsertMeta("property", "og:image", ogImage);
    upsertMeta("property", "og:image:alt", imageAlt || DEFAULTS.imageAlt);
    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", title || DEFAULTS.title);
    upsertMeta("name", "twitter:description", description || DEFAULTS.description);
    upsertMeta("name", "twitter:image", ogImage);

    if (publishedTime) {
      upsertMeta("property", "article:published_time", publishedTime);
    }
    if (author) {
      upsertMeta("property", "article:author", author);
    }

    schemas.forEach((schema, index) => {
      upsertJsonLd(`artigos-jsonld-${index}`, schema);
    });

    return () => {
      document.title = DEFAULTS.title;
      upsertMeta("name", "description", DEFAULTS.description);
      upsertLink("canonical", DEFAULTS.canonical);
      upsertMeta("property", "og:type", DEFAULTS.type);
      upsertMeta("property", "og:title", DEFAULTS.title);
      upsertMeta("property", "og:description", DEFAULTS.description);
      upsertMeta("property", "og:url", DEFAULTS.canonical);
      upsertMeta("property", "og:image", DEFAULTS.image);
      upsertMeta("property", "og:image:alt", DEFAULTS.imageAlt);
      upsertMeta("name", "twitter:title", DEFAULTS.title);
      upsertMeta("name", "twitter:description", DEFAULTS.description);
      upsertMeta("name", "twitter:image", DEFAULTS.image);
      const published = document.head.querySelector('meta[property="article:published_time"]');
      if (published) published.remove();
      const articleAuthor = document.head.querySelector('meta[property="article:author"]');
      if (articleAuthor) articleAuthor.remove();
      schemas.forEach((_, index) => upsertJsonLd(`artigos-jsonld-${index}`, null));
    };
  }, [title, description, path, type, image, imageAlt, publishedTime, author, jsonLdKey]);
}
