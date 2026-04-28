// GA4-only tracking. Zero Meta Pixel/CAPI — Creditas events must not
// touch the Facebook ecosystem to avoid any campaign interference.
import { trackGA4CustomEvent } from './analytics'

export const CREDITAS_AFFILIATE = 'HII588383'

export const CREDITAS_LINKS = {
  home: `https://app.creditas.com/home-equity/solicitacao/informacoes-pessoais?utm_medium=affiliates&utm_source=${CREDITAS_AFFILIATE}&utm_campaign=[hr]-crm&utm_term=always-on&utm_content=lp`,
  auto: `https://app.creditas.com/auto-refi/solicitacao/informacoes-pessoais?utm_medium=affiliates&utm_source=${CREDITAS_AFFILIATE}&utm_campaign=[ar]-crm&utm_term=always-on&utm_content=lp`,
}

export function trackCreditasRecoveryView(rejectionReason, source) {
  trackGA4CustomEvent('creditas_recovery_view', {
    rejection_reason: rejectionReason,
    source,
  })
}

export function trackCreditasRedirect(product, rejectionReason, source) {
  trackGA4CustomEvent('creditas_redirect', {
    product,
    rejection_reason: rejectionReason,
    source,
    content_name: `Creditas ${product === 'home' ? 'Home Equity' : 'Auto Equity'}`,
  })

  window.open(CREDITAS_LINKS[product], '_blank', 'noopener,noreferrer')
}
