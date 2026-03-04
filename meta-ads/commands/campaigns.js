require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const MetaAdsAPI = require('../api');

const api = new MetaAdsAPI(
  process.env.META_ADS_ACCESS_TOKEN,
  process.env.META_ADS_API_VERSION || 'v21.0'
);

const accountId = process.argv[2];

async function listCampaigns() {
  try {
    if (accountId) {
      const actId = accountId.startsWith('act_') ? accountId : `act_${accountId}`;
      console.log(`Campanhas da conta ${actId}:\n`);
      const campaigns = await api.getCampaigns(actId);
      printCampaigns(campaigns.data);
    } else {
      const accounts = await api.getAdAccounts();
      if (!accounts.data || accounts.data.length === 0) {
        console.log('Nenhuma conta encontrada.');
        return;
      }

      for (const account of accounts.data) {
        console.log(`=== ${account.name || account.account_id} ===\n`);
        const campaigns = await api.getCampaigns(account.id);
        printCampaigns(campaigns.data);
        console.log('');
      }
    }
  } catch (error) {
    console.error('Erro:', error.message);
  }
}

function printCampaigns(campaigns) {
  if (!campaigns || campaigns.length === 0) {
    console.log('  Nenhuma campanha encontrada.\n');
    return;
  }

  campaigns.forEach((c, i) => {
    console.log(`  [${i + 1}] ${c.name}`);
    console.log(`      ID: ${c.id}`);
    console.log(`      Status: ${c.status}`);
    console.log(`      Objetivo: ${c.objective}`);
    if (c.daily_budget) console.log(`      Orcamento diario: R$ ${(c.daily_budget / 100).toFixed(2)}`);
    if (c.lifetime_budget) console.log(`      Orcamento total: R$ ${(c.lifetime_budget / 100).toFixed(2)}`);
    console.log('');
  });
}

console.log('Uso: node campaigns.js [account_id]\n');
listCampaigns();
