# Guia de Otimização de Imagens - Fênix Cred

## 📊 Problema Atual

### Imagem 1: modelo_fenix_cred.webp
- **Tamanho atual:** 121 KB
- **Dimensões atuais:** 1696x2528 pixels
- **Dimensões de exibição:** ~525x783 pixels (desktop)
- **Problema:** Imagem 3.2x maior que necessário
- **Economia possível:** ~11.6 KB (120.8 KB → 109.2 KB)

### Imagem 2: logo-fenix-cred.webp
- **Tamanho atual:** 32 KB
- **Dimensões atuais:** 1080x316 pixels
- **Dimensões de exibição:** ~299x88 pixels (desktop)
- **Problema:** Imagem 3.6x maior que necessário
- **Economia possível:** ~2.5 KB (32.0 KB → 29.5 KB)

**Total economizável:** ~138.7 KB

## 🎯 Solução: Imagens Responsivas com srcset

### Estrutura de Tamanhos

#### modelo_fenix_cred.webp
```
Mobile (até 640px):     400x600px   (~40 KB)
Tablet (641-1024px):    525x783px   (~60 KB)
Desktop (1025px+):      525x783px   (~60 KB)
Retina (2x):            1050x1566px (~80 KB)
```

#### logo-fenix-cred.webp
```
Mobile (até 640px):     180x53px    (~8 KB)
Tablet (641-1024px):    240x70px    (~12 KB)
Desktop (1025px+):      299x88px    (~15 KB)
Retina (2x):            598x176px   (~22 KB)
```

## 🛠️ Como Otimizar as Imagens

### Opção 1: Usando Sharp (Node.js) - RECOMENDADO

```bash
# Instalar sharp
npm install --save-dev sharp

# Executar script de otimização
node scripts/optimize-images.js
```

### Opção 2: Usando ImageMagick (CLI)

```bash
# Instalar ImageMagick (macOS)
brew install imagemagick

# Otimizar modelo_fenix_cred
convert src/assets/modelo_fenix_cred.webp \
  -resize 400x600 -quality 85 src/assets/modelo_fenix_cred-400w.webp
convert src/assets/modelo_fenix_cred.webp \
  -resize 525x783 -quality 85 src/assets/modelo_fenix_cred-525w.webp
convert src/assets/modelo_fenix_cred.webp \
  -resize 1050x1566 -quality 85 src/assets/modelo_fenix_cred-1050w.webp

# Otimizar logo-fenix-cred
convert src/assets/logo-fenix-cred.webp \
  -resize 180x53 -quality 90 src/assets/logo-fenix-cred-180w.webp
convert src/assets/logo-fenix-cred.webp \
  -resize 240x70 -quality 90 src/assets/logo-fenix-cred-240w.webp
convert src/assets/logo-fenix-cred.webp \
  -resize 299x88 -quality 90 src/assets/logo-fenix-cred-299w.webp
convert src/assets/logo-fenix-cred.webp \
  -resize 598x176 -quality 90 src/assets/logo-fenix-cred-598w.webp
```

### Opção 3: Usando Squoosh (Online) - MAIS FÁCIL

1. Acesse: https://squoosh.app/
2. Faça upload da imagem original
3. Configure:
   - **Format:** WebP
   - **Quality:** 85 (modelo) / 90 (logo)
   - **Resize:** Use as dimensões acima
4. Baixe e salve com o nome correto

## 📁 Estrutura de Arquivos Após Otimização

```
src/assets/
├── modelo_fenix_cred.webp (original - manter como fallback)
├── modelo_fenix_cred-400w.webp  (mobile)
├── modelo_fenix_cred-525w.webp  (tablet/desktop)
├── modelo_fenix_cred-1050w.webp (retina)
├── logo-fenix-cred.webp (original - manter como fallback)
├── logo-fenix-cred-180w.webp  (mobile)
├── logo-fenix-cred-240w.webp  (tablet)
├── logo-fenix-cred-299w.webp   (desktop)
└── logo-fenix-cred-598w.webp  (retina)
```

## ✅ Componentes Atualizados

Os componentes `Hero.jsx` e `Logo.jsx` já foram atualizados para usar `srcset` responsivo.

### Hero.jsx
- ✅ Usa `<picture>` com múltiplos `<source>`
- ✅ `srcset` com diferentes resoluções
- ✅ `sizes` attribute para otimização
- ✅ `loading="eager"` e `fetchpriority="high"` (above the fold)

### Logo.jsx
- ✅ Usa `<picture>` com múltiplos `<source>`
- ✅ `srcset` baseado no tamanho do componente
- ✅ `loading="lazy"` (abaixo da dobra)
- ✅ Dimensões explícitas (`width` e `height`)

## 📈 Resultados Esperados

### Antes:
- modelo_fenix_cred: 120.8 KB (1696x2528)
- logo-fenix-cred: 32.0 KB (1080x316)
- **Total:** 152.8 KB

### Depois:
- modelo_fenix_cred (mobile): ~40 KB (400x600)
- modelo_fenix_cred (desktop): ~60 KB (525x783)
- logo-fenix-cred (mobile): ~8 KB (180x53)
- logo-fenix-cred (desktop): ~15 KB (299x88)
- **Total carregado (mobile):** ~48 KB
- **Total carregado (desktop):** ~75 KB
- **Economia:** ~77-104 KB dependendo do dispositivo

## 🚀 Próximos Passos

1. ✅ Componentes atualizados com `srcset`
2. ⏳ Criar versões otimizadas das imagens
3. ⏳ Testar em diferentes dispositivos
4. ⏳ Verificar PageSpeed Insights

## 📝 Notas Importantes

- **WebP:** Formato já otimizado, mas podemos reduzir qualidade se necessário
- **Lazy Loading:** Logo usa `loading="lazy"` (abaixo da dobra)
- **Eager Loading:** Hero image usa `loading="eager"` (above the fold)
- **Fetch Priority:** Hero image usa `fetchpriority="high"` para prioridade
- **Dimensões:** Sempre especificar `width` e `height` para evitar CLS

