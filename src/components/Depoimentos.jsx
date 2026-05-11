import { useState } from "react";
import "./Depoimentos.css";

/**
 * Componente Depoimentos - Seção de depoimentos de clientes
 *
 * Carousel com depoimentos de clientes satisfeitos
 */
function Depoimentos() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const depoimentos = [
    {
      id: 1,
      nome: "Maria Silva",
      cargo: "Aposentada (INSS) em São Paulo",
      servico: "Crédito consignado",
      localizacao: "Zona Leste - Vila Prudente",
      texto:
        "A Fênix Cred transformou minha vida! Consegui realizar o sonho da minha casa própria com condições excelentes. Atendimento impecável!",
      nota: 5,
      avatar: "👩",
    },
    {
      id: 2,
      nome: "João Santos",
      cargo: "Servidor Público em São Paulo",
      servico: "Crédito consignado",
      localizacao: "Zona Leste - Jardim Guairaca",
      texto:
        "Processo super rápido e sem burocracias. Em menos de 48h já tinha o dinheiro na conta. Recomendo a todos!",
      nota: 5,
      avatar: "👨",
    },
    {
      id: 3,
      nome: "Ana Costa",
      cargo: "Empresária em São Paulo",
      servico: "Antecipação de recebíveis",
      localizacao: "Zona Leste - Vila Formosa",
      texto:
        "As melhores taxas do mercado! A equipe da Fênix é muito profissional e sempre disponível para ajudar.",
      nota: 5,
      avatar: "👩‍💼",
    },
    {
      id: 4,
      nome: "Carlos Oliveira",
      cargo: "Aposentado (INSS) em São Paulo",
      servico: "Crédito consignado",
      localizacao: "Zona Leste - Jardim Guairaca",
      texto:
        "Atendimento humanizado e transparente. Me senti muito bem tratado em todas as etapas do processo.",
      nota: 5,
      avatar: "👨‍🦳",
    },
    {
      id: 5,
      nome: "Patrícia Mendes",
      cargo: "Servidora Pública em São Paulo",
      servico: "Empréstimo pessoal",
      localizacao: "Zona Leste - Vila Prudente",
      texto:
        "Aprovação em 24h! Consegui organizar minhas dívidas com as melhores taxas. Atendimento excelente!",
      nota: 5,
      avatar: "👩‍💼",
    },
    {
      id: 6,
      nome: "Roberto Alves",
      cargo: "Aposentado (INSS) em São Paulo",
      servico: "Crédito consignado",
      localizacao: "Zona Leste - Jardim Guairaca",
      texto:
        "Melhor correspondente bancário de São Paulo! Processo rápido, seguro e com as melhores condições.",
      nota: 5,
      avatar: "👨‍🦳",
    },
  ];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % depoimentos.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + depoimentos.length) % depoimentos.length
    );
  };

  return (
    <section id="depoimentos" className="depoimentos">
      <div className="depoimentos-container">
        <div className="depoimentos-header">
          <h2 className="section-title">O que nossos clientes dizem</h2>
          <p className="section-subtitle">
            Mais de 200 mil clientes satisfeitos confiam na Fênix Cred
          </p>
        </div>

        <div className="depoimentos-carousel">
          <div className="carousel-wrapper">
            <div
              className="carousel-slides"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {depoimentos.map((depoimento) => (
                <div key={depoimento.id} className="depoimento-card" data-spotlight>
                  <div className="depoimento-header">
                    <div
                      className="depoimento-avatar"
                      aria-label={`Foto de ${depoimento.nome} – ${depoimento.cargo} – ${depoimento.localizacao}`}
                    >
                      {depoimento.avatar}
                    </div>
                    <div className="depoimento-info">
                      <h3 className="depoimento-nome">{depoimento.nome}</h3>
                      <p className="depoimento-cargo">
                        {depoimento.cargo} – {depoimento.servico}
                      </p>
                      <p className="depoimento-localizacao">
                        {depoimento.localizacao}
                      </p>
                    </div>
                    <div className="depoimento-nota">
                      {[...Array(depoimento.nota)].map((_, i) => (
                        <span key={i}>⭐</span>
                      ))}
                    </div>
                  </div>
                  <p className="depoimento-texto">"{depoimento.texto}"</p>
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

          {/* Indicadores */}
          <div
            className="carousel-indicators"
            role="tablist"
            aria-label="Indicadores de slides"
          >
            {depoimentos.map((_, index) => (
              <button
                key={index}
                className={`indicator ${
                  index === currentIndex ? "active" : ""
                }`}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Ir para slide ${index + 1}`}
                aria-selected={index === currentIndex}
                role="tab"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Depoimentos;
