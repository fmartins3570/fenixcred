/**
 * Componente App - Componente principal da aplicação
 *
 * Organiza todas as seções do site na ordem exata:
 * 1. Header (fixo no topo)
 * 2. Hero
 * 3. Stats
 * 4. About (Sobre Nós)
 * 5. Diferenciais
 * 6. Services (Serviços)
 * 7. Avaliações Google
 * 8. Parceiros
 * 9. FAQ
 * 10. Trabalhe Conosco
 * 11. Footer
 *
 * Sistema de roteamento simples baseado em hash para páginas separadas
 */
import { useState, useEffect, Suspense, lazy } from "react";
import Header from "./components/Header";
import Breadcrumb from "./components/Breadcrumb";
import Hero from "./components/Hero";
import Stats from "./components/Stats";
import About from "./components/About";
import Diferenciais from "./components/Diferenciais";
import Services from "./components/Services";
import Footer from "./components/Footer";
import SectionDivider from "./components/SectionDivider";
import SchemaJSON from "./components/SchemaJSON";
import BackToTop from "./components/BackToTop";
import CookieBanner from "./components/CookieBanner";
import { useActiveSection } from "./hooks/useActiveSection";
import { useLazyComponent } from "./hooks/useLazyComponent";
import "./App.css";

// Lazy load de componentes abaixo da dobra (reduz bundle inicial)
// Carregamento será adiado até que a seção esteja próxima de ficar visível
const Parceiros = lazy(() => import("./components/Parceiros"));
const FAQ = lazy(() => import("./components/FAQ"));
const TrabalheConosco = lazy(() => import("./components/TrabalheConosco"));
const PrivacyPolicy = lazy(() => import("./components/PrivacyPolicy"));
const ReviewsSection = lazy(() => import("./components/ReviewsSection"));
const CreditoCLT = lazy(() => import("./components/CreditoCLT"));
const SimulacaoCLT = lazy(() => import("./components/SimulacaoCLT"));
const SimulacaoCLTV2 = lazy(() => import("./components/SimulacaoCLTV2"));
const SimulacaoCLTV3 = lazy(() => import("./components/SimulacaoCLTV3"));
const SimulacaoCredito = lazy(() => import("./components/SimulacaoCredito"));
const DataDeletion = lazy(() => import("./components/DataDeletion"));
const ConsignadoLP = lazy(() => import("./components/ConsignadoLP"));
const Investidores = lazy(() => import("./components/Investidores"));
const Artigos = lazy(() => import("./components/Artigos"));
const Artigo = lazy(() => import("./components/Artigos/Article"));
// Global exit-intent email capture — rendered on every marketing route
const EmailCapturePopup = lazy(() => import("./components/EmailCapturePopup"));

const PATH_PAGES = {
  "/consignado-negativado": "consignado-negativado",
  "/consignado-rapido": "consignado-rapido",
  "/consignado-clt": "consignado-clt",
  "/antecipacao-fgts": "antecipacao-fgts",
  "/investidores": "investidores",
  "/simulacao-consignado-clt": "simulacao-clt",
  "/simulacao-clt-v2": "simulacao-clt-v2",
  "/simulacao-clt-v3": "simulacao-clt-v3",
  "/simulacao-credito-garantia": "simulacao-credito",
  "/page-credito-clt-personalizado": "credito-clt-personalizado",
  "/page-credito-clt": "credito-clt",
  "/politica-privacidade": "privacy-standalone",
  "/exclusao-de-dados": "data-deletion",
};

function normalizePath(pathname) {
  if (!pathname || pathname === "/") return "/";
  return pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
}

function resolveLocation(pathname, hash) {
  const path = normalizePath(pathname);
  if (path === "/artigos") return { page: "artigos", slug: null };
  if (path.startsWith("/artigos/")) {
    const slug = path.slice("/artigos/".length);
    if (slug && !slug.includes("/")) return { page: "artigo", slug };
  }
  if (PATH_PAGES[path]) return { page: PATH_PAGES[path], slug: null };
  if ((hash || "").replace("#", "") === "politica-privacidade") {
    return { page: "privacy", slug: null };
  }
  return { page: "home", slug: null };
}

function getInitialLocation() {
  if (typeof window === "undefined") return { page: "home", slug: null };
  return resolveLocation(window.location.pathname, window.location.hash);
}

function App() {
  const initialLocation = getInitialLocation();
  const [currentPage, setCurrentPage] = useState(initialLocation.page);
  const [artigoSlug, setArtigoSlug] = useState(initialLocation.slug);
  const activeSection = useActiveSection();
  // Manter ordem de hooks estável entre rotas
  const [shouldLoadReviews, reviewsRef] = useLazyComponent("300px");
  const [shouldLoadParceiros, parceirosRef] = useLazyComponent("300px");
  const [shouldLoadFAQ, faqRef] = useLazyComponent("300px");
  const [shouldLoadTrabalhe, trabalheRef] = useLazyComponent("300px");

  useEffect(() => {
    const applyLocation = () => {
      const { page, slug } = resolveLocation(window.location.pathname, window.location.hash);
      setCurrentPage(page);
      setArtigoSlug(slug);
    };

    applyLocation();
    window.addEventListener("hashchange", applyLocation);
    window.addEventListener("popstate", applyLocation);
    return () => {
      window.removeEventListener("hashchange", applyLocation);
      window.removeEventListener("popstate", applyLocation);
    };
  }, []);

  // Landing pages por angulo — ConsignadoLP
  if (
    currentPage === "consignado-negativado" ||
    currentPage === "consignado-rapido" ||
    currentPage === "consignado-clt" ||
    currentPage === "antecipacao-fgts"
  ) {
    const angleMap = {
      "consignado-negativado": "negativado",
      "consignado-rapido": "velocidade",
      "consignado-clt": "geral",
      "antecipacao-fgts": "fgts",
    };
    return (
      <div className="App">
        <Suspense
          fallback={
            <div
              style={{ padding: "2rem", textAlign: "center", color: "#fff" }}
            >
              Carregando...
            </div>
          }
        >
          <ConsignadoLP angle={angleMap[currentPage]} />
        </Suspense>
        <Suspense fallback={null}>
          <EmailCapturePopup />
        </Suspense>
      </div>
    );
  }

  // Apresentacao para investidores — sem EmailCapturePopup e sem tracking de midia
  if (currentPage === "investidores") {
    return (
      <div className="App">
        <Suspense
          fallback={
            <div
              style={{ padding: "2rem", textAlign: "center", color: "#fff" }}
            >
              Carregando...
            </div>
          }
        >
          <Investidores />
        </Suspense>
      </div>
    );
  }

  // Landing page Simulação CLT (questionário interativo de pré-qualificação)
  if (currentPage === "simulacao-clt") {
    return (
      <div className="App">
        <Suspense
          fallback={
            <div
              style={{ padding: "2rem", textAlign: "center", color: "#fff" }}
            >
              Carregando...
            </div>
          }
        >
          <SimulacaoCLT />
        </Suspense>
        <Suspense fallback={null}>
          <EmailCapturePopup />
        </Suspense>
      </div>
    );
  }

  // V2 quiz — 4 perguntas, validação
  if (currentPage === "simulacao-clt-v2") {
    return (
      <div className="App">
        <Suspense
          fallback={
            <div
              style={{ padding: "2rem", textAlign: "center", color: "#fff" }}
            >
              Carregando...
            </div>
          }
        >
          <SimulacaoCLTV2 />
        </Suspense>
        <Suspense fallback={null}>
          <EmailCapturePopup />
        </Suspense>
      </div>
    );
  }

  // V3 quiz — 4 perguntas + calculadora obrigatória
  if (currentPage === "simulacao-clt-v3") {
    return (
      <div className="App">
        <Suspense
          fallback={
            <div
              style={{ padding: "2rem", textAlign: "center", color: "#fff" }}
            >
              Carregando...
            </div>
          }
        >
          <SimulacaoCLTV3 />
        </Suspense>
        <Suspense fallback={null}>
          <EmailCapturePopup />
        </Suspense>
      </div>
    );
  }

  // Simulação crédito com garantia (quiz + recovery Creditas)
  if (currentPage === "simulacao-credito") {
    return (
      <div className="App">
        <Suspense
          fallback={
            <div
              style={{ padding: "2rem", textAlign: "center", color: "#fff" }}
            >
              Carregando...
            </div>
          }
        >
          <SimulacaoCredito />
        </Suspense>
        <Suspense fallback={null}>
          <EmailCapturePopup />
        </Suspense>
      </div>
    );
  }

  // Landing page CLT personalizada (com popup de captura + greeting)
  if (currentPage === "credito-clt-personalizado") {
    return (
      <div className="App">
        <Suspense
          fallback={
            <div
              style={{ padding: "2rem", textAlign: "center", color: "#fff" }}
            >
              Carregando...
            </div>
          }
        >
          <CreditoCLT personalized />
        </Suspense>
        <Suspense fallback={null}>
          <EmailCapturePopup />
        </Suspense>
      </div>
    );
  }

  // Landing page CLT padrão (sem popup, sem personalização)
  if (currentPage === "credito-clt") {
    return (
      <div className="App">
        <Suspense
          fallback={
            <div
              style={{ padding: "2rem", textAlign: "center", color: "#fff" }}
            >
              Carregando...
            </div>
          }
        >
          <CreditoCLT />
        </Suspense>
        <Suspense fallback={null}>
          <EmailCapturePopup />
        </Suspense>
      </div>
    );
  }

  // Listagem de artigos (modelo Mariano Santana)
  if (currentPage === "artigos") {
    return (
      <div className="App">
        <Suspense
          fallback={
            <div
              style={{ padding: "2rem", textAlign: "center", color: "#fff" }}
            >
              Carregando...
            </div>
          }
        >
          <Artigos />
        </Suspense>
        <Suspense fallback={null}>
          <EmailCapturePopup />
        </Suspense>
      </div>
    );
  }

  // Artigo individual
  if (currentPage === "artigo") {
    return (
      <div className="App">
        <Suspense
          fallback={
            <div
              style={{ padding: "2rem", textAlign: "center", color: "#fff" }}
            >
              Carregando...
            </div>
          }
        >
          <Artigo slug={artigoSlug} />
        </Suspense>
        <Suspense fallback={null}>
          <EmailCapturePopup />
        </Suspense>
      </div>
    );
  }

  // Exclusão de dados standalone (Meta Developers - Data Deletion Instructions)
  if (currentPage === "data-deletion") {
    return (
      <div className="App">
        <Suspense
          fallback={
            <div
              style={{ padding: "2rem", textAlign: "center", color: "#fff" }}
            >
              Carregando...
            </div>
          }
        >
          <DataDeletion />
        </Suspense>
      </div>
    );
  }

  // Política de privacidade standalone (URL direta, sem header/footer do site)
  // Usada para Meta Developers e links externos
  if (currentPage === "privacy-standalone") {
    return (
      <div className="App">
        <Suspense
          fallback={
            <div
              style={{ padding: "2rem", textAlign: "center", color: "#fff" }}
            >
              Carregando...
            </div>
          }
        >
          <PrivacyPolicy />
        </Suspense>
      </div>
    );
  }

  // Se estiver na página de política de privacidade (via hash), mostra com header/footer
  if (currentPage === "privacy") {
    return (
      <div className="App">
        <SchemaJSON />
        <Header />
        <Breadcrumb currentSection="politica-privacidade" />
        <main>
          <Suspense
            fallback={
              <div
                style={{ padding: "2rem", textAlign: "center", color: "#fff" }}
              >
                Carregando...
              </div>
            }
          >
            <PrivacyPolicy />
          </Suspense>
        </main>
        <Footer />
        <Suspense fallback={null}>
          <EmailCapturePopup />
        </Suspense>
      </div>
    );
  }

  // Página principal
  return (
    <div className="App">
      <SchemaJSON />
      <Header />
      <Breadcrumb currentSection={activeSection} />
      <main>
        <Hero />
        <SectionDivider />
        <Stats />
        <SectionDivider />
        <About />
        <SectionDivider />
        <Diferenciais />
        <SectionDivider />
        <Services />
        <SectionDivider />
        {/* ReviewsSection - Carregar apenas quando próximo de ficar visível */}
        <div ref={reviewsRef}>
          {shouldLoadReviews && (
            <Suspense fallback={null}>
              <ReviewsSection />
            </Suspense>
          )}
        </div>
        <SectionDivider />
        {/* Parceiros - Carregar apenas quando próximo de ficar visível */}
        <div ref={parceirosRef}>
          {shouldLoadParceiros && (
            <Suspense fallback={null}>
              <Parceiros />
            </Suspense>
          )}
        </div>
        <SectionDivider />
        {/* FAQ - Carregar apenas quando próximo de ficar visível */}
        <div ref={faqRef}>
          {shouldLoadFAQ && (
            <Suspense fallback={null}>
              <FAQ />
            </Suspense>
          )}
        </div>
        <SectionDivider />
        {/* TrabalheConosco - Carregar apenas quando próximo de ficar visível */}
        <div ref={trabalheRef}>
          {shouldLoadTrabalhe && (
            <Suspense fallback={null}>
              <TrabalheConosco />
            </Suspense>
          )}
        </div>
      </main>
      <Footer />
      <BackToTop />
      <CookieBanner />
      <Suspense fallback={null}>
        <EmailCapturePopup />
      </Suspense>
    </div>
  );
}

export default App;
