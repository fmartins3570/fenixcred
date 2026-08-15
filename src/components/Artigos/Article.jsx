import { useEffect, useState } from "react";
import Header from "../Header";
import Footer from "../Footer";
import BackToTop from "../BackToTop";
import CookieBanner from "../CookieBanner";
import { getArtigoBySlug, getRelatedArtigos, formatDateLong } from "../../data/artigos";
import { ARTIGOS_CONTENT } from "../../data/artigos-content";
import { loadArtigo } from "../../utils/artigosApi";
import { usePageMeta } from "../../hooks/usePageMeta";
import { tagMessage } from "../../utils/utmParams";
import { trackEvent, generateEventId } from "../../utils/metaPixel";
import { sendServerEvent } from "../../utils/metaCAPI";
import ArticleBody from "./ArticleBody";
import ArticleCard from "./ArticleCard";
import "./index.css";

const SITE = "https://fenixcredbr.com.br";

function openWhatsApp(slug) {
  const eventId = generateEventId();
  trackEvent(
    "Contact",
    { content_name: `Artigo ${slug}`, content_category: "whatsapp", value: 3, currency: "BRL" },
    eventId,
  );
  sendServerEvent("Contact", eventId, { page: `Artigo ${slug}` }, { value: 3, currency: "BRL" });
  const msg = encodeURIComponent(
    tagMessage(`(artigo/${slug}) Olá, li o artigo e quero simular o crédito.`),
  );
  window.open(`https://api.whatsapp.com/send?phone=5511917082143&text=${msg}`, "_blank");
}

function Article({ slug }) {
  const staticPost = slug ? getArtigoBySlug(slug) : undefined;
  const [artigo, setArtigo] = useState(staticPost);
  const [sections, setSections] = useState(slug ? ARTIGOS_CONTENT[slug] : undefined);
  const [contentHtml, setContentHtml] = useState(staticPost?.content ?? null);
  const [related, setRelated] = useState(slug ? getRelatedArtigos(slug) : []);
  const [loading, setLoading] = useState(!staticPost);

  useEffect(() => {
    if (!slug) return undefined;
    let cancelled = false;
    loadArtigo(slug).then((result) => {
      if (cancelled) return;
      setArtigo(result.post);
      setContentHtml(result.content);
      setSections(result.sections);
      setRelated(result.related);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const seoTitle = artigo
    ? artigo.seo_title?.trim() || `${artigo.titulo} | Fênix Cred`
    : "Artigo não encontrado | Fênix Cred";
  const seoDesc = artigo
    ? artigo.meta_description?.trim() || artigo.descricao
    : "O artigo que você procura não está disponível.";

  usePageMeta({
    title: seoTitle,
    description: seoDesc,
    path: artigo ? `/artigos/${artigo.slug}` : "/artigos",
    type: artigo ? "article" : "website",
    image: artigo?.imagem,
    imageAlt: artigo?.alt,
    publishedTime: artigo?.data,
    author: artigo?.autor,
    jsonLd: artigo
      ? [
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: artigo.titulo,
            description: seoDesc,
            image: `${SITE}${artigo.imagem}`,
            datePublished: artigo.data,
            author: { "@type": "Organization", name: artigo.autor },
            publisher: {
              "@type": "Organization",
              name: "Fênix Cred",
              logo: { "@type": "ImageObject", url: `${SITE}/assets/logo-fenix-cred.webp` },
            },
            mainEntityOfPage: `${SITE}/artigos/${artigo.slug}`,
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
              { "@type": "ListItem", position: 2, name: "Artigos", item: `${SITE}/artigos` },
              {
                "@type": "ListItem",
                position: 3,
                name: artigo.titulo,
                item: `${SITE}/artigos/${artigo.slug}`,
              },
            ],
          },
        ]
      : [],
  });

  if (loading) {
    return (
      <div className="App artigos-page">
        <Header />
        <main>
          <section className="artigos-hero" aria-labelledby="artigos-hero-title">
            <div className="artigos-hero-inner">
              <p className="artigos-eyebrow">Artigos</p>
              <h1 id="artigos-hero-title">Carregando artigo…</h1>
            </div>
          </section>
        </main>
        <CookieBanner />
      </div>
    );
  }

  if (!artigo) {
    return (
      <div className="App artigos-page">
        <Header />
        <main>
          <section className="artigos-hero" aria-labelledby="artigos-hero-title">
            <div className="artigos-hero-inner">
              <p className="artigos-eyebrow">Artigos</p>
              <h1 id="artigos-hero-title">Artigo não encontrado</h1>
              <p className="artigos-hero-sub">Esse endereço não corresponde a nenhum artigo publicado.</p>
              <a className="artigos-back" href="/artigos">
                Voltar aos artigos
              </a>
            </div>
          </section>
        </main>
        <Footer />
        <CookieBanner />
      </div>
    );
  }

  return (
    <div className="App artigos-page">
      <Header />
      <main>
        <section className="artigos-hero" aria-labelledby="artigos-hero-title">
          <div className="artigos-hero-inner">
            <nav className="artigos-breadcrumb" aria-label="Trilha">
              <ol>
                <li>
                  <a href="/">Home</a>
                </li>
                <li>
                  <a href="/artigos">Artigos</a>
                </li>
                <li>
                  <span aria-current="page">{artigo.tags[0]}</span>
                </li>
              </ol>
            </nav>
            <p className="artigos-eyebrow">{artigo.tags[0]}</p>
            <h1 id="artigos-hero-title">{artigo.titulo}</h1>
            <p className="artigos-hero-sub">{artigo.descricao}</p>
            <span className="artigos-hero-rule" aria-hidden="true" />
          </div>
        </section>

        <article className="artigos-detail">
          <div className="artigos-detail-inner">
            <div className="artigos-byline">
              <span>{artigo.autor}</span>
              <time dateTime={artigo.data}>{formatDateLong(artigo.data)}</time>
            </div>

            <figure className="artigos-cover">
              <img
                src={artigo.imagem}
                alt={artigo.alt}
                width={1280}
                height={720}
                decoding="async"
              />
              <figcaption>{artigo.alt}</figcaption>
            </figure>

            <ArticleBody sections={sections} content={contentHtml} />
          </div>
        </article>

        {related.length > 0 && (
          <section className="artigos-related" aria-labelledby="artigos-related-title">
            <div className="artigos-related-inner">
              <h2 id="artigos-related-title">Artigos relacionados</h2>
              <ul className="artigos-related-grid">
                {related.map((item) => (
                  <li key={item.slug}>
                    <ArticleCard artigo={item} headingLevel="h3" compact />
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        <section className="artigos-cta" aria-labelledby="artigos-cta-title">
          <div className="artigos-cta-inner">
            <p className="artigos-eyebrow">Próximo passo</p>
            <h2 id="artigos-cta-title">Simule o crédito com quem lê a margem com você</h2>
            <p>Chame no WhatsApp e a Fênix Cred monta a proposta com o seu contracheque em mãos.</p>
            <button type="button" className="artigos-cta-btn" onClick={() => openWhatsApp(artigo.slug)}>
              Falar no WhatsApp
            </button>
          </div>
        </section>
      </main>
      <Footer />
      <BackToTop />
      <CookieBanner />
    </div>
  );
}

export default Article;
