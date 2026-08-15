# Artigos Specification

## Problem Statement

O site institucional da Fênix Cred não tem um canal de conteúdo. O escritório Mariano Santana já opera um modelo de blog (hero + grade de cards + artigo + relacionados + CTA) que converte busca orgânica em contato. Precisamos replicar esse modelo na stack da Fênix (React + CSS puro + roteamento por pathname), sem o painel PHP/MySQL do Mariano.

## Goals

- [ ] Listagem em `/artigos` com o mesmo modelo visual do Mariano, na paleta Fênix
- [ ] Artigo individual em `/artigos/:slug` com SEO (title, description, canonical, OG, JSON-LD)
- [ ] Cinco artigos-semente sobre os produtos da Fênix, com dados atualizados em 2026
- [ ] Links no Header, Footer e sitemap

## Out of Scope

| Feature | Reason |
| ------- | ------ |
| Painel admin PHP/MySQL/TinyMCE | Hostinger estático; v1 é data-driven como o `blog.ts` original do Mariano |
| MDX / react-router / Tailwind | Fora da stack do projeto |
| RSS / sync remoto | Sem backend de posts |

## User Stories

### P1: Listagem e leitura ⭐ MVP

**User Story**: Como visitante, quero ver artigos e abrir um artigo completo para entender crédito CLT/FGTS e seguir para o WhatsApp.

**Acceptance Criteria**:

1. WHEN o usuário acessa `/artigos` THEN o sistema SHALL renderizar hero + grade de cards com capa, tag, título, descrição, autor e data
2. WHEN o usuário clica em um card THEN o sistema SHALL abrir `/artigos/:slug` com corpo, capa, relacionados e CTA WhatsApp
3. WHEN o slug não existe THEN o sistema SHALL mostrar estado de artigo não encontrado com link de volta
4. WHEN o usuário está em `/artigos` THEN Header e Footer SHALL apontar seções da home via `/#secao`

**Independent Test**: Abrir `/artigos`, clicar no primeiro card, ler o corpo, clicar em um relacionado, voltar pela trilha.

---

## Requirement Traceability

| Requirement ID | Story | Status |
| -------------- | ----- | ------ |
| ART-01 | P1 listagem | Verified |
| ART-02 | P1 detalhe + 404 | Verified |
| ART-03 | P1 SEO + sitemap | Verified |
| ART-04 | P1 nav Header/Footer | Verified |
| ART-05 | P1 conteúdo semente | Verified |
