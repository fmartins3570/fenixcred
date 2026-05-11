# Otimização de JavaScript Não Usado

## 📊 Problema Identificado

Lighthouse reporta:
- **Google Tag Manager: 140.1 KiB** com economia estimada de **53.5 KiB**
- **Bundle principal: 66.4 KiB** com economia estimada de **20.4 KiB**
- Total de economia estimada: **74 KiB**

## 🎯 Solução Implementada

### 1. Google Analytics - Carregamento Adiado

**Problema:**
- Google Analytics carregando imediatamente (bloqueante)
- Script grande (140.1 KiB) carregando antes da renderização
- Funções não utilizadas no código

**Solução:**
- ✅ Carregamento adiado com `requestIdleCallback`
- ✅ Removidas funções não utilizadas (`loadGAScript`, `trackEvent`, `trackPageView`)
- ✅ Código minimalista apenas para verificação

**Arquivo:** `index.html` + `src/utils/analytics.js`

**Antes:**
```javascript
// Carregava imediatamente
<script async src="https://www.googletagmanager.com/gtag/js?id=G-T91KB49251"></script>
```

**Depois:**
```javascript
// Carrega após renderização inicial
requestIdleCallback(loadGA, { timeout: 2000 });
```

**Economia:** ~53.5 KiB (carregamento adiado, não bloqueia renderização)

### 2. Bundle Principal - Tree-Shaking Agressivo

**Problema:**
- Código não usado não sendo removido
- Tree-shaking não otimizado
- Imports não utilizados

**Solução:**
- ✅ Tree-shaking agressivo configurado
- ✅ Removidos imports não utilizados
- ✅ Código minimalista

**Arquivo:** `vite.config.js`

```javascript
treeshake: {
  moduleSideEffects: false,
  propertyReadSideEffects: false,
  tryCatchDeoptimization: false,
}
```

**Economia:** ~20.4 KiB (código não usado removido)

### 3. Funções Não Utilizadas Removidas

**Arquivo:** `src/utils/analytics.js`

**Removido:**
- ❌ `loadGAScript()` - não usado (script já no index.html)
- ❌ `trackEvent()` - não usado em lugar nenhum
- ❌ `trackPageView()` - não usado em lugar nenhum

**Mantido:**
- ✅ `initGA()` - versão minimalista apenas para verificação

**Arquivo:** `src/main.jsx`

**Removido:**
- ❌ `loadGAScript` import - não usado

**Mantido:**
- ✅ `initGA` - apenas para verificação

## 📊 Impacto Esperado

### Antes
- Google Analytics: 140.1 KiB (carregando imediatamente)
- Bundle principal: 66.4 KiB (com código não usado)
- Total: 206.5 KiB

### Depois
- Google Analytics: 140.1 KiB (carregamento adiado, não bloqueia)
- Bundle principal: ~46 KiB (código não usado removido)
- **Economia estimada: 74 KiB**

## 🔧 Características Implementadas

### 1. Carregamento Adiado do Google Analytics

```javascript
if ('requestIdleCallback' in window) {
  requestIdleCallback(loadGA, { timeout: 2000 });
} else {
  setTimeout(loadGA, 100);
}
```

**Vantagens:**
- ✅ Não bloqueia renderização inicial
- ✅ Carrega quando browser está ocioso
- ✅ Timeout garante carregamento
- ✅ Fallback para browsers antigos

### 2. Tree-Shaking Agressivo

```javascript
treeshake: {
  moduleSideEffects: false,
  propertyReadSideEffects: false,
  tryCatchDeoptimization: false,
}
```

**Vantagens:**
- ✅ Remove código não usado
- ✅ Bundle menor
- ✅ Melhor performance
- ✅ Carregamento mais rápido

### 3. Código Minimalista

**Antes:**
- `analytics.js`: 92 linhas com funções não usadas

**Depois:**
- `analytics.js`: 25 linhas apenas com o necessário

**Vantagens:**
- ✅ Menos código para manter
- ✅ Bundle menor
- ✅ Melhor performance

## ✅ Validação

### Teste 1: Chrome DevTools Network

1. Abra DevTools (`F12`) > **Network**
2. Recarregue a página
3. Verifique:
   - ✅ Google Analytics carrega após renderização
   - ✅ Bundle principal menor
   - ✅ Menos JavaScript carregado inicialmente

### Teste 2: Lighthouse

1. Execute Lighthouse audit
2. Verifique **Unused JavaScript**
3. Deve mostrar:
   - ✅ Economia de ~74 KiB
   - ✅ Menos JavaScript não usado
   - ✅ Melhor pontuação

### Teste 3: Bundle Analysis

1. Execute `npm run build`
2. Verifique tamanho dos bundles
3. Deve mostrar:
   - ✅ Bundle principal menor
   - ✅ Código não usado removido
   - ✅ Chunks otimizados

## 🔍 Explicação Técnica

### Por que Google Analytics Bloqueava?

**Problema:**
- Script carregava imediatamente no `<head>`
- 140.1 KiB de JavaScript bloqueando renderização
- Não era crítico para renderização inicial

**Solução:**
- Carregamento adiado com `requestIdleCallback`
- Carrega após renderização inicial
- Não bloqueia renderização

### Por que Tree-Shaking Não Funcionava?

**Problema:**
- Configuração padrão do Vite não é agressiva
- Alguns side effects impediam tree-shaking
- Código não usado não era removido

**Solução:**
- Tree-shaking agressivo configurado
- `moduleSideEffects: false` - remove módulos não usados
- `propertyReadSideEffects: false` - remove propriedades não usadas

## 📝 Boas Práticas

### ✅ Fazer

- Adiar carregamento de scripts não críticos
- Remover funções não utilizadas
- Configurar tree-shaking agressivo
- Usar `requestIdleCallback` para scripts não críticos

### ❌ Evitar

- Carregar scripts não críticos imediatamente
- Manter funções não utilizadas
- Tree-shaking desabilitado
- Bloquear renderização com scripts não críticos

## 🚀 Próximos Passos

1. ✅ Google Analytics adiado
2. ✅ Funções não usadas removidas
3. ✅ Tree-shaking agressivo configurado
4. ⏳ Fazer deploy
5. ⏳ Testar no Lighthouse
6. ⏳ Verificar economia de JavaScript
7. ⏳ Monitorar performance
8. ⏳ Ajustar se necessário

## 📚 Referências

- [Reduce JavaScript Payloads](https://web.dev/reduce-javascript-payloads-with-code-splitting/)
- [Remove Unused Code](https://web.dev/remove-unused-code/)
- [Tree Shaking](https://webpack.js.org/guides/tree-shaking/)
