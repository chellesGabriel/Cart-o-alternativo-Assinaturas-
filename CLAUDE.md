# CLAUDE.md

Documentação de referência para este projeto. Consulte os docs abaixo **somente quando necessário** para a tarefa em andamento — não os leia proativamente a cada resposta.

## Docs

- [Arquitetura](.claude/docs/architecture.md) — consulte ao lidar com estrutura de pastas, organização de módulos ou responsabilidades de camadas
- [Tecnologias](.claude/docs/technologies.md) — consulte ao precisar de informações sobre stack, dependências ou configurações
- [Design System](src/llms.txt) — **leia obrigatoriamente antes de criar ou modificar qualquer componente de UI.** Índice (`llms.txt`) com links para foundations (theme, tokens, typography), components (button, typography) e patterns (feedback)

## Skills

- `/ui` — **use sempre que for criar telas ou componentes de UI.** A skill lê o Ant Design e o Design System Eduzz, implementa o código e invoca sequencialmente os subagents `audit-ux` (primeiro) e `audit-ds` (depois) para auditar e corrigir
- `/ux` — use para auditorias e revisões de usabilidade independentes (sem geração de código). Lê as seções de UX do Design System e aplica as 10 heurísticas de Nielsen e os princípios de Krug com escala de severidade 0–4

## Agents

- `audit-ux` — invocado pela skill `/ui` **antes** do `audit-ds` para auditar **apenas os arquivos informados** contra o checklist de heurísticas de UX (clareza de copy, prevenção de erro, feedback, acessibilidade WCAG, hierarquia, dark patterns) e corrigir as violações no próprio arquivo
- `audit-ds` — invocado pela skill `/ui` **após** o `audit-ux` (ou manualmente, via Agent tool) para auditar **apenas os arquivos informados** contra o checklist do Design System (componentes antd, tokens, tags HTML, ícones, etc.) e corrigir as violações no próprio arquivo. Não usar para varredura de código legado em massa
