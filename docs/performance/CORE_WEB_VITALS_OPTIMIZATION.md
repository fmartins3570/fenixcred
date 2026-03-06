# Otimização Core Web Vitals - Lazy Loading de Imagens

## 📊 Objetivo

Otimizar Core Web Vitals (especialmente LCP e CLS) implementando lazy loading nativo em todas as imagens, exceto:
- Imagem hero/LCP (primeira imagem visível)
- Logo (above the fold)
- Imagens above the fold

## ✅ Implementações

### 1. Hero Image (LCP) - SEM Lazy Loading

**Arquivo:** `src/components/Hero.jsx`

- ✅ `loading="eager"` - Carrega imediatamente
- ✅ `fetchpriority="high"` - Prioridade alta
- ✅ `decoding="async"` - Decodificação assíncrona
- ✅ `width="525"` e `height="783"` - Previne CLS

### 2. Logo - SEM Lazy Loading

**Arquivo:** `src/components/Logo.jsx`

- ✅ `loading="eager"` - Carrega imediatamente (está no header)
- ✅ `decoding="async"` - Decodificação assíncrona
- ✅ `width` e `height` dinâmicos - Previne CLS

### 3. Review Avatars - COM Lazy Loading

**Arquivo:** `src/components/ReviewsSection.jsx`

- ✅ `loading="lazy"` - Lazy loading nativo
- ✅ `decoding="async"` - Decodificação assíncrona
- ✅ `width="48"` e `height="48"` - Previne CLS

### 4. Intersection Observer Fallback

**Arquivo:** `src/utils/lazyImages.js`

- ✅ Fallback para browsers antigos
- ✅ Suporta `data-src` para lazy loading manual
- ✅ Executa automaticamente quando DOM está pronto

## 🔧 Características Implementadas

### Lazy Loading Nativo

```html
<img 
  src="imagem.jpg"
  loading="lazy"
  decoding="async"
  width="800"
  height="600"
  alt="Descrição detalhada"
>
```

### Intersection Observer Fallback

Para browsers que não suportam `loading="lazy"`:

```javascript
const imageObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      img.classList.add('loaded');
      imageObserver.unobserve(img);
    }
  });
}, { rootMargin: '50px' });
```

## 📊 Impacto Esperado

### Antes
- Todas as imagens carregam imediatamente
- LCP > 2.5s
- CLS > 0.1
- Muitas requisições simultâneas

### Depois
- **LCP < 2.5s** (objetivo)
- **CLS < 0.1** (objetivo)
- Imagens abaixo da dobra carregam apenas ao scroll
- Menos requisições simultâneas
- Melhor performance

## ✅ Validação

### Teste 1: PageSpeed Insights

1. Acesse: [PageSpeed Insights](https://pagespeed.web.dev/)
2. Digite: `https://fenixcredbr.com.br`
3. Execute o teste
4. Verifique:
   - ✅ LCP < 2.5s
   - ✅ CLS < 0.1
   - ✅ FCP < 1.8s

### Teste 2: Network Tab

1. Abra DevTools (`F12`) > Aba **Network**
2. Filtre por **Img**
3. Recarregue a página
4. Verifique:
   - ✅ Hero image carrega imediatamente
   - ✅ Logo carrega imediatamente
   - ✅ Review avatars carregam apenas ao scroll

### Teste 3: Verificar Lazy Loading

1. Abra DevTools (`F12`) > Aba **Network**
2. Filtre por **Img**
3. Role a página para baixo
4. Verifique:
   - ✅ Imagens aparecem no Network tab apenas quando visíveis
   - ✅ `loading="lazy"` está presente nas imagens abaixo da dobra

### Teste 4: Verificar CLS

1. Abra DevTools (`F12`) > Aba **Performance**
2. Grave uma sessão
3. Recarregue a página
4. Verifique:
   - ✅ CLS < 0.1
   - ✅ Imagens têm width/height definidos
   - ✅ Não há layout shift

## 🔍 Explicação Técnica

### Por que Lazy Loading é Importante?

1. **LCP (Largest Contentful Paint)**
   - Apenas imagem hero carrega imediatamente
   - Outras imagens não bloqueiam LCP
   - Melhor tempo de carregamento

2. **CLS (Cumulative Layout Shift)**
   - width/height definidos previnem layout shift
   - Espaço reservado antes da imagem carregar
   - Melhor experiência do usuário

3. **Performance**
   - Menos requisições simultâneas
   - Melhor uso de bandwidth
   - Melhor experiência mobile

### Como Funciona

1. **Lazy Loading Nativo:**
   - Browser detecta `loading="lazy"`
   - Carrega imagem apenas quando próxima do viewport
   - Suportado em 95%+ dos browsers modernos

2. **Intersection Observer Fallback:**
   - Para browsers antigos
   - Observa quando imagem entra no viewport
   - Carrega imagem dinamicamente

3. **Width/Height:**
   - Reserva espaço antes da imagem carregar
   - Previne layout shift
   - Melhora CLS

## 📝 Notas Importantes

### Imagens SEM Lazy Loading

- ✅ Hero image (LCP)
- ✅ Logo (above the fold)
- ✅ Qualquer imagem acima da dobra

### Imagens COM Lazy Loading

- ✅ Review avatars
- ✅ Imagens abaixo da dobra
- ✅ Imagens em seções lazy-loaded

### Atributos Importantes

- `loading="lazy"` - Lazy loading nativo
- `decoding="async"` - Decodificação assíncrona
- `width` e `height` - Previne CLS
- `fetchpriority="high"` - Apenas para LCP image

## 🚀 Próximos Passos

1. ✅ Lazy loading implementado
2. ✅ Intersection Observer fallback criado
3. ✅ Width/height adicionados
4. ⏳ Fazer deploy
5. ⏳ Testar no PageSpeed Insights
6. ⏳ Verificar Network tab
7. ⏳ Monitorar Core Web Vitals
8. ⏳ Ajustar se necessário

## 📚 Referências

- [Lazy Loading Images](https://web.dev/lazy-loading-images/)
- [Core Web Vitals](https://web.dev/vitals/)
- [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
