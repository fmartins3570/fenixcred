import { useState, useCallback, useEffect, useRef } from 'react'
import './FAQ.css'

const FAQ_ITEMS = [
  {
    question: 'O que é crédito consignado CLT?',
    answer: 'É um empréstimo com desconto automático na folha de pagamento para trabalhadores com carteira assinada. As parcelas são descontadas diretamente do salário, garantindo taxas menores e maior facilidade de aprovação.',
  },
  {
    question: 'Quem pode solicitar o consignado CLT?',
    answer: 'Trabalhadores CLT com vínculo empregatício ativo há mais de 3 meses. Mesmo com nome sujo no SPC/Serasa, você pode ser aprovado, pois o desconto é feito diretamente na folha de pagamento.',
  },
  {
    question: 'Quem tem nome sujo pode fazer o empréstimo CLT?',
    answer: 'Sim! Como as parcelas são descontadas diretamente do seu salário, a maioria das instituições financeiras não consulta SPC/Serasa para aprovação do consignado CLT.',
  },
  {
    question: 'Preciso de margem consignável. Como descobrir?',
    answer: 'A margem consignável é a porcentagem do seu salário disponível para desconto de empréstimos. Você pode consultar seu holerite (contracheque) ou perguntar diretamente ao RH da sua empresa. Geralmente, a margem é de até 35% do salário bruto.',
  },
  {
    question: 'Quanto tempo leva para aprovação?',
    answer: 'A análise é realizada em minutos após o envio da documentação completa. Em muitos casos, a aprovação acontece no mesmo dia e o dinheiro é liberado em até 24 horas.',
  },
  {
    question: 'Quais são as taxas e prazos?',
    answer: 'As taxas começam a partir de 1,2% ao mês, variando conforme análise de crédito. O prazo pode chegar até 48 meses (4 anos). Sempre informamos a taxa exata antes da contratação.',
  },
  {
    question: 'A empresa pode recusar o empréstimo consignado?',
    answer: 'A empresa não pode impedir o funcionário de contratar um empréstimo consignado se houver convênio firmado. A lei garante esse direito ao trabalhador CLT.',
  },
  {
    question: 'Quanto posso pegar de empréstimo?',
    answer: 'O valor depende da sua margem consignável e do prazo escolhido. Por exemplo, quem ganha R$ 2.000 pode ter até R$ 700 de margem, possibilitando empréstimos de até R$ 30.000 dependendo do prazo.',
  },
  {
    question: 'Como funciona o desconto em folha?',
    answer: 'Após aprovação, o RH da sua empresa é autorizado a descontar a parcela mensalmente do seu salário. Você não precisa se preocupar em pagar boletos ou lembrar de datas.',
  },
  {
    question: 'É seguro fazer o processo online?',
    answer: 'Totalmente seguro. A Fênix Cred é correspondente bancário autorizado, atuando em conformidade com as normas do Banco Central. Utilizamos criptografia de ponta a ponta em todas as operações.',
  },
]

/**
 * FAQ Section - Accordion
 * Perguntas frequentes sobre consignado CLT
 */
export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null)
  const sectionRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const toggle = useCallback((i) => {
    setOpenIndex((prev) => (prev === i ? null : i))
  }, [])

  return (
    <section
      id="faq-simulacao"
      className={`sim-faq ${isVisible ? 'sim-faq--visible' : ''}`}
      ref={sectionRef}
    >
      <div className="sim-faq-container">
        <h2 className="sim-faq-title">Perguntas frequentes</h2>
        <p className="sim-faq-subtitle">
          Tire suas dúvidas sobre o empréstimo consignado CLT
        </p>

        <div className="sim-faq-list">
          {FAQ_ITEMS.map((item, i) => (
            <div
              key={i}
              className={`sim-faq-item ${openIndex === i ? 'sim-faq-item--open' : ''}`}
            >
              <button
                className="sim-faq-question"
                onClick={() => toggle(i)}
                aria-expanded={openIndex === i}
                aria-controls={`faq-answer-${i}`}
              >
                <span className="sim-faq-question-text">{item.question}</span>
                <svg
                  className="sim-faq-chevron"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              <div
                id={`faq-answer-${i}`}
                className="sim-faq-answer"
                role="region"
              >
                <p className="sim-faq-answer-text">{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
