/**
 * Tenure utilities — shared between PreQualForm and Quiz.
 *
 * tenure_months + tenure_bucket drive bank-cascade routing (Facta >=3m,
 * Pan >=6m, Mercantil >=12m) and allow temporal retargeting of leads
 * who do not qualify today but will in 3-6 months.
 */

export const MONTHS = [
  { value: 1, label: 'Janeiro' },
  { value: 2, label: 'Fevereiro' },
  { value: 3, label: 'Março' },
  { value: 4, label: 'Abril' },
  { value: 5, label: 'Maio' },
  { value: 6, label: 'Junho' },
  { value: 7, label: 'Julho' },
  { value: 8, label: 'Agosto' },
  { value: 9, label: 'Setembro' },
  { value: 10, label: 'Outubro' },
  { value: 11, label: 'Novembro' },
  { value: 12, label: 'Dezembro' },
]

const CURRENT_YEAR = new Date().getFullYear()
export const YEAR_OPTIONS = Array.from({ length: 30 }, (_, i) => CURRENT_YEAR - i)

export function calcTenureMonths(month, year) {
  if (!month || !year) return null
  const now = new Date()
  const current = now.getFullYear() * 12 + now.getMonth()
  const admission = Number(year) * 12 + (Number(month) - 1)
  return Math.max(0, current - admission)
}

export function tenureBucket(months) {
  if (months == null) return 'unknown'
  if (months < 3) return 't0-2m'
  if (months < 6) return 't3-5m'
  if (months < 12) return 't6-11m'
  if (months < 24) return 't12-23m'
  return 't24m+'
}

export function tenurePhrase(months) {
  if (months == null) return ''
  if (months === 0) return 'há menos de 1 mês'
  if (months === 1) return 'há 1 mês'
  if (months < 12) return `há ${months} meses`
  const years = Math.floor(months / 12)
  const rest = months % 12
  if (years === 1 && rest === 0) return 'há 1 ano'
  if (rest === 0) return `há ${years} anos`
  if (years === 1) return `há 1 ano e ${rest} ${rest === 1 ? 'mês' : 'meses'}`
  return `há ${years} anos e ${rest} ${rest === 1 ? 'mês' : 'meses'}`
}

/**
 * Cross margin × tenure into a single quality tier for Meta + VendeAI.
 *   top      → margem=sim + tenure >= 6m  (cascata completa)
 *   high     → margem=sim + tenure 3-5m   (facta + pan)
 *   mid-new  → margem=sim + tenure 0-2m   (facta carencia)
 *   mid      → margem=naosei + tenure >= 6m
 *   mid-new  → margem=naosei + tenure < 6m
 *   low      → margem=nao (any tenure)
 */
export function leadQuality(margin, months) {
  const hasTenureData = months != null
  if (margin === 'sim') {
    if (hasTenureData && months >= 6) return 'top'
    if (hasTenureData && months >= 3) return 'high'
    return 'mid-new'
  }
  if (margin === 'naosei') {
    if (hasTenureData && months >= 6) return 'mid'
    return 'mid-new'
  }
  return 'low'
}
