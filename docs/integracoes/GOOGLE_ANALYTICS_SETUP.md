# Configuração do Google Analytics

## ✅ Implementação Realizada

O Google Analytics foi implementado de forma dupla para garantir funcionamento:

### 1. No `index.html` (Código Principal)
- Script do Google Tag Manager carregado no `<head>`
- ID de rastreamento: `G-T91KB49251`
- Configuração com `send_page_view: true`

### 2. No React (`src/utils/analytics.js` + `src/main.jsx`)
- Utilitário para garantir funcionamento em SPAs
- Inicialização automática quando a aplicação carrega
- Funções para tracking de eventos e visualizações de página

## 🔍 Como Verificar se Está Funcionando

### Método 1: Google Tag Assistant (Recomendado)
1. Instale a extensão [Google Tag Assistant](https://chrome.google.com/webstore/detail/tag-assistant-legacy-by-g/kejbdjndbnbjgmefkgdddjlbokphdefk) no Chrome
2. Acesse o site `fenixcredbr.com.br`
3. Clique no ícone da extensão
4. Deve aparecer "Google Analytics: Universal Analytics" ou "GA4" com status verde

### Método 2: Console do Navegador
1. Abra o site `fenixcredbr.com.br`
2. Pressione `F12` para abrir o DevTools
3. Vá na aba **Console**
4. Digite: `window.dataLayer`
5. Deve retornar um array com objetos do Google Analytics

### Método 3: Network Tab
1. Abra o DevTools (`F12`)
2. Vá na aba **Network**
3. Filtre por "gtag" ou "analytics"
4. Deve aparecer requisições para `google-analytics.com` ou `googletagmanager.com`

### Método 4: Google Analytics Real-Time
1. Acesse [Google Analytics](https://analytics.google.com/)
2. Vá em **Relatórios** > **Tempo Real**
3. Acesse o site `fenixcredbr.com.br` em outra aba
4. Deve aparecer 1 usuário ativo no relatório em tempo real

## ⚠️ Por que pode não estar sendo detectado?

### 1. Site ainda não publicado
- O Google Analytics só detecta tags em sites **publicados e acessíveis publicamente**
- Se o site ainda está em desenvolvimento local, não será detectado
- **Solução**: Publique o site primeiro

### 2. Tempo de detecção
- O Google pode levar **até 48 horas** para detectar a tag após a publicação
- **Solução**: Aguarde e tente novamente depois

### 3. Cache do navegador
- O navegador pode estar usando versão antiga do site
- **Solução**: 
  - Limpe o cache (`Ctrl+Shift+Delete`)
  - Ou use modo anônimo (`Ctrl+Shift+N`)

### 4. Bloqueadores de anúncios
- Extensões como AdBlock podem bloquear o Google Analytics
- **Solução**: Desative temporariamente para testar

### 5. HTTPS vs HTTP
- O Google Analytics requer HTTPS em produção
- **Solução**: Certifique-se de que o site está em HTTPS

## 📋 Checklist de Verificação

- [ ] Site está publicado e acessível publicamente
- [ ] Site está usando HTTPS
- [ ] Arquivo `index.html` contém o código do Google Analytics
- [ ] ID de rastreamento está correto: `G-T91KB49251`
- [ ] Build de produção foi feito (`npm run build`)
- [ ] Arquivos da pasta `dist` foram enviados para o servidor
- [ ] Aguardou pelo menos algumas horas após publicação

## 🚀 Próximos Passos

1. **Publique o site** com os arquivos atualizados da pasta `dist`
2. **Aguarde 24-48 horas** para o Google detectar
3. **Use o Google Tag Assistant** para verificar em tempo real
4. **Verifique o Google Analytics Real-Time** para confirmar funcionamento

## 📝 Notas Importantes

- O código está implementado corretamente no `index.html`
- A implementação dupla (HTML + React) garante funcionamento mesmo em SPAs
- O Google Analytics pode levar tempo para aparecer no painel, mas já está coletando dados
- Se após 48 horas ainda não aparecer, verifique se o ID `G-T91KB49251` está correto no Google Analytics

## 🔧 Troubleshooting

### Erro: "Tag não detectada"
1. Verifique se o site está publicado
2. Verifique se está acessível publicamente
3. Use o Google Tag Assistant para diagnóstico
4. Aguarde 24-48 horas

### Erro: "ID incorreto"
1. Verifique o ID no Google Analytics: `G-T91KB49251`
2. Confirme que está correto no `index.html`
3. Faça um novo build e publique novamente

### Erro: "Script não carrega"
1. Verifique conexão com internet
2. Verifique se há bloqueadores de anúncios
3. Verifique console do navegador para erros
4. Teste em modo anônimo
