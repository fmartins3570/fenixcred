# 📐 Dimensões Exatas das Imagens

## 🖼️ Imagem 1: modelo_fenix_cred.webp

Você precisa criar **3 versões** desta imagem:

| Arquivo                        | Largura    | Altura     | Qualidade | Uso                                 |
| ------------------------------ | ---------- | ---------- | --------- | ----------------------------------- |
| `modelo_fenix_cred-400w.webp`  | **400px**  | **600px**  | 85%       | Mobile (até 640px)                  |
| `modelo_fenix_cred-525w.webp`  | **525px**  | **783px**  | 85%       | Tablet/Desktop (641px+)             |
| `modelo_fenix_cred-1050w.webp` | **1050px** | **1566px** | 85%       | Retina/2x (telas de alta densidade) |

### 📝 Instruções:

1. Abra a imagem original `modelo_fenix_cred.webp` (1696x2528px)
2. Redimensione para cada tamanho acima
3. Exporte como WebP com qualidade 85%
4. Salve com os nomes exatos listados acima

---

## 🎨 Imagem 2: logo-fenix-cred.webp

Você precisa criar **4 versões** desta imagem:

| Arquivo                     | Largura   | Altura    | Qualidade | Uso                                 |
| --------------------------- | --------- | --------- | --------- | ----------------------------------- |
| `logo-fenix-cred-180w.webp` | **180px** | **53px**  | 90%       | Mobile (até 640px)                  |
| `logo-fenix-cred-240w.webp` | **240px** | **70px**  | 90%       | Tablet (641-1024px)                 |
| `logo-fenix-cred-299w.webp` | **299px** | **88px**  | 90%       | Desktop (1025px+)                   |
| `logo-fenix-cred-598w.webp` | **598px** | **176px** | 90%       | Retina/2x (telas de alta densidade) |

### 📝 Instruções:

1. Abra a imagem original `logo-fenix-cred.webp` (1080x316px)
2. Redimensione para cada tamanho acima
3. Exporte como WebP com qualidade 90%
4. Salve com os nomes exatos listados acima

---

## 🎯 Resumo Rápido

### modelo_fenix_cred:

- ✅ 400x600px → `modelo_fenix_cred-400w.webp`
- ✅ 525x783px → `modelo_fenix_cred-525w.webp`
- ✅ 1050x1566px → `modelo_fenix_cred-1050w.webp`

### logo-fenix-cred:

- ✅ 180x53px → `logo-fenix-cred-180w.webp`
- ✅ 240x70px → `logo-fenix-cred-240w.webp`
- ✅ 299x88px → `logo-fenix-cred-299w.webp`
- ✅ 598x176px → `logo-fenix-cred-598w.webp`

---

## 🛠️ Como Criar (3 Opções)

### Opção 1: Automático (RECOMENDADO) ⭐

```bash
npm install --save-dev sharp
npm run optimize-images
```

**Vantagem:** Cria todas as versões automaticamente!

### Opção 2: Online (Squoosh.app)

1. Acesse: https://squoosh.app/
2. Faça upload da imagem original
3. Configure:
   - **Format:** WebP
   - **Quality:** 85 (modelo) ou 90 (logo)
   - **Resize:** Use as dimensões exatas acima
4. Baixe e salve com o nome correto

### Opção 3: Photoshop/GIMP

1. Abra a imagem original
2. Vá em **Imagem → Redimensionar** (ou Image → Resize)
3. Digite as dimensões exatas (largura x altura)
4. Exporte como WebP com a qualidade especificada
5. Salve com o nome correto

---

## 📁 Onde Salvar

Todas as imagens devem ser salvas em:

```
src/assets/
```

**Estrutura final:**

```
src/assets/
├── modelo_fenix_cred.webp (original - manter)
├── modelo_fenix_cred-400w.webp ✅
├── modelo_fenix_cred-525w.webp ✅
├── modelo_fenix_cred-1050w.webp ✅
├── logo-fenix-cred.webp (original - manter)
├── logo-fenix-cred-180w.webp ✅
├── logo-fenix-cred-240w.webp ✅
├── logo-fenix-cred-299w.webp ✅
└── logo-fenix-cred-598w.webp ✅
```

---

## ⚠️ Importante

- ✅ **Mantenha a proporção:** Se a imagem original não tiver exatamente essas proporções, ajuste mantendo a proporção original
- ✅ **Nomes exatos:** Os nomes dos arquivos devem ser **exatamente** como listado acima
- ✅ **Formato WebP:** Todas as versões devem estar em formato WebP
- ✅ **Qualidade:** Use 85% para modelo, 90% para logo

---

## ✅ Verificação

Após criar todas as imagens, verifique:

```bash
ls -lh src/assets/*.webp
```

Você deve ver **9 arquivos** no total:

- 1 original modelo_fenix_cred.webp
- 3 versões otimizadas do modelo
- 1 original logo-fenix-cred.webp
- 4 versões otimizadas do logo
