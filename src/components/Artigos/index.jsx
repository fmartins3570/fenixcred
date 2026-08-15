import Header from "../Header";
import Footer from "../Footer";
import BackToTop from "../BackToTop";
import CookieBanner from "../CookieBanner";
import { ARTIGOS } from "../../data/artigos";
import { useEffect, useState } from "react";
import { usePageMeta } from "../../hooks/usePageMeta";
import { tagMessage } from "../../utils/utmParams";
import { trackEvent, generateEventId } from "../../utils/metaPixel";
import { sendServerEvent } from "../../utils/metaCAPI";
import { listArtigos } from "../../utils/artigosApi";
import ArticleCard from "./ArticleCard";
import "./index.css";

const TITLE = "Artigos sobre crédito CLT e FGTS | Fênix Cred";
const DESCRIPTION =
  "Artigos da Fênix Cred sobre consignado CLT, antecipação de FGTS e crédito para quem está negativado. Conteúdo prático para decidir com clareza.";

function openWhatsApp() {
  const eventId = generateEventId();
  trackEvent(
    "Contact",
    { content_name: "Artigos Index WhatsApp", content_category: "whatsapp", value: 3, currency: "BRL" },
    eventId,
  );
  sendServerEvent("Contact", eventId, { page: "Artigos" }, { value: 3, currency: "BRL" });
  const msg = encodeURIComponent(tagMessage("(artigos) Olá, li os artigos e quero simular o crédito."));
  window.open(`https://api.whatsapp.com/send?phone=5511917082143&text=${msg}`, "_blank");
}

function Artigos() {
  const [posts, setPosts] = useState(ARTIGOS);

  useEffect(() => {
    let cancelled = false;
    listArtigos().then((next) => {
      if (!cancelled) setPosts(next);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  usePageMeta({
    title: TITLE,
    description: DESCRIPTION,
    path: "/artigos",
    image: posts[0]?.imagem,
    imageAlt: posts[0]?.alt,
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: TITLE,
        description: DESCRIPTION,
        url: "https://fenixcredbr.com.br/artigos",
        isPartOf: { "@type": "WebSite", name: "Fênix Cred", url: "https://fenixcredbr.com.br" },
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://fenixcredbr.com.br/" },
          { "@type": "ListItem", position: 2, name: "Artigos", item: "https://fenixcredbr.com.br/artigos" },
        ],
      },
    ],
  });

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
                  <span aria-current="page">Artigos</span>
                </li>
              </ol>
            </nav>
            <p className="artigos-eyebrow">Artigos</p>
            <h1 id="artigos-hero-title">Crédito CLT e FGTS, explicados sem enrolação.</h1>
            <p className="artigos-hero-sub">
              O mesmo conteúdo que usamos no atendimento — regras atualizadas, checklist e o que muda na
              sua parcela.
            </p>
            <span className="artigos-hero-rule" aria-hidden="true" />
          </div>
        </section>

        <section className="artigos-listing" aria-label="Lista de artigos">
          <div className="artigos-listing-inner">
            <ul className="artigos-grid">
              {posts.map((artigo, index) => (
                <li key={artigo.slug} style={{ "--card-index": index }}>
                  <ArticleCard artigo={artigo} />
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="artigos-cta" aria-labelledby="artigos-cta-title">
          <div className="artigos-cta-inner">
            <p className="artigos-eyebrow">Simulação</p>
            <h2 id="artigos-cta-title">Quer ver o valor que cabe na sua margem?</h2>
            <p>Fale com a Fênix Cred no WhatsApp. Sem compromisso, com a proposta na sua realidade.</p>
            <button type="button" className="artigos-cta-btn" onClick={openWhatsApp}>
              Simular no WhatsApp
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

export default Artigos;
