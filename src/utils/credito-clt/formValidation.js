/**
 * Utilitários de validação e máscaras para formulários
 */

/**
 * Aplica máscara de telefone brasileiro
 */
export function maskPhone(value) {
  const numbers = value.replace(/\D/g, '')
  const limited = numbers.slice(0, 11)
  
  if (limited.length <= 2) {
    return limited.length ? `(${limited}` : ''
  }
  if (limited.length <= 6) {
    return `(${limited.slice(0, 2)}) ${limited.slice(2)}`
  }
  if (limited.length <= 10) {
    return `(${limited.slice(0, 2)}) ${limited.slice(2, 6)}-${limited.slice(6)}`
  }
  return `(${limited.slice(0, 2)}) ${limited.slice(2, 7)}-${limited.slice(7)}`
}

/**
 * Aplica máscara de moeda brasileira
 */
export function maskCurrency(value) {
  const numbers = value.replace(/\D/g, '')
  
  if (!numbers) return ''
  
  const cents = parseInt(numbers, 10)
  const formatted = (cents / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
  
  return formatted
}

/**
 * Remove máscara de telefone
 */
export function unmaskPhone(value) {
  return value.replace(/\D/g, '')
}

/**
 * Remove máscara de moeda
 */
export function unmaskCurrency(value) {
  return value.replace(/\D/g, '')
}
