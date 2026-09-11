# Étude

Teoria, prática e repertório de piano num só lugar — feito para uso pessoal, no computador e no tablet.

## O que tem

- **Hoje** — timer de prática, exercícios técnicos com contador semanal, metas.
- **Repertório** — peças em estudo com link para a fonte da partitura, mais uma lista de fontes legais (IMSLP, Mutopia, CPDL, 8Notes, MuseScore, Sheet Music Plus).
- **Teoria** — referência rápida: claves, intervalos, fórmulas de acordes, cadências, círculo das quintas, dedilhado.
- **Maestro** — mentor de piano por chat, via API da Anthropic chamada diretamente do navegador com uma chave que você mesmo fornece (fica salva só no seu aparelho).

## Stack

Vite + React + TypeScript + Tailwind CSS v4 + Framer Motion. Sem backend: os dados (diário de prática, repertório, plano) ficam salvos no `localStorage` do navegador — por aparelho, não sincronizam sozinhos entre computador e tablet. Use o botão de backup (ícone ao lado do de tema) de vez em quando para exportar um `.json` e não perder o histórico se limpar o navegador ou trocar de aparelho.

## Chave da API da Anthropic

O Maestro chama `api.anthropic.com` direto do navegador com uma chave que você mesmo cola (Configurações do Maestro). Ela fica só no `localStorage` do seu aparelho — nunca passa pelo GitHub Pages nem por este repositório. Se desconfiar que o aparelho foi comprometido, revogue a chave em [console.anthropic.com](https://console.anthropic.com/settings/keys) e gere uma nova.

## Rodando localmente

```bash
npm install
npm run dev
npm test    # roda a suíte do Vitest (lib/streak, lib/storage)
```

## Deploy

Publicado automaticamente no GitHub Pages a cada push em `main`, via `.github/workflows/deploy.yml`.
