import { useState } from "react";
import "./FAQ.css";
import RelatedContent from "./RelatedContent";
import { trackCustomEvent } from '../utils/metaPixel';

/**
 * Componente FAQ - Seção de perguntas frequentes
 *
 * Accordion com perguntas e respostas
 */
function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      id: 1,
      pergunta: "O que é Crédito CLT?",
      resposta:
        "O Crédito CLT é um empréstimo para trabalhadores com carteira assinada, com desconto direto na folha de pagamento. A Fênix Cred oferece as melhores condições em todo Brasil, com agilidade, transparência e taxas justas.",
    },
    {
      id: 2,
      pergunta: "Quem pode contratar Antecipação do FGTS?",
      resposta:
        "Qualquer trabalhador com saldo no FGTS pode antecipar o saque-aniversário. A Fênix Cred facilita o processo de forma rápida e segura, atendendo todo o Brasil desde 2018.",
    },
    {
      id: 3,
      pergunta: "Como contratar Crédito CLT ou Antecipação do FGTS?",
      resposta:
        "Entre em contato conosco via WhatsApp (11) 91708-2143 ou preencha nosso formulário. Nossa equipe entrará em contato para analisar seu perfil e apresentar as melhores opções em todo Brasil.",
    },
    {
      id: 4,
      pergunta: "A Fênix Cred atende em todo Brasil?",
      resposta:
        "Sim! A Fênix Cred oferece soluções de Crédito CLT e Antecipação do FGTS para trabalhadores em todo o território nacional, com atendimento 100% online e seguro. Somos sediados em São Paulo e atendemos todo Brasil.",
    },
    {
      id: 5,
      pergunta: "Qual a diferença entre Crédito CLT e Antecipação do FGTS?",
      resposta:
        "O Crédito CLT é um empréstimo com desconto em folha, enquanto a Antecipação do FGTS utiliza o saldo do seu Fundo de Garantia como garantia. Ambos são ótimas opções para liberar crédito rápido, sem burocracia.",
    },
    {
      id: 6,
      pergunta: "Preciso de fiador para Crédito CLT?",
      resposta:
        "Não! O Crédito CLT não exige fiador, pois o desconto é feito diretamente na folha de pagamento. Isso torna o processo mais rápido, seguro e sem burocracia desnecessária.",
    },
    {
      id: 7,
      pergunta: "Quanto tempo leva para aprovar o Crédito CLT?",
      resposta:
        "Na Fênix Cred, trabalhamos com agilidade e transparência. Após a análise do seu perfil, a aprovação pode acontecer de forma rápida, sempre buscando a melhor opção de acordo com seu perfil.",
    },
    {
      id: 8,
      pergunta: "A Fênix Cred é confiável?",
      resposta:
        "Sim! A Fênix Cred é correspondente bancário autorizado pelo Banco Central, conforme a Resolução nº 3.954. Temos mais de 90 mil clientes atendidos ao mês, nota 4.8 no Google e atuamos no mercado desde 2018 com ética e transparência.",
    },
  ];

  const toggleFAQ = (index) => {
    if (openIndex !== index) {
      trackCustomEvent('FAQ_Open', { question: faqs[index].pergunta })
    }
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="faq">
      <div className="faq-container">
        <div className="faq-header">
          <h2 className="section-title">
            Perguntas frequentes sobre Crédito CLT e Antecipação do FGTS
          </h2>
          <p className="section-subtitle">
            Tire suas dúvidas sobre Crédito CLT e Antecipação do FGTS em todo
            Brasil
          </p>
        </div>

        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div
              key={faq.id}
              className={`faq-item ${openIndex === index ? "open" : ""}`}
            >
              <button className="faq-question" onClick={() => toggleFAQ(index)}>
                <span>{faq.pergunta}</span>
                <svg
                  className="faq-icon"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
                </svg>
              </button>
              <div className="faq-answer">
                <p>{faq.resposta}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Links Internos - Conteúdo Relacionado */}
      <RelatedContent currentSection="faq" maxLinks={5} />
    </section>
  );
}

export default FAQ;
