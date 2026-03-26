/**
 * UTM Parameters Utility - FenixCred
 *
 * Captura parametros UTM da URL na primeira visita e persiste no sessionStorage.
 * Isso garante que a tag acompanha o usuario mesmo apos navegacao SPA.
 */

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content']
const STORAGE_KEY = 'fenix_utm'

/**
 * Captura UTMs da URL e salva no sessionStorage (apenas na primeira vez com UTMs).
 * Chamado automaticamente no import do modulo.
 */
function captureUtmParams() {
  const params = new URLSearchParams(window.location.search)
  const utms = {}
  let hasAny = false

  for (const key of UTM_KEYS) {
    const val = params.get(key)
    if (val) {
      utms[key] = val
      hasAny = true
    }
  }

  if (hasAny) {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(utms))
  }
}

// Captura na carga do modulo
captureUtmParams()

/**
 * Retorna os UTMs salvos (ou objeto vazio se nao houver).
 */
export function getUtmParams() {
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY)) || {}
  } catch {
    return {}
  }
}

/**
 * Retorna o prefixo de tag para mensagens WhatsApp.
 * Usa utm_content como tag principal (ex: "f-gv", "f-av").
 * Se nao houver utm_content, retorna string vazia.
 */
export function getUtmTag() {
  const utms = getUtmParams()
  return utms.utm_content || ''
}

/**
 * Retorna o valor do cookie _fbc (Facebook Click ID) se disponível.
 * Formato: fb.1.{timestamp}.{fbclid}
 */
function getFbc() {
  try {
    const cookies = document.cookie.split('; ')
    const fbcCookie = cookies.find((c) => c.startsWith('_fbc='))
    if (fbcCookie) return decodeURIComponent(fbcCookie.split('=')[1])

    // Se não tem cookie, tenta gerar a partir do fbclid na URL
    const params = new URLSearchParams(window.location.search)
    const fbclid = params.get('fbclid')
    if (fbclid) return `fb.1.${Date.now()}.${fbclid}`
  } catch {}
  return ''
}

/**
 * Prepende a tag UTM e anexa o fbc (Facebook Click ID) a uma mensagem.
 * O fbc permite que o VendeAI vincule a conversão ao clique no anúncio.
 * Ex: "(f-gv) Ola! Gostaria de simular...\n[fbc:fb.1.xxx.xxx]"
 */
export function tagMessage(message) {
  const tag = getUtmTag()
  const fbc = getFbc()
  let result = tag ? `(${tag}) ${message}` : message
  if (fbc) result += `\n[fbc:${fbc}]`
  return result
}
