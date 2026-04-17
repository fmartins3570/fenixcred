# Fenix Cred

Site institucional + landing pages da Fenix Cred -- empresa de solucoes financeiras (credito consignado CLT, antecipacao FGTS).

## Cliente
- **Empresa:** Fenix Cred (H.I Intermediacao Financeira LTDA - ME)
- **CNPJ:** 52.069.594/0001-90
- **Contato:** (11) 91708-2143 | contato@fenixcredbr.com.br
- **WhatsApp:** 5511917082143
- **Dominio:** fenixcredbr.com.br
- **Gerenciado por:** FM Consultoria (Felipe Martins)

## Stack
- React 19 + Vite 7 + JavaScript ES6+ (sem TypeScript)
- CSS3 Puro (sem framework CSS)
- Sharp 0.34 (otimizacao de imagens)
- Playwright (dependencia de producao, usado em integracao)

## Comandos
```bash
npm run dev                # Servidor de desenvolvimento (Vite)
npm run build              # Build de producao (Vite + inject-resource-hints + generate-sitemap)
npm run preview            # Preview do build de producao
npm run lint               # ESLint
npm run optimize-images    # Otimizar imagens com Sharp
npm run generate-sitemap   # Gerar sitemap.xml
```

## Estrutura
```
src/
  App.jsx                   # Componente raiz + roteamento por pathname
  main.jsx                  # Entry point
  index.css                 # Reset + variaveis CSS globais (:root)
  App.css                   # Layout global (.App, main, scroll)
  assets/                   # Imagens otimizadas (WebP, multiplas larguras)
  styles/
    spotlight.css           # Efeito visual spotlight
  hooks/
    useActiveSection.js     # Detecta secao visivel (IntersectionObserver)
    useLazyComponent.js     # Lazy load de secoes abaixo da dobra
    useLazyImage.js         # Lazy load de imagens
    useViewContent.js       # Tracking de ViewContent
    useWhatsAppWithTag.js   # Link WhatsApp com UTM tag
    credito-clt/
      useLeadData.js        # Gerencia dados de lead CLT
      useWhatsApp.js        # WhatsApp especifico para fluxo CLT
  utils/
    analytics.js            # Google Analytics (GA4 init/fallback)
    metaPixel.js            # Meta Pixel (fbq helper, generateEventId, cookies)
    metaCAPI.js             # Meta Conversions API (server-side via CAPI Server VPS)
    cookieConsent.js        # Gerenciamento de consentimento LGPD
    lazyImages.js           # Utilitario de lazy loading de imagens
    spotlight.js            # Efeito visual spotlight
    utmParams.js            # Captura e persistencia de parametros UTM
    consignado-lp/
      angles.js             # Configuracao de angulos (negativado, velocidade, geral)
      simulator-config.js   # Config do simulador de consignado
    credito-clt/
      constants.js          # Constantes da landing page CLT
      formValidation.js     # Validacao de formularios CLT
  components/
    Header.jsx              # Header fixo com nav + menu mobile
    Hero.jsx                # Hero section com CTA WhatsApp
    Stats.jsx               # Numeros/estatisticas da empresa
    About.jsx               # Sobre nos
    Diferenciais.jsx        # Diferenciais competitivos
    Services.jsx            # Servicos oferecidos
    ReviewsSection.jsx      # Avaliacoes Google (lazy)
    Parceiros.jsx           # Logos de parceiros (lazy)
    FAQ.jsx                 # Perguntas frequentes (lazy)
    TrabalheConosco.jsx     # Formulario trabalhe conosco (lazy)
    Footer.jsx              # Rodape com links e contato
    Depoimentos.jsx         # Depoimentos de clientes
    Logo.jsx                # Componente de logo responsivo
    Breadcrumb.jsx          # Breadcrumb para SEO
    SchemaJSON.jsx          # JSON-LD structured data
    SectionDivider.jsx      # Divisor visual entre secoes
    BackToTop.jsx           # Botao voltar ao topo
    CookieBanner.jsx        # Banner de consentimento LGPD
    PrivacyPolicy.jsx       # Politica de privacidade (LGPD + Meta Data Deletion)
    DataDeletion.jsx        # Instrucoes de exclusao de dados (Meta Developers)
    RelatedContent.jsx      # Conteudo relacionado
    ConsignadoLP/           # Landing page de consignado (multi-angulo)
      index.jsx             # Entry point com prop "angle"
      Hero.jsx              # Hero especifico LP
      Simulator.jsx         # Simulador interativo
      FinalCTA.jsx          # CTA final
    CreditoCLT/             # Landing page dedicada CLT
      index.jsx             # Entry point (prop "personalized" para variante)
      Hero.jsx              # Hero CLT
      Benefits.jsx          # Beneficios
      HowItWorks.jsx        # Como funciona
      SocialProof.jsx       # Prova social
      FAQ.jsx               # FAQ especifico CLT
      FinalCTA.jsx          # CTA final
      LeadPopup.jsx         # Popup de captura de lead (variante personalizada)
      HeaderCLT.jsx         # Header especifico CLT
      Footer.jsx            # Footer especifico CLT
      sections/             # Sub-secoes modulares
      seo/                  # SEO especifico (schema, meta)
      ui/                   # Componentes UI reutilizaveis
    SimulacaoCLT/           # Questionario interativo de pre-qualificacao
      index.jsx             # Entry point
      Hero.jsx              # Hero do quiz
      Questionnaire.jsx     # Quiz multi-step -> WhatsApp
      FAQ.jsx               # FAQ do simulador
      WhatsAppFloat.jsx     # Botao flutuante WhatsApp
scripts/
  inject-resource-hints.js  # Injeta preload/prefetch no HTML pos-build
  generate-sitemap.js       # Gera sitemap.xml automaticamente
  optimize-images.js        # Otimiza imagens com Sharp (WebP, multiplas larguras)
  deploy-combined.sh        # Script de deploy combinado
  check-http2.sh            # Verifica suporte HTTP/2
  validate-cache-headers.sh # Valida headers de cache
```

## Rotas e Paginas

O roteamento e feito manualmente em `App.jsx` via `window.location.pathname` (sem react-router).

| URL | Tipo | Descricao |
|-----|------|-----------|
| `/` | Homepage | Todas as secoes do site institucional |
| `/consignado-negativado` | Landing page | Consignado para negativados (angle: negativado) |
| `/consignado-rapido` | Landing page | Consignado rapido (angle: velocidade) |
| `/consignado-clt` | Landing page | Consignado CLT (angle: geral) |
| `/page-credito-clt` | Landing page | Credito CLT sem popup |
| `/page-credito-clt-personalizado` | Landing page | Credito CLT com greeting personalizado + LeadPopup |
| `/simulacao-consignado-clt` | Simulador | Quiz interativo de pre-qualificacao -> WhatsApp |
| `/politica-privacidade` | Estatica | Politica de privacidade (LGPD + Meta Data Deletion) |
| `/exclusao-de-dados` | Estatica | Instrucoes de exclusao de dados (Meta Developers) |
| `/#politica-privacidade` | Hash | Politica de privacidade com header/footer do site |

## Integracoes
- **Meta Pixel:** 2877752735949899 (Browser + CAPI via VPS server)
- **Google Analytics 4:** G-T91KB49251
- **Google Maps API:** Place ID via env var `VITE_FENIX_PLACE_ID`
- **CAPI Server (VPS):** Eventos browser via POST JSON para painel.martinsfelipe.com/api/capi/meta (SHA-256 hashing, IP server-side, retry com backoff)
- **Google Apps Script (VendeAI):** Webhooks de tags/stages do VendeAI -> Meta CAPI (doPost)
- **Cookie Consent:** Controla carregamento condicional de Pixel + GA4 (LGPD compliance)

## Paleta de Cores (CSS custom properties em :root)
```css
--bg-dark: #050528          /* Fundo principal */
--bg-darker: #030318        /* Fundo secundario */
--primary-yellow: #FDB147   /* Amarelo Fenix (CTA, titulos) */
--primary-yellow-light: #FDC567
--whatsapp-green: #25d366   /* Verde WhatsApp */
--whatsapp-green-dark: #20ba5a
--text-white: #ffffff       /* Texto principal (contraste 19.56:1 WCAG AAA) */
--text-gray: rgba(255, 255, 255, 0.8)
--text-gray-light: rgba(255, 255, 255, 0.6)
```

## Deploy
- **Hospedagem:** Hostinger
- **CI/CD:** GitHub Actions (`.github/workflows/deploy.yml`) -> `npm ci` -> `npm run build` -> FTP Deploy (SamKirkland/FTP-Deploy-Action)
- **Env vars no CI:** `VITE_FENIX_PLACE_ID`, `VITE_GOOGLE_MAPS_API_KEY`, `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD`
- **SSL:** obrigatorio (upgrade-insecure-requests no CSP)
- **Repositorio:** github.com/fmartins3570/fenixcred
- **Node:** 20 (definido no workflow)

## Performance e Otimizacoes
- **Code splitting:** Chunks manuais no Vite (react-vendor, reviews, parceiros, faq, trabalhe, privacy, consignado-lp, simulacao-clt, vendor)
- **Lazy loading:** Componentes abaixo da dobra carregam via IntersectionObserver (`useLazyComponent` com rootMargin 300px)
- **CSS critico inline:** Header + Hero CSS inline no `index.html` para evitar FOUC
- **CSS nao-bloqueante:** Tecnica de `media="print"` com onload para CSS do Vite
- **Resource hints:** Script pos-build injeta preload/prefetch automaticamente
- **Imagens:** WebP com multiplas larguras (400w, 525w, 1050w), inline de assets < 4KB
- **Build:** esbuild minification, console.log/debugger removidos em producao, tree-shaking agressivo, target ES2015, sourcemaps desabilitados

## Decisoes Tecnicas
- **Sem TypeScript:** projeto iniciou em JS puro, migracacao planejada mas nao priorizada
- **Sem framework CSS:** CSS puro para controle total de performance e tamanho de bundle
- **Sem react-router:** Roteamento manual por pathname para bundle menor e controle total
- **CAPI via VPS server:** Eventos browser vao para CAPI Server dedicado (POST JSON, SHA-256 server-side, IP via X-Forwarded-For). VendeAI webhooks ainda via Apps Script
- **Cookie consent controla Pixel + GA4:** Scripts sao stubs ate consentimento (LGPD)
- **Critical CSS inline:** Evita render-blocking CSS para Header e Hero
- **CSP (Content Security Policy):** Definido via .htaccess (single source of truth)

## Projetos Relacionados
- **[[Painel FM Consultoria]]** -- Dashboard que gerencia campanhas e analytics deste site
- **[[FM Consultoria]]** -- Site da agencia que desenvolve este projeto. Relatorios de performance publicados em martinsfelipe.com

## Convencoes
- Comentarios em ingles
- Commits seguem Conventional Commits
- Codigo em JavaScript ES6+ (sem TypeScript)
- Componentes React em JSX (um arquivo .jsx + um .css por componente)
- Path alias: `@/` aponta para `src/`
- Imagens em WebP com multiplas larguras para responsividade
- Fonte principal: Inter (system-ui fallback)
