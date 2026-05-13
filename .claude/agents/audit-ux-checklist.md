# Checklist de Auditoria — Heurísticas de UX

Foco em violações verificáveis estaticamente no código JSX/TSX. Cada item referencia a heurística-fonte (Nielsen #N, Krug, WCAG, dark pattern).

## Bloco 1 — Clareza e copy (Krug, Nielsen #2)

| # | O que verificar | Correção obrigatória |
|---|---|---|
| 1 | Botões com texto vago: "OK", "Sim", "Não", "Submit", "Confirmar", "Continuar" como rótulo principal de uma ação destrutiva ou irreversível | Trocar por verbo + objeto descritivo ("Excluir conta", "Salvar alterações") |
| 2 | Texto de link genérico: "Clique aqui", "Saiba mais", "Aqui", "Link" | Trocar por descrição do destino ("Ver política de privacidade", "Abrir relatório completo") |
| 3 | Mensagens de erro genéricas: `message.error('Erro')`, `message.error('Falha')`, `message.error('Algo deu errado')` sem especificidade | Substituir por mensagem que diz **o que aconteceu + como corrigir** ("Não foi possível salvar. Verifique sua conexão e tente novamente.") |
| 4 | Códigos técnicos expostos ao usuário: `Erro 500`, `ECONNREFUSED`, `null reference`, stack traces, mensagens em inglês quando o app é PT-BR | Traduzir para linguagem do usuário, sem código técnico |
| 5 | Labels técnicos em forms: "query", "param", "id", "uuid", nomes de campo do banco (`user_id`, `created_at`) | Usar termo do domínio ("E-mail", "Data de criação") |
| 6 | Confirmshaming em opções de declínio: "Não, não quero economizar", "Vou continuar perdendo", "Sair sem proteger meus dados" | Neutralizar ("Não, obrigado", "Talvez depois") |
| 7 | Happy talk em headings: "Bem-vindo!", "Olá! Estamos felizes em ver você", "Obrigado por estar aqui!" sem valor informativo | Remover ou substituir por heading que descreve o conteúdo |

## Bloco 2 — Prevenção de erro e controle (Nielsen #3, #5)

| # | O que verificar | Correção obrigatória |
|---|---|---|
| 1 | Ação destrutiva (`Button` com prop `danger`, ou texto "Excluir", "Remover", "Apagar", "Deletar", "Cancelar plano", "Revogar") **sem** `modal.confirm` ou modal de confirmação no `onClick` | Envolver a ação em `modal.confirm({ title, content, okText, okType: 'danger', onOk })` antes de executar |
| 2 | `Modal` ou `Drawer` que contém `<Form>` com `maskClosable` no padrão (`true`) ou ausente | Adicionar `maskClosable={false}` para evitar perda acidental de dados |
| 3 | Submit assíncrono que limpa o form em caso de erro (ex: `form.resetFields()` no catch) | Manter o input do usuário, destacar apenas o campo com erro |
| 4 | Operação irreversível sem aviso prévio sobre a consequência no `content` do modal (apenas "Tem certeza?") | Texto deve explicar a consequência ("Esta ação não pode ser desfeita. O registro será removido permanentemente.") |

## Bloco 3 — Feedback e visibilidade do status (Nielsen #1)

| # | O que verificar | Correção obrigatória |
|---|---|---|
| 1 | Operação assíncrona (`await`, `.then()`, mutation) sem feedback de sucesso (`message.success` ou equivalente) ao concluir | Adicionar feedback de sucesso ao final da operação |
| 2 | Operação assíncrona sem tratamento de erro com feedback ao usuário (`message.error` no catch) | Adicionar `try/catch` com `message.error` específico — não apenas console.log |
| 3 | Lista renderizada sem fallback para vazio (sem `<Empty>` ou estado vazio quando o array pode ser `[]`) | Adicionar `<Empty description="..." />` com mensagem orientada à ação |
| 4 | Tabela ou lista com paginação/loading sem skeleton ou spinner durante carregamento | Adicionar `loading` no `<Table>` ou `<Spin>` no wrapper |

## Bloco 4 — Acessibilidade (WCAG 2.1 AA)

| # | O que verificar | Correção obrigatória |
|---|---|---|
| 1 | `<img>` sem `alt` (informativa) ou `alt=""` (decorativa) | Adicionar `alt` descritivo ou `alt=""` se for puramente decorativa |
| 2 | Elemento interativo construído em `<div>` ou `<span>` com `onClick` sem `role`, `tabIndex` ou alternativa por teclado | Substituir por `<button>` semântico ou componente do antd (`Button`); se inevitável, adicionar `role="button"`, `tabIndex={0}` e handler de `onKeyDown` (`Enter`/`Space`) |
| 3 | `<a>` ou link com apenas ícone (sem texto) e sem `aria-label` | Adicionar `aria-label` descritivo |
| 4 | `Form.Item` sem `label` nem `aria-label` no `<Input>` interno | Adicionar `label` no `Form.Item` ou `aria-label` no input |
| 5 | Estado/significado transmitido apenas por cor (ex: dot vermelho/verde sem ícone nem texto) | Adicionar ícone ou texto que diferencie além da cor |
| 6 | Input de senha sem `autoComplete="current-password"` ou `"new-password"` quando aplicável; e-mail sem `autoComplete="email"`; telefone sem `autoComplete="tel"` | Adicionar `autoComplete` apropriado |
| 7 | Tooltip-only para informação crítica (info importante só aparece em hover) | Mover info para texto visível ou inline help |

## Bloco 5 — Hierarquia e minimalismo (Nielsen #4, #8)

| # | O que verificar | Correção obrigatória |
|---|---|---|
| 1 | Múltiplos `<Typography.Title level={1}>` no mesmo arquivo/página | Apenas um `level={1}` por página; demais devem ser `level={2}+` |
| 2 | Mais de um CTA primário (`<Button type="primary">`) competindo no mesmo grupo de ações | Apenas um `primary` por grupo (também coberto pelo audit-ds) |
| 3 | Form com mais de 7 campos visíveis sem agrupamento (`<fieldset>`, seções com `<Typography.Title>` ou `<Card>`) | Quebrar em seções lógicas |
| 4 | Inputs obrigatórios marcados sem indicação clara (sem asterisco, sem `required` no `Form.Item`) **e** sem indicação de quais são opcionais | Marcar obrigatórios via `rules: [{ required: true }]` (que renderiza asterisco) ou marcar opcionais explicitamente |

## Bloco 6 — Dark patterns

| # | O que verificar | Correção obrigatória |
|---|---|---|
| 1 | `Checkbox` ou `Switch` pré-marcado (`defaultChecked={true}`/`checked={true}` no estado inicial) que adiciona custo, opt-in de marketing, ou compartilhamento de dados | Default deve ser desmarcado; opt-in explícito do usuário |
| 2 | Botões com peso visual desigual em escolhas binárias críticas (ex: "Aceitar" como `type="primary"` enorme + "Recusar" como `type="text"` quase invisível) — quando ambas são escolhas legítimas | Ambos com peso visual comparável |
| 3 | Fluxos de cancelamento/exclusão com mais passos que o fluxo de criação equivalente (Roach Motel) | Simetria — cancelar deve ser tão direto quanto criar |
| 4 | Urgência fabricada hardcoded ("Últimas X unidades!", "Oferta acaba em 10:00") sem dado real por trás | Remover ou conectar a dado real |
