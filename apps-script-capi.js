var PIXEL_ID = '2877752735949899';

var ACCESS_TOKEN = 'EAAcb0l7GRyEBQ1dEd08ZBX6qjH6tg6tlBW5mdZCU2QdnPHz2YpJwaDSjuXuZAis7m9WTxkKsekeLhGSa0MdJGkHT3rKwhZBDmCZCg7nmzymLgeTTjxat5sbL7wPjVZCi5GFz2x6z0ZCtI4GD3ZBSPYhZA8IU2yGc2ZCmZBA5xuttNtecWNBzoqjKGbnopIvecBW9QZDZD';

var SHEET_ID = '1_zuhGf1IRplOWnyZl3UMVbxFW155KOCbo4zZg1l_Jys';

// VendeAI tag → Meta CAPI event mapping
var VENDEAI_EVENT_MAP = {
  'dados_simulacao_coletados': 'LeadSubmitted',
  'ofertado': 'QualifiedLead',
  'digitado': 'OrderCreated',
  'pago': 'Purchase',
  'cancelado': 'OrderCancelled'
};

function doGet(e) {
  var p = e.parameter;
  var sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();

  sheet.appendRow([
    new Date(),
    p.name || '',
    p.phone || '',
    p.purposes || '',
    p.page || p.event_source_url || '',
    p.event_name || 'legacy',
    p.event_id || '',
    p.value || '',
    p.city || '',
    p.fbc || '',
    p.fbp || ''
  ]);

  if (p.event_name) {
    sendToConversionsAPI(p);
  }

  return ContentService.createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT);
}

/**
 * Receives VendeAI webhook (POST with JSON body).
 * Looks up fbc by phone, maps tags to Meta events, sends CAPI.
 */
function doPost(e) {
  // If no JSON body but URL params exist, treat as browser CAPI (same as doGet).
  // This handles edge cases where requests arrive as POST instead of GET.
  if (!e.postData || !e.postData.contents || e.postData.contents.trim() === '') {
    return doGet(e);
  }

  try {
    var payload = JSON.parse(e.postData.contents);
    var event = payload.event;
    var summary = payload.chat_summary || {};
    var contact = (summary.details && summary.details.contact) || {};
    var session = (summary.details && summary.details.session) || {};
    var tags = summary.tags || [];

    // Log webhook to a separate sheet for debugging
    var wb = SpreadsheetApp.openById(SHEET_ID);
    var logSheet = wb.getSheetByName('webhook_log');
    if (!logSheet) {
      logSheet = wb.insertSheet('webhook_log');
      logSheet.appendRow(['timestamp', 'event', 'phone', 'product', 'stage', 'tags', 'campaign', 'raw']);
    }
    logSheet.appendRow([
      new Date(),
      event,
      contact.phone || '',
      summary.product || '',
      summary.stage || '',
      tags.join(', '),
      session.campaign || '',
      JSON.stringify(payload).substring(0, 1000)
    ]);

    // Find which tags map to CAPI events
    var eventsToSend = [];
    for (var i = 0; i < tags.length; i++) {
      if (VENDEAI_EVENT_MAP[tags[i]]) {
        eventsToSend.push(VENDEAI_EVENT_MAP[tags[i]]);
      }
    }

    // Also check stage for "pago" or "digitado" patterns
    if (summary.stage && VENDEAI_EVENT_MAP[summary.stage]) {
      var stageEvent = VENDEAI_EVENT_MAP[summary.stage];
      if (eventsToSend.indexOf(stageEvent) === -1) {
        eventsToSend.push(stageEvent);
      }
    }

    if (eventsToSend.length === 0) {
      return ContentService.createTextOutput(JSON.stringify({ ok: true, sent: 0 }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // Look up fbc by phone in the main sheet
    var phone = contact.phone ? contact.phone.replace(/\D/g, '') : '';
    var fbc = '';
    var fbp = '';
    if (phone) {
      var lookup = lookupByPhone(phone);
      fbc = lookup.fbc;
      fbp = lookup.fbp;
    }

    // Send each mapped event to Meta CAPI
    var sent = 0;
    for (var j = 0; j < eventsToSend.length; j++) {
      var params = {
        event_name: eventsToSend[j],
        event_id: Utilities.getUuid(),
        event_source_url: 'https://www.fenixcredbr.com.br/simulacao-consignado-clt',
        phone: phone,
        name: contact.name || '',
        fbc: fbc,
        fbp: fbp
      };

      // Add value for Purchase/OrderCreated if available
      if (eventsToSend[j] === 'Purchase' || eventsToSend[j] === 'OrderCreated') {
        params.value = '0';
        params.currency = 'BRL';
        params.content_name = session.campaign || summary.product || 'clt';
      }

      sendToConversionsAPI(params);
      sent++;
    }

    return ContentService.createTextOutput(JSON.stringify({ ok: true, sent: sent }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    Logger.log('Webhook error: ' + err.message);
    return ContentService.createTextOutput(JSON.stringify({ error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Search the main sheet for a phone number and return fbc/fbp.
 * Searches from bottom to top to get the most recent entry.
 * Column C = phone (index 3), Column J = fbc (index 10), Column K = fbp (index 11)
 */
function lookupByPhone(phone) {
  var sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
  var data = sheet.getDataRange().getValues();
  var normalizedPhone = phone.replace(/\D/g, '');

  // Search from bottom (most recent) to top
  for (var i = data.length - 1; i >= 1; i--) {
    var rowPhone = String(data[i][2]).replace(/\D/g, '');
    if (rowPhone && normalizedPhone.indexOf(rowPhone) !== -1 || rowPhone.indexOf(normalizedPhone) !== -1) {
      var fbc = String(data[i][9] || '');
      var fbp = String(data[i][10] || '');
      if (fbc) {
        return { fbc: fbc, fbp: fbp };
      }
    }
  }
  return { fbc: '', fbp: '' };
}

function sendToConversionsAPI(p) {
  var ud = {};

  if (p.phone) {
    var ph = p.phone.replace(/\D/g, '');
    if (ph.length <= 11) {
      ph = '55' + ph;
    }
    ud.ph = [sha256(ph)];
  }

  if (p.name) {
    var parts = p.name.toLowerCase().trim().split(/\s+/);
    ud.fn = [sha256(parts[0])];
    if (parts.length > 1) {
      ud.ln = [sha256(parts[parts.length - 1])];
    }
  }

  if (p.email) {
    ud.em = [sha256(p.email.toLowerCase().trim())];
  }

  if (p.city) {
    var ct = p.city.toLowerCase().trim().replace(/\s+/g, '');
    ud.ct = [sha256(ct)];
  }

  if (p.fbc) ud.fbc = p.fbc;
  if (p.fbp) ud.fbp = p.fbp;
  if (p.client_user_agent) ud.client_user_agent = p.client_user_agent;
  if (p.client_ip_address) ud.client_ip_address = p.client_ip_address;
  if (p.external_id) ud.external_id = [sha256(p.external_id)];

  var ev = {
    event_name: p.event_name,
    event_time: Math.floor(Date.now() / 1000),
    event_id: p.event_id || '',
    event_source_url: p.event_source_url || '',
    action_source: 'website',
    user_data: ud
  };

  if (p.value || p.currency || p.content_name) {
    ev.custom_data = {};
    if (p.value) {
      ev.custom_data.value = parseFloat(p.value);
    }
    if (p.currency) {
      ev.custom_data.currency = p.currency;
    }
    if (p.content_name) {
      ev.custom_data.content_name = p.content_name;
    }
  }

  var body = {
    data: [ev],
    access_token: ACCESS_TOKEN
  };

  var url = 'https://graph.facebook.com/v21.0/' + PIXEL_ID + '/events';

  var opts = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(body),
    muteHttpExceptions: true
  };

  try {
    var res = UrlFetchApp.fetch(url, opts);
    Logger.log('CAPI OK: ' + res.getContentText());
  } catch (err) {
    Logger.log('CAPI Error: ' + err.message);
  }
}

function sha256(value) {
  var digest = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256, value
  );
  var hex = '';
  for (var i = 0; i < digest.length; i++) {
    var b = (digest[i] & 0xFF).toString(16);
    hex += (b.length === 1 ? '0' : '') + b;
  }
  return hex;
}
