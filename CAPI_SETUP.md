# Meta Conversions API (CAPI) — Setup Guide

## Arquitetura

```
Browser (Pixel fbq)                    CAPI Server (VPS)
  |                                          |
  +-- fbq('track','Lead',{},{eventID}) --+   |
  |                                      |   |
  +-- fetch POST JSON (sendServerEvent) -+---> Valida + SHA-256 hashing
  |                                      +---> Captura IP real (X-Forwarded-For)
  |                                      +---> POST graph.facebook.com/v22.0 CAPI
  |                                            (retry com backoff)
  |
VendeAI (webhook POST)                Google Apps Script (doPost)
  |                                          |
  +-- POST JSON (tags, contact) ---------+--> Log em webhook_log sheet
                                         +--> Lookup fbc/fbp por telefone
                                         +--> POST graph.facebook.com/v22.0 CAPI
```

Deduplicacao: Meta deduplica eventos com mesmo `event_id` + `event_name` dentro de 48h.

## Configuracao

### CAPI Server (VPS) — Eventos Browser

| Item | Valor |
|------|-------|
| **Pixel ID** | `2877752735949899` |
| **Graph API** | v22.0 |
| **CAPI URL** | `https://painel.martinsfelipe.com/api/capi/meta` |
| **Client ID** | `fenixcred` |
| **Metodo** | POST JSON com `keepalive: true` |
| **Funcionalidades** | SHA-256 hashing, IP via X-Forwarded-For, retry com backoff |

### Google Apps Script — Eventos VendeAI (webhooks)

| Item | Valor |
|------|-------|
| **Sheet ID** | `1_zuhGf1IRplOWnyZl3UMVbxFW155KOCbo4zZg1l_Jys` |
| **Apps Script Project** | `1W8kP1UBeSL8DIxgRT1MxrpSuiKZnjhFWKRGw1BWZPPg4JWeOEw0VR7Kt` |
| **Deploy URL** | `https://script.google.com/macros/s/AKfycbyuYC4ZdGBohpfJM1Zr0JFHA3WTg-_95Z4sC9EQ9JOEEzYdcRnfNMLfASBoOr3rq-Cl/exec` |
| **Conta** | fenixcredbr@gmail.com |
| **Versao atual** | 4 (16/abr/2026) |

## Eventos Browser (site -> CAPI Server via POST)

Todos os eventos disparam browser Pixel + CAPI server-side com `event_id` compartilhado.

| Evento | Componentes | user_data enviado |
|--------|------------|-------------------|
| **Contact** | Header, Hero, Footer (float/tel/email), TrabalheConosco, CLT Hero, CLT FAQ, CLT Float, SimulacaoCLT Float, useWhatsAppWithTag | fbc, fbp, external_id, client_ip, client_user_agent, country=br, page |
| **Lead** | LeadPopup, FinalCTA, Questionnaire | name, phone, fbc, fbp, external_id, client_ip, client_user_agent, country=br, value |
| **CompleteRegistration** | LeadPopup, Questionnaire | name, phone, fbc, fbp, external_id, client_ip, client_user_agent, country=br, value |
| **InitiateCheckout** | Questionnaire | fbc, fbp, external_id, client_ip, client_user_agent, country=br |
| **ViewContent** | SimulacaoCLT index | fbc, fbp, external_id, client_ip, client_user_agent, country=br |

### Eventos somente browser (sem CAPI)

| Evento | Componentes |
|--------|------------|
| FAQ_Open | FAQ, FAQ CLT |
| SocialClick | Footer (Facebook, Instagram, TikTok) |
| LeadPopupView / LeadPopupDismissed | LeadPopup |
| CustomizeProduct | ConsignadoLP Simulator |
| QuizAnswer | Questionnaire |

## Eventos VendeAI (webhook -> Apps Script via POST)

A VendeAI envia webhooks POST com JSON quando tags sao aplicadas ou stages mudam.

### Mapeamento de tags (VENDEAI_EVENT_MAP)

| Tag VendeAI | Evento CAPI | Volume (~10 dias) |
|-------------|-------------|-------------------|
| `ofertado` | `QualifiedLead` | ~92 |
| `digitado` | `OrderCreated` | ~30 |
| `pago` | `Purchase` | ~3 |
| `cancelado` | `OrderCancelled` | raro |
| `dados_simulacao_coletados` | `LeadSubmitted` | legacy |

### Mapeamento de stages (VENDEAI_STAGE_MAP) — v4

| Stage VendeAI | Evento CAPI | Significado |
|---------------|-------------|-------------|
| `send_authorization` | `Lead` | Lead autorizou consulta de credito (sinal mais forte) |
| `simulation` | `InitiateCheckout` | Lead entrou na simulacao com dados |

**Deduplicacao:** Cache em memoria por `chat_id + stage` — evita disparar o mesmo evento de stage multiplas vezes para o mesmo lead.

### Stages NAO mapeados (apenas log)

| Stage | Descricao |
|-------|-----------|
| `clt_lead_qualification` | Bot qualificando lead |
| `get_cpf` | Bot pedindo CPF |
| `get_sim_data` | Bot coletando dados de simulacao |
| `_cross_sell` | Tentativa de cross sell |

### Fluxo doPost

1. Recebe JSON com `event`, `chat_summary` (contact, session, tags)
2. Log no sheet `webhook_log` (timestamp, event, phone, product, stage, tags, campaign)
3. Mapeia tags para eventos CAPI via `VENDEAI_EVENT_MAP`
4. Busca `fbc`/`fbp` na planilha principal por telefone (lookup reverso)
5. Envia cada evento mapeado para a CAPI com `event_id` unico (UUID)

## user_data enviado para CAPI

| Campo | Source | Hashing |
|-------|--------|---------|
| `ph` (phone) | formulario / VendeAI | SHA-256 (normalizado 55+DDD+num) |
| `fn` (first name) | formulario / VendeAI | SHA-256 (lowercase) |
| `ln` (last name) | formulario / VendeAI | SHA-256 (lowercase) |
| `em` (email) | quando disponivel | SHA-256 (lowercase) |
| `ct` (city) | formulario | SHA-256 (lowercase, sem espacos) |
| `st` (state) | quando disponivel | SHA-256 (lowercase) |
| `country` | sempre (`br`) | SHA-256 |
| `fbc` | cookie / lookup | plain |
| `fbp` | cookie / lookup | plain |
| `client_ip_address` | server-side (X-Forwarded-For) | plain |
| `client_user_agent` | navigator.userAgent | plain |
| `external_id` | localStorage UUID | SHA-256 |

## Planilha de Leads (colunas)

| Col | Campo |
|-----|-------|
| A | timestamp |
| B | name |
| C | phone |
| D | purposes |
| E | page / event_source_url |
| F | event_name |
| G | event_id |
| H | value |
| I | city |
| J | fbc |
| K | fbp |

## Como Gerar/Renovar Access Token

### CAPI Server (VPS)

1. Acesse https://business.facebook.com/events_manager
2. Selecione o Pixel **2877752735949899**
3. Aba **Settings** > secao "Conversions API" > **Generate access token**
4. Atualize o token na configuracao do CAPI Server (VPS)

### Apps Script (VendeAI webhooks)

1. Gere o token conforme acima
2. Abra o Apps Script: https://script.google.com/home/projects/1W8kP1UBeSL8DIxgRT1MxrpSuiKZnjhFWKRGw1BWZPPg4JWeOEw0VR7Kt/edit
3. Substitua o valor de `ACCESS_TOKEN` pelo novo token
4. **Deploy** > **Gerenciar implantacoes** > Editar > **Nova versao** > **Implantar**

## Verificacao

### Eventos Browser (CAPI Server)

1. Abra o site e clique em qualquer CTA WhatsApp
2. **Browser Console**: confirme `fbq('track', 'Contact', {...}, {eventID: '...'})` 
3. **Network tab**: confirme POST para `painel.martinsfelipe.com/api/capi/meta` com status 200
4. **Meta Events Manager > Test Events**: verifique eventos browser + server com match de deduplicacao (mesmo `event_id`)

### Eventos VendeAI (Apps Script)

1. **Apps Script Logs** (Execucoes): confirme eventos com `event_name` e `event_id`
2. **Planilha webhook_log**: verifique logs de tags/stages recebidos
3. **Planilha principal**: verifique que fbc/fbp estao sendo registrados nas colunas J/K
4. **Meta Events Manager**: verifique eventos Lead (send_authorization) e InitiateCheckout (simulation)

## Custom Conversions (Events Manager)

| Nome | Regra |
|------|-------|
| Lead de alto valor | Evento = `Lead`, value > 10000 |
| Lead qualificado | Evento = `CompleteRegistration` |
| Contato quente CLT | Evento = `Contact`, URL contem "credito-clt" |
