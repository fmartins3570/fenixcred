const BASE_URL = 'https://graph.facebook.com';

class MetaAdsAPI {
  constructor(accessToken, apiVersion = 'v21.0') {
    this.accessToken = accessToken;
    this.apiVersion = apiVersion;
    this.baseUrl = `${BASE_URL}/${apiVersion}`;
  }

  async request(endpoint, params = {}) {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    url.searchParams.set('access_token', this.accessToken);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, Array.isArray(value) ? value.join(',') : value);
    });

    const response = await fetch(url.toString());
    const data = await response.json();

    if (data.error) {
      throw new Error(`Meta API Error: ${data.error.message} (Code: ${data.error.code})`);
    }

    return data;
  }

  // Informacoes do usuario/conta
  async getMe() {
    return this.request('/me', {
      fields: 'id,name,email'
    });
  }

  // Listar contas de anuncio
  async getAdAccounts() {
    return this.request('/me/adaccounts', {
      fields: 'id,name,account_id,account_status,currency,timezone_name,amount_spent,balance'
    });
  }

  // Detalhes de uma conta de anuncio
  async getAdAccount(accountId) {
    return this.request(`/${accountId}`, {
      fields: 'id,name,account_id,account_status,currency,timezone_name,amount_spent,balance,spend_cap'
    });
  }

  // Campanhas de uma conta
  async getCampaigns(accountId) {
    return this.request(`/${accountId}/campaigns`, {
      fields: 'id,name,status,objective,daily_budget,lifetime_budget,budget_remaining,start_time,stop_time,created_time,updated_time',
      limit: 100
    });
  }

  // Conjuntos de anuncio de uma campanha
  async getAdSets(campaignId) {
    return this.request(`/${campaignId}/adsets`, {
      fields: 'id,name,status,daily_budget,lifetime_budget,budget_remaining,targeting,start_time,end_time,optimization_goal,bid_strategy',
      limit: 100
    });
  }

  // Anuncios de um conjunto
  async getAds(adSetId) {
    return this.request(`/${adSetId}/ads`, {
      fields: 'id,name,status,creative,created_time,updated_time',
      limit: 100
    });
  }

  // Insights (metricas) de uma conta, campanha, adset ou ad
  async getInsights(objectId, params = {}) {
    const defaultParams = {
      fields: 'impressions,clicks,spend,cpc,cpm,ctr,reach,frequency,actions,cost_per_action_type',
      date_preset: 'last_30d',
      ...params
    };
    return this.request(`/${objectId}/insights`, defaultParams);
  }

  // Insights com breakdown por dia
  async getDailyInsights(objectId, params = {}) {
    return this.getInsights(objectId, {
      time_increment: 1,
      ...params
    });
  }

  // Insights com breakdown por idade e genero
  async getDemographicInsights(objectId, params = {}) {
    return this.getInsights(objectId, {
      breakdowns: 'age,gender',
      ...params
    });
  }

  // Insights por plataforma (Facebook, Instagram, etc)
  async getPlatformInsights(objectId, params = {}) {
    return this.getInsights(objectId, {
      breakdowns: 'publisher_platform',
      ...params
    });
  }

  // Criativos de anuncio
  async getAdCreative(creativeId) {
    return this.request(`/${creativeId}`, {
      fields: 'id,name,title,body,image_url,thumbnail_url,link_url,call_to_action_type,object_story_spec'
    });
  }

  // Audiencias customizadas
  async getCustomAudiences(accountId) {
    return this.request(`/${accountId}/customaudiences`, {
      fields: 'id,name,description,approximate_count,data_source,delivery_status,operation_status',
      limit: 100
    });
  }

  // Paginacao - buscar proxima pagina
  async getNextPage(pagingNext) {
    const response = await fetch(pagingNext);
    const data = await response.json();
    if (data.error) {
      throw new Error(`Meta API Error: ${data.error.message} (Code: ${data.error.code})`);
    }
    return data;
  }
}

module.exports = MetaAdsAPI;
