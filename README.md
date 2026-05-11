# Eduzz Conta — Assinaturas

Sistema de gerenciamento de assinaturas da plataforma Eduzz, com funcionalidades de cartao principal/alternativo, suspensao, reativacao e cancelamento de contratos.

## Stack

- React 19 + TypeScript
- Vite 8
- Ant Design 6
- Tailwind CSS 4
- React Router DOM 7
- Zustand (estado global)
- Dayjs (datas pt-BR)
- Lucide React (ícones)

## Design System

Este projeto consome o design system centralizado da Eduzz através de dois repositórios:

- **[eduzz-design/design-tokens](https://github.com/eduzz-design/design-tokens)** — tokens de tema (cores, tipografia, bordas, componentes) do Ant Design + CSS base do Tailwind. Servidos via `https://theme.rootzz.xyz` e sincronizados automaticamente ao rodar `pnpm dev` ou `pnpm build`.
- **[eduzz-design/design-boilerplate](https://github.com/eduzz-design/design-boilerplate)** — estrutura de projeto de referência com providers, scripts de sync, store, eslint e convenções de código que este projeto segue.

### Sincronização automática

Ao executar `pnpm dev`, dois scripts rodam antes do Vite:

1. **`sync-tokens`** (`predev`) — baixa `tokens.json` e `index.css` atualizados do servidor de tokens e salva em `src/theme/tokens.json` e `src/index.css`.
2. **`sync-rules`** — clona/atualiza as regras do design system do repo [eduzz-design/claude-design-rules](https://github.com/eduzz-design/claude-design-rules) para `.claude/`.

Isso garante que o projeto sempre usa os tokens e regras mais recentes sem necessidade de pull manual dos repos.

---

## Regras do Sistema

### 1. Cartao Principal

- Cada contrato possui uma forma de pagamento principal (cartao de credito, boleto ou PIX).
- O cartao principal pode ser alterado a qualquer momento atraves do botao "Editar" na secao de formas de pagamento do contrato.
- Ao trocar, o usuario pode selecionar um cartao ja cadastrado ou registrar um novo.
- O cartao definido como alternativo da conta nao pode ser selecionado como principal de um contrato (e vice-versa).
- A mudanca de forma de pagamento passa por um fluxo de confirmacao antes de ser efetivada.

---

### 2. Cartao Alternativo (nivel de conta)

- O cartao alternativo e vinculado a conta do usuario, nao a um contrato especifico.
- Ele e usado automaticamente como fallback caso a cobranca no metodo principal falhe em qualquer contrato.
- Apenas um cartao alternativo pode estar ativo por vez.
- O cartao alternativo pode ser cadastrado/editado na tela de detalhe do contrato ou na pagina "Meus cartoes" (`/formas-pagamento`).
- Cartoes que ja sao principal de algum contrato nao podem ser definidos como alternativo.

---

### 3. Suspensao de Assinatura

#### 3.1 Fluxo de entrada

- O botao "Cancelar Assinatura" no detalhe do contrato nao leva ao cancelamento direto — ele redireciona para a tela de suspensao como tentativa de retencao.
- A suspensao esta disponivel para contratos com status "Em dia" ou "Suspenso".

#### 3.2 Etapa 1 — Escolha do periodo (Etapa 1 de 2)

- O usuario pode suspender por 1 a 6 meses.
- A selecao e feita por um controle numerico (stepper: -/+).
- Nenhuma cobranca e feita durante o periodo de suspensao.
- Sao exibidas duas datas calculadas:
  - **Acesso ao conteudo ate:** data de renovacao do contrato (fim do periodo pago).
  - **Pausa na cobranca ate:** data atual + quantidade de meses selecionados.
- Botao primario: "Suspender assinatura por X mes(es)" → avanca para etapa 2.
- Botao danger (outline vermelho): "Cancelar Assinatura" → redireciona para o fluxo de cancelamento de fato.

#### 3.3 Etapa 2 — Motivos da suspensao (Etapa 2 de 2)

- Titulo: "Por que suspender sua assinatura?"
- Opcoes de motivo (checkbox, multipla escolha):
  - No momento, nao posso manter esse gasto
  - Nao tenho tempo para consumir o conteudo agora
  - O conteudo ainda nao esta completo
  - Outro motivo (com campo de texto)
- Alert warning: "Sua assinatura sera pausada por X mes(es). Sera retomada automaticamente em DD/MM/YYYY"
- O botao "Confirmar suspensao" so fica habilitado se ao menos 1 motivo estiver selecionado.

#### 3.4 Processamento

- Ao confirmar, um modal e exibido com icone girando e texto "Suspendendo assinatura...".
- Apos ~2.5 segundos, o status do contrato e alterado para "Suspenso" e o usuario e redirecionado a tela de sucesso.

#### 3.5 Tela de sucesso

- Icone check verde + titulo "Sua assinatura esta suspensa" (em verde).
- Informacoes exibidas:
  - Acesso ao conteudo ate DD/MM/YYYY (fim do periodo pago).
  - Retomada automatica: data + valor mensal.
- Botao: "Voltar para minhas assinaturas" → `/assinaturas`.
- Texto: "Enviamos uma confirmacao dessa acao em seu e-mail."

#### 3.6 Efeitos no contrato

- Status muda para "Suspenso" (tag laranja).
- O botao "Reativar minha assinatura" aparece ao lado do "Cancelar Assinatura" (desktop) ou acima dele (mobile).
- Espacamento entre os botoes: 12px.

---

### 4. Reativacao de Assinatura

#### 4.1 Disponibilidade

- Disponivel apenas para contratos com status "Suspenso".

#### 4.2 Tela de reativacao (Etapa 1 de 1)

- Icone de seta circular + titulo "Reativar assinatura agora?"
- Texto explicativo sobre retomada da cobranca e liberacao imediata do acesso.
- Caixa cinza com resumo:
  - **Plano:** tipo + valor/mes.
  - **Forma de pagamento:** metodo atual + bandeira do cartao + link "Alterar".
  - **Proxima cobranca:** "Agora".
- Botao primario: "Reativar minha assinatura".
- Botao secundario: "Agora nao" → volta ao detalhe do contrato.

#### 4.3 Processamento

- Modal com icone girando + "Reativando assinatura..."
- Apos ~2.5 segundos, status muda para "Em dia" e redireciona para tela de sucesso.

#### 4.4 Tela de sucesso

- Check verde + "Sua assinatura esta reativada" (em verde).
- "Seu acesso foi restaurado. Boas-vindas de volta ao [Nome do Produto]"
- Botao: "Voltar para minhas assinaturas".
- Texto de confirmacao por e-mail.

---

### 5. Cancelamento de Assinatura

#### 5.1 Fluxo de entrada

- O cancelamento so e acessivel a partir do botao "Cancelar Assinatura" na tela de suspensao (Etapa 1), reforcando a tentativa de retencao via suspensao antes do cancelamento definitivo.

#### 5.2 Etapa 1 — Motivos do cancelamento (Etapa 2 de 3)

- Titulo: "Por que cancelar sua assinatura?"
- Opcoes de motivo (checkbox, multipla escolha):
  - O custo mensal esta alto para mim
  - O conteudo nao atendeu minhas expectativas
  - Nao estou usando mais ou ja consegui o que precisava
  - Encontrei uma alternativa melhor
  - Tive problemas para acessar ou usar o conteudo
  - Tive problemas com pagamento, cobranca ou renovacao
  - Comprei por impulso e me arrependi
  - Outro motivo. Qual? (com campo de texto)
- Campo opcional: "Gostaria de comentar mais sobre sua experiencia?" (textarea).
- Botao "Proxima etapa" habilitado apenas com ao menos 1 motivo selecionado.
- Botao "Voltar" → retorna a tela de suspensao.

#### 5.3 Etapa 2 — Confirmacao (Etapa 3 de 3)

- Icone de warning vermelho + titulo "Voce esta prestes a perder".
- Exibicao dos beneficios que serao perdidos (cards com fundo vermelho claro `#fff2f0`):
  - Acesso ao produto (com imagem e descricao).
  - Grupo exclusivo no WhatsApp (com imagem e descricao).
- Alert warning: "Apos o cancelamento, voce ainda tera acesso ao conteudo ate DD/MM/YYYY (fim do periodo pago)"
- Botao danger (vermelho solido): "Cancelar minha assinatura".
- Botao secundario: "Voltar".

#### 5.4 Processamento

- Modal com icone girando + "Cancelando assinatura..."
- Apos ~2.5 segundos, status muda para "Cancelado" e redireciona para tela de sucesso.

#### 5.5 Tela de sucesso

- Icone triste (FrownOutlined) + titulo "Assinatura cancelada".
- "Que pena ver voce partir, sentiremos sua falta!"
- Caixa azul: "Voce tera acesso ao conteudo ate DD/MM/YYYY (fim do periodo pago)"
- Botao: "Voltar para minhas assinaturas".
- Texto de confirmacao por e-mail.

---

### 6. Contrato Cancelado — Visualizacao e Reembolso

#### 6.1 Alteracoes no detalhe do contrato

- Tag "Cancelado" em cinza.
- Nenhum botao de acao (sem cancelar, sem reativar).
- Valor exibido com sufixo /mes.
- Linha adicional: "Voce tera acesso ao conteudo ate: DD/MM/YYYY".
- Renovacao exibida como "-".

#### 6.2 Secao "Reembolso"

Aparece como um card adicional no detalhe do contrato cancelado. O comportamento depende do tempo desde a compra:

**Cenario A — Dentro de 7 dias da compra:**
- Icone check verde.
- Texto: "Seu reembolso foi solicitado - DD/MM/YYYY - HH:MM"
- O reembolso e automatico.

**Cenario B — Fora dos 7 dias:**
- Texto: "O prazo para solicitar o reembolso e de ate 7 dias apos a compra. Para solicitar o reembolso, por gentileza, entre em contato diretamente com o produtor."
- Exibe nome e e-mail do produtor para contato.

---

### 7. Navegacao e Header

#### 7.1 Header do fluxo (telas fullscreen)

- Todas as telas de suspensao, cancelamento e reativacao sao fullscreen (sobrepoem o layout principal).
- Topbar contem: logo + contexto textual + botao "Fechar X".
- Desktop: logo completo MyEduzz + texto de contexto (ex: "Cancelar assinatura | Produto").
- Mobile: icone compacto (hamburguer + grid + simbolo amarelo) + indicador de etapa (ex: "Etapa 1 de 2").
- Subtitulo mobile: nome da acao + nome do produto abaixo da topbar.
- Barra de progresso amarela (`#FFBC00`) proporcional a etapa atual.
- Telas de sucesso nao possuem barra de progresso.

#### 7.2 Menu lateral (Sidebar)

- O item "Minhas assinaturas" so fica ativo (negrito + bolinha amarela) na rota exata `/assinaturas`.
- Ao navegar para um contrato especifico ou fluxo de suspensao/cancelamento, o menu nao fica destacado — servindo como ponto de retorno.
