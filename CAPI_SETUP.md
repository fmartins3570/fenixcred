# Meta Conversions API (CAPI) — Setup Guide

## Arquitetura

```
Browser (Pixel fbq)                    Google Apps Script (doGet)
  |                                          |
  +-- fbq('track','Lead',{},{eventID}) --+   |
  |                                      |   |
  +-- fetch GET (sendServerEvent) -------+---> Salva na planilha
  |                                      +---> POST graph.facebook.com/v22.0 CAPI
  |                                            (SHA-256 hashed user data)
  |
VendeAI (webhook POST)                Google Apps Script (doPost)
  |                                          |
  +-- POST JSON (tags, contact) ---------+--> Log em webhook_log sheet
                                         +--> Lookup fbc/fbp por telefone
                                         +--> POST graph.facebook.com/v22.0 CAPI
```

Deduplicacao: Meta deduplica eventos com mesmo `event_id` + `event_name` dentro de 48h.

## Configuracao

| Item | Valor |
|------|-------|
| **Pixel ID** | `2877752735949899` |
| **Graph API** | v22.0 |
| **Sheet ID** | `1_zuhGf1IRplOWnyZl3UMVbxFW155KOCbo4zZg1l_Jys` |
| **Apps Script Project** | `1W8kP1UBeSL8DIxgRT1MxrpSuiKZnjhFWKRGw1BWZPPg4JWeOEw0VR7Kt` |
| **Deploy URL** | `https://script.google.com/macros/s/AKfycbyuYC4ZdGBohpfJM1Zr0JFHA3WTg-_95Z4sC9EQ9JOEEzYdcRnfNMLfASBoOr3rq-Cl/exec` |
| **Conta** | fenixcredbr@gmail.com |
| **Versao atual** | 3 (16/abr/2026) |

## Eventos Browser (site -> Apps Script via GET)

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

A VendeAI envia webhooks POST com JSON quando tags sao aplicadas ao contato.

### Mapeamento de tags

| Tag VendeAI | Evento CAPI |
|-------------|-------------|
| `dados_simulacao_coletados` | `LeadSubmitted` |
| `ofertado` | `QualifiedLead` |
| `digitado` | `OrderCreated` |
| `pago` | `Purchase` |
| `cancelado` | `OrderCancelled` |

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
| `client_ip_address` | ipify.org | plain |
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

1. Acesse https://business.facebook.com/events_manager
2. Selecione o Pixel **2877752735949899**
3. Aba **Settings** > secao "Conversions API" > **Generate access token**
4. Abra o Apps Script: https://script.google.com/home/projects/1W8kP1UBeSL8DIxgRT1MxrpSuiKZnjhFWKRGw1BWZPPg4JWeOEw0VR7Kt/edit
5. Substitua o valor de `ACCESS_TOKEN` pelo novo token
6. **Deploy** > **Gerenciar implantacoes** > Editar > **Nova versao** > **Implantar**

## Verificacao

1. Abra o site e clique em qualquer CTA WhatsApp
2. **Browser Console**: confirme `fbq('track', 'Contact', {...}, {eventID: '...'})` 
3. **Apps Script Logs** (Execucoes): confirme eventos com `event_name` e `event_id`
4. **Meta Events Manager > Test Events**: verifique eventos browser + server com match de deduplicacao (mesmo `event_id`)
5. **Planilha**: verifique que fbc/fbp estao sendo registrados nas colunas J/K

## Custom Conversions (Events Manager)

| Nome | Regra |
|------|-------|
| Lead de alto valor | Evento = `Lead`, value > 10000 |
| Lead qualificado | Evento = `CompleteRegistration` |
| Contato quente CLT | Evento = `Contact`, URL contem "credito-clt" |
