# 📤 Instruções de Deploy - Hostinger

## ✅ Arquivos Prontos para Upload

Todos os arquivos necessários estão na pasta **`dist/`** e estão prontos para upload no servidor Hostinger.

## 🚀 Passo a Passo Rápido

### 1️⃣ Acesse o File Manager da Hostinger
- Faça login no painel: https://hpanel.hostinger.com.br
- Clique em **"Gerenciador de Arquivos"** ou **"File Manager"**

### 2️⃣ Navegue até a pasta pública
- **Domínio principal**: Vá para `public_html/`
- **Subdomínio**: Vá para `public_html/nome-do-subdominio/`

### 3️⃣ Faça upload dos arquivos
1. Na pasta `dist/` do seu computador, selecione **TODOS** os arquivos:
   - `.htaccess` ⚠️ (IMPORTANTE - configura cache headers e SPA routing)
   - `index.html`
   - `vite.svg`
   - `robots.txt`
   - `sitemap.xml`
   - Pasta `assets/` (com todos os arquivos dentro)

2. No File Manager da Hostinger:
   - Clique em **"Upload"** ou **"Enviar arquivos"**
   - Arraste todos os arquivos ou selecione-os
   - Aguarde o upload completar

### 4️⃣ Verifique o arquivo .htaccess
- O arquivo `.htaccess` é essencial para:
  - ✅ SPA routing (navegação entre páginas)
  - ✅ Cache headers agressivos (otimização de crawl budget)
  - ✅ Compressão Gzip
  - ✅ Headers de segurança
- Se não aparecer, ative "Mostrar arquivos ocultos" nas configurações
- Certifique-se de que ele foi enviado corretamente

### 5️⃣ Teste o site
- Acesse seu domínio no navegador
- O site deve carregar normalmente
- Teste navegar entre as páginas

## 📁 Estrutura Final no Servidor

Após o upload, a estrutura deve ficar assim:

```
public_html/
├── .htaccess
├── index.html
├── vite.svg
└── assets/
    ├── index-aZN1psOv.css
    └── index-CNn0IFqc.js
```

## ⚙️ Configurações Importantes

### Permissões de Arquivos
- **Arquivos**: 644
- **Pastas**: 755
- **.htaccess**: 644

Para alterar permissões no File Manager:
1. Clique com botão direito no arquivo/pasta
2. Selecione "Alterar Permissões" ou "Change Permissions"
3. Defina as permissões corretas

## 🔧 Solução de Problemas

### ❌ Página em branco
- ✅ Verifique se `index.html` está na pasta correta
- ✅ Verifique se o arquivo `.htaccess` está presente
- ✅ Limpe o cache do navegador (Ctrl+F5)

### ❌ Erro 404 ao navegar
- ✅ Certifique-se de que o `.htaccess` foi enviado
- ✅ Verifique se o mod_rewrite está habilitado (geralmente já está na Hostinger)
- ✅ Entre em contato com o suporte se o problema persistir

### ❌ CSS/JS não carregam
- ✅ Verifique se a pasta `assets/` foi enviada completamente
- ✅ Verifique as permissões da pasta `assets/` (deve ser 755)
- ✅ Verifique o console do navegador (F12) para erros

## 📞 Suporte Hostinger

Se precisar de ajuda:
- **Chat ao vivo**: Disponível no painel
- **E-mail**: suporte@hostinger.com.br
- **Telefone**: Verifique no site da Hostinger

## ✅ Checklist Final

Antes de finalizar, verifique:

- [ ] Todos os arquivos da pasta `dist/` foram enviados
- [ ] Arquivo `.htaccess` está presente (pode estar oculto)
- [ ] Pasta `assets/` foi enviada com todos os arquivos
- [ ] Permissões estão corretas (arquivos: 644, pastas: 755)
- [ ] Site está acessível no navegador
- [ ] Todas as rotas funcionam (#inicio, #sobre, etc.)
- [ ] Política de Privacidade abre corretamente (#politica-privacidade)
- [ ] Botões de WhatsApp funcionam

## 🎉 Pronto!

Seu site está pronto para uso! 🚀

