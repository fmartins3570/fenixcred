import "./Hero.css";
import { trackEvent, generateEventId } from '../utils/metaPixel'
import { sendServerEvent } from '../utils/metaCAPI'
import { tagMessage } from '../utils/utmParams'
// Imports das versões responsivas otimizadas
// Versões normais (1x) para telas padrão
import modeloImage400w from "../assets/modelo_fenix_cred-400w.webp";
import modeloImage525w from "../assets/modelo_fenix_cred-525w.webp";
import modeloImage1050w from "../assets/modelo_fenix_cred-1050w.webp";
// Versões p2 (2x) para telas de alta densidade (retina)
// IMPORTANTE: Certifique-se de que estes arquivos existem em src/assets/
import modeloImage400wp2 from "../assets/modelo_fenix_cred-400wp2.webp";
import modeloImage525wp2 from "../assets/modelo_fenix_cred-525wp2.webp";
import modeloImage1050wp2 from "../assets/modelo_fenix_cred-1050wp2.webp";

/**
 * Componente Hero - Seção principal
 *
 * Layout 2 colunas:
 * - Esquerda: Subtítulo, título em amarelo, descrição, 2 botões
 * - Direita: Imagem hero com círculo amarelo de fundo
 *
 * Cores: Fundo escuro, texto branco, acentos amarelo e verde neon
 */
function Hero() {
  const openWhatsApp = () => {
    const eventId = generateEventId()
    trackEvent('Contact', { content_name: 'Hero WhatsApp', content_category: 'whatsapp' }, eventId)
    sendServerEvent('Contact', eventId, { page: 'Hero' })
    const msg = encodeURIComponent(tagMessage('(home) Olá, gostaria de simular o crédito para o CLT.'))
    window.open(
      `https://api.whatsapp.com/send?phone=5511917082143&text=${msg}`,
      "_blank"
    );
  };

  return (
    <section id="inicio" className="hero">
      <div className="hero-container">
        <div className="hero-content">
          {/* Coluna Esquerda - Texto */}
          <div className="hero-text">
            {/* Subtítulo pequeno com borda amarela */}
            <div className="hero-badge">Correspondente bancário desde 2018</div>

            {/* Título grande em amarelo - H1 otimizado para SEO */}
            <h1 className="hero-title">
              Crédito CLT e Antecipação do FGTS de forma simples e segura
            </h1>

            {/* Subheadline */}
            <p className="hero-subheadline">
              +90 mil clientes atendidos ao mês • +20 colaboradores • 4.8 nota de avaliação no Google • 2018 atuando no mercado
            </p>

            {/* Descrição */}
            <p className="hero-description">
              Trabalhamos com agilidade, transparência e compromisso para oferecer Crédito CLT e antecipação do FGTS de forma simples e segura. Atendemos trabalhadores com carteira assinada que buscam liberar crédito rápido, com taxas justas e sem burocracia. 
              Atendemos todo Brasil! 🇧🇷
            </p>

            {/* Botões CTA */}
            <div className="hero-buttons">
              <button className="btn-primary" onClick={openWhatsApp}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                Fale Conosco
              </button>

              <a href="#servicos" className="btn-secondary">
                Simular crédito CLT
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z" />
                </svg>
              </a>
            </div>

            {/* Informações de taxas — obrigatório Meta Ads serviços financeiros */}
            <div className="hero-rates">
              <p>Taxas a partir de <strong>1,49% a.m.</strong> | CET a partir de <strong>29,90% a.a.</strong></p>
              <p className="hero-rates-disclaimer">Condições sujeitas a análise de crédito. A Fenix Cred atua como correspondente bancário.</p>
            </div>
          </div>

          {/* Coluna Direita - Imagem */}
          <div className="hero-image">
            <div className="hero-image-wrapper">
              <div className="hero-circle" data-spotlight-frame></div>
              <div className="hero-person">
                <picture>
                  {/* Mobile: até 640px - LCP image para mobile */}
                  {/* 1x para telas normais, p2 para telas retina (2x) */}
                  <source
                    srcSet={`${modeloImage400w} 1x, ${modeloImage400wp2} 2x`}
                    media="(max-width: 640px)"
                    type="image/webp"
                  />
                  {/* Tablet: 641px - 1024px */}
                  {/* 1x para telas normais, p2 para telas retina (2x) */}
                  <source
                    srcSet={`${modeloImage525w} 1x, ${modeloImage525wp2} 2x`}
                    media="(min-width: 641px) and (max-width: 1024px)"
                    type="image/webp"
                  />
                  {/* Desktop: 1025px+ - LCP image para desktop */}
                  {/* 1x para telas normais, p2 para telas retina (2x) */}
                  <source
                    srcSet={`${modeloImage525w} 1x, ${modeloImage525wp2} 2x`}
                    media="(min-width: 1025px)"
                    type="image/webp"
                  />
                  {/* Imagem LCP - Otimizada para detecção imediata e carregamento prioritário */}
                  {/* srcSet com versões normais (1x) e p2 (2x) para diferentes densidades de pixel */}
                  {/* O navegador escolhe automaticamente baseado na densidade da tela */}
                  <img
                    src={modeloImage525w}
                    srcSet={`${modeloImage400w} 400w, ${modeloImage400wp2} 800w, ${modeloImage525w} 525w, ${modeloImage525wp2} 1050w, ${modeloImage1050w} 1050w, ${modeloImage1050wp2} 2100w`}
                    sizes="(max-width: 640px) 400px, (max-width: 1024px) 525px, 525px"
                    alt="Fênix Cred – correspondente bancário de crédito consignado em São Paulo, Zona Leste"
                    className="hero-model-image"
                    loading="eager"
                    fetchpriority="high"
                    decoding="async"
                    width="525"
                    height="783"
                  />
                </picture>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
