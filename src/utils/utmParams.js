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
 * Prepende a tag UTM a uma mensagem (se houver).
 * Ex: "(f-gv) Ola! Gostaria de simular..."
 */
export function tagMessage(message) {
  const tag = getUtmTag()
  return tag ? `(${tag}) ${message}` : message
}
