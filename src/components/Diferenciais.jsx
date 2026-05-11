import { useState } from "react";
import "./Diferenciais.css";

/**
 * Componente Diferenciais - Seção de diferenciais da empresa
 *
 * Carousel com 6 cards (3 visíveis por vez):
 * - Nossa Missão
 * - Nossa Visão
 * - Uma empresa de valores
 * - Atendimento Fênix
 * - As melhores taxas do mercado
 * - Crédito descomplicado + Agilidade e praticidade
 */
function Diferenciais() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const diferenciais = [
    {
      id: 1,
      title: "Nossa Missão",
      description:
        "Democratizar o acesso ao crédito CLT, oferecendo condições acessíveis e transparentes aos nossos clientes.",
      icon: "🎯",
    },
    {
      id: 2,
      title: "Nossa Visão",
      description:
        "Somos referência em soluções de crédito para o CLT, reconhecida pela excelência no atendimento e inovação.",
      icon: "👁️",
    },
    {
      id: 3,
      title: "Uma empresa de valores",
      description:
        "Trabalhamos com ética, transparência e compromisso, sempre colocando o nosso cliente em primeiro lugar.",
      icon: "💎",
    },
    {
      id: 4,
      title: "Atendimento Fênix",
      description:
        "Nossa equipe especializada está pronta para oferecer o melhor atendimento e suporte em todas as etapas.",
      icon: "🤝",
    },
    {
      id: 5,
      title: "As melhores taxas do mercado",
      description:
        "Negociamos as melhores condições para você, com taxas competitivas e parcelas que cabem no seu bolso.",
      icon: "💰",
    },
    {
      id: 6,
      title: "Crédito descomplicado",
      description:
        "Agilidade e praticidade em cada etapa. Processo simples, rápido e sem burocracias desnecessárias.",
      icon: "⚡",
    },
  ];

  const cardsPerView = 3;
  const maxIndex = diferenciais.length - cardsPerView;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  return (
    <section className="diferenciais">
      <div className="diferenciais-container">
        <h2 className="diferenciais-heading">
          Os diferenciais que só a Fênix tem
        </h2>

        <div className="diferenciais-carousel">
          <div className="carousel-wrapper">
            <div
              className="carousel-track"
              style={{
                transform: `translateX(-${
                  currentIndex * (100 / cardsPerView)
                }%)`,
              }}
            >
              {diferenciais.map((diferencial) => (
                <div key={diferencial.id} className="diferencial-card" data-spotlight>
                  <div className="card-icon">{diferencial.icon}</div>
                  <h3 className="card-title">{diferencial.title}</h3>
                  <p className="card-description">{diferencial.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Botões de navegação */}
          <div
            className="carousel-controls"
            role="group"
            aria-label="Controles do carrossel"
          >
            <button
              className="carousel-btn prev"
              onClick={prevSlide}
              aria-label="Anterior"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
              </svg>
            </button>
            <button
              className="carousel-btn next"
              onClick={nextSlide}
              aria-label="Próximo"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Diferenciais;
