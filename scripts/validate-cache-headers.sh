#!/bin/bash

# Script de Validação de Cache Headers
# Site: fenixcredbr.com.br
# Uso: ./validate-cache-headers.sh

DOMAIN="fenixcredbr.com.br"
BASE_URL="https://${DOMAIN}"

echo "🔍 Validando Cache Headers para ${DOMAIN}"
echo "=========================================="
echo ""

# Cores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função para testar header
test_header() {
    local url=$1
    local expected=$2
    local description=$3
    
    echo -n "Testando ${description}... "
    
    response=$(curl -sI "$url" 2>/dev/null)
    
    if echo "$response" | grep -q "$expected"; then
        echo -e "${GREEN}✅ PASSOU${NC}"
        echo "$response" | grep -i "cache-control\|expires" | head -2
    else
        echo -e "${RED}❌ FALHOU${NC}"
        echo "Resposta:"
        echo "$response" | grep -i "cache-control\|expires" || echo "  Nenhum header de cache encontrado"
    fi
    echo ""
}

# Testar JavaScript
echo "📦 TESTANDO ASSETS ESTÁTICOS (Cache de 1 ano)"
echo "----------------------------------------------"

# Pegar um arquivo JS real da pasta dist
JS_FILE=$(find dist/assets -name "*.js" -type f | head -1 | xargs basename 2>/dev/null)
if [ -n "$JS_FILE" ]; then
    test_header "${BASE_URL}/assets/${JS_FILE}" "max-age=31536000" "JavaScript (.js)"
fi

# Pegar um arquivo CSS real da pasta dist
CSS_FILE=$(find dist/assets -name "*.css" -type f | head -1 | xargs basename 2>/dev/null)
if [ -n "$CSS_FILE" ]; then
    test_header "${BASE_URL}/assets/${CSS_FILE}" "max-age=31536000" "CSS (.css)"
fi

# Testar imagem
test_header "${BASE_URL}/assets/logo-fenix-cred.webp" "max-age=31536000" "Imagem WebP"

echo ""
echo "📄 TESTANDO HTML (Cache de 1 hora)"
echo "-----------------------------------"
test_header "${BASE_URL}/" "max-age=3600" "HTML (index.html)"

echo ""
echo "📋 TESTANDO ARQUIVOS DE CONFIGURAÇÃO (Cache de 1 dia)"
echo "------------------------------------------------------"
test_header "${BASE_URL}/robots.txt" "max-age=86400" "robots.txt"
test_header "${BASE_URL}/sitemap.xml" "max-age=86400" "sitemap.xml"

echo ""
echo "=========================================="
echo "✅ Validação concluída!"
echo ""
echo "💡 Dica: Se algum teste falhou, verifique:"
echo "   1. Arquivo .htaccess está no servidor?"
echo "   2. Módulos Apache estão habilitados? (headers, expires, rewrite)"
echo "   3. Site está publicado e acessível?"
echo ""
