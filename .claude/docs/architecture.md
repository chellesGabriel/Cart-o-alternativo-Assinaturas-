# Arquitetura do Projeto

Este projeto é um Reactcom separação clara de responsabilidades. Cada pasta tem um papel bem definido — evite criar arquivos fora da pasta correta.

---

## Estrutura de pastas

```
src/
├── components/       # Componentes reutilizáveis
│   ├── layouts/      # Estruturas de página (wrappers de rota)
│   ├── router/       # Guards e utilitários de roteamento
│   └── shared/       # Componentes genéricos usados em qualquer parte
├── constants/        # Valores constantes (rotas, enums, etc.)
├── hooks/            # Custom hooks React
├── interfaces/       # Tipos TypeScript compartilhados
├── pages/            # Páginas da aplicação
│   ├── public/       # Páginas acessíveis sem autenticação
│   ├── private/      # Páginas protegidas por autenticação
│   └── routes.tsx    # Definição do roteamento da aplicação
├── providers/        # Wrappers de contexto e provedores globais
├── store/            # Estado global com Zustand
├── theme/            # Configuração de tema do Ant Design
├── utils/            # Funções utilitárias puras
├── envs.ts           # Variáveis de ambiente tipadas
├── index.css         # Estilos globais e configuração do Tailwind
└── main.tsx          # Entry point da aplicação
```
