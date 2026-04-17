import { useCallback } from "react";
import "./Hero.css";
import Simulator from "./ConsignadoLP/Simulator";
import PreQualForm from "./shared/PreQualForm";
import { trackEvent, generateEventId } from "../utils/metaPixel";
import { sendServerEvent } from "../utils/metaCAPI";
import { tagMessage } from "../utils/utmParams";

/**
 * Hero component — homepage entry point.
 *
 * Layout:
 * - Desktop: 2 columns — institutional text + CTAs (left) | PreQualForm stacked
 *   with Simulator (right).
 * - Mobile: everything stacked. CTAs live above the form for quick access;
 *   the form is the main conversion surface.
 *
 * Tracking:
 * - PreQualForm fires its own ViewContent / PreQualStart / Lead events
 *   (source tag: 'home'). Simulator fires CustomizeProduct. The Hero only
 *   handles the Simulator -> WhatsApp handoff (Contact event).
 */
function Hero() {
  // Homepage pre-qualification tag — yields WhatsApp tags like
  // "home-prequal-sim" / "home-prequal-naosei" so VendeAI/CAPI can segment.
  const HOME_TAG = "home";
  const WHATSAPP_NUMBER = "5511917082143";

  // Simulator -> WhatsApp handoff with parcela estimate included
  const handleSimulate = useCallback((value, term, installment) => {
    const formattedValue = value.toLocaleString("pt-BR");
    const formattedInstallment = installment.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    const body = `Olá! Gostaria de simular um crédito consignado CLT.\nValor: R$ ${formattedValue} | Prazo: ${term}x | Parcela estimada: R$ ${formattedInstallment}`;

    const eventId = generateEventId();
    trackEvent(
      "Contact",
      {
        content_name: `WhatsApp Simulador ${HOME_TAG}`,
        content_category: "whatsapp",
        value,
        currency: "BRL",
      },
      eventId
    );
    sendServerEvent(
      "Contact",
      eventId,
      { page: window.location.pathname },
      { value, currency: "BRL" }
    );

    const tagged = tagMessage(`(${HOME_TAG}-simulador) ${body}`);
    const encoded = encodeURIComponent(tagged);
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`,
      "_blank",
      "noopener,noreferrer"
    );
  }, []);

  // Primary CTA: smooth-scroll to the PreQualForm and focus its first actionable button
  const handleStartPreQual = useCallback((e) => {
    e.preventDefault();
    const el = document.getElementById("home-prequal");
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    // After the scroll settles, move focus to the first option button for a11y
    window.setTimeout(() => {
      const firstBtn = el.querySelector(".prequal-form__option");
      if (firstBtn) firstBtn.focus({ preventScroll: true });
    }, 450);
  }, []);

  return (
    <section id="inicio" className="hero">
      <div className="hero-container">
        <div className="hero-content">
          {/* Left Column — institutional copy + CTAs */}
          <div className="hero-text">
            {/* Small pill badge */}
            <div className="hero-badge">Correspondente bancário desde 2018</div>

            {/* H1 — SEO-critical */}
            <h1 className="hero-title">
              Crédito CLT e Antecipação do FGTS de forma simples e segura
            </h1>

            {/* Subheadline — preserves institutional stats */}
            <p className="hero-subheadline">
              +90 mil clientes atendidos ao mês • +20 colaboradores • 4.8 nota
              de avaliação no Google • 2018 atuando no mercado
            </p>

            {/* Descriptive paragraph */}
            <p className="hero-description">
              Trabalhamos com agilidade, transparência e compromisso para
              oferecer Crédito CLT e antecipação do FGTS de forma simples e
              segura. Atendemos trabalhadores com carteira assinada que buscam
              liberar crédito rápido, com taxas justas e sem burocracia.
              Atendemos todo Brasil! 🇧🇷
            </p>

            {/* CTAs — now aligned to the pre-qualification flow */}
            <div className="hero-buttons">
              <a
                href="#home-prequal"
                className="btn-primary"
                onClick={handleStartPreQual}
                aria-label="Começar pré-simulação de crédito"
              >
                Começar pré-simulação
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z" />
                </svg>
              </a>

              <a
                href="#servicos"
                className="btn-secondary"
                aria-label="Conhecer produtos e serviços"
              >
                Conhecer produtos
              </a>
            </div>

            {/* Compliance — rates info required by Meta Ads for finance */}
            <div className="hero-rates">
              <p>
                Taxas a partir de <strong>1,49% a.m.</strong> | CET a partir de{" "}
                <strong>29,90% a.a.</strong>
              </p>
              <p className="hero-rates-disclaimer">
                Condições sujeitas a análise de crédito. A Fenix Cred atua como
                correspondente bancário.
              </p>
            </div>
          </div>

          {/* Right Column — PreQualForm + Simulator stacked */}
          <aside
            className="hero-conversion"
            aria-label="Pré-qualificação e simulador de crédito"
          >
            <div id="home-prequal" className="hero-prequal-anchor">
              <PreQualForm
                sourceTag={HOME_TAG}
                whatsAppNumber={WHATSAPP_NUMBER}
                variant="yellow"
                title="Pré-qualifique em 20 segundos"
              />
            </div>

            <div
              className="hero-simulator-block"
              aria-labelledby="home-simulator-heading"
            >
              <div className="hero-simulator-header">
                <h2
                  id="home-simulator-heading"
                  className="hero-simulator-heading"
                >
                  Simule sua parcela
                </h2>
                <p className="hero-simulator-sub">
                  Veja quanto caberia no seu bolso antes de falar com um
                  especialista.
                </p>
              </div>
              <Simulator
                tag={HOME_TAG}
                onSimulate={handleSimulate}
                mode="parcelado"
              />
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

export default Hero;
