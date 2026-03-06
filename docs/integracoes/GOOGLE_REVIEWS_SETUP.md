# Configuração da Seção de Avaliações do Google

## 📋 Pré-requisitos

Para usar a seção de avaliações do Google Meu Negócio, você precisa:

1. **Google Cloud Platform Account** - Crie uma conta em [Google Cloud Console](https://console.cloud.google.com/)
2. **API Key** - Gere uma chave de API do Google Maps
3. **Place ID** - Obtenha o Place ID do seu negócio no Google Meu Negócio

## 🔑 Passo 1: Obter Google Maps API Key

1. Acesse o [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Vá em **APIs & Services** > **Library**
4. Procure por **"Places API"** e habilite
5. Vá em **APIs & Services** > **Credentials**
6. Clique em **Create Credentials** > **API Key**
7. Copie a chave gerada

## 📍 Passo 2: Obter Place ID

### Opção 1: Usando Place ID Finder
1. Acesse [Place ID Finder](https://developers.google.com/maps/documentation/places/web-service/place-id-finder)
2. Digite o nome e endereço do seu negócio
3. Copie o Place ID exibido

### Opção 2: Via Google Meu Negócio
1. Acesse [Google Meu Negócio](https://www.google.com/business/)
2. Selecione seu negócio
3. O Place ID pode ser encontrado na URL ou usando ferramentas de desenvolvedor

## ⚙️ Passo 3: Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

```env
# Google Places API Configuration
# Place ID da Fênix Cred
VITE_FENIX_PLACE_ID=5915714919254647518

# Google Maps API Key
# Obtenha sua API Key em: https://console.cloud.google.com/
VITE_GOOGLE_MAPS_API_KEY=sua_api_key_aqui
```

**⚠️ IMPORTANTE:** 
- O Place ID da Fênix Cred já está configurado: `5915714919254647518`
- Substitua `sua_api_key_aqui` pela sua chave de API do Google Maps
- Após criar o arquivo `.env`, reinicie o servidor de desenvolvimento

## 🔒 Segurança

⚠️ **IMPORTANTE**: 
- **NUNCA** commite o arquivo `.env` no Git
- O arquivo `.env` já está no `.gitignore`
- Para produção, configure as variáveis de ambiente no seu servidor/hosting
- Configure restrições de API Key no Google Cloud Console (por domínio/IP)

## 🚀 Como Funciona

O componente `ReviewsSection`:
1. Carrega dinamicamente a Google Maps JavaScript API
2. Usa o `PlacesService` para buscar detalhes do lugar
3. Extrai as 5 avaliações mais recentes
4. Exibe as avaliações com design alinhado à identidade visual da Fênix Cred

## 🎨 Cores Utilizadas

- Fundo: `#05070B` / `#05060A` (gradiente radial)
- Cards: `#0C0F16` (com transparência)
- Amarelo destaque: `#FFC727`
- Verde destaque: `#00FF85`
- Textos: `#FFFFFF` / `#E5E7EB`

## 📱 Responsividade

A seção é totalmente responsiva e se adapta a:
- Desktop (grid de 3 colunas)
- Tablet (grid de 2 colunas)
- Mobile (1 coluna)

## 🐛 Troubleshooting

### Erro: "Place ID não configurado"
- Verifique se o arquivo `.env` existe na raiz do projeto
- Confirme que as variáveis começam com `VITE_`
- Reinicie o servidor de desenvolvimento após criar/editar o `.env`

### Erro: "Google Maps API Key não configurada"
- Verifique se a API Key está correta
- Confirme que a Places API está habilitada no Google Cloud Console
- Verifique se há restrições de domínio/IP na API Key

### Nenhuma avaliação aparece
- Verifique se o Place ID está correto
- Confirme que o negócio tem avaliações públicas no Google
- Verifique o console do navegador para erros

## 📚 Documentação Adicional

- [Google Places API](https://developers.google.com/maps/documentation/places/web-service)
- [Place ID](https://developers.google.com/maps/documentation/places/web-service/place-id)
- [Google Maps JavaScript API](https://developers.google.com/maps/documentation/javascript)
