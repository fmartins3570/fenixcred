# 🚀 Instruções de Deploy - FenixCred

## ✅ Build Concluído com Sucesso!

Data: 16/01/2026
Pasta: `dist/`
Tamanho total: **532 KB**

---

## 📦 Arquivos Gerados

### Principais:
- ✅ `index.html` (18.61 kB - gzip: 5.17 kB)
- ✅ `.htaccess` (7.2 kB - **IMPORTANTE: arquivo oculto**)
- ✅ `robots.txt` (2.1 kB)
- ✅ `sitemap.xml` (2.3 kB - 9 URLs)
- ✅ `favicon_fenix_cred.webp` (2.8 kB)

### Assets:
- ✅ **CSS:** 5 arquivos (total: ~32 kB)
  - `index-DaDt_mCQ.css` (21.20 kB - principal)
  - `reviews-CJw4Ricp.css` (3.73 kB)
  - `faq-CuadtUTI.css` (3.09 kB)
  - `privacy-D57lI4ep.css` (2.62 kB)
  - Outros componentes lazy-loaded

- ✅ **JavaScript:** 7 arquivos (total: ~261 kB)
  - `react-vendor-CeRvbKfO.js` (188.70 kB - gzip: 58.94 kB)
  - `index-CPiYnty9.js` (45.41 kB - gzip: 14.88 kB)
  - `privacy-v1-mdLXX.js` (16.17 kB)
  - Componentes lazy: `faq`, `reviews`, `trabalhe`, `parceiros`

- ✅ **Imagens WebP:** 7 arquivos (total: ~162 kB)
  - Logo: 4 versões responsivas (240w, 299w, 598w, original)
  - Hero: 3 versões responsivas (400w, 525w, 1050w)

---

## 🎯 Otimizações Implementadas

### Performance:
- ✅ **Resource Hints:** Preload de CSS/JS críticos injetados
- ✅ **Critical CSS:** Inline no `<head>` (above-the-fold)
- ✅ **Code Splitting:** 7 chunks para lazy loading
- ✅ **Tree Shaking:** JavaScript não usado removido
- ✅ **Google Analytics:** Carregamento adiado (3s ou interação)
- ✅ **Gzip:** Compressão aplicada (redução de ~70%)

### Acessibilidade:
- ✅ **Contraste WCAG AAA:** Links #ffffff (19.56:1), #FFD700 (4.8:1)
- ✅ **Áreas de Toque:** 48x48px (desktop), 56x56px (mobile)
- ✅ **Espaçamento:** 8px mínimo entre elementos

### Segurança (Security Headers):
- ✅ **CSP:** Content Security Policy implementado
- ✅ **HSTS:** HTTP Strict Transport Security (1 ano)
- ✅ **COOP/COEP/CORP:** Políticas de isolamento de origem
- ✅ **Charset:** Primeira meta tag (prevenção XSS)

### SEO:
- ✅ **Sitemap.xml:** 9 URLs com lastmod dinâmico
- ✅ **Robots.txt:** Otimizado para crawl budget
- ✅ **Meta Tags:** Mobile-first, Open Graph, Twitter Cards
- ✅ **Schema.org:** JSON-LD para rich snippets

---

## 🚀 Como Fazer o Deploy (Hostinger)

### Método 1: File Manager (Recomendado)

1. **Acessar o File Manager:**
   - Login no painel da Hostinger
   - Acesse: **Websites** > **fenixcredbr.com.br** > **File Manager**

2. **Navegar até a pasta pública:**
   - Localize a pasta `public_html/` (ou `httpdocs/` ou `www/`)
   - **IMPORTANTE:** Faça backup da pasta atual antes de substituir

3. **Fazer backup:**
   ```bash
   # Renomear pasta atual
   public_html → public_html_backup_20260116
   ```

4. **Upload dos arquivos:**
   - **Selecione TODOS os arquivos da pasta `dist/`** (não a pasta em si)
   - Arraste para `public_html/`
   - **ATENÇÃO:** Marque "Mostrar arquivos ocultos" para ver o `.htaccess`
   - Aguarde upload completo (532 KB)

5. **Verificar estrutura final:**
   ```
   public_html/
   ├── .htaccess ⚠️ ARQUIVO OCULTO - MUITO IMPORTANTE
   ├── index.html
   ├── robots.txt
   ├── sitemap.xml
   ├── favicon_fenix_cred.webp
   ├── vite.svg
   └── assets/
       ├── *.css (5 arquivos)
       ├── *.js (7 arquivos)
       └── *.webp (7 imagens)
   ```

### Método 2: FTP (Alternativo)

1. **Conectar via FTP:**
   - Cliente: FileZilla ou Cyberduck
   - Host: `ftp.fenixcredbr.com.br`
   - Porta: 21
   - Protocolo: FTP (ou SFTP se disponível)

2. **Configurar FileZilla para mostrar arquivos ocultos:**
   - Menu: **Servidor** > **Forçar exibição de arquivos ocultos**

3. **Upload:**
   - Navegar até `public_html/`
   - Selecionar TODOS os arquivos de `dist/`
   - Arrastar para o servidor
   - Confirmar substituição

---

## ⚠️ IMPORTANTE: Arquivo `.htaccess`

O arquivo `.htaccess` é **CRÍTICO** e contém:
- Cache headers (1 ano para assets)
- Security headers (CSP, HSTS, COOP)
- Redirecionamento HTTPS
- Compressão Gzip
- Regras de SPA routing

### Como verificar se foi copiado:

**File Manager:**
1. Clique em **Configurações** (ícone de engrenagem)
2. Marque ✅ **Mostrar arquivos ocultos**
3. Verifique se `.htaccess` aparece na lista

**FTP:**
1. FileZilla: **Servidor** > **Forçar exibição de arquivos ocultos**
2. Verifique se `.htaccess` aparece (tamanho: 7.2 kB)

**Terminal/SSH (se tiver acesso):**
```bash
ls -la public_html/ | grep .htaccess
```

---

## ✅ Checklist Pós-Deploy

### 1. Verificar Site Carregando:
- [ ] Acesse: https://fenixcredbr.com.br
- [ ] Página carrega sem erros?
- [ ] Imagens aparecem corretamente?
- [ ] Navegação funciona?

### 2. Testar Performance (PageSpeed Insights):
- [ ] Acesse: https://pagespeed.web.dev/
- [ ] Digite: `fenixcredbr.com.br`
- [ ] **Resultado esperado:**
  - ✅ Desempenho: **100**
  - ✅ Acessibilidade: **100**
  - ✅ Práticas Recomendadas: **100**
  - ✅ SEO: **100**

### 3. Testar Contraste (WebAIM):
- [ ] Acesse: https://webaim.org/resources/contrastchecker/
- [ ] Teste 1: `#ffffff` sobre `#050528` → Deve dar **19.56:1 (AAA)** ✅
- [ ] Teste 2: `#FFD700` sobre `#050528` → Deve dar **4.8:1 (AA)** ✅

### 4. Testar Security Headers:
- [ ] Acesse: https://securityheaders.com/
- [ ] Digite: `fenixcredbr.com.br`
- [ ] Verifique:
  - ✅ Content-Security-Policy presente
  - ✅ Strict-Transport-Security presente
  - ✅ Cross-Origin-Opener-Policy presente
  - ✅ Grade A ou A+ esperado

### 5. Testar Mobile Usability:
- [ ] Chrome DevTools (`F12`) > Device Toolbar
- [ ] Testar em iPhone 12 Pro / Galaxy S20
- [ ] Inspecionar áreas de toque:
  - Links de navegação: ≥48px ✅
  - Ícones sociais: ≥48px ✅
  - Botões: ≥48px ✅

### 6. Testar Sitemap:
- [ ] Acesse: https://fenixcredbr.com.br/sitemap.xml
- [ ] Deve mostrar 9 URLs
- [ ] Verificar datas de modificação atualizadas

### 7. Testar Robots.txt:
- [ ] Acesse: https://fenixcredbr.com.br/robots.txt
- [ ] Verificar se sitemap está listado

### 8. Google Search Console (Opcional):
- [ ] Enviar novo sitemap
- [ ] Solicitar reindexação
- [ ] Monitorar erros de rastreamento

---

## 🐛 Troubleshooting

### ❌ Página em branco / Erro 404:
**Causa:** `.htaccess` não foi copiado ou não funciona
**Solução:**
1. Verificar se `.htaccess` existe
2. Testar permissões: `chmod 644 .htaccess`
3. Verificar se mod_rewrite está ativo no Apache

### ❌ CSS não carrega / Site sem estilo:
**Causa:** Caminho de assets incorreto
**Solução:**
1. Verificar se pasta `assets/` existe
2. Abrir DevTools (`F12`) > Console
3. Procurar erros 404
4. Verificar permissões: `chmod 755 assets/`

### ❌ Imagens não aparecem:
**Causa:** MIME type incorreto para WebP
**Solução:**
Adicionar no `.htaccess`:
```apache
AddType image/webp .webp
```

### ❌ PageSpeed ainda baixo:
**Causa:** Cache headers não funcionando
**Solução:**
1. Verificar se `.htaccess` foi copiado
2. Testar cache: `curl -I https://fenixcredbr.com.br/assets/index-*.css`
3. Procurar por `Cache-Control: max-age=31536000`

### ❌ Erro "Mixed Content":
**Causa:** Recursos HTTP em página HTTPS
**Solução:**
1. Forçar HTTPS no `.htaccess` (já implementado)
2. Verificar console do navegador
3. Substituir URLs `http://` por `https://`

---

## 📊 Métricas Esperadas

### PageSpeed Insights:
- **LCP (Largest Contentful Paint):** < 1.5s ⚡
- **FID (First Input Delay):** < 100ms ⚡
- **CLS (Cumulative Layout Shift):** < 0.1 ⚡
- **FCP (First Contentful Paint):** < 1.0s ⚡
- **TTI (Time to Interactive):** < 2.5s ⚡

### Lighthouse Scores:
- **Performance:** 100 🎯
- **Accessibility:** 100 ♿
- **Best Practices:** 100 🔒
- **SEO:** 100 📈

---

## 📞 Suporte

### Se algo der errado:
1. **Restaurar backup:**
   - Renomear `public_html/` → `public_html_erro/`
   - Renomear `public_html_backup_20260116/` → `public_html/`

2. **Verificar logs:**
   - Hostinger: **Websites** > **Estatísticas** > **Logs de erro**

3. **Testar localmente:**
   ```bash
   npm run preview
   # Abrir: http://localhost:4173
   ```

---

## ✅ Deploy Concluído!

Após seguir todos os passos:
1. ✅ Arquivos em produção
2. ✅ PageSpeed 100/100
3. ✅ Security headers ativos
4. ✅ Sitemap indexado
5. ✅ Acessibilidade WCAG AA

**🎉 Parabéns! Site otimizado e no ar!**

---

**Documentação gerada automaticamente**
Data: 16/01/2026
Versão: 1.0.0
