# Site Fenix Cred

Site institucional da Fenix Cred desenvolvido com React e Vite.

## 📋 Sobre o Projeto

Este é um site institucional moderno e responsivo para a empresa Fenix Cred, uma empresa de soluções financeiras. O site apresenta os serviços oferecidos, informações sobre a empresa e um formulário de contato.

## 🚀 Tecnologias Utilizadas

- **React 19** - Biblioteca JavaScript para construção de interfaces
- **Vite** - Ferramenta de build rápida e moderna
- **CSS3** - Estilização com CSS puro (sem frameworks)
- **JavaScript (ES6+)** - Linguagem de programação

## 📁 Estrutura do Projeto

```
site-fenix-cred/
├── src/
│   ├── components/          # Componentes React
│   │   ├── Header.jsx       # Cabeçalho com menu de navegação
│   │   ├── Hero.jsx         # Seção principal/banner
│   │   ├── Services.jsx     # Seção de serviços oferecidos
│   │   ├── About.jsx        # Seção sobre a empresa
│   │   ├── Contact.jsx      # Seção de contato com formulário
│   │   └── Footer.jsx       # Rodapé do site
│   ├── App.jsx              # Componente principal
│   ├── App.css              # Estilos do App
│   ├── main.jsx             # Ponto de entrada da aplicação
│   └── index.css            # Estilos globais
├── public/                  # Arquivos estáticos
└── package.json             # Dependências do projeto
```

## 🎯 Componentes Principais

### Header
- Menu de navegação responsivo
- Menu hambúrguer para dispositivos móveis
- Links para todas as seções do site

### Hero
- Banner principal com call-to-action
- Título e descrição impactantes
- Botões de ação

### Services
- Grid de cards com os serviços oferecidos
- 6 serviços principais:
  - Empréstimo Pessoal
  - Empréstimo Consignado
  - Financiamento Veicular
  - Crédito Imobiliário
  - Antecipação de Recebíveis
  - Cartão de Crédito

### About
- Informações sobre a empresa
- Estatísticas e números importantes
- Missão e valores

### Contact
- Formulário de contato funcional
- Informações de contato (telefone, email, endereço)
- Validação de campos

### Footer
- Links úteis
- Redes sociais
- Informações de contato
- Copyright

## 🛠️ Como Executar o Projeto

### Pré-requisitos
- Node.js (versão 18 ou superior)
- npm ou yarn

### Instalação

1. Clone o repositório ou navegue até a pasta do projeto:
```bash
cd site-fenix-cred
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente (opcional - apenas se quiser usar a seção de avaliações do Google):
```bash
# Crie um arquivo .env na raiz do projeto
VITE_FENIX_PLACE_ID=5915714919254647518
VITE_GOOGLE_MAPS_API_KEY=sua_api_key_aqui
```
> **Nota:** Veja `docs/integracoes/GOOGLE_REVIEWS_SETUP.md` para instruções detalhadas sobre como obter a API Key.

4. Execute o servidor de desenvolvimento:
```bash
npm run dev
```

5. Abra o navegador em `http://localhost:5173`

### Build para Produção

Para criar uma versão otimizada para produção:

```bash
npm run build
```

Os arquivos serão gerados na pasta `dist/`.

### Preview da Build

Para visualizar a build de produção localmente:

```bash
npm run preview
```

## 📱 Responsividade

O site é totalmente responsivo e se adapta a diferentes tamanhos de tela:
- **Desktop**: Layout completo com menu horizontal
- **Tablet**: Layout adaptado com grid responsivo
- **Mobile**: Menu hambúrguer e layout em coluna única

## 🎨 Características de Design

- Design moderno e profissional
- Cores corporativas (azul e roxo)
- Animações suaves
- Tipografia legível
- Contraste adequado para acessibilidade

## 📝 Próximos Passos (Melhorias Futuras)

- [ ] Integração com API para envio de formulário
- [ ] Adicionar mais animações
- [ ] Implementar modo escuro
- [ ] Adicionar testes unitários
- [ ] Otimização de imagens
- [ ] SEO melhorado
- [ ] Integração com Google Analytics

## 👨‍💻 Desenvolvimento

Este projeto foi desenvolvido para ser educativo e fácil de entender, com comentários explicativos em cada componente para ajudar desenvolvedores iniciantes.

## 📄 Licença

Este projeto é privado e pertence à Fenix Cred.
