# Instruções para Adicionar o Logo Real

## 📁 Localização do Logo

O logo está localizado em: `src/assets/logo-fenix-cred.svg`

## 🔄 Como Substituir o Logo

### Opção 1: Substituir o arquivo SVG existente
1. Substitua o arquivo `src/assets/logo-fenix-cred.svg` pelo seu logo real
2. Mantenha o mesmo nome do arquivo
3. O componente já está configurado para usar este arquivo

### Opção 2: Usar uma imagem PNG/JPG
1. Coloque sua imagem em `src/assets/logo-fenix-cred.png` (ou `.jpg`)
2. Edite o arquivo `src/components/Logo.jsx`
3. Altere a linha de import:
   ```jsx
   // De:
   import logoImage from '../assets/logo-fenix-cred.svg'
   
   // Para:
   import logoImage from '../assets/logo-fenix-cred.png'
   ```

## 📍 Onde o Logo Aparece

O logo está sendo usado nos seguintes lugares:

1. **Header** - Logo principal no topo do site (tamanho: medium)
2. **Footer** - Logo no rodapé (tamanho: small)

## 🎨 Tamanhos Disponíveis

O componente Logo aceita os seguintes tamanhos:
- `small` - 40px de altura (usado no Footer)
- `medium` - 60px de altura (usado no Header)
- `large` - 100px de altura
- `xlarge` - 150px de altura

## 📝 Exemplo de Uso

```jsx
import Logo from './components/Logo'

// Logo pequeno
<Logo size="small" />

// Logo médio (padrão)
<Logo size="medium" />

// Logo grande
<Logo size="large" />
```

## ✅ Checklist

- [ ] Substituir o arquivo `logo-fenix-cred.svg` pelo logo real
- [ ] Verificar se o logo aparece corretamente no Header
- [ ] Verificar se o logo aparece corretamente no Footer
- [ ] Testar em diferentes tamanhos de tela (responsivo)
- [ ] Verificar se o logo tem fundo transparente (recomendado)

## 🎯 Recomendações

- Use formato SVG para melhor qualidade em qualquer tamanho
- Se usar PNG/JPG, use fundo transparente
- Mantenha a proporção do logo original
- O logo deve ter boa visibilidade em fundo escuro (tema do site)

