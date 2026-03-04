require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const MetaAdsAPI = require('./api');

const accessToken = process.env.META_ADS_ACCESS_TOKEN;
const apiVersion = process.env.META_ADS_API_VERSION || 'v21.0';

if (!accessToken) {
  console.error('Erro: META_ADS_ACCESS_TOKEN nao encontrado no .env');
  process.exit(1);
}

const api = new MetaAdsAPI(accessToken, apiVersion);

function formatCurrency(value, currency = 'BRL') {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency }).format(value / 100);
}

function formatNumber(value) {
  return new Intl.NumberFormat('pt-BR').format(value);
}

async function main() {
  try {
    // 1. Informacoes do usuario
    console.log('=== INFORMACOES DO USUARIO ===\n');
    const me = await api.getMe();
    console.log(`Nome: ${me.name}`);
    console.log(`ID: ${me.id}`);
    if (me.email) console.log(`Email: ${me.email}`);

    // 2. Contas de anuncio
    console.log('\n=== CONTAS DE ANUNCIO ===\n');
    const accounts = await api.getAdAccounts();

    if (!accounts.data || accounts.data.length === 0) {
      console.log('Nenhuma conta de anuncio encontrada.');
      return;
    }

    for (const account of accounts.data) {
      const statusMap = { 1: 'Ativa', 2: 'Desativada', 3: 'Nao confirmada', 7: 'Pendente revisao', 9: 'Em periodo de carencia', 101: 'Temporariamente indisponivel', 100: 'Pendente encerramento' };
      console.log(`Conta: ${account.name || 'Sem nome'}`);
      console.log(`  ID: ${account.account_id}`);
      console.log(`  Status: ${statusMap[account.account_status] || account.account_status}`);
      console.log(`  Moeda: ${account.currency}`);
      console.log(`  Fuso horario: ${account.timezone_name}`);
      if (account.amount_spent) console.log(`  Total gasto: ${formatCurrency(account.amount_spent, account.currency)}`);
      console.log('');

      // 3. Campanhas da conta
      console.log(`  --- CAMPANHAS (${account.name || account.account_id}) ---\n`);
      const campaigns = await api.getCampaigns(account.id);

      if (!campaigns.data || campaigns.data.length === 0) {
        console.log('  Nenhuma campanha encontrada.\n');
        continue;
      }

      for (const campaign of campaigns.data) {
        console.log(`  Campanha: ${campaign.name}`);
        console.log(`    Status: ${campaign.status}`);
        console.log(`    Objetivo: ${campaign.objective}`);
        if (campaign.daily_budget) console.log(`    Orcamento diario: ${formatCurrency(campaign.daily_budget)}`);
        if (campaign.lifetime_budget) console.log(`    Orcamento total: ${formatCurrency(campaign.lifetime_budget)}`);
        if (campaign.budget_remaining) console.log(`    Orcamento restante: ${formatCurrency(campaign.budget_remaining)}`);

        // 4. Insights da campanha
        try {
          const insights = await api.getInsights(campaign.id);
          if (insights.data && insights.data.length > 0) {
            const data = insights.data[0];
            console.log(`    --- Metricas (ultimos 30 dias) ---`);
            if (data.impressions) console.log(`      Impressoes: ${formatNumber(data.impressions)}`);
            if (data.reach) console.log(`      Alcance: ${formatNumber(data.reach)}`);
            if (data.clicks) console.log(`      Cliques: ${formatNumber(data.clicks)}`);
            if (data.spend) console.log(`      Gasto: R$ ${parseFloat(data.spend).toFixed(2)}`);
            if (data.cpc) console.log(`      CPC: R$ ${parseFloat(data.cpc).toFixed(2)}`);
            if (data.cpm) console.log(`      CPM: R$ ${parseFloat(data.cpm).toFixed(2)}`);
            if (data.ctr) console.log(`      CTR: ${parseFloat(data.ctr).toFixed(2)}%`);
            if (data.frequency) console.log(`      Frequencia: ${parseFloat(data.frequency).toFixed(2)}`);

            // Acoes (conversoes, leads, etc)
            if (data.actions) {
              console.log(`      --- Acoes ---`);
              for (const action of data.actions) {
                console.log(`        ${action.action_type}: ${formatNumber(action.value)}`);
              }
            }
          }
        } catch (err) {
          console.log(`    (Sem insights disponiveis)`);
        }

        console.log('');
      }
    }

    console.log('=== CONEXAO COM META ADS REALIZADA COM SUCESSO ===');

  } catch (error) {
    console.error('\nErro ao conectar com Meta Ads API:');
    console.error(error.message);

    if (error.message.includes('OAuthException')) {
      console.error('\nDica: O token de acesso pode ter expirado. Gere um novo token em:');
      console.error('https://developers.facebook.com/tools/explorer/');
    }
  }
}

main();
