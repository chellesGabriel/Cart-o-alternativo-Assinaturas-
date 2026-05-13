---
name: ux
description: 'Auditoria de usabilidade para designers. Use quando o usuário pedir "review de UX", "auditoria de usabilidade", "heurísticas", "Nielsen", "Krug", "dark patterns", "WCAG" ou avaliação de tela/fluxo.'
---

Público: designers Eduzz — já conhecem heurísticas. Seja direto, sem reexplicar conceitos.

1. **Buscar regras no Rootzz** — `https://ds.rootzz.xyz/llms.txt` (WebFetch). Leia apenas as seções **Foundations > UX** e **Patterns > UX** relevantes à tarefa. Arquivos usam `.txt`.

2. **Auditar e entregar** — relatório enxuto, no formato:

   - **Issue** (1 linha) — o problema observado
   - **Severidade** 0–4
   - **Heurística** violada (Nielsen #N / Krug / WCAG X.Y.Z / dark pattern)
   - **Correção** acionável (1–2 linhas, específica)

   Sem introdução, sem resumo executivo, sem reexplicar a heurística. Agrupe por severidade decrescente. Se não houver issue, diga em uma linha.
