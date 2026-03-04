require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const MetaAdsAPI = require('../api');

const api = new MetaAdsAPI(
  process.env.META_ADS_ACCESS_TOKEN,
  process.env.META_ADS_API_VERSION || 'v21.0'
);

async function listAccounts() {
  try {
    const me = await api.getMe();
    console.log(`Usuario: ${me.name} (ID: ${me.id})\n`);

    const accounts = await api.getAdAccounts();
    if (!accounts.data || accounts.data.length === 0) {
      console.log('Nenhuma conta de anuncio encontrada.');
      return;
    }

    console.log(`Total de contas: ${accounts.data.length}\n`);
    accounts.data.forEach((acc, i) => {
      console.log(`[${i + 1}] ${acc.name || 'Sem nome'}`);
      console.log(`    Account ID: ${acc.account_id}`);
      console.log(`    Status: ${acc.account_status}`);
      console.log(`    Moeda: ${acc.currency}`);
      console.log('');
    });
  } catch (error) {
    console.error('Erro:', error.message);
  }
}

listAccounts();
