export interface Subscription {
  contrato: string
  status: 'Em dia' | 'Suspenso' | 'Cancelado'
  inicio: string
  produto: string
  produtoId: string
  cobranca: string
  proxVencimento: string
  valor: string
}

export interface SavedCard {
  id: string
  brand: 'Mastercard' | 'Visa' | 'Elo' | 'Amex' | ''
  last4: string
  holderName: string
  expiry: string
  disabled?: boolean
}

export interface SubscriptionDetail {
  id: string
  produto: string
  produtor: string
  imagemProduto: string
  nome: string
  email: string
  telefone: string
  formaPagamento: string
  cardFinal: string
  cardBrand: 'Mastercard' | 'Visa' | 'Elo'
  primaryCardId: string
  contrato: string
  status: 'Em dia' | 'Suspenso' | 'Cancelado'
  tipoFrequencia: string
  frequencia: string
  limiteCobrancas: string
  valor: string
  renovacao: string
}

// Cartão alternativo da conta — vinculado automaticamente a todos os contratos
export let accountAlternativeCardId: string | null = null

export function setAccountAlternativeCardId(cardId: string | null) {
  accountAlternativeCardId = cardId
}

export const subscriptions: Subscription[] = [
  {
    contrato: '3938952',
    status: 'Suspenso',
    inicio: '04/03/2026',
    produto: 'Curso University - 5x... (2421560)',
    produtoId: '2421560',
    cobranca: '1 / ∞',
    proxVencimento: '04/04/2026',
    valor: 'R$ 1.020,00',
  },
  {
    contrato: '3941200',
    status: 'Em dia',
    inicio: '10/03/2026',
    produto: 'Marketing Pro - Mensal (2489310)',
    produtoId: '2489310',
    cobranca: '2 / ∞',
    proxVencimento: '10/04/2026',
    valor: 'R$ 297,00',
  },
  {
    contrato: '3942100',
    status: 'Em dia',
    inicio: '01/02/2026',
    produto: 'Design Mastery (2501200)',
    produtoId: '2501200',
    cobranca: '3 / 12',
    proxVencimento: '01/05/2026',
    valor: 'R$ 150,00',
  },
]

export const savedCards: SavedCard[] = [
  {
    id: 'card-1',
    brand: 'Mastercard',
    last4: '3804',
    holderName: 'GABRIEL R CHELLES',
    expiry: '12/28',
  },
  {
    id: 'card-2',
    brand: 'Elo',
    last4: '4098',
    holderName: 'GABRIEL R CHELLES',
    expiry: '03/25',
    disabled: true,
  },
]

export const subscriptionDetails: Record<string, SubscriptionDetail> = {
  '3938952': {
    id: '3938952',
    produto: 'Curso University - 5x 30 dias',
    produtor: 'Jefferson Campos',
    imagemProduto: 'https://placehold.co/80x80/f5f5f5/999?text=Curso',
    nome: 'Gabriel Rodrigues Chelles',
    email: 'gabrielchelles@email.com',
    telefone: '11 (9) 1122 - 3366',
    formaPagamento: 'Cartão de crédito',
    cardFinal: '3804',
    cardBrand: 'Mastercard',
    primaryCardId: 'card-1',
    contrato: '3938952',
    status: 'Suspenso',
    tipoFrequencia: 'Mensal',
    frequencia: 'a cada 1 mês(es)',
    limiteCobrancas: '1 / ∞',
    valor: 'R$ 1.020,00',
    renovacao: 'Cobrado no dia 04/04/2026',
  },
  '3941200': {
    id: '3941200',
    produto: 'Marketing Pro - Mensal',
    produtor: 'Ana Costa',
    imagemProduto: 'https://placehold.co/80x80/f5f5f5/999?text=Mkt',
    nome: 'Gabriel Rodrigues Chelles',
    email: 'gabrielchelles@email.com',
    telefone: '11 (9) 1122 - 3366',
    formaPagamento: 'Boleto bancário',
    cardFinal: '',
    cardBrand: 'Mastercard',
    primaryCardId: '',
    contrato: '3941200',
    status: 'Em dia',
    tipoFrequencia: 'Mensal',
    frequencia: 'a cada 1 mês(es)',
    limiteCobrancas: '2 / ∞',
    valor: 'R$ 297,00',
    renovacao: 'Cobrado no dia 10/04/2026',
  },
  '3942100': {
    id: '3942100',
    produto: 'Design Mastery',
    produtor: 'Lucas Mendes',
    imagemProduto: 'https://placehold.co/80x80/f5f5f5/999?text=Design',
    nome: 'Gabriel Rodrigues Chelles',
    email: 'gabrielchelles@email.com',
    telefone: '11 (9) 1122 - 3366',
    formaPagamento: 'PIX',
    cardFinal: '',
    cardBrand: 'Mastercard',
    primaryCardId: '',
    contrato: '3942100',
    status: 'Em dia',
    tipoFrequencia: 'Mensal',
    frequencia: 'a cada 1 mês(es)',
    limiteCobrancas: '3 / 12',
    valor: 'R$ 150,00',
    renovacao: 'Cobrado no dia 01/05/2026',
  },
}

export interface PaymentHistoryItem {
  fatura: string
  valor: string
  status: 'Pago' | 'Reembolsada' | 'Cancelada' | 'Aguardando pagamento'
  pagamento?: string
  metodo: 'cartao' | 'boleto' | 'pix'
  erroCartao?: boolean
}

export const paymentHistory: Record<string, PaymentHistoryItem[]> = {
  '3938952': [
    {
      fatura: '50152507',
      valor: 'R$ 100,00',
      status: 'Aguardando pagamento',
      metodo: 'cartao',
      erroCartao: true,
    },
    {
      fatura: '50152506',
      valor: 'R$ 100,00',
      status: 'Aguardando pagamento',
      metodo: 'cartao',
      erroCartao: true,
    },
    {
      fatura: '50152505',
      valor: 'R$ 100,00',
      status: 'Pago',
      pagamento: '13/02/2026',
      metodo: 'cartao',
    },
    {
      fatura: '50152504',
      valor: 'R$ 100,00',
      status: 'Reembolsada',
      pagamento: '18/01/2026',
      metodo: 'cartao',
    },
    {
      fatura: '50152503',
      valor: 'R$ 100,00',
      status: 'Cancelada',
      metodo: 'cartao',
    },
  ],
  '3941200': [
    {
      fatura: '50152506',
      valor: 'R$ 100,00',
      status: 'Aguardando pagamento',
      metodo: 'boleto',
    },
    {
      fatura: '50152505',
      valor: 'R$ 100,00',
      status: 'Pago',
      pagamento: '13/02/2026',
      metodo: 'boleto',
    },
    {
      fatura: '50152504',
      valor: 'R$ 100,00',
      status: 'Reembolsada',
      pagamento: '18/01/2026',
      metodo: 'boleto',
    },
    {
      fatura: '50152503',
      valor: 'R$ 100,00',
      status: 'Cancelada',
      metodo: 'boleto',
    },
  ],
  '3942100': [
    {
      fatura: '50152506',
      valor: 'R$ 100,00',
      status: 'Aguardando pagamento',
      metodo: 'pix',
    },
    {
      fatura: '50152505',
      valor: 'R$ 100,00',
      status: 'Pago',
      pagamento: '13/02/2026',
      metodo: 'pix',
    },
    {
      fatura: '50152504',
      valor: 'R$ 100,00',
      status: 'Reembolsada',
      pagamento: '18/01/2026',
      metodo: 'pix',
    },
    {
      fatura: '50152503',
      valor: 'R$ 100,00',
      status: 'Cancelada',
      metodo: 'pix',
    },
  ],
}

// backward compat
export const subscriptionDetail: SubscriptionDetail = subscriptionDetails['3938952']
