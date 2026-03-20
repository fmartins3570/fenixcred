var PIXEL_ID = '2877752735949899';

var ACCESS_TOKEN = 'EAAcb0l7GRyEBQ1dEd08ZBX6qjH6tg6tlBW5mdZCU2QdnPHz2YpJwaDSjuXuZAis7m9WTxkKsekeLhGSa0MdJGkHT3rKwhZBDmCZCg7nmzymLgeTTjxat5sbL7wPjVZCi5GFz2x6z0ZCtI4GD3ZBSPYhZA8IU2yGc2ZCmZBA5xuttNtecWNBzoqjKGbnopIvecBW9QZDZD';

function doGet(e) {
  var p = e.parameter;
  var sheet = SpreadsheetApp.openById('1_zuhGf1IRplOWnyZl3UMVbxFW155KOCbo4zZg1l_Jys').getActiveSheet();

  sheet.appendRow([
    new Date(),
    p.name || '',
    p.phone || '',
    p.purposes || '',
    p.page || p.event_source_url || '',
    p.event_name || 'legacy',
    p.event_id || '',
    p.value || '',
    p.city || ''
  ]);

  if (p.event_name) {
    sendToConversionsAPI(p);
  }

  return ContentService.createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT);
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
