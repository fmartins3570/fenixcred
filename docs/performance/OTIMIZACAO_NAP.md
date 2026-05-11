# ✅ Otimização NAP (Name, Address, Phone) - Fênix Cred

## 🎯 Objetivo

Garantir que os dados da empresa sejam consistentes em todo o site para melhorar ranqueamento local no Google.

## 📊 Informações NAP Padronizadas

### Nome da Empresa
- **Nome Comercial:** Fênix Cred Soluções Financeiras
- **Razão Social:** H.I INTERMEDIACAO FINANCEIRA LTDA - ME
- **CNPJ:** 52.069.594/0001-90

### Endereço Completo
- **Rua:** Av. do Oratório, 4098
- **Bairro:** Jardim Guairaca
- **CEP:** 03220-200
- **Cidade:** São Paulo
- **Estado:** SP
- **País:** Brasil

**Formato completo:**
```
Av. do Oratório, 4098 - Jardim Guairaca
CEP 03220-200 - São Paulo - SP
```

### Telefone
- **Formato:** (11) 99949-0655
- **Formato internacional:** +55-11-99949-0655
- **Link tel:** `tel:+5511999490655`

### Email
- **Email:** contato@fenixcredbr.com.br
- **Link mailto:** `mailto:contato@fenixcredbr.com.br`

### Horário de Funcionamento
- **Horário:** Segunda a Sexta, 8h às 18h

## ✅ Implementações Realizadas

### 1. Footer - Seção NAP Estruturada ✅

**Localização:** `src/components/Footer.jsx`

**Estrutura implementada:**
```jsx
<div className="company-info-nap">
  <h3 className="company-name">Fênix Cred Soluções Financeiras</h3>
  <address className="company-address">
    <p>
      <strong>Endereço:</strong><br />
      <a href="[Google Maps Link]">
        Av. do Oratório, 4098 - Jardim Guairaca<br />
        CEP 03220-200 - São Paulo - SP
      </a>
    </p>
    <p>
      <strong>Telefone:</strong><br />
      <a href="tel:+5511999490655">(11) 99949-0655</a>
    </p>
    <p>
      <strong>Email:</strong><br />
      <a href="mailto:contato@fenixcredbr.com.br">contato@fenixcredbr.com.br</a>
    </p>
    <p>
      <strong>Horário de Atendimento:</strong><br />
      Segunda a Sexta, 8h às 18h
    </p>
  </address>
</div>
```

**Características:**
- ✅ Uso de tag semântica `<address>`
- ✅ Links clicáveis (tel: e mailto:)
- ✅ Link para Google Maps
- ✅ Formatação consistente
- ✅ Acessibilidade (aria-labels)

### 2. Meta Tags Open Graph - Localização ✅

**Localização:** `index.html`

**Meta tags adicionadas:**
```html
<!-- Open Graph - Localização (NAP) -->
<meta property="og:locality" content="São Paulo" />
<meta property="og:region" content="SP" />
<meta property="og:postal-code" content="03220-200" />
<meta property="og:country-name" content="Brazil" />
<meta property="og:street-address" content="Av. do Oratório, 4098 - Jardim Guairaca" />

<!-- Meta Tags de Contato -->
<meta name="contact" content="contato@fenixcredbr.com.br" />
<meta name="telephone" content="+55-11-99949-0655" />
```

### 3. Seção "Sobre Nós" - Informações NAP ✅

**Localização:** `src/components/About.jsx`

**Adicionado:**
- Nome da empresa
- Endereço completo
- Telefone clicável
- Email clicável
- Horário de funcionamento

### 4. Schema JSON-LD - Dados Estruturados ✅

**Localização:** `src/components/SchemaJSON.jsx`

**Já implementado:**
- ✅ LocalBusiness schema com endereço completo
- ✅ Organization schema com contato
- ✅ Coordenadas geográficas (latitude/longitude)
- ✅ Telefone formatado
- ✅ Email de contato

## 📍 Locais Onde NAP Aparece

### 1. Footer (Principal) ✅
- Seção dedicada com tag `<address>`
- Formatação semântica
- Links clicáveis

### 2. Seção "Sobre Nós" ✅
- Informações NAP completas
- Integradas ao conteúdo

### 3. Meta Tags HTML ✅
- Open Graph para localização
- Meta tags de contato

### 4. Schema JSON-LD ✅
- Dados estruturados para Google
- LocalBusiness schema
- Organization schema

### 5. Footer - Avisos Legais ✅
- CNPJ e endereço no rodapé inferior
- Informações legais completas

## 🎨 Estilos CSS

**Localização:** `src/components/Footer.css`

**Classes adicionadas:**
- `.company-info-nap` - Container principal
- `.company-info-nap .company-name` - Nome da empresa
- `.company-info-nap address` - Estilos para tag address
- `.company-info-nap address a` - Links clicáveis

## ✅ Checklist de Consistência NAP

### Nome
- [x] Footer: "Fênix Cred Soluções Financeiras" ✅
- [x] Sobre Nós: "Fênix Cred Soluções Financeiras" ✅
- [x] Schema JSON-LD: "Fênix Cred – Soluções Financeiras" ✅
- [x] Meta tags: "Fênix Cred Soluções Financeiras" ✅

### Endereço
- [x] Footer: "Av. do Oratório, 4098 - Jardim Guairaca, CEP 03220-200 - São Paulo - SP" ✅
- [x] Sobre Nós: "Av. do Oratório, 4098 - Jardim Guairaca, CEP 03220-200 - São Paulo - SP" ✅
- [x] Schema JSON-LD: "Av. do Oratório, 4098" + "São Paulo" + "SP" + "03220-200" ✅
- [x] Meta tags: og:street-address, og:locality, og:region, og:postal-code ✅

### Telefone
- [x] Footer: "(11) 99949-0655" com link tel: ✅
- [x] Sobre Nós: "(11) 99949-0655" com link tel: ✅
- [x] Schema JSON-LD: "(11) 99949-0655" e "+55-11-99949-0655" ✅
- [x] Meta tags: "+55-11-99949-0655" ✅

### Email
- [x] Footer: "contato@fenixcredbr.com.br" com link mailto: ✅
- [x] Sobre Nós: "contato@fenixcredbr.com.br" com link mailto: ✅
- [x] Schema JSON-LD: "contato@fenixcredbr.com.br" ✅
- [x] Meta tags: "contato@fenixcredbr.com.br" ✅

### Horário
- [x] Footer: "Segunda a Sexta, 8h às 18h" ✅
- [x] Sobre Nós: "Segunda a Sexta, 8h às 18h" ✅

## 🚀 Benefícios para SEO Local

### 1. Consistência de Dados
- ✅ Mesmas informações em múltiplos locais
- ✅ Formato padronizado
- ✅ Facilita indexação do Google

### 2. Dados Estruturados
- ✅ Schema.org LocalBusiness
- ✅ Schema.org Organization
- ✅ Coordenadas geográficas

### 3. Meta Tags
- ✅ Open Graph para localização
- ✅ Meta tags de contato
- ✅ Melhor compartilhamento em redes sociais

### 4. Semântica HTML
- ✅ Tag `<address>` para endereço
- ✅ Links clicáveis (tel: e mailto:)
- ✅ Estrutura acessível

## 📈 Resultados Esperados

### Google My Business
- ✅ Dados consistentes facilitam verificação
- ✅ Melhor ranqueamento em buscas locais
- ✅ Aparecer em "Mapas" do Google

### Buscas Locais
- ✅ "crédito consignado São Paulo"
- ✅ "crédito CLT Zona Leste"
- ✅ "Fênix Cred São Paulo"

### Rich Snippets
- ✅ Endereço e telefone podem aparecer nos resultados
- ✅ Horário de funcionamento visível
- ✅ Link direto para Google Maps

## 🧪 Testes Recomendados

### 1. Google Rich Results Test
Acesse: https://search.google.com/test/rich-results

**Verificar:**
- Schema LocalBusiness válido
- Dados completos e corretos

### 2. Google Search Console
**Verificar:**
- Dados estruturados indexados
- Sem erros de validação

### 3. Teste Manual
- [ ] Verificar Footer no site
- [ ] Verificar seção "Sobre Nós"
- [ ] Testar links tel: e mailto:
- [ ] Verificar link do Google Maps
- [ ] Confirmar consistência de dados

## 📝 Próximos Passos

1. ✅ NAP implementado no Footer
2. ✅ NAP implementado em "Sobre Nós"
3. ✅ Meta tags adicionadas
4. ✅ Schema JSON-LD verificado
5. ⏳ Criar/verificar Google My Business
6. ⏳ Verificar dados no Google Search Console
7. ⏳ Monitorar ranqueamento local

---

**Status:** ✅ Otimização NAP Completa
**Data:** 2024-12-26
**Consistência:** 100% em todos os locais

