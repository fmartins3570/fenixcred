#!/bin/bash

# Script para verificar se o servidor suporta HTTP/2
# Uso: ./scripts/check-http2.sh

DOMAIN="fenixcredbr.com.br"

echo "🔍 Verificando suporte HTTP/2 para $DOMAIN"
echo ""

# Verificar se curl está instalado
if ! command -v curl &> /dev/null; then
    echo "❌ curl não está instalado. Instale com:"
    echo "   macOS: brew install curl"
    echo "   Linux: sudo apt-get install curl"
    exit 1
fi

# Verificar HTTP/2
echo "📡 Testando conexão HTTP/2..."
HTTP2_RESPONSE=$(curl -sI --http2 -o /dev/null -w "%{http_version}" "https://$DOMAIN" 2>&1)

if echo "$HTTP2_RESPONSE" | grep -q "2"; then
    echo "✅ HTTP/2 está ATIVO!"
    echo "   Versão HTTP: $HTTP2_RESPONSE"
else
    echo "⚠️  HTTP/2 pode não estar ativo"
    echo "   Resposta: $HTTP2_RESPONSE"
fi

echo ""
echo "📊 Verificando headers HTTP/2..."

# Verificar headers
curl -sI --http2 "https://$DOMAIN" | grep -i "http/2\|:status\|:method" || echo "   Headers HTTP/2 não encontrados"

echo ""
echo "🔧 Verificando versão do servidor..."

# Tentar identificar servidor
SERVER=$(curl -sI "https://$DOMAIN" | grep -i "server:" | head -1)
echo "   $SERVER"

echo ""
echo "📝 Próximos passos:"
echo "   1. Se HTTP/2 não estiver ativo, configure no servidor"
echo "   2. Para Nginx: adicione 'http2' em 'listen 443 ssl http2;'"
echo "   3. Para Apache: HTTP/2 é suportado via mod_http2"
echo "   4. Para Hostinger: HTTP/2 geralmente já está ativo"
