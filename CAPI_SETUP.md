# Meta Conversions API (CAPI) — Setup Guide

## 1. Gerar Access Token

1. Acesse https://business.facebook.com/events_manager
2. Selecione o Pixel **2877752735949899**
3. Aba **Settings** > seção "Conversions API" > **Generate access token**
4. Copie o token gerado (você vai colar no Apps Script abaixo)

## 2. Atualizar o Google Apps Script

Abra o editor do Apps Script vinculado à planilha de leads:
`https://script.google.com/macros/s/AKfycbwCTd-uGRPNFW7fXDq73huWHkOGW_11-3qyyum8YxH6xl8VzWju1tZCso6hDleFKZvf/exec`

Substitua o código inteiro por:

```javascript
// ===== CONFIGURAÇÃO =====
var PIXEL_ID = '2877752735949899';
var ACCESS_TOKEN = 'EAAMkte04lIcBQ7Ig1Cf0f8Nb1chHWWZCI4sRUfjDZCe5zfuod5RfZCAs2pBtXjZAvUNUF0sB0IOxx6aZC8ceI43NUuyZAXHnc3qzrX1ZCNSt7kiZAEn9QTOlA6Eqy6sHavB5r7hvRvcx84Uj9RZChG6aJtbr43LNPV8iGVT04yL19k5gvGZBwgulowFQc0xlPhUgZDZD';

function doGet(e) {
  var params = e.parameter;
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  // Salvar na planilha (funciona para requests legados e CAPI)
  sheet.appendRow([
    new Date(),
    params.name || '',
    params.phone || '',
    params.purposes || '',
    params.page || params.event_source_url || '',
    params.event_name || 'legacy',
    params.event_id || '',
    params.value || '',
  ]);

  // Se tem event_name, enviar para Conversions API
  if (params.event_name) {
    sendToConversionsAPI(params);
  }

  // Retornar pixel 1x1 transparente (compatível com Image requests)
  return ContentService.createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT);
}

function sendToConversionsAPI(params) {
  var userData = {};

  // Hash dos dados do usuário (Meta exige SHA-256)
  if (params.phone) {
    // Normalizar: apenas dígitos, com código do país
    var normalizedPhone = params.phone.replace(/\D/g, '');
    if (normalizedPhone.length <= 11) {
      normalizedPhone = '55' + normalizedPhone; // Adicionar código BR
    }
    userData.ph = [sha256(normalizedPhone)];
  }

  if (params.name) {
    // Meta pede primeiro nome e sobrenome separados, em minúsculas
    var nameParts = params.name.toLowerCase().trim().split(/\s+/);
    userData.fn = [sha256(nameParts[0])];
    if (nameParts.length > 1) {
      userData.ln = [sha256(nameParts[nameParts.length - 1])];
    }
  }

  // Cookies do browser para matching
  if (params.fbc) userData.fbc = params.fbc;
  if (params.fbp) userData.fbp = params.fbp;

  // Montar payload CAPI
  var eventData = {
    event_name: params.event_name,
    event_time: Math.floor(Date.now() / 1000),
    event_id: params.event_id || '',
    event_source_url: params.event_source_url || '',
    action_source: 'website',
    user_data: userData,
  };

  // Custom data (value, currency)
  if (params.value || params.currency) {
    eventData.custom_data = {};
    if (params.value) eventData.custom_data.value = parseFloat(params.value);
    if (params.currency) eventData.custom_data.currency = params.currency;
  }

  var payload = {
    data: [eventData],
    access_token: ACCESS_TOKEN,
  };

  var options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true,
  };

  try {
    var response = UrlFetchApp.fetch(
      'https://graph.facebook.com/v21.0/' + PIXEL_ID + '/events',
      options
    );
    Logger.log('CAPI Response: ' + response.getContentText());
  } catch (err) {
    Logger.log('CAPI Error: ' + err.message);
  }
}

function sha256(value) {
  var rawHash = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, value);
  return rawHash.map(function(byte) {
    return ('0' + (byte & 0xFF).toString(16)).slice(-2);
  }).join('');
}
```

### Passos:
1. Cole o código acima no editor
2. Substitua `COLE_SEU_TOKEN_AQUI` pelo token gerado no passo 1
3. Clique em **Deploy** > **Manage deployments** > edite o deploy existente
4. Selecione **New version** e clique **Deploy**
5. Autorize as permissões solicitadas

## 3. Custom Conversions (Events Manager)

Após o deploy, configure no Meta Events Manager > **Custom Conversions**:

| Nome | Regra |
|------|-------|
| Lead de alto valor | Evento = `Lead`, value > 10000 |
| Lead qualificado | Evento = `CompleteRegistration` |
| Contato quente CLT | Evento = `Contact`, URL contém "credito-clt" |

## 4. Verificação

1. Abra o site e submeta um formulário
2. **Browser Console**: confirme que `fbq('track', 'Lead', {...}, {eventID: '...'})` aparece
3. **Apps Script Logs** (View > Executions): confirme que eventos chegam com `event_name` e `event_id`
4. **Meta Events Manager > Test Events**: verifique eventos browser + server com match de deduplicação (mesmo `event_id`)

## Arquitetura de Deduplicação

```
Browser                          Server (Google Apps Script)
  |                                    |
  +- fbq('track','Lead',{},{eventID}) -+
  |                                    |
  +- sendServerEvent() ---GET----------+---> Salva na planilha
  |                                    +---> POST graph.facebook.com CAPI
  |                                    |     (SHA-256 hashed user data)
```

O Meta deduplica automaticamente eventos com mesmo `event_id` + `event_name` dentro de 48h.
