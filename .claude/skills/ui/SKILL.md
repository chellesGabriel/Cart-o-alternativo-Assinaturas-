---
name: ui
description: Skill para criação de telas e fluxos de UI, aplicando as regras do Design System e princípios de UX
---

Fluxo obrigatório para qualquer criação ou modificação de UI:

1. **Ler o `llms.txt` do Ant Design** — `https://ant.design/llms.txt` (use WebFetch). A partir do índice, siga para os componentes envolvidos na tarefa via `https://ant.design/components/{component-name}/index.md` para obter props, exemplos e APIs atualizadas. Para uma visão completa, consulte `https://ant.design/llms-full.txt`.

2. **Ler o `llms.txt` do Rootzz (Design System Eduzz)** — `https://ds.rootzz.xyz/llms.txt` (use WebFetch). A partir do índice, leia os arquivos relevantes das seções **Foundations > UI**, **Components**, **Patterns > UI** (regras do DS) e **Foundations > UX**, **Patterns > UX** (heurísticas de usabilidade) conforme a tarefa. **Importante:** siga os links exatamente como listados no índice — todos os arquivos do Rootzz usam extensão `.txt` (não `.md`). Não generalize o padrão `.md` do Ant Design para o Rootzz.

3. **Consolidar o contexto e implementar a tela** — só depois de ler as duas fontes, produza o código aplicando as regras do Design System Eduzz por cima da API do antd, com os princípios de UX guiando copy, hierarquia, prevenção de erro e acessibilidade.

4. **Auditoria pós-implementação — UX primeiro** — invoque `audit-ux` via Agent tool, passando **a lista exata dos arquivos criados/modificados nesta resposta**. O auditor verifica heurísticas de usabilidade (clareza de copy, prevenção de erro, feedback, acessibilidade WCAG, hierarquia, dark patterns) e corrige as violações diretamente nos arquivos. Caso não haja inconsistências, apenas confirma.

Exemplo de invocação do audit-ux:

```
Agent({
  subagent_type: "audit-ux",
  description: "Auditar UX no código gerado",
  prompt: "Audite e corrija os seguintes arquivos recém-gerados: \n- src/pages/Login.tsx\n- src/components/LoginForm.tsx"
})
```

5. **Auditoria pós-implementação — DS depois** — somente após o `audit-ux` retornar, invoque `audit-ds` via Agent tool, passando **os mesmos arquivos** (já corrigidos pelo UX). O auditor verifica o checklist do Design System (componentes antd, tokens, tags HTML, ícones, etc.) e corrige as violações no próprio arquivo. Caso não haja inconsistências, apenas confirma.

Exemplo de invocação do audit-ds:

```
Agent({
  subagent_type: "audit-ds",
  description: "Auditar DS no código gerado",
  prompt: "Audite e corrija os seguintes arquivos recém-gerados: \n- src/pages/Login.tsx\n- src/components/LoginForm.tsx"
})
```

Inclua na sua resposta final, na íntegra, **os relatórios do `audit-ux` e do `audit-ds`**, nessa ordem.
