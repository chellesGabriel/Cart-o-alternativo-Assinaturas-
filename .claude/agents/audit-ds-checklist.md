# Checklist de Auditoria — Design System Eduzz

## Bloco 1 — Proibições absolutas

| # | O que verificar | Correção obrigatória |
|---|---|---|
| 1 | `import { Space` ou `<Space` | Substituir por `div` com Tailwind (`flex gap-*`) |
| 2 | `import { Row` ou `<Row` | Substituir por `div` com Tailwind (`grid` ou `flex`) |
| 3 | `import { Col` ou `<Col` | Substituir por `div` com Tailwind |
| 4 | `from '@ant-design/icons'` | Substituir por equivalente do `lucide-react` |
| 5 | `style={{` em qualquer JSX | Converter para classe Tailwind |
| 6 | Classes Tailwind com prefixo `!` (ex: `!mb-1`, `!p-0`) | Remover o `!` e ajustar a estrutura |
| 7 | `import { message` ou `import { notification` do antd | Usar `App.useApp()` |
| 8 | Cores Tailwind em texto (`text-gray-*`, `text-red-*`, `text-blue-*`) | Substituir por `text-(--ant-color-text*)` |
| 9 | Cores Tailwind em fundo (`bg-white`, `bg-gray-*`, `bg-slate-*`) | Substituir por `bg-(--ant-color-bg-container)` ou variante semântica |
| 10 | Bordas com cores Tailwind (`border-gray-*`) | Substituir por `border-(--ant-color-border)` |
| 11 | Tags HTML nativas quando existe componente equivalente no antd (`<button>` → `Button`, `<input>` → `Input`, `<select>` → `Select`, `<textarea>` → `Input.TextArea`, `<table>` → `Table`, `<form>` → `Form`, etc.) | Substituir pelo componente correspondente do antd |
| 12 | `Button type="link"` | Substituir por `Link` do react-router-dom (interno) ou `Typography.Link` (externo) |
| 13 | `size="large"` ou `size="small"` em qualquer componente do antd | Remover a prop (padrão `middle`) — exceções precisam de comentário justificando |
| 14 | Spinner manual (`<Spin>`, `<Spinner>`, `LoaderCircle`) lado a lado com `<Button>` em fluxo de submit | Usar a prop `loading` do próprio `Button` |
| 15 | Desestruturação `const { Text } = Typography` ou `const { Title } = Typography` | Usar via namespace: `Typography.Text`, `Typography.Title` |
| 16 | `Typography.Title` com `className` ou `style` que sobrescrevem tamanho/peso (`text-xl`, `font-bold`, `fontSize`, `fontWeight`) | Remover sobrescrita — `level` controla via tema |
| 17 | `Typography.Text type="secondary\|danger\|success\|warning"` com `className="text-(--ant-color-*)"` redundante | Manter apenas o `type` — ele já aplica a cor |
| 18 | Pesos de fonte fora da lista permitida (qualquer `font-*` que não seja `font-light`, `font-normal`, `font-medium`, `font-semibold`, `font-extrabold` / 300, 400, 500, 600, 800) | Trocar para um peso da lista permitida |
| 19 | Uso de `colorBgBase` ou `colorTextBase` no código (não em `seedToken` do tema) | Trocar por alias token correspondente (`--ant-color-bg-container`, `--ant-color-text`) |
| 20 | Tokens de escala numérica (`--ant-blue-6`, `--ant-red-3`, `--ant-gold-5`, etc.) no código | Substituir por alias token semântico (`--ant-color-primary`, `--ant-color-error`, etc.) |

## Bloco 2 — Obrigações de componentes

| # | Situação | Obrigação |
|---|---|---|
| 1 | Há `<Table` | Deve ter `size="middle"` explícito |
| 2 | Há uso de `message`, `notification` ou `modal` | Deve vir de `const { message, notification, modal } = App.useApp()` |
| 3 | Há ícones | Devem ser importados de `lucide-react` |
| 4 | Há links de navegação interna | Deve usar `Link` do `react-router-dom` |
| 5 | Há links externos | Deve usar `Typography.Link` |
| 6 | Há uso de `Typography` | Usar via namespace (`Typography.Text`, `Typography.Title`) — sem desestruturação |
| 7 | Há `Typography.Text type="secondary"` | Não adicionar `className="text-(--ant-color-text-secondary)"` junto — o `type` já aplica a cor |
| 8 | Há `<Button>` sem texto (apenas `icon`) | Deve ter `shape="circle"` **e** `aria-label` descritivo |
| 9 | Dois ou mais `<Button type="primary">` adjacentes (mesmo wrapper `flex`/`div` de ações) | Apenas um pode ser `type="primary"`; demais devem ser `default`, `dashed` ou `text` |
| 10 | Botão dispara ação destrutiva (`Excluir`, `Remover`, `Revogar`, `Desativar`, `Cancelar plano`) | Deve ter prop `danger` |
| 11 | `<Button>` em fluxo de submit assíncrono | Deve usar prop `loading={isSubmitting}` em vez de spinner externo |

## Bloco 3 — Tokens CSS

| # | Situação | Obrigação |
|---|---|---|
| 1 | Há tokens de escala numérica (`--ant-blue-6`, `--ant-red-3`) | Substituir por alias tokens semânticos |
| 2 | Há `borderRadius` ou `z-index` hardcoded via `style` ou via classe Tailwind arbitrária (`z-[1000]`, `rounded-[4px]`) | Usar tokens `--ant-border-radius*` ou `--ant-z-index*` |
| 3 | Há `colorBgBase` ou `colorTextBase` consumidos no código | Trocar por alias (`--ant-color-bg-container`, `--ant-color-text`) — base só pertence ao seedToken |
