/**
 * Finance utilities for CLT consigned credit simulations.
 *
 * All functions here are pure — no DOM, no side effects — so they can be
 * reused across the site (quiz, landing pages) and unit-tested in isolation.
 */

/**
 * Default CLT consigned monthly interest rate (1.49% a.m.)
 * Matches the headline rate advertised on /consignado-clt.
 */
export const DEFAULT_MONTHLY_RATE = 0.0149

/**
 * Payment term options (months) surfaced in the quiz scenarios.
 */
export const TERM_OPTIONS = [24, 48, 72]

/**
 * Hard limits for the "valor desejado" input.
 * Aligned with the simulator ranges on the landing page.
 */
export const MIN_LOAN_VALUE = 1000
export const MAX_LOAN_VALUE = 50000

/**
 * Rough reference monthly rate for an unsecured personal loan (crédito
 * pessoal) — used only to compute an informative "savings" delta so the
 * user can see why consigned is cheaper.
 *
 * Source: BACEN SCR series (crédito pessoal não-consignado, pessoa física)
 * — typical averages are ~6% a.m. We use a conservative 5% a.m.
 */
export const PERSONAL_LOAN_REFERENCE_RATE = 0.05

/**
 * Standard CLT consigned payroll margin (35% of gross salary).
 * Per Lei 14.131/2021 and subsequent regulations, CLT workers may commit
 * up to 35% of their salary to consigned credit.
 */
export const CLT_PAYROLL_MARGIN_PCT = 0.35

/**
 * Calculate the fixed installment (PMT) for a loan using the Price formula.
 *
 * PMT = PV * (i * (1+i)^n) / ((1+i)^n - 1)
 *
 * @param {number} pv   Present value / principal (R$)
 * @param {number} i    Monthly interest rate (decimal, e.g. 0.0149)
 * @param {number} n    Number of months (integer > 0)
 * @returns {number}    Monthly payment in R$, or 0 for invalid inputs.
 */
export function calculatePMT(pv, i, n) {
  if (!pv || pv <= 0 || !n || n <= 0) return 0
  // Special case: zero interest → simple division.
  if (!i || i <= 0) return pv / n
  const factor = Math.pow(1 + i, n)
  return (pv * (i * factor)) / (factor - 1)
}

/**
 * Build the list of scenarios (one per term option) for a given principal.
 *
 * Each scenario includes:
 *   - term: months
 *   - installment: fixed monthly payment (Price)
 *   - total: total amount the user will pay back (installment * term)
 *   - interestPaid: total - pv
 *   - savingsVsPersonal: (personal loan total) - (consigned total),
 *                       clamped at 0 so we never show negative savings.
 *
 * @param {number} pv   Loan principal in R$
 * @param {number} [rate]  Monthly rate (default: DEFAULT_MONTHLY_RATE)
 * @returns {Array<object>}
 */
export function buildScenarios(pv, rate = DEFAULT_MONTHLY_RATE) {
  return TERM_OPTIONS.map((term) => {
    const installment = calculatePMT(pv, rate, term)
    const total = installment * term
    const interestPaid = total - pv

    const personalInstallment = calculatePMT(pv, PERSONAL_LOAN_REFERENCE_RATE, term)
    const personalTotal = personalInstallment * term
    const savingsVsPersonal = Math.max(0, personalTotal - total)

    return {
      term,
      installment,
      total,
      interestPaid,
      savingsVsPersonal,
    }
  })
}

/**
 * Estimate CLT consigned payroll margin from gross salary.
 * @param {number} grossSalary  Gross monthly salary in R$.
 * @returns {number}            Estimated margin (35% of gross), or 0.
 */
export function estimateMarginFromSalary(grossSalary) {
  if (!grossSalary || grossSalary <= 0) return 0
  return grossSalary * CLT_PAYROLL_MARGIN_PCT
}

/**
 * Format a number as BRL currency (R$).
 * Returns an empty string for invalid inputs.
 */
export function formatBRL(value) {
  if (value == null || Number.isNaN(value)) return ''
  return Number(value).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

/**
 * Parse a "R$ 1.234,56" (or raw digits) string into a numeric value.
 * Returns 0 if nothing parseable.
 */
export function parseBRL(raw) {
  if (!raw) return 0
  const digits = String(raw).replace(/\D/g, '')
  if (!digits) return 0
  return parseInt(digits, 10) / 100
}
