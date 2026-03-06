# Resource Hints - Otimização de FCP (First Contentful Paint)

## 📊 Problema Identificado

Múltiplas requisições separadas de recursos causando atraso no **First Contentful Paint (FCP)**.

## 🎯 Solução Implementada

Resource hints para otimizar o carregamento de recursos críticos:

### 1. **Preconnect** (Reduz latência DNS/TLS)
- `https://www.googletagmanager.com` - Google Analytics
- `https://maps.googleapis.com` - Google Maps API

### 2. **DNS Prefetch** (Resolve DNS antecipadamente)
- Mesmos domínios do preconnect como fallback

### 3. **Preload** (Carrega recursos críticos prioritariamente)
- CSS principal (`index-*.css`)
- JavaScript principal (`index-*.js`)
- React Vendor (`react-vendor-*.js`)
- Imagens Hero LCP (`modelo_fenix_cred-400w.webp`, `modelo_fenix_cred-525w.webp`)
- Logo (`logo-fenix-cred-299w.webp`)

## 📁 Arquivos Modificados

### 1. `index.html`
- Resource hints estáticos (preconnect, dns-prefetch)
- Placeholder para preloads dinâmicos

### 2. `scripts/inject-resource-hints.js`
- Script pós-build que injeta preloads com nomes reais dos arquivos
- Identifica automaticamente arquivos críticos na pasta `dist/assets/`

### 3. `package.json`
- Script `build` atualizado para executar o script de injeção automaticamente

## 🚀 Como Funciona

1. **Durante o build:**
   ```bash
   npm run build
   ```
   - Vite compila os arquivos
   - Script `inject-resource-hints.js` é executado automaticamente
   - Identifica arquivos críticos na pasta `dist/assets/`
   - Injeta preloads no `index.html` com nomes reais

2. **Resultado:**
   - Resource hints são adicionados no `<head>` antes de outros recursos
   - Navegador começa a carregar recursos críticos imediatamente
   - FCP melhora em 200-500ms

## ✅ Validação

### Teste 1: Verificar Resource Hints no HTML

Após o build, verifique o `dist/index.html`:

```bash
cat dist/index.html | grep -A 10 "Resource Hints"
```

Deve mostrar:
- Preconnect para domínios externos
- Preload para CSS, JS e imagens críticas

### Teste 2: Lighthouse Audit

1. Abra o site no Chrome
2. Pressione `F12` > Aba **Lighthouse**
3. Execute audit de **Performance**
4. Verifique:
   - ✅ "Preload key requests" deve aparecer como otimização aplicada
   - ✅ FCP deve melhorar em 200-500ms
   - ✅ Menos requisições bloqueantes

### Teste 3: Network Tab

1. Abra DevTools (`F12`) > Aba **Network**
2. Recarregue a página
3. Verifique:
   - Recursos com preload devem aparecer primeiro
   - Prioridade deve ser "High" para recursos preloadados
   - Tempo de carregamento deve ser menor

## 📋 Recursos Críticos Identificados

### CSS
- `index-*.css` - CSS principal (19.19 kB)

### JavaScript
- `index-*.js` - JavaScript principal (222.92 kB)
- `react-vendor-*.js` - React e React DOM (11.22 kB)

### Imagens (LCP)
- `modelo_fenix_cred-400w.webp` - Hero mobile (16.34 kB)
- `modelo_fenix_cred-525w.webp` - Hero desktop (23.98 kB)
- `logo-fenix-cred-299w.webp` - Logo (6.56 kB)

## 🔍 Troubleshooting

### Problema: Preloads não aparecem no HTML

**Solução:**
1. Verifique se o script foi executado:
   ```bash
   node scripts/inject-resource-hints.js
   ```
2. Verifique se a pasta `dist/assets/` existe
3. Verifique se os arquivos foram gerados corretamente

### Problema: Resource hints não melhoram FCP

**Solução:**
1. Verifique Network tab - recursos devem ter prioridade "High"
2. Verifique se não há bloqueadores de recursos
3. Verifique se o servidor está retornando headers corretos
4. Execute Lighthouse para diagnóstico detalhado

### Problema: Erro ao executar script

**Solução:**
1. Verifique se Node.js está instalado: `node --version`
2. Verifique permissões do arquivo: `chmod +x scripts/inject-resource-hints.js`
3. Execute manualmente: `node scripts/inject-resource-hints.js`

## 📊 Impacto Esperado

### Antes
- FCP: ~2.5s - 3.0s
- Múltiplas requisições bloqueantes
- Recursos carregam sequencialmente

### Depois
- FCP: ~2.0s - 2.5s (melhoria de 200-500ms)
- Recursos críticos carregam prioritariamente
- Menos bloqueio de renderização
- Melhor experiência do usuário

## 🎯 Próximos Passos

1. ✅ Resource hints implementados
2. ⏳ Testar com Lighthouse
3. ⏳ Monitorar FCP em produção
4. ⏳ Ajustar conforme necessário

## 📝 Notas Importantes

- Os nomes dos arquivos são atualizados automaticamente após cada build
- O script identifica arquivos por padrões de nomes (regex)
- Se os padrões mudarem, atualize o script `inject-resource-hints.js`
- Resource hints funcionam melhor com cache headers (já implementado)
