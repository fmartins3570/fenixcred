require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const MetaAdsAPI = require('../api');

const api = new MetaAdsAPI(
  process.env.META_ADS_ACCESS_TOKEN,
  process.env.META_ADS_API_VERSION || 'v21.0'
);

const objectId = process.argv[2];
const datePreset = process.argv[3] || 'last_30d';

async function getInsights() {
  try {
    let targetId = objectId;

    if (!targetId) {
      // Sem ID especificado, buscar insights de todas as contas
      const accounts = await api.getAdAccounts();
      if (!accounts.data || accounts.data.length === 0) {
        console.log('Nenhuma conta encontrada.');
        return;
      }

      for (const account of accounts.data) {
        console.log(`\n=== ${account.name || account.account_id} ===\n`);
        targetId = account.id;
        await printInsights(targetId);
      }
    } else {
      targetId = targetId.startsWith('act_') ? targetId : targetId;
      await printInsights(targetId);
    }
  } catch (error) {
    console.error('Erro:', error.message);
  }
}

async function printInsights(id) {
  try {
    const insights = await api.getInsights(id, { date_preset: datePreset });

    if (!insights.data || insights.data.length === 0) {
      console.log('  Sem dados de insights para o periodo.\n');
      return;
    }

    const d = insights.data[0];
    console.log(`  Periodo: ${d.date_start} a ${d.date_stop}`);
    console.log(`  Impressoes: ${Number(d.impressions || 0).toLocaleString('pt-BR')}`);
    console.log(`  Alcance: ${Number(d.reach || 0).toLocaleString('pt-BR')}`);
    console.log(`  Cliques: ${Number(d.clicks || 0).toLocaleString('pt-BR')}`);
    console.log(`  Gasto: R$ ${parseFloat(d.spend || 0).toFixed(2)}`);
    console.log(`  CPC: R$ ${parseFloat(d.cpc || 0).toFixed(2)}`);
    console.log(`  CPM: R$ ${parseFloat(d.cpm || 0).toFixed(2)}`);
    console.log(`  CTR: ${parseFloat(d.ctr || 0).toFixed(2)}%`);
    console.log(`  Frequencia: ${parseFloat(d.frequency || 0).toFixed(2)}`);

    if (d.actions && d.actions.length > 0) {
      console.log('\n  Acoes:');
      d.actions.forEach(a => {
        console.log(`    ${a.action_type}: ${a.value}`);
      });
    }

    if (d.cost_per_action_type && d.cost_per_action_type.length > 0) {
      console.log('\n  Custo por acao:');
      d.cost_per_action_type.forEach(a => {
        console.log(`    ${a.action_type}: R$ ${parseFloat(a.value).toFixed(2)}`);
      });
    }

    // Insights demograficos
    console.log('\n  --- Demograficos ---');
    const demoInsights = await api.getDemographicInsights(id, { date_preset: datePreset });
    if (demoInsights.data && demoInsights.data.length > 0) {
      demoInsights.data.forEach(row => {
        console.log(`    ${row.age} / ${row.gender}: ${Number(row.impressions).toLocaleString('pt-BR')} impressoes, R$ ${parseFloat(row.spend).toFixed(2)} gasto`);
      });
    }

    // Insights por plataforma
    console.log('\n  --- Por Plataforma ---');
    const platInsights = await api.getPlatformInsights(id, { date_preset: datePreset });
    if (platInsights.data && platInsights.data.length > 0) {
      platInsights.data.forEach(row => {
        console.log(`    ${row.publisher_platform}: ${Number(row.impressions).toLocaleString('pt-BR')} impressoes, R$ ${parseFloat(row.spend).toFixed(2)} gasto`);
      });
    }

  } catch (err) {
    console.log(`  Erro ao buscar insights: ${err.message}`);
  }
}

console.log('Uso: node insights.js [object_id] [date_preset]');
console.log('Date presets: today, yesterday, last_7d, last_14d, last_30d, this_month, last_month\n');
getInsights();
