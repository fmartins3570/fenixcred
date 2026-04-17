import { faqs, benefits, steps, stats, testimonials } from '../credito-clt/constants'

/**
 * Angle-specific content for ConsignadoLP landing pages.
 * Each angle defines: copy, tags, trust badges, FAQs, and SEO metadata.
 */
export const ANGLES = {
  negativado: {
    tag: 'neg',
    seo: {
      title: 'Consignado CLT para Negativados | Sem Consulta SPC — Fênix Cred',
      description: 'Crédito consignado CLT sem consulta ao SPC/Serasa. Aprovação em menos de 2h, taxas a partir de 1,49% a.m. Simule grátis pelo WhatsApp.',
    },
    hero: {
      badge: 'Aprovação mesmo com nome negativado',
      headline: 'Nome no SPC? Seu crédito CLT está garantido',
      subheadline: 'Consignado CLT sem consulta ao Serasa. Aprovação em menos de 2h, taxas a partir de 1,49% a.m. e parcelas descontadas na folha.',
      ctaText: 'Simular Meu Crédito Agora',
    },
    trustBadges: [
      { icon: 'shield', text: 'Sem consulta SPC/Serasa' },
      { icon: 'clock', text: 'Aprovação em até 2h' },
      { icon: 'check', text: '100% Online' },
    ],
    faqs: [
      {
        question: 'Posso conseguir crédito consignado mesmo com nome negativado?',
        answer: 'Sim! O crédito consignado CLT não depende de consulta ao SPC ou Serasa. Como as parcelas são descontadas diretamente da folha de pagamento, a aprovação é baseada na sua margem consignável, não no seu score de crédito.',
      },
      {
        question: 'Por que o consignado CLT não consulta SPC/Serasa?',
        answer: 'Porque o pagamento é garantido pelo desconto em folha. O empregador desconta a parcela do seu salário antes mesmo de você receber, eliminando o risco de inadimplência. Por isso, o histórico de crédito não é fator decisivo.',
      },
      {
        question: 'Ter o nome sujo afeta a taxa de juros do consignado?',
        answer: 'Não. As taxas do consignado CLT são definidas pela margem consignável e prazo, não pelo score. Você terá as mesmas condições de quem tem o nome limpo: a partir de 1,49% a.m.',
      },
      ...faqs.slice(2, 6),
    ],
  },

  velocidade: {
    tag: 'vel',
    seo: {
      title: 'Consignado CLT Rápido | Crédito em Menos de 2h — Fênix Cred',
      description: 'Crédito consignado CLT na conta em menos de 2 horas. 100% online, sem burocracia. Taxas a partir de 1,49% a.m. Simule agora.',
    },
    hero: {
      badge: 'Crédito na conta em menos de 2 horas',
      headline: 'Crédito na conta em menos de 2h. Sem burocracia.',
      subheadline: 'Consignado CLT 100% online. Parcelas descontadas na folha, taxas a partir de 1,49% a.m. Simule agora.',
      ctaText: 'Simular Meu Crédito Agora',
    },
    trustBadges: [
      { icon: 'clock', text: 'Menos de 2h para aprovar' },
      { icon: 'check', text: '100% Online' },
      { icon: 'shield', text: 'Sem burocracia' },
    ],
    faqs: [
      {
        question: 'O crédito realmente cai em menos de 2 horas?',
        answer: 'Sim! Após o envio da documentação completa e aprovação, o valor é depositado na sua conta em menos de 2 horas úteis. Todo o processo é feito 100% online.',
      },
      {
        question: 'Quais documentos preciso enviar?',
        answer: 'RG ou CNH, CPF, comprovante de residência atualizado, contracheque dos últimos 3 meses e dados bancários. Todo o envio é feito digitalmente pelo WhatsApp.',
      },
      {
        question: 'O processo é realmente 100% online?',
        answer: 'Sim! Da simulação à assinatura do contrato, tudo é feito pelo WhatsApp e assinatura digital. Você não precisa ir a nenhuma agência ou escritório.',
      },
      ...faqs.slice(0, 2),
      ...faqs.slice(4, 6),
    ],
  },

  geral: {
    tag: 'ger',
    seo: {
      title: 'Consignado CLT a partir de 1,49% a.m. | Simule Grátis — Fênix Cred',
      description: 'Crédito consignado CLT com taxas a partir de 1,49% a.m. Sem consulta SPC/Serasa, aprovação em até 2h. Simule pelo WhatsApp.',
    },
    hero: {
      badge: '⭐ Correspondente bancário desde 2018',
      headline: 'Crédito Consignado CLT a partir de 1,49% a.m.',
      subheadline: 'Taxas justas, desconto em folha e dinheiro na conta. Sem consulta ao SPC/Serasa. Atendemos todo Brasil.',
      ctaText: 'Simular Meu Crédito CLT Agora',
    },
    trustBadges: [
      { icon: 'clock', text: 'Taxa a partir de 1,49%' },
      { icon: 'shield', text: 'Sem consulta SPC/Serasa' },
      { icon: 'check', text: '100% Online' },
    ],
    faqs: faqs,
  },

  // FGTS anticipation angle — different product (not installment-based)
  // Uses `mode: 'antecipado'` to toggle Simulator behavior (no term, net amount)
  fgts: {
    tag: 'fgts',
    mode: 'antecipado',
    product: 'antecipacao-fgts',
    seo: {
      title: 'Antecipação FGTS em 24h | Até R$30.000 Sem Consulta SPC — Fênix Cred',
      description: 'Antecipe seu FGTS com a Fênix Cred. Libere até R$30.000 em 24h, sem consulta SPC/Serasa e direto de banco autorizado pela Caixa. Simule grátis.',
    },
    hero: {
      badge: '💸 Antecipação FGTS autorizada pela Caixa',
      headline: 'Libere até R$30.000 do seu FGTS em 24h',
      subheadline: 'Sem consulta SPC, sem análise de crédito, dinheiro direto na conta.',
      ctaText: 'Simular FGTS Agora',
    },
    trustBadges: [
      { icon: 'shield', text: 'Sem consulta SPC/Serasa' },
      { icon: 'clock', text: 'Resposta em até 24h' },
      { icon: 'check', text: 'Direto do banco autorizado pela Caixa' },
    ],
    faqs: [
      {
        question: 'Qual o limite de antecipação do FGTS?',
        answer: 'O limite depende do saldo disponível na sua conta vinculada do FGTS e do valor liberado pelo saque-aniversário. Em geral, nossos parceiros antecipam de R$500 até R$30.000, respeitando o saldo e a adesão ativa ao saque-aniversário.',
      },
      {
        question: 'Preciso estar empregado para antecipar?',
        answer: 'Não. A antecipação do FGTS funciona com saldo disponível na sua conta vinculada, independentemente de vínculo empregatício atual. Mesmo desempregado, se você tem saldo e aderiu ao saque-aniversário, pode antecipar.',
      },
      {
        question: 'Preciso ter aderido ao saque-aniversário?',
        answer: 'Sim. A antecipação só é possível para quem aderiu à modalidade saque-aniversário do FGTS pelo app da Caixa ou Internet Banking. A adesão é gratuita e pode ser feita a qualquer momento.',
      },
      {
        question: 'Em quanto tempo o dinheiro cai na conta?',
        answer: 'Após aprovação e assinatura digital do contrato, o valor é liberado em até 24 horas úteis diretamente na sua conta bancária. Todo o processo é feito de forma online e sem burocracia.',
      },
      {
        question: 'Qual a taxa de juros da antecipação?',
        answer: 'As taxas da antecipação FGTS variam conforme o banco parceiro e o valor contratado, normalmente partindo de 1,29% ao mês. O CET completo é informado antes da contratação para total transparência.',
      },
      {
        question: 'Posso antecipar se já tiver outro empréstimo FGTS?',
        answer: 'Depende do saldo ainda disponível no seu FGTS e das regras do banco parceiro. Se houver saldo não comprometido e saques-aniversário futuros elegíveis, é possível contratar uma nova antecipação ou portabilidade. Simule conosco para verificar.',
      },
    ],
  },
}

// Shared data (same for all angles)
export const SHARED = {
  benefits,
  steps,
  stats,
  testimonials,
  whatsappNumber: '5511917082143',
  disclaimer: 'Simulação meramente ilustrativa. Valores sujeitos a análise de crédito pela instituição financeira parceira.',
  ratesDisclaimer: 'Taxas a partir de 1,49% a.m. | CET a partir de 29,90% a.a.',
  complianceDisclaimer: 'Condições sujeitas a análise de crédito. A Fenix Cred atua como correspondente bancário.',
}
