#!/bin/bash

# ==============================================
# Script de Deploy Combinado
# Site Principal + Landing Page CLT
# ==============================================

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Diretórios
SITE_DIR="$HOME/workspace/site-fenix-cred"
LANDING_DIR="$HOME/workspace/fenix-cred-clt-landing"
DEPLOY_DIR="$HOME/workspace/deploy-fenix"

echo -e "${YELLOW}===============================================${NC}"
echo -e "${YELLOW}  Deploy Combinado - Fênix Cred${NC}"
echo -e "${YELLOW}===============================================${NC}"
echo ""

# Verificar se os diretórios existem
if [ ! -d "$SITE_DIR" ]; then
    echo -e "${RED}❌ Erro: Diretório do site principal não encontrado: $SITE_DIR${NC}"
    exit 1
fi

if [ ! -d "$LANDING_DIR" ]; then
    echo -e "${RED}❌ Erro: Diretório da landing page não encontrado: $LANDING_DIR${NC}"
    exit 1
fi

# Passo 1: Build do site principal
echo -e "${YELLOW}📦 Passo 1/5: Build do site principal...${NC}"
cd "$SITE_DIR"
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Erro no build do site principal${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Build do site principal concluído${NC}"
echo ""

# Passo 2: Build da landing page
echo -e "${YELLOW}📦 Passo 2/5: Build da landing page CLT...${NC}"
cd "$LANDING_DIR"
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Erro no build da landing page${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Build da landing page concluído${NC}"
echo ""

# Passo 3: Criar pasta de deploy
echo -e "${YELLOW}📁 Passo 3/5: Criando pasta de deploy...${NC}"
rm -rf "$DEPLOY_DIR"
mkdir -p "$DEPLOY_DIR"
echo -e "${GREEN}✅ Pasta de deploy criada: $DEPLOY_DIR${NC}"
echo ""

# Passo 4: Copiar site principal
echo -e "${YELLOW}📋 Passo 4/5: Copiando site principal...${NC}"
cp -r "$SITE_DIR/dist/"* "$DEPLOY_DIR/"
# Copiar .htaccess (arquivo oculto)
cp "$SITE_DIR/.htaccess" "$DEPLOY_DIR/.htaccess"
echo -e "${GREEN}✅ Site principal copiado${NC}"
echo ""

# Passo 5: Copiar landing page para subpasta
echo -e "${YELLOW}📋 Passo 5/5: Copiando landing page para /page-credito-clt/...${NC}"
mkdir -p "$DEPLOY_DIR/page-credito-clt"
cp -r "$LANDING_DIR/dist/"* "$DEPLOY_DIR/page-credito-clt/"
echo -e "${GREEN}✅ Landing page copiada${NC}"
echo ""

# Mostrar estrutura final
echo -e "${YELLOW}===============================================${NC}"
echo -e "${GREEN}✅ Deploy combinado concluído com sucesso!${NC}"
echo -e "${YELLOW}===============================================${NC}"
echo ""
echo -e "📁 Estrutura gerada em: ${GREEN}$DEPLOY_DIR${NC}"
echo ""
echo "Arquivos principais:"
ls -la "$DEPLOY_DIR" | head -15
echo ""
echo "Subpasta landing page:"
ls -la "$DEPLOY_DIR/page-credito-clt" | head -10
echo ""

# Calcular tamanho total
TOTAL_SIZE=$(du -sh "$DEPLOY_DIR" | cut -f1)
echo -e "📊 Tamanho total: ${GREEN}$TOTAL_SIZE${NC}"
echo ""

echo -e "${YELLOW}===============================================${NC}"
echo -e "${YELLOW}  Próximos passos:${NC}"
echo -e "${YELLOW}===============================================${NC}"
echo ""
echo "1. Acesse o painel da Hostinger"
echo "2. Vá em File Manager > public_html"
echo "3. Faça backup da pasta atual (renomear para public_html_backup)"
echo "4. Faça upload de TODO o conteúdo de:"
echo -e "   ${GREEN}$DEPLOY_DIR${NC}"
echo ""
echo "URLs finais:"
echo -e "  • Site principal: ${GREEN}https://fenixcredbr.com.br/${NC}"
echo -e "  • Landing CLT:    ${GREEN}https://fenixcredbr.com.br/page-credito-clt/${NC}"
echo ""
