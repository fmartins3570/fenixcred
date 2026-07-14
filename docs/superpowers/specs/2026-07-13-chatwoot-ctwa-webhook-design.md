# Chatwoot CTWA Webhook Design

**Data:** 2026-07-13

**Conta VendeAI:** 15481

**Objetivo:** restabelecer a captura de `ctwa_clid` na origem das conversas Click-to-WhatsApp e disponibilizar essa atribuição aos eventos de conversão enviados pelo CAPI, sem duplicar eventos `Lead`.

## Contexto e causa raiz

O webhook principal do VendeAI continua enviando atualizações de estágio, etiqueta e proposta para `/api/capi/vendeai`. Ele sustenta os eventos de fundo de funil, como `QualifiedLead`, `OrderCreated` e `Purchase`, mas atualmente entrega `referral.ctwa_clid` vazio.

O CRM Chatwoot embutido na conta 15481 não possui webhook de saída configurado. Por isso, o CAPI não recebe o payload original de `conversation_created` ou `message_created`, onde o referral de Click-to-WhatsApp pode existir.

O CAPI já possui o endpoint `/api/capi/chatwoot`, protegido por token, e o handler necessário para processar esses dois eventos. A configuração `chatwoot_lead_enabled` está desligada, portanto o endpoint enriquece o lead sem disparar um novo evento `Lead`.

## Abordagens consideradas

### 1. Webhook Chatwoot somente para enriquecimento — escolhida

Cadastrar o webhook de conta no CRM com os eventos `conversation_created` e `message_created`, mantendo `chatwoot_lead_enabled: false`.

Vantagens:

- restaura a tentativa de captura do referral na origem;
- não altera o webhook principal do VendeAI;
- não cria eventos `Lead` duplicados;
- permite rollback pela remoção de uma única configuração externa.

### 2. Webhook Chatwoot com `Lead` independente

Além do enriquecimento, ativar `chatwoot_lead_enabled: true` para disparar `Lead` quando houver `ctwa_clid`.

Não será usada inicialmente porque pode duplicar eventos de topo de funil e precisa de uma política de deduplicação validada com tráfego real.

### 3. Inferência no webhook principal do VendeAI

Tentar reconstruir o identificador CTWA a partir de telefone, campanha ou outros campos do webhook principal.

Foi descartada porque `ctwa_clid` não pode ser derivado com segurança: o identificador original precisa chegar da Meta por meio da primeira mensagem ou conversa.

## Arquitetura

```text
Anúncio Click-to-WhatsApp
          |
          v
WhatsApp / Meta referral
          |
          v
CRM Chatwoot da conta VendeAI 15481
          |
          | conversation_created + message_created
          v
POST /api/capi/chatwoot com o token secreto já configurado
          |
          +--> autentica o token
          +--> localiza ctwa_clid no payload
          +--> extrai telefone, nome, fbc, fbp e ref-token
          +--> atualiza leads.db por telefone
          +--> não dispara Lead enquanto chatwoot_lead_enabled=false
          |
          v
Webhook principal /api/capi/vendeai
          |
          +--> recebe ofertado, digitado, pago e estágios
          +--> consulta leads.db pelo telefone
          +--> adiciona ctwa_clid aos eventos disponíveis
          v
Meta Conversions API
```

## Componentes e responsabilidades

### CRM VendeAI/Chatwoot

- Criar um webhook ativo na conta 15481.
- Usar a URL completa já preparada no CAPI, incluindo o token secreto.
- Assinar somente `conversation_created` e `message_created`.
- Não modificar o webhook técnico do VendeAI configurado na seção de IA.

### Endpoint Chatwoot do CAPI

- Rejeitar requisições com token incorreto com HTTP 401.
- Responder HTTP 200 aos eventos válidos e a eventos não utilizados, evitando desativação automática do webhook.
- Em `conversation_created`, localizar um `ctwa_clid` não vazio no payload, extrair telefone e nome e atualizar o cadastro compartilhado do lead.
- Em `message_created` de entrada, extrair `[fbc:...]`, `[fbp:...]` e o token de pré-qualificação da mensagem, além de procurar o referral de forma defensiva.
- Não enviar um evento Meta diretamente enquanto `chatwoot_lead_enabled` estiver desligado.

### Webhook principal do VendeAI

- Continuar recebendo estágios, etiquetas e propostas sem alteração.
- Consultar o lead pelo telefone e reutilizar o `ctwa_clid` capturado pelo Chatwoot.
- Enviar eventos elegíveis com `action_source: business_messaging` e `messaging_channel: whatsapp` quando o identificador estiver disponível.

## Segurança e privacidade

- O token do webhook não será escrito neste repositório nem exibido em relatórios.
- A URL completa será preenchida apenas na configuração autenticada do VendeAI.
- Logs e verificações mostrarão somente final do telefone e presença ou ausência do identificador, sem expor dados pessoais completos.
- Nenhum payload real será copiado para documentação local.

## Implantação

1. Confirmar que `capi-server` está ativo e que o token do Chatwoot está configurado para `fenixcred`.
2. Validar que o endpoint retorna HTTP 401 sem o token e HTTP 200 com o token correto usando um ping vazio, que não cria ou altera leads.
3. Criar o webhook na tela CRM → Configurações → Integrações → Webhooks da conta 15481.
4. Selecionar `conversation_created` e `message_created`.
5. Confirmar na interface que o webhook está ativo e com os dois eventos corretos.
6. Acompanhar os logs para provar que o Chatwoot começou a enviar eventos.
7. Executar ou aguardar uma conversa real iniciada por anúncio Click-to-WhatsApp.
8. Confirmar que o payload contém `ctwa_clid` e que o registro do telefone foi atualizado no `leads.db`.
9. Confirmar que uma conversão posterior do mesmo lead, como `ofertado`, recupera o identificador pelo telefone e é enviada como `business_messaging`.

## Tratamento de falhas

- **HTTP 401:** revisar exclusivamente o token cadastrado na URL.
- **Nenhuma requisição recebida:** revisar se o webhook está ativo e se os dois eventos estão selecionados.
- **Eventos recebidos sem telefone:** inspecionar o formato real do payload antes de alterar o extrator.
- **Telefone presente, mas `ctwa_clid` ausente:** confirmar que a conversa começou por um anúncio Click-to-WhatsApp. Se continuar ausente em testes CTWA reais, registrar como limitação da integração VendeAI/Chatwoot com a Meta e não inferir o valor.
- **Eventos duplicados:** manter `chatwoot_lead_enabled: false`; o novo webhook não deve emitir `Lead` durante esta fase.
- **Impacto inesperado:** remover o webhook criado. O fluxo principal `/api/capi/vendeai` permanece independente.

## Critérios de aceite

- Há exatamente um webhook Chatwoot apontando para o endpoint protegido do CAPI.
- O webhook assina exatamente `conversation_created` e `message_created`.
- O endpoint responde HTTP 200 com o token correto.
- Os dois tipos de evento aparecem nos logs do `capi-server` sem erros recorrentes.
- `chatwoot_lead_enabled` permanece `false`.
- Uma conversa CTWA real grava um `ctwa_clid` novo associado ao telefone correto.
- Uma conversão VendeAI posterior recupera esse identificador e usa a origem `business_messaging`.

## Fora do escopo

- Ativar um evento `Lead` independente no Chatwoot.
- Modificar o mapeamento de `ofertado`, `digitado`, `pago` ou de estágios.
- Alterar a integração WhatsApp, o número, o app Meta ou o webhook de entrada da Meta.
- Reconstruir ou inferir `ctwa_clid` quando ele não existir no payload original.
