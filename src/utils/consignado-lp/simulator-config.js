// Simulator configuration for ConsignadoLP
// Price formula: PMT = PV * [i * (1+i)^n] / [(1+i)^n - 1]

export const SIMULATOR_CONFIG = {
  minValue: 1000,
  maxValue: 50000,
  step: 500,
  defaultValue: 10000,
  monthlyRate: 0.0149, // 1.49% a.m.
  terms: [12, 24, 36, 48, 60, 72, 84],
  defaultTerm: 48,
}

// FGTS anticipation simulator — no installments, shows net amount after fees
// Net rate is purely visual/illustrative; real value depends on partner bank
export const FGTS_SIMULATOR_CONFIG = {
  minValue: 500,
  maxValue: 30000,
  step: 500,
  defaultValue: 10000,
  netRate: 0.85, // 85% of gross — illustrative net amount after partner bank fees
}

/**
 * Calculate monthly installment using Price formula (tabela Price)
 * PMT = PV * [i * (1+i)^n] / [(1+i)^n - 1]
 *
 * @param {number} principal - Loan amount (PV)
 * @param {number} termMonths - Number of months (n)
 * @returns {number} Monthly installment rounded up to cents
 */
export function calculateInstallment(principal, termMonths) {
  const i = SIMULATOR_CONFIG.monthlyRate
  const n = termMonths
  const factor = Math.pow(1 + i, n)
  const pmt = principal * (i * factor) / (factor - 1)
  return Math.ceil(pmt * 100) / 100 // Round up to cents
}

/**
 * Format number as BRL currency string
 * @param {number} value
 * @returns {string} e.g. "R$ 15.000"
 */
export function formatCurrency(value) {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
}

/**
 * Calculate net amount for FGTS anticipation (illustrative).
 * Applies a fixed percentage to simulate post-fee net payout.
 *
 * @param {number} grossValue - Requested FGTS anticipation amount
 * @returns {number} Estimated net amount deposited on user's account
 */
export function calculateFgtsNet(grossValue) {
  return Math.floor(grossValue * FGTS_SIMULATOR_CONFIG.netRate)
}
