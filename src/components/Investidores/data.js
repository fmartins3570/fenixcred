/**
 * Single source of truth for every number on the investor page.
 *
 * Sources, all primary, all queried directly:
 * - Meta Ads API (act_1234061875532331) — spend, impressions, clicks, reach
 * - CAPI leads.db, via SSH — events, proposals, leads
 * - VendeAI dashboard — FGTS funnel
 * - Portaria MTE no 1.115 — the regulation text
 *
 * No projections, no estimates, no invented valuation/TAM. If a number was not
 * returned by one of those sources, it is not on the page.
 */

export const REFERENCE = {
  label: 'Operação de fev/2026 a 14/jul/2026',
  cut: 'Séries mensais até 14/jul/2026 · indicadores de originação em janela de 30 dias · funil FGTS de 21 a 27/jun',
  report: 'Consultas diretas à Meta Ads API e à base CAPI leads.db',
}

/**
 * Lifetime totals for the whole operation.
 *
 * `mediaSpend` is media only — it is the one investment figure that is auditable
 * end to end in the Meta Ads API. Subscriptions, infrastructure, fees and hours
 * are NOT included, because no source here holds them, and inventing a total
 * would be the one thing that could discredit every other number on the page.
 */
export const INVESTMENT = {
  mediaSpend: 30049.05,
  since: '20/jan/2026',
  until: '14/jul/2026',
  impressions: 1742813,
  clicks: 72460,
  reach: 606954,
  /** Distinct phone numbers in the CAPI base */
  people: 33175,
  /** Purchase events, deduplicated by conversation, mai–jul */
  sales: 106,
  /** Proposals with an approved balance, mai–jul */
  proposals: 438,
  /** Total credit offered, mai–jul */
  offered: 1264467,
  /** mediaSpend over the tracked window (mai–jul) divided by sales */
  costPerSale: 204.73,
}

/**
 * Month by month, fev/2026 → 14/jul/2026.
 *
 * `tracked` is the honest part. Media spend starts in Feb, but the CAPI server
 * only went live on 19/apr — so Feb and Mar have real spend and NO funnel
 * telemetry at all. Those months are not zero-performance; they are
 * zero-measurement, and the page has to say so instead of plotting a 0 that
 * reads as failure. April is partial for the same reason.
 *
 *   'none'    — spend is real, no CAPI telemetry existed
 *   'partial' — CAPI came online mid-month (19/apr)
 *   'full'    — complete telemetry
 */
export const TRACKING_START = '19/abr/2026'

export const HISTORY = [
  { month: 'fev', label: 'fev/2026', spend: 19.94, impressions: 18324, clicks: 6, tracked: 'none' },
  { month: 'mar', label: 'mar/2026', spend: 3483.13, impressions: 93115, clicks: 3845, tracked: 'none' },
  {
    month: 'abr',
    label: 'abr/2026',
    spend: 4844.72,
    impressions: 168190,
    clicks: 6026,
    tracked: 'partial',
    note: 'CAPI entrou em 19/abr',
  },
  {
    month: 'mai',
    label: 'mai/2026',
    spend: 8925.15,
    impressions: 573773,
    clicks: 24144,
    tracked: 'full',
    conversations: 11733,
    proposals: 51,
    sales: 45,
  },
  {
    month: 'jun',
    label: 'jun/2026',
    spend: 10050.4,
    impressions: 725058,
    clicks: 30171,
    tracked: 'full',
    conversations: 15482,
    proposals: 331,
    sales: 55,
  },
  {
    month: 'jul',
    label: 'jul/2026',
    spend: 2725.71,
    impressions: 164353,
    clicks: 8268,
    tracked: 'full',
    conversations: 3112,
    proposals: 56,
    sales: 6,
    partialMonth: true,
    note: 'Mês em curso · 1 a 14/jul',
  },
]

export const COMPANY = {
  name: 'Fenix Cred',
  legal: 'H.I Intermediação Financeira LTDA',
  cnpj: '52.069.594/0001-90',
  role: 'Correspondente bancário',
  whatsapp: '5511917082143',
  email: 'contato@fenixcredbr.com.br',
}

/** 30d, CAPI leads.db, tabela `proposals` */
export const PRODUCTS = {
  clt: {
    key: 'clt',
    name: 'Crédito CLT',
    full: 'Consignado CLT — Crédito do Trabalhador',
    commissionPct: 2.5,
    proposals: 309,
    offered: 1033791,
    avgTicket: 3346,
    commissionPerProposal: 83.6,
    commissionPool: 25845,
  },
  fgts: {
    key: 'fgts',
    name: 'Antecipação FGTS',
    full: 'Antecipação FGTS — saque-aniversário',
    commissionPct: 40,
    proposals: 57,
    offered: 14567,
    avgTicket: 256,
    commissionPerProposal: 102.4,
    commissionPool: 5838,
  },
}

/** The three multiples that carry the "commission paradox" argument */
export const MULTIPLES = [
  { value: '4,4x', label: 'o pool de comissão do CLT sobre o do FGTS' },
  { value: '5,4x', label: 'o CLT monta 5,4x mais propostas' },
  { value: '13x', label: 'o ticket do CLT é 13x maior' },
]

/** Realized production, jun/2026 pre-outage */
export const PRODUCTION = {
  dailyPeakTyped: 54000,
  monthly: 77532,
}

/** FGTS funnel, 7d (VendeAI dashboard, 21-27/jun) */
export const FGTS_7D = {
  leads: 2130,
  paid: 9,
  conversion: 0.4,
  production: 2183.16,
  avgTicket: 242.57,
  bank: '2S Consig',
  commission: 873.26,
  spend: 536.17,
  net: 337.09,
  roas: 1.63,
}

/**
 * FGTS sales by day, 21-27/jun.
 *
 * The source reports 9 sales, ALL of them on 22-23/jun, and gives no per-day
 * split. So 22-23 is plotted as a single merged block worth 9 — inventing a
 * 5/4 (or any) split would be fabricating a number the source does not have.
 * Every other day is a hard zero, drawn as a ghost bar so the emptiness is
 * visible rather than merely absent.
 */
export const FGTS_DAILY = [
  { day: '21', sales: 0, span: 1, outage: false },
  { day: '22–23', sales: 9, span: 2, outage: true },
  { day: '24', sales: 0, span: 1, outage: false },
  { day: '25', sales: 0, span: 1, outage: false },
  { day: '26', sales: 0, span: 1, outage: false },
  { day: '27', sales: 0, span: 1, outage: false },
]

/** The bottleneck */
export const MARGIN = {
  noBalancePct: 96.3,
  currentRate: 3.7,
  historicalRate: 8.3,
}

/** Portaria MTE no 1.115 — published 25/jun/2026, in force since 26/jun/2026 */
export const PORTARIA = {
  number: 'nº 1.115',
  published: '25/jun/2026',
  inForce: '26/jun/2026',
  rateCap: '1,99%',
  guarantees: [
    { pct: 'até 10%', what: 'do saldo do FGTS' },
    { pct: 'até 100%', what: 'da multa rescisória (os 40%)' },
    { pct: 'até 35%', what: 'das verbas rescisórias' },
  ],
  employerBurden: ['Portal Emprega Brasil', 'eSocial', 'FGTS Digital'],
}

/** Budget allocation, phased */
export const ALLOCATION = {
  phase1: {
    label: 'Fase 1 — Cruzeiro (hoje)',
    total: 140,
    lines: [
      { name: 'FGTS', value: 80, kind: 'floor', note: 'Piso. Captura o fallback do CLT. Não é escala.' },
      { name: 'CLT Setorial (sonda)', value: 60, kind: 'grow', note: 'Existe para medir se o saldo voltou.' },
    ],
  },
  phase2: {
    label: 'Fase 2 — Pós-confirmação do CLT',
    total: 330,
    lines: [
      { name: 'FGTS', value: 80, kind: 'floor', note: 'Inalterado. A disciplina se mantém sob capital novo.' },
      { name: 'CLT Setorial', value: 150, kind: 'grow', note: 'Escala do canal validado.' },
      { name: 'CLT VBO', value: 100, kind: 'grow', note: 'Otimização por valor de conversão.' },
    ],
  },
  gate: 'Gatilho 48–72h · re-pausa automática',
}

export const KPIS = [
  { name: 'Propostas CLT / dia', target: 'Retomada do volume pré-outage' },
  { name: 'Taxa de saldo CLT', target: '3,7% → 8,3%+', hero: true },
  { name: 'Rejeições pós-CPF / dia', target: 'Queda contínua' },
  { name: 'Quality do número de WhatsApp', target: 'Não cair de Média' },
  { name: 'Venda direta de FGTS / dia', target: 'Testa se ainda é parasita' },
  { name: 'QualifiedLead e Purchase / dia', target: 'Retomada pós-reativação' },
  { name: 'ROAS por produto', target: 'CLT acima do FGTS no agregado' },
]

export const RISKS = [
  {
    id: 'R1',
    risk: 'O CLT segue instável no pós-reabertura.',
    detector: 'Propostas CLT/dia · taxa de saldo CLT',
    brake:
      'A Fase 1 é uma sonda de R$ 60/dia, não uma aposta. A escala só existe depois do gatilho de 48–72h confirmado, com re-pausa automática.',
  },
  {
    id: 'R2',
    risk: 'Os bancos demoram a habilitar a garantia da Portaria 1.115.',
    detector: 'Taxa de saldo CLT (3,7% → 8,3%)',
    brake:
      'A própria taxa denuncia a habilitação no dia em que acontecer, banco a banco, sem depender de aviso. A cascata multi-banco (C6, Facta, Presença, 2S Consig) já opera — não dependemos de um único parceiro.',
  },
  {
    id: 'R3',
    risk: 'A quality do número de WhatsApp cai.',
    detector: 'Quality do WhatsApp (painel diário)',
    brake:
      'É KPI de primeira linha, monitorado todo dia — não um incidente descoberto depois. Está ligado ao mesmo mecanismo de re-pausa.',
  },
  {
    id: 'R4',
    risk: 'A comissão do CLT segue baixa (2,5%).',
    detector: 'ROAS por produto · Purchase com value = comissão real',
    brake:
      'A tese nunca dependeu do percentual — depende do pool (volume × ticket de R$ 3.346). E como a comissão real entra dentro do evento, qualquer deterioração aparece no mesmo dia, não no fechamento do mês.',
  },
]

export const SOURCES = [
  'Meta Ads API (act_1234061875532331)',
  'CAPI leads.db (via SSH)',
  'Dashboard VendeAI',
  'Portaria MTE nº 1.115',
]

/* ── formatters ── */

const brl = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  maximumFractionDigits: 0,
})

const brlCents = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 2,
})

const int = new Intl.NumberFormat('pt-BR')

export const fmtBRL = (n) => brl.format(n)
export const fmtBRLCents = (n) => brlCents.format(n)
export const fmtInt = (n) => int.format(n)
export const fmtPct = (n) => `${String(n).replace('.', ',')}%`
