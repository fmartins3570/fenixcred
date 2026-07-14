# Chatwoot CTWA Webhook Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Configurar o webhook do Chatwoot da conta VendeAI 15481 para enriquecer o CAPI com `ctwa_clid`, sem duplicar eventos `Lead`, e verificar o fluxo até o reaproveitamento nos eventos do webhook principal do VendeAI.

**Architecture:** O Chatwoot enviará `conversation_created` e `message_created` ao endpoint protegido `/api/capi/chatwoot`. O handler já implantado gravará referral e identidade no `leads.db`; o webhook `/api/capi/vendeai` continuará responsável pelos eventos de conversão e consultará esse enriquecimento pelo telefone.

**Tech Stack:** VendeAI 15481, Chatwoot, Node.js CAPI Server, SQLite, systemd, SSH, curl e Chrome autenticado.

## Global Constraints

- Manter `chatwoot_lead_enabled: false` durante toda a implantação.
- Não modificar o webhook principal `/api/capi/vendeai`.
- Assinar somente `conversation_created` e `message_created` no novo webhook.
- Não exibir nem salvar o token secreto em arquivos do repositório, logs do Codex ou relatórios.
- Não criar payloads sintéticos que gravem telefones ou leads no banco de produção.
- Remover o webhook criado se a configuração causar erros recorrentes ou comportamento inesperado.
- Não alterar código nesta implantação; se o payload real não corresponder ao contrato atual, interromper e produzir um diagnóstico antes de propor patch.

---

### Task 1: Validar o endpoint e estabelecer o baseline

**Files:**
- Reference: `/Users/felipemartins/workspace/fenixcred/docs/superpowers/specs/2026-07-13-chatwoot-ctwa-webhook-design.md`
- Reference: VPS `/opt/capi-server/dist/webhooks/chatwoot.js`
- Reference: VPS `/opt/capi-server/clients.json`
- Test: serviço `capi-server`, endpoint público e journal do systemd

**Interfaces:**
- Consumes: configuração `fenixcred.chatwoot_webhook_token` e `fenixcred.chatwoot_lead_enabled`.
- Produces: baseline com serviço ativo, autenticação confirmada e horário UTC de início da implantação.

- [ ] **Step 1: Registrar o horário UTC e verificar o serviço**

Run:

```bash
date -u +%Y-%m-%dT%H:%M:%SZ
ssh -i ~/.ssh/hostinger_deploy_new -o ConnectTimeout=10 -o StrictHostKeyChecking=no root@76.13.170.87 'systemctl is-active capi-server'
```

Expected: um timestamp UTC e `active`.

- [ ] **Step 2: Confirmar a configuração sem imprimir segredos**

Run:

```bash
ssh -i ~/.ssh/hostinger_deploy_new -o ConnectTimeout=10 -o StrictHostKeyChecking=no root@76.13.170.87 "python3 - <<'PY'
import json
c = json.load(open('/opt/capi-server/clients.json'))['fenixcred']
assert c.get('chatwoot_webhook_token')
assert c.get('chatwoot_lead_enabled') is False
print('token_configured=true lead_enabled=false')
PY"
```

Expected: `token_configured=true lead_enabled=false`.

- [ ] **Step 3: Verificar rejeição sem token**

Run:

```bash
curl -sS -o /tmp/chatwoot-unauthorized.json -w '%{http_code}\n' -X POST https://painel.martinsfelipe.com/api/capi/chatwoot -H 'Content-Type: application/json' --data '{}'
rm -f /tmp/chatwoot-unauthorized.json
```

Expected: HTTP `401`.

- [ ] **Step 4: Verificar o ping autenticado sem expor o token**

Run:

```bash
ssh -i ~/.ssh/hostinger_deploy_new -o ConnectTimeout=10 -o StrictHostKeyChecking=no root@76.13.170.87 "python3 - <<'PY'
import json, urllib.request
c = json.load(open('/opt/capi-server/clients.json'))['fenixcred']
url = 'https://painel.martinsfelipe.com/api/capi/chatwoot?token=' + c['chatwoot_webhook_token']
req = urllib.request.Request(url, data=b'{}', headers={'Content-Type': 'application/json'}, method='POST')
with urllib.request.urlopen(req, timeout=15) as response:
    body = json.loads(response.read())
    print('status=%d ok=%s reason=%s' % (response.status, body.get('ok'), body.get('reason')))
PY"
```

Expected: `status=200 ok=True reason=empty_body`.

### Task 2: Criar o webhook no CRM da conta 15481

**Files:**
- Modify external configuration: VendeAI CRM account `15481`, integration `Webhooks`
- Reference: VPS `/opt/capi-server/clients.json`

**Interfaces:**
- Consumes: endpoint validado pela Task 1 e sessão autenticada do VendeAI.
- Produces: exatamente um webhook ativo para o CAPI, com os eventos `conversation_created` e `message_created`.

- [ ] **Step 1: Colocar a URL protegida no clipboard sem imprimir o segredo**

Run:

```bash
ssh -i ~/.ssh/hostinger_deploy_new -o ConnectTimeout=10 -o StrictHostKeyChecking=no root@76.13.170.87 "python3 - <<'PY'
import json
c = json.load(open('/opt/capi-server/clients.json'))['fenixcred']
print('https://painel.martinsfelipe.com/api/capi/chatwoot?token=' + c['chatwoot_webhook_token'], end='')
PY" | pbcopy
```

Expected: comando sem saída; a URL completa fica disponível apenas no clipboard local.

- [ ] **Step 2: Abrir a configuração de Webhooks**

Action: no VendeAI autenticado, abrir `CRM → Configurações → Integrações → Webhooks` e confirmar visualmente a conta `15481`.

Expected: a página lista os webhooks da conta e oferece `Adicionar novo Webhook`.

- [ ] **Step 3: Criar a assinatura**

Action: clicar em `Adicionar novo Webhook`, colar a URL do clipboard e selecionar somente `conversation_created` e `message_created`; salvar uma única vez.

Expected: um webhook novo aparece na lista com a URL do domínio `painel.martinsfelipe.com` e os dois eventos corretos.

- [ ] **Step 4: Limpar o clipboard**

Run:

```bash
printf '' | pbcopy
```

Expected: comando sem saída.

### Task 3: Verificar entrega e ausência de duplicação

**Files:**
- Inspect: journal do serviço `capi-server`
- Inspect: VPS `/opt/capi-server/data/leads.db`
- Inspect external configuration: lista de webhooks da conta 15481

**Interfaces:**
- Consumes: webhook criado na Task 2 e timestamp de baseline da Task 1.
- Produces: evidência de requisições Chatwoot, configuração sem `Lead` independente e diagnóstico do referral real.

- [ ] **Step 1: Reabrir o webhook e conferir a configuração persistida**

Action: abrir o item criado e confirmar a URL do domínio correto e somente os eventos `conversation_created` e `message_created`.

Expected: nenhuma assinatura extra e nenhum evento adicional.

- [ ] **Step 2: Confirmar que o servidor recebeu eventos Chatwoot**

Run imediatamente após criar o webhook:

```bash
ssh -i ~/.ssh/hostinger_deploy_new -o ConnectTimeout=10 -o StrictHostKeyChecking=no root@76.13.170.87 "journalctl -u capi-server --since '15 minutes ago' --no-pager | grep -E 'Chatwoot conversation_created|Chatwoot message_created' | tail -20"
```

Expected: ao menos uma linha `Chatwoot conversation_created` ou `Chatwoot message_created` após haver nova atividade no CRM. A saída deve expor somente final de telefone e metadados reduzidos.

- [ ] **Step 3: Confirmar que nenhum Lead Chatwoot foi disparado**

Run:

```bash
ssh -i ~/.ssh/hostinger_deploy_new -o ConnectTimeout=10 -o StrictHostKeyChecking=no root@76.13.170.87 "journalctl -u capi-server --since '15 minutes ago' --no-pager | grep -c 'Chatwoot CTWA enriched — Lead firing OFF' || true"
```

Expected: zero enquanto não houver CTWA ou um número positivo acompanhado de `Lead firing OFF`; não pode haver evento Meta de fonte `chatwoot` com `event_name=Lead`.

- [ ] **Step 4: Verificar a primeira conversa CTWA real**

Action: acompanhar novas conversas iniciadas por anúncio Click-to-WhatsApp. Se não houver tráfego CTWA durante a janela de verificação, solicitar ao usuário que abra um anúncio real e envie a primeira mensagem; não usar link direto do WhatsApp porque ele não gera `ctwa_clid`.

Expected: log `Chatwoot conversation_created` com `hasCtwa: true` ou `Chatwoot CTWA enriched — Lead firing OFF`.

- [ ] **Step 5: Confirmar persistência nova sem expor o identificador**

Run:

```bash
ssh -i ~/.ssh/hostinger_deploy_new -o ConnectTimeout=10 -o StrictHostKeyChecking=no root@76.13.170.87 "sqlite3 /opt/capi-server/data/leads.db \"SELECT COUNT(*) FROM leads WHERE ctwa_clid IS NOT NULL AND ctwa_clid <> '' AND updated_at >= datetime('now','-2 hours');\""
```

Expected: contagem maior que zero depois de uma conversa CTWA confirmada. O valor do `ctwa_clid` não é impresso.

- [ ] **Step 6: Confirmar reaproveitamento pelo webhook VendeAI**

Run, após o mesmo lead receber uma conversão mapeada:

```bash
ssh -i ~/.ssh/hostinger_deploy_new -o ConnectTimeout=10 -o StrictHostKeyChecking=no root@76.13.170.87 "journalctl -u capi-server --since '2 hours ago' --no-pager | grep -E 'VendeAI.*(QualifiedLead|OrderCreated|Purchase).*business_messaging' | tail -10"
```

Expected: uma conversão posterior do lead aparece como `business_messaging`. Se nenhuma conversão ocorrer na janela, registrar a verificação como pendente de atividade real, sem simular `ofertado`, `digitado` ou `pago` em produção.

### Task 4: Fechar a implantação com evidências e rollback definido

**Files:**
- Modify: `/Users/felipemartins/workspace/fenixcred/docs/superpowers/plans/2026-07-13-chatwoot-ctwa-webhook.md`
- Reference: `/Users/felipemartins/workspace/fenixcred/docs/superpowers/specs/2026-07-13-chatwoot-ctwa-webhook-design.md`

**Interfaces:**
- Consumes: resultados das Tasks 1 a 3.
- Produces: checklist fiel ao estado real e handoff com qualquer validação dependente de tráfego marcada como pendente.

- [ ] **Step 1: Marcar apenas passos comprovados**

Action: trocar `[ ]` por `[x]` somente nos passos que têm saída de comando ou confirmação visual atual. Não marcar a captura CTWA nem a conversão posterior se não ocorreu tráfego real.

Expected: o plano diferencia configuração concluída de verificação pendente por atividade externa.

- [ ] **Step 2: Executar a checagem final do serviço e da flag**

Run:

```bash
ssh -i ~/.ssh/hostinger_deploy_new -o ConnectTimeout=10 -o StrictHostKeyChecking=no root@76.13.170.87 "systemctl is-active capi-server && python3 - <<'PY'
import json
c = json.load(open('/opt/capi-server/clients.json'))['fenixcred']
print('lead_enabled=' + str(c.get('chatwoot_lead_enabled')).lower())
PY"
```

Expected:

```text
active
lead_enabled=false
```

- [ ] **Step 3: Executar revisão de segurança do repositório**

Run:

```bash
git diff --check
git grep -n 'chatwoot?token=' -- docs/superpowers || true
```

Expected: `git diff --check` sem saída e nenhuma URL contendo token nos documentos.

- [ ] **Step 4: Commitar somente a atualização do plano**

Run:

```bash
git add docs/superpowers/plans/2026-07-13-chatwoot-ctwa-webhook.md
git diff --cached --check
git commit -m 'docs: record Chatwoot CTWA webhook rollout'
```

Expected: commit criado sem incluir alterações preexistentes do usuário.

## Rollback operacional

Se o webhook gerar falhas recorrentes ou comportamento inesperado:

1. Abrir `CRM → Configurações → Integrações → Webhooks` na conta 15481.
2. Remover somente o webhook que aponta para `painel.martinsfelipe.com/api/capi/chatwoot`.
3. Confirmar que `/api/capi/vendeai` continua recebendo eventos normalmente.
4. Não apagar dados históricos do `leads.db`; o `ctwa_clid` já capturado continua válido para o lead correspondente.
