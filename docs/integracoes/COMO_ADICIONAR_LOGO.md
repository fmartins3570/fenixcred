# 🎨 Como Adicionar o Logo Real da Fênix Cred

## 📋 Passo a Passo

### 1️⃣ Coloque sua imagem do logo na pasta assets

Coloque o arquivo do logo em:
```
src/assets/logo-fenix-cred.png
```

**Formatos aceitos:**
- `.png` (recomendado - com fundo transparente)
- `.jpg` ou `.jpeg`
- `.svg`

### 2️⃣ Atualize o componente Logo.jsx

Abra o arquivo: `src/components/Logo.jsx`

Encontre as linhas de import (linhas 2-10) e:

**Se sua imagem for PNG:**
```jsx
// Descomente esta linha:
import logoImage from '../assets/logo-fenix-cred.png'

// E comente ou remova esta:
// import logoImage from '../assets/logo-fenix-cred.svg'
```

**Se sua imagem for JPG:**
```jsx
// Descomente esta linha:
import logoImage from '../assets/logo-fenix-cred.jpg'

// E comente ou remova esta:
// import logoImage from '../assets/logo-fenix-cred.svg'
```

**Se sua imagem for SVG:**
```jsx
// Já está configurado! Apenas substitua o arquivo:
// src/assets/logo-fenix-cred.svg
```

### 3️⃣ Verifique o resultado

Execute o projeto:
```bash
npm run dev
```

O logo deve aparecer em:
- ✅ Header (topo do site)
- ✅ Footer (rodapé)

## 🎯 Recomendações

- **Formato PNG com fundo transparente** é o ideal
- **Tamanho recomendado**: 200-400px de largura
- **Resolução**: Mínimo 200px, ideal 400px ou mais
- **Fundo**: Transparente (para funcionar bem no tema escuro)

## ❓ Problemas Comuns

### Logo não aparece
- Verifique se o nome do arquivo está correto
- Verifique se o import no `Logo.jsx` está correto
- Verifique o console do navegador para erros

### Logo aparece muito grande/pequeno
- Ajuste os tamanhos no CSS em `src/components/Logo.css`
- Ou use as props `size="small"`, `size="medium"`, etc.

### Logo com fundo branco
- Use uma imagem PNG com fundo transparente
- Ou edite a imagem para remover o fundo

## 📞 Precisa de Ajuda?

Se tiver problemas, verifique:
1. O arquivo está em `src/assets/`?
2. O nome do arquivo está correto?
3. O import no `Logo.jsx` está descomentado?
4. O formato do arquivo é suportado (.png, .jpg, .svg)?

