# 🖼️ Instruções de Otimização de Imagens

## ⚠️ IMPORTANTE

Antes de fazer o build de produção, você **DEVE** otimizar as imagens para melhorar o PageSpeed.

## 📋 Passo a Passo

### 1. Instalar Sharp (ferramenta de otimização)

```bash
npm install --save-dev sharp
```

### 2. Executar o script de otimização

```bash
npm run optimize-images
```

Este comando irá criar versões otimizadas das imagens:
- `modelo_fenix_cred-400w.webp` (mobile)
- `modelo_fenix_cred-525w.webp` (tablet/desktop)
- `modelo_fenix_cred-1050w.webp` (retina)
- `logo-fenix-cred-180w.webp` (mobile)
- `logo-fenix-cred-240w.webp` (tablet)
- `logo-fenix-cred-299w.webp` (desktop)
- `logo-fenix-cred-598w.webp` (retina)

### 3. Verificar se as imagens foram criadas

```bash
ls -lh src/assets/*.webp
```

Você deve ver os novos arquivos listados acima.

### 4. Fazer o build

```bash
npm run build
```

## 🎯 Resultados Esperados

### Antes da Otimização:
- modelo_fenix_cred: **120.8 KB** (1696x2528px)
- logo-fenix-cred: **32.0 KB** (1080x316px)
- **Total:** 152.8 KB

### Depois da Otimização:
- modelo_fenix_cred (mobile): **~40 KB** (400x600px)
- modelo_fenix_cred (desktop): **~60 KB** (525x783px)
- logo-fenix-cred (mobile): **~8 KB** (180x53px)
- logo-fenix-cred (desktop): **~15 KB** (299x88px)
- **Total carregado (mobile):** **~48 KB** ✅
- **Total carregado (desktop):** **~75 KB** ✅
- **Economia:** **~77-104 KB** dependendo do dispositivo

## 🔄 Alternativa: Otimização Manual

Se preferir otimizar manualmente ou não quiser instalar Sharp:

1. Acesse: https://squoosh.app/
2. Faça upload da imagem original
3. Configure:
   - **Format:** WebP
   - **Quality:** 85 (modelo) / 90 (logo)
   - **Resize:** Use as dimensões do arquivo `OTIMIZAR_IMAGENS.md`
4. Baixe e salve com os nomes corretos em `src/assets/`

## ✅ Verificação

Após otimizar, verifique:
- [ ] Todas as imagens otimizadas foram criadas
- [ ] O build funciona sem erros
- [ ] O site carrega corretamente
- [ ] PageSpeed Insights mostra melhoria

## 📝 Notas

- As imagens originais são mantidas como fallback
- O navegador escolhe automaticamente a melhor resolução baseado no dispositivo
- Imagens Retina (2x) são carregadas apenas em telas de alta densidade
- O componente já está configurado para usar `srcset` responsivo

