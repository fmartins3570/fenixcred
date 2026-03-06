# HTTP/2 Server Push - Verificação e Configuração

## 📊 Objetivo

Verificar se o servidor suporta HTTP/2 e melhorar tempo de carregamento pushando recursos críticos antes do browser pedir.

## ✅ Verificação de HTTP/2

### Teste Rápido

Execute o script de verificação:

```bash
chmod +x scripts/check-http2.sh
./scripts/check-http2.sh
```

### Verificação Manual

#### 1. Verificar com curl

```bash
curl -I --http2 https://fenixcredbr.com.br
```

Deve retornar:
```
HTTP/2 200
```

#### 2. Verificar no Chrome DevTools

1. Abra DevTools (`F12`)
2. Vá em **Network**
3. Recarregue a página
4. Clique em qualquer requisição
5. Verifique **Protocol**: deve mostrar `h2` (HTTP/2)

#### 3. Verificar Online

- [HTTP/2 Test](https://tools.keycdn.com/http2-test)
- [HTTP/2 Check](https://http2.pro/check)

## 🔧 Configuração por Servidor

### Nginx (>= 1.13.9)

#### Verificar Versão

```bash
nginx -v
```

Deve ser >= 1.13.9 para suporte completo a HTTP/2.

#### Configuração

O arquivo `config/nginx.conf` já está configurado com HTTP/2:

```nginx
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    # ...
}
```

#### HTTP/2 Server Push (Opcional)

**⚠️ Nota:** HTTP/2 Server Push foi deprecado e não está mais recomendado. Use **preload** no HTML ao invés de Server Push.

Se ainda quiser usar (Nginx 1.13.9+):

```nginx
location = /index.html {
    http2_push /assets/index-abc123.css;
    http2_push /assets/index-xyz789.js;
    http2_push /assets/logo-fenix-cred-299w.webp;
}
```

**Problema:** Os nomes dos arquivos mudam a cada build (hash). Melhor usar preload no HTML.

### Apache (mod_http2)

#### Verificar se está habilitado

```bash
apache2ctl -M | grep http2
```

Deve retornar: `http2_module`

#### Habilitar (se não estiver)

```bash
sudo a2enmod http2
sudo systemctl restart apache2
```

#### Configuração

Adicionar no `.htaccess` ou configuração do virtual host:

```apache
<IfModule mod_http2.c>
    Protocols h2 http/1.1
</IfModule>
```

**⚠️ Nota:** Apache não suporta Server Push nativamente. Use preload no HTML.

### Hostinger

#### Verificação

A Hostinger geralmente já tem HTTP/2 ativo por padrão.

Para verificar:
1. Execute o script: `./scripts/check-http2.sh`
2. Ou verifique no Chrome DevTools (Network tab)

#### Configuração

Se HTTP/2 não estiver ativo:
1. Entre em contato com o suporte Hostinger
2. Solicite ativação de HTTP/2
3. Geralmente é ativado automaticamente com SSL

**⚠️ Nota:** Hostinger usa Apache, que não suporta Server Push. Use preload no HTML.

### Vercel / Netlify

#### Verificação

HTTP/2 está ativo por padrão.

Verificar:
```bash
curl -I --http2 https://seu-site.vercel.app
```

#### Configuração

Não é necessário configurar - HTTP/2 é automático.

**⚠️ Nota:** Vercel/Netlify não suportam Server Push. Use preload no HTML.

## 🎯 Alternativa Recomendada: Preload

Ao invés de HTTP/2 Server Push (deprecado), use **preload** no HTML:

### Já Implementado

O site já usa preload para recursos críticos (ver `index.html` e `scripts/inject-resource-hints.js`):

```html
<link rel="preload" as="style" href="/assets/index-abc123.css" />
<link rel="preload" as="script" href="/assets/index-xyz789.js" />
<link rel="preload" as="image" href="/assets/logo-fenix-cred-299w.webp" type="image/webp" />
```

### Vantagens do Preload vs Server Push

1. ✅ **Mais confiável** - Funciona em todos os browsers
2. ✅ **Mais flexível** - Pode ser controlado pelo HTML
3. ✅ **Não deprecado** - Suportado ativamente
4. ✅ **Melhor cache** - Browser decide quando carregar
5. ✅ **Funciona com HTTP/1.1 e HTTP/2**

## 📊 Impacto Esperado

### HTTP/2 (sem Server Push)

- ✅ Multiplexing - Múltiplas requisições em uma conexão
- ✅ Header compression - Headers comprimidos
- ✅ Server push - **Deprecado, não usar**

### Preload (Recomendado)

- ✅ Recursos críticos carregam antes
- ✅ Melhor LCP (Largest Contentful Paint)
- ✅ Funciona em todos os browsers
- ✅ Mais controle sobre o que carregar

## ✅ Validação

### Teste 1: Verificar HTTP/2

```bash
./scripts/check-http2.sh
```

Deve mostrar: `✅ HTTP/2 está ATIVO!`

### Teste 2: Chrome DevTools

1. Abra DevTools (`F12`) > **Network**
2. Recarregue a página
3. Verifique **Protocol**: deve mostrar `h2`
4. Verifique se recursos críticos têm preload

### Teste 3: Verificar Preload

1. Abra DevTools (`F12`) > **Network**
2. Recarregue a página
3. Filtre por **Other**
4. Verifique se recursos com preload aparecem primeiro

## 🔍 Explicação Técnica

### Por que HTTP/2 Server Push foi Deprecado?

1. **Problemas de Cache**
   - Browser pode já ter o recurso em cache
   - Server Push envia mesmo assim (desperdício)

2. **Complexidade**
   - Difícil de implementar corretamente
   - Pode causar problemas de performance

3. **Preload é Melhor**
   - Browser decide quando carregar
   - Mais flexível e confiável

### HTTP/2 vs HTTP/1.1

**HTTP/1.1:**
- ❌ Uma requisição por conexão
- ❌ Headers não comprimidos
- ❌ Sem multiplexing

**HTTP/2:**
- ✅ Multiplexing (múltiplas requisições)
- ✅ Header compression
- ✅ Melhor performance

## 📝 Notas Importantes

### Server Push vs Preload

- **Server Push:** Deprecado, não usar
- **Preload:** Recomendado, já implementado

### Verificação

- Execute `./scripts/check-http2.sh` para verificar HTTP/2
- Verifique no Chrome DevTools (Network tab)
- Use preload ao invés de Server Push

### Hostinger

- HTTP/2 geralmente já está ativo
- Não suporta Server Push (Apache)
- Use preload (já implementado)

## 🚀 Próximos Passos

1. ✅ Verificar HTTP/2 com script
2. ✅ Confirmar que preload está funcionando
3. ⏳ Não usar Server Push (deprecado)
4. ⏳ Manter preload para recursos críticos
5. ⏳ Monitorar performance

## 📚 Referências

- [HTTP/2 Server Push - Deprecation](https://developer.chrome.com/blog/removing-push/)
- [Resource Hints - Preload](https://developer.mozilla.org/en-US/docs/Web/HTML/Link_types/preload)
- [HTTP/2 Test](https://tools.keycdn.com/http2-test)
