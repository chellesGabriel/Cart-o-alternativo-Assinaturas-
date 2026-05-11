import { useState } from 'react'
import { Typography, Tag, Button, Collapse, Divider, Tooltip, Card, Empty, Alert, message } from 'antd'
import {
  CreditCard,
  HelpCircle,
  Barcode,
  X,
  ArrowLeft,
  Home,
  RefreshCw,
  RotateCcw,
  Download,
  QrCode,
  CircleCheck,
} from 'lucide-react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  savedCards,
  subscriptionDetails,
  accountAlternativeCardId,
  setAccountAlternativeCardId,
  paymentHistory,
  type SavedCard,
  type PaymentHistoryItem,
} from '../data/mockData'
import CardBrandIcon from '../components/CardBrandIcon'
import ChangePaymentModal from '../components/ChangePaymentModal'
import { useIsMobile } from '../hooks/useIsMobile'

const { Title, Text } = Typography

function CardDisplay({ card }: { card: SavedCard }) {
  return (
    <span className="font-medium">
      {card.brand || 'Cartão'} •••• {card.last4}
    </span>
  )
}

const statusTagColor: Record<string, string> = {
  'Pago': 'green',
  'Reembolsada': 'red',
  'Cancelada': 'default',
  'Aguardando pagamento': 'gold',
}

function PaymentHistoryRow({ item }: { item: PaymentHistoryItem }) {
  const isAguardando = item.status === 'Aguardando pagamento'

  const actionButton = () => {
    if (!isAguardando) return null
    if (item.metodo === 'cartao') return (
      <Button size="small" icon={<RefreshCw size={16} />}>Trocar cartão</Button>
    )
    if (item.metodo === 'boleto') return (
      <Button size="small" icon={<Download size={16} />}>Baixar Boleto</Button>
    )
    if (item.metodo === 'pix') return (
      <Button size="small" icon={<QrCode size={16} />}>Pagar com Pix</Button>
    )
    return null
  }

  return (
    <div className="bg-[#fafafa] rounded px-4 py-2 flex flex-col gap-2">
      {/* Row 1: Fatura + Tag */}
      <div className="flex items-center justify-between">
        <Text className="text-sm">
          Fatura: <Text strong>{item.fatura}</Text>
        </Text>
        <Tag color={statusTagColor[item.status]} className="!text-xs !m-0">
          {item.status}
        </Tag>
      </div>
      {/* Row 2: Valor + Pagamento ou Button */}
      <div className="flex items-center justify-between">
        <Text strong className="text-sm">{item.valor}</Text>
        {item.pagamento && (
          <Text className="text-sm">Pagamento: {item.pagamento}</Text>
        )}
        {actionButton()}
      </div>
      {/* Row 3: Alert */}
      {isAguardando && item.erroCartao && (
        <Alert
          type="error"
          message="Não foi possível processar o pagamento no cartão."
          showIcon
          className="!py-2 !text-sm"
        />
      )}
      {isAguardando && !item.erroCartao && (item.metodo === 'boleto' || item.metodo === 'pix') && (
        <Alert
          type="warning"
          message="Evite cancelamentos. Aguardando pagamento."
          showIcon
          className="!py-2 !text-sm"
        />
      )}
    </div>
  )
}

export default function AssinaturaDetalhe() {
  const { contrato } = useParams<{ contrato: string }>()
  const navigate = useNavigate()
  const isMobile = useIsMobile()

  const [paymentModalOpen, setPaymentModalOpen] = useState(false)
  const [paymentTarget, setPaymentTarget] = useState<'primary' | 'alternative'>('primary')
  const [, setTick] = useState(0)

  const baseDetail = contrato ? subscriptionDetails[contrato] : null

  if (!baseDetail) {
    return (
      <div className="flex-1 bg-[#fafafa] min-h-screen">
        <div className="px-4 py-4 md:px-8 md:py-8">
          <div className="flex items-center gap-1 text-sm mb-4 flex-wrap">
            <Home size={16} className="text-gray-400" />
            <span className="text-gray-400 px-1">/</span>
            <Link to="/assinaturas" className="text-gray-400 hover:text-gray-600">Minhas assinaturas</Link>
          </div>
          <Card>
            <Empty description="Assinatura não encontrada">
              <Button type="primary" onClick={() => navigate('/assinaturas')}>
                Voltar para assinaturas
              </Button>
            </Empty>
          </Card>
        </div>
      </div>
    )
  }

  const detail = baseDetail

  const alternativeCardId = accountAlternativeCardId

  const isBoleto = detail.formaPagamento === 'Boleto bancário'
  const isPix = detail.formaPagamento === 'PIX'
  const primaryCard = savedCards.find((c) => c.id === detail.primaryCardId)
  const alternativeCard = alternativeCardId
    ? savedCards.find((c) => c.id === alternativeCardId)
    : null

  const handleEditPayment = (target: 'primary' | 'alternative') => {
    setPaymentTarget(target)
    setPaymentModalOpen(true)
  }

  const handleAddAlternative = () => {
    setPaymentTarget('alternative')
    setPaymentModalOpen(true)
  }

  const currentCardIdForTarget =
    paymentTarget === 'primary'
      ? detail.primaryCardId ?? null
      : alternativeCardId ?? null

  const handleConfirmPayment = (cardId: string, method?: string) => {
    const card = savedCards.find((c) => c.id === cardId)
    const label = card ? `${card.brand || 'Cartão'} •••• ${card.last4}` : 'Cartão'

    if (paymentTarget === 'alternative') {
      setAccountAlternativeCardId(cardId)
      message.success(`Cartão ${label} definido como alternativo da conta`)
    } else if (paymentTarget === 'primary') {
      if (method === 'boleto') {
        baseDetail.formaPagamento = 'Boleto bancário'
        baseDetail.primaryCardId = ''
        baseDetail.cardFinal = ''
        baseDetail.cardBrand = 'Mastercard'
        message.success('Forma de pagamento alterada para Boleto bancário')
      } else if (method === 'pix') {
        baseDetail.formaPagamento = 'PIX'
        baseDetail.primaryCardId = ''
        baseDetail.cardFinal = ''
        baseDetail.cardBrand = 'Mastercard'
        message.success('Forma de pagamento alterada para PIX')
      } else if (card) {
        baseDetail.primaryCardId = cardId
        baseDetail.formaPagamento = 'Cartão de crédito'
        baseDetail.cardFinal = card.last4
        baseDetail.cardBrand = card.brand as typeof baseDetail.cardBrand
        message.success(`Cartão ${label} definido como principal`)
      }
    }
    setTick((t) => t + 1)
  }

  return (
    <div className="flex-1 bg-[#fafafa] min-h-screen">
      <div className="px-4 py-4 md:px-8 md:py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1 text-sm mb-4 flex-wrap">
          <Home size={16} className="text-gray-400" />
          <span className="text-gray-400 px-1">/</span>
          <Link to="/assinaturas" className="text-gray-400 hover:text-gray-600">Minhas assinaturas</Link>
        </div>

        {/* Back button on mobile */}
        {isMobile && (
          <Button
            type="text"
            icon={<ArrowLeft size={16} />}
            onClick={() => navigate('/assinaturas')}
            className="!px-0 !mb-2"
          >
            Voltar
          </Button>
        )}

        {/* Title row + Cancel button */}
        <div className="flex items-center justify-between mb-6">
          <Title level={3} className="!mb-0 !text-xl md:!text-2xl" style={{ color: 'rgba(0,0,0,0.85)' }}>
            Assinatura {detail.contrato}
          </Title>
          {!isMobile && detail.status !== 'Cancelado' && (
            <div className="flex items-center gap-3">
              {detail.status === 'Suspenso' && (
                <Button icon={<RotateCcw size={16} />} type="primary" onClick={() => navigate(`/assinaturas/${contrato}/reativacao`)}>
                  Reativar minha assinatura
                </Button>
              )}
              <Button danger icon={<X size={16} />} onClick={() => navigate(`/assinaturas/${contrato}/suspensao`)}>
                Cancelar Assinatura
              </Button>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col gap-5">
          {/* Product info card */}
          <Card size="small">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                <img
                  src={detail.imagemProduto}
                  alt={detail.produto}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <Text strong className="block text-base truncate">
                  {detail.produto}
                </Text>
                <Text type="secondary" className="text-sm block">
                  Produtor: <Text strong>{detail.produtor}</Text>
                </Text>
                <Text type="secondary" className="text-sm block break-all">
                  Suporte: <Text strong>{detail.emailSuporte}</Text>
                </Text>
              </div>
            </div>
          </Card>

          {/* Row 1: Purchase info + Payment methods */}
          <div className="flex flex-col md:grid md:grid-cols-2 md:items-stretch gap-5">
            {/* Purchase info */}
            <Card size="small" className="flex flex-col">
              <Text type="secondary" className="text-xs block mb-3">
                Informações da compra
              </Text>
              <div className="flex flex-col gap-1.5">
                <Text className="text-sm">Nome: {detail.nome}</Text>
                <Text className="text-sm break-all">E-mail: {detail.email}</Text>
                <Text className="text-sm">Telefone: {detail.telefone}</Text>
              </div>
            </Card>

            {/* Payment methods section */}
              <Card size="small" className="!p-0">
                <div className="px-4 pt-3 pb-2">
                  <Text type="secondary" className="text-xs block">Formas de pagamento</Text>
                </div>

                {/* Primary */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <Text type="secondary" className="text-xs">Principal</Text>
                    <Button
                      type="link"
                      size="small"
                      className="!p-0"
                      onClick={() => handleEditPayment('primary')}
                    >
                      Editar
                    </Button>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    {isBoleto ? (
                      <>
                        <Barcode size={20} className="text-orange-500" />
                        <Text className="text-sm font-medium">Boleto bancário</Text>
                      </>
                    ) : isPix ? (
                      <>
                        <QrCode size={20} className="text-green-600" />
                        <Text className="text-sm font-medium">PIX</Text>
                      </>
                    ) : primaryCard ? (
                      <>
                        <CardBrandIcon brand={primaryCard.brand} size={28} />
                        <Text className="text-sm">
                          <CardDisplay card={primaryCard} />
                        </Text>
                      </>
                    ) : (
                      <>
                        <CreditCard size={16} className="text-gray-400" />
                        <Text className="text-sm text-gray-400">Cartão não definido</Text>
                      </>
                    )}
                  </div>
                </div>

                <Divider className="!my-0" />

                {/* Alternative card */}
                <div className="px-4 py-3">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Text type="secondary" className="text-xs">Alternativa</Text>
                      <Tooltip title="O cartão alternativo da sua conta é usado automaticamente caso a cobrança no método principal falhe em qualquer contrato, evitando interrupções no seu acesso.">
                        <HelpCircle size={12} className="text-gray-400 cursor-help" />
                      </Tooltip>
                    </span>
                    {alternativeCard ? (
                      <Button
                        type="link"
                        size="small"
                        className="!p-0"
                        onClick={() => navigate('/formas-pagamento')}
                      >
                        Editar
                      </Button>
                    ) : (
                      <Button
                        type="link"
                        size="small"
                        className="!p-0"
                        onClick={handleAddAlternative}
                      >
                        Cadastrar
                      </Button>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    {alternativeCard ? (
                      <>
                        <CardBrandIcon brand={alternativeCard.brand} size={28} />
                        <Text className="text-sm">
                          <CardDisplay card={alternativeCard} />
                        </Text>
                      </>
                    ) : (
                      <>
                        <CreditCard size={16} className="text-gray-400" />
                        <Text className="text-sm text-gray-400">
                          Nenhum cartão cadastrado
                        </Text>
                      </>
                    )}
                  </div>
                </div>
              </Card>

          </div>

          {/* Row 2: Contract info + Payment history */}
          <div className="flex flex-col md:grid md:grid-cols-2 md:items-start gap-5">
            {/* Contract info */}
            <Card size="small">
              <Text type="secondary" className="text-xs block mb-3">
                Informações do seu contrato
              </Text>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <Text className="text-sm">Contrato: {detail.contrato}</Text>
                  <Tag
                    color={
                      detail.status === 'Em dia'
                        ? 'green'
                        : detail.status === 'Suspenso'
                          ? 'orange'
                          : detail.status === 'Cancelado'
                            ? 'default'
                            : undefined
                    }
                    className="text-xs"
                  >
                    {detail.status}
                  </Tag>
                </div>
                <Text className="text-sm">
                  Tipo de frequência: {detail.tipoFrequencia}
                </Text>
                <Text className="text-sm">Frequência: {detail.frequencia}</Text>
                <Text className="text-sm">
                  Limite de cobranças: {detail.limiteCobrancas}
                </Text>
              </div>
              <Title level={4} className="!mt-3 !mb-1">
                {detail.valor}{detail.status !== 'Cancelado' ? '' : ' /mês'}
              </Title>
              {detail.status === 'Cancelado' && (
                <>
                  <Text className="text-sm block mt-1">
                    Você terá acesso ao conteúdo até: {(() => {
                      const m = detail.renovacao.match(/(\d{2})\/(\d{2})\/(\d{4})/)
                      return m ? `${m[1]}/${m[2]}/${m[3]}` : '-'
                    })()}
                  </Text>
                </>
              )}
              <Divider className="!my-3" />
              <Text type="secondary" className="text-sm">
                Renovação: {detail.status === 'Cancelado' ? '-' : detail.renovacao}
              </Text>
            </Card>

            {/* Payment history */}
            <Collapse
              defaultActiveKey={['1']}
              items={[
                {
                  key: '1',
                  label: 'Histórico de Pagamento',
                  styles: { body: { borderTop: 'none' } },
                  children: (() => {
                    const items = paymentHistory[detail.contrato] || []
                    if (!items.length) return <Text type="secondary" className="text-sm py-2">Nenhum pagamento registrado.</Text>
                    const pending = items.filter((i) => i.status === 'Aguardando pagamento')
                    const resolved = items.filter((i) => i.status !== 'Aguardando pagamento')
                    return (
                      <div className="flex flex-col gap-3">
                        {pending.length > 0 && (
                          <div className="flex flex-col gap-2">
                            {pending.map((item, idx) => (
                              <PaymentHistoryRow key={`p-${idx}`} item={item} />
                            ))}
                          </div>
                        )}
                        {pending.length > 0 && resolved.length > 0 && (
                          <Divider className="!my-0" />
                        )}
                        {resolved.length > 0 && (
                          <div className="flex flex-col gap-2">
                            {resolved.map((item, idx) => (
                              <PaymentHistoryRow key={`r-${idx}`} item={item} />
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  })(),
                },
              ]}
              className="!border-[#f0f0f0] !rounded-lg !bg-white [&>.ant-collapse-item]:!border-[#f0f0f0] [&_[class*=collapse-panel]]:!border-t-0"
            />
          </div>

          {/* Cancel button on mobile - at the bottom */}
          {isMobile && detail.status !== 'Cancelado' && (
            <>
              <Divider className="!my-1" />
              <div className="flex flex-col gap-3 mb-16">
                {detail.status === 'Suspenso' && (
                  <Button icon={<RotateCcw size={16} />} type="primary" block onClick={() => navigate(`/assinaturas/${contrato}/reativacao`)}>
                    Reativar minha assinatura
                  </Button>
                )}
                <Button danger icon={<X size={16} />} onClick={() => navigate(`/assinaturas/${contrato}/suspensao`)} block>
                  Cancelar Assinatura
                </Button>
              </div>
            </>
          )}

          {/* Reembolso section - only when cancelled */}
          {detail.status === 'Cancelado' && (() => {
            const inicioMatch = detail.inicio.match(/(\d{2})\/(\d{2})\/(\d{4})/)
            const inicioDate = inicioMatch
              ? new Date(+inicioMatch[3], +inicioMatch[2] - 1, +inicioMatch[1])
              : new Date(0)
            const now = new Date()
            const diffDays = Math.floor((now.getTime() - inicioDate.getTime()) / (1000 * 60 * 60 * 24))
            const dentroDosPrazos = diffDays <= 7

            return (
              <Card size="small">
                <Text type="secondary" className="text-xs block mb-3">
                  Reembolso
                </Text>
                {dentroDosPrazos ? (
                  <div className="flex items-start gap-2">
                    <CircleCheck size={16} className="text-[#52c41a] mt-0.5" />
                    <Text className="text-sm">
                      Seu reembolso foi solicitado - {detail.canceladoEm || '-'}
                    </Text>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <Text className="text-sm">
                      O prazo para solicitar o reembolso é de até 7 dias após a compra. Para solicitar o reembolso, por gentileza, entre em contato diretamente com o produtor.
                    </Text>
                    <div className="flex flex-col gap-0.5">
                      <Text className="text-sm">Nome: {detail.produtor}</Text>
                      <Text className="text-sm">E-mail: {detail.emailProdutor || detail.emailSuporte}</Text>
                    </div>
                  </div>
                )}
              </Card>
            )
          })()}
        </div>
      </div>

      {/* Change payment modal */}
      <ChangePaymentModal
        open={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        target={paymentTarget}
        currentCardId={currentCardIdForTarget}
        disabledCardIds={paymentTarget === 'primary'
          ? [alternativeCardId]
          : Object.values(subscriptionDetails).map((d) => d.primaryCardId).filter(Boolean)
        }
        primaryCardId={detail.primaryCardId}
        alternativeCardId={alternativeCardId ?? null}
        allCards={savedCards}
        onConfirm={handleConfirmPayment}
      />
    </div>
  )
}
