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
// Global exit-intent email capture — rendered on every marketing route
const EmailCapturePopup = lazy(() => import("./components/EmailCapturePopup"));

function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const activeSection = useActiveSection();
  // Manter ordem de hooks estável entre rotas
  const [shouldLoadReviews, reviewsRef] = useLazyComponent("300px");
  const [shouldLoadParceiros, parceirosRef] = useLazyComponent("300px");
  const [shouldLoadFAQ, faqRef] = useLazyComponent("300px");
  const [shouldLoadTrabalhe, trabalheRef] = useLazyComponent("300px");

  useEffect(() => {
    const pathname = window.location.pathname;

    // Landing pages por angulo — ConsignadoLP
    if (pathname === "/consignado-negativado" || pathname === "/consignado-negativado/") {
      setCurrentPage("consignado-negativado");
      return;
    }
    if (pathname === "/consignado-rapido" || pathname === "/consignado-rapido/") {
      setCurrentPage("consignado-rapido");
      return;
    }
    if (pathname === "/consignado-clt" || pathname === "/consignado-clt/") {
      setCurrentPage("consignado-clt");
      return;
    }
    if (pathname === "/antecipacao-fgts" || pathname === "/antecipacao-fgts/") {
      setCurrentPage("antecipacao-fgts");
      return;
    }

    // Verifica o pathname para simulação consignado CLT (questionário interativo)
    if (pathname === "/simulacao-consignado-clt" || pathname === "/simulacao-consignado-clt/") {
      setCurrentPage("simulacao-clt");
      return;
    }

    // V2 quiz — 4 perguntas, validação
    if (pathname === "/simulacao-clt-v2" || pathname === "/simulacao-clt-v2/") {
      setCurrentPage("simulacao-clt-v2");
      return;
    }

    // V3 quiz — 4 perguntas + calculadora obrigatória
    if (pathname === "/simulacao-clt-v3" || pathname === "/simulacao-clt-v3/") {
      setCurrentPage("simulacao-clt-v3");
      return;
    }

    // Simulação crédito com garantia (Creditas recovery flow)
    if (pathname === "/simulacao-credito-garantia" || pathname === "/simulacao-credito-garantia/") {
      setCurrentPage("simulacao-credito");
      return;
    }

    // Verifica o pathname para landing page CLT personalizada (com popup + greeting)
    if (pathname === "/page-credito-clt-personalizado" || pathname === "/page-credito-clt-personalizado/") {
      setCurrentPage("credito-clt-personalizado");
      return;
    }

    // Verifica o pathname para landing page CLT (sem popup)
    if (pathname === "/page-credito-clt" || pathname === "/page-credito-clt/") {
      setCurrentPage("credito-clt");
      return;
    }

    // Verifica o pathname para política de privacidade (URL standalone para Meta Developers)
    if (pathname === "/politica-privacidade" || pathname === "/politica-privacidade/") {
      setCurrentPage("privacy-standalone");
      return;
    }

    // Verifica o pathname para exclusão de dados (Meta Developers - Data Deletion)
    if (pathname === "/exclusao-de-dados" || pathname === "/exclusao-de-dados/") {
      setCurrentPage("data-deletion");
      return;
    }

    // Verifica o hash na URL ao carregar a página
    const hash = window.location.hash.replace("#", "");
    if (hash === "politica-privacidade") {
      setCurrentPage("privacy");
    } else {
      setCurrentPage("home");
    }

    // Escuta mudanças no pathname e hash
    const handleLocationChange = () => {
      const newPathname = window.location.pathname;
      // Landing pages por angulo — ConsignadoLP
      if (newPathname === "/consignado-negativado" || newPathname === "/consignado-negativado/") {
        setCurrentPage("consignado-negativado");
        return;
      }
      if (newPathname === "/consignado-rapido" || newPathname === "/consignado-rapido/") {
        setCurrentPage("consignado-rapido");
        return;
      }
      if (newPathname === "/consignado-clt" || newPathname === "/consignado-clt/") {
        setCurrentPage("consignado-clt");
        return;
      }
      if (newPathname === "/antecipacao-fgts" || newPathname === "/antecipacao-fgts/") {
        setCurrentPage("antecipacao-fgts");
        return;
      }

      if (newPathname === "/simulacao-consignado-clt" || newPathname === "/simulacao-consignado-clt/") {
        setCurrentPage("simulacao-clt");
        return;
      }

      if (newPathname === "/simulacao-clt-v2" || newPathname === "/simulacao-clt-v2/") {
        setCurrentPage("simulacao-clt-v2");
        return;
      }

      if (newPathname === "/simulacao-clt-v3" || newPathname === "/simulacao-clt-v3/") {
        setCurrentPage("simulacao-clt-v3");
        return;
      }

      if (newPathname === "/simulacao-credito-garantia" || newPathname === "/simulacao-credito-garantia/") {
        setCurrentPage("simulacao-credito");
        return;
      }

      if (newPathname === "/page-credito-clt-personalizado" || newPathname === "/page-credito-clt-personalizado/") {
        setCurrentPage("credito-clt-personalizado");
        return;
      }

      if (newPathname === "/page-credito-clt" || newPathname === "/page-credito-clt/") {
        setCurrentPage("credito-clt");
        return;
      }

      if (newPathname === "/politica-privacidade" || newPathname === "/politica-privacidade/") {
        setCurrentPage("privacy-standalone");
        return;
      }

      if (newPathname === "/exclusao-de-dados" || newPathname === "/exclusao-de-dados/") {
        setCurrentPage("data-deletion");
        return;
      }

      const newHash = window.location.hash.replace("#", "");
      if (newHash === "politica-privacidade") {
        setCurrentPage("privacy");
      } else {
        setCurrentPage("home");
      }
    };

    window.addEventListener("hashchange", handleLocationChange);
    window.addEventListener("popstate", handleLocationChange);
    return () => {
      window.removeEventListener("hashchange", handleLocationChange);
      window.removeEventListener("popstate", handleLocationChange);
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
