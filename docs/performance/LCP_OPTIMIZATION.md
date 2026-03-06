# Otimização LCP (Largest Contentful Paint)

## 📊 Problema Identificado

Lighthouse reporta:
- "Descoberta de solicitações de LCP"
- "Otimize a LCP tornando a imagem LCP detectável no HTML imediatamente"
- "A propriedade fetchpriority=high precisa ser aplicada"
- "A solicitação é detectável no documento inicial"

## 🎯 Solução Implementada

### 1. Preload da Imagem LCP com fetchpriority="high"

**Arquivo:** `scripts/inject-resource-hints.js`

O script agora adiciona `fetchpriority="high"` no preload da imagem LCP:

```html
<link rel="preload" as="image" href="/assets/modelo_fenix_cred-525w.webp" type="image/webp" fetchpriority="high" />
<link rel="preload" as="image" href="/assets/modelo_fenix_cred-400w.webp" type="image/webp" fetchpriority="high" />
```

### 2. Imagem Hero Otimizada

**Arquivo:** `src/components/Hero.jsx`

A imagem hero já está otimizada:
- ✅ `loading="eager"` - Carrega imediatamente
- ✅ `fetchpriority="high"` - Prioridade alta
- ✅ `decoding="async"` - Decodificação assíncrona
- ✅ `width="525"` e `height="783"` - Previne CLS
- ✅ `srcset` e `sizes` - Responsivo

## 🔧 Características

### Preload com fetchpriority

```html
<link rel="preload" as="image" href="/assets/modelo_fenix_cred-525w.webp" type="image/webp" fetchpriority="high" />
```

**Benefícios:**
- Browser detecta imagem LCP imediatamente
- Carrega com prioridade alta
- Não bloqueia renderização
- Melhor LCP

### Imagem Hero

```html
<img
  src="/assets/modelo_fenix_cred-525w.webp"
  srcSet="..."
  sizes="..."
  loading="eager"
  fetchpriority="high"
  decoding="async"
  width="525"
  height="783"
/>
```

**Benefícios:**
- Detectável no HTML inicial
- Carrega com prioridade alta
- Não lazy loaded
- Dimensões definidas (previne CLS)

## 📊 Impacto Esperado

### Antes
- LCP > 2.5s
- Imagem LCP não detectável imediatamente
- fetchpriority não aplicado no preload

### Depois
- **LCP < 2.5s** (objetivo)
- Imagem LCP detectável no HTML inicial
- fetchpriority="high" no preload
- Carregamento prioritário

## ✅ Validação

### Teste 1: Verificar Preload

1. Abra DevTools (`F12`) > **Network**
2. Recarregue a página
3. Filtre por **Other** ou **Img**
4. Verifique:
   - ✅ Preload da imagem LCP aparece primeiro
   - ✅ Tem `fetchpriority="high"` no preload
   - ✅ Imagem hero carrega imediatamente

### Teste 2: Lighthouse

1. Execute Lighthouse audit
2. Verifique **LCP**
3. Deve mostrar:
   - ✅ "A solicitação é detectável no documento inicial"
   - ✅ "fetchpriority=high aplicado"
   - ✅ LCP < 2.5s

### Teste 3: Verificar HTML

1. Visualize o HTML fonte (`Ctrl+U`)
2. Procure por `preload` e `modelo_fenix_cred`
3. Verifique:
   - ✅ Preload está no `<head>`
   - ✅ Tem `fetchpriority="high"`
   - ✅ Imagem hero tem `fetchpriority="high"`

## 🔍 Explicação Técnica

### Por que Preload com fetchpriority?

1. **Detecção Imediata:**
   - Browser detecta imagem LCP no HTML inicial
   - Não precisa esperar JavaScript executar
   - Melhor LCP

2. **Prioridade Alta:**
   - `fetchpriority="high"` indica prioridade
   - Browser carrega antes de outros recursos
   - Melhor tempo de carregamento

3. **Não Bloqueia:**
   - Preload não bloqueia renderização
   - Carrega em paralelo
   - Melhor performance

### Por que fetchpriority no Preload?

- Preload sozinho não garante prioridade
- `fetchpriority="high"` força prioridade alta
- Browser trata como recurso crítico
- Melhor LCP

## 📝 Notas Importantes

### Ordem de Preload

1. **CSS crítico** - Primeiro
2. **Imagem LCP** - Segundo (com fetchpriority="high")
3. **JavaScript crítico** - Terceiro
4. **Outros recursos** - Depois

### Imagens LCP

- ✅ Preload com `fetchpriority="high"`
- ✅ `loading="eager"` na tag `<img>`
- ✅ `fetchpriority="high"` na tag `<img>`
- ✅ Dimensões definidas (width/height)

## 🚀 Próximos Passos

1. ✅ Preload com fetchpriority implementado
2. ✅ Imagem hero otimizada
3. ⏳ Fazer deploy
4. ⏳ Testar no Lighthouse
5. ⏳ Verificar LCP < 2.5s
6. ⏳ Monitorar performance
7. ⏳ Ajustar se necessário

## 📚 Referências

- [Optimize LCP](https://web.dev/optimize-lcp/)
- [fetchpriority](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#fetchpriority)
- [Preload Critical Assets](https://web.dev/preload-critical-assets/)
