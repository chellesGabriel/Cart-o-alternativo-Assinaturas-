import { useState, useCallback } from 'react'
import {
  Typography,
  Button,
  Card,
  Modal,
  Empty,
  Form,
  Input,
  Row,
  Col,
  Divider,
  Table,
  Tag,
  Radio,
  Checkbox,
  Dropdown,
  Tooltip,
  message,
} from 'antd'
import {
  HomeOutlined,
  PlusOutlined,
  DeleteOutlined,
  QuestionCircleOutlined,
  CreditCardOutlined,
  LockOutlined,
  DownOutlined,
  UpOutlined,
  MoreOutlined,
  StarOutlined,
  SafetyOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import {
  savedCards,
  subscriptionDetails,
  accountAlternativeCardId,
  setAccountAlternativeCardId,
  type SavedCard,
  type SubscriptionDetail,
} from '../data/mockData'
import CardBrandIcon from '../components/CardBrandIcon'
import CreditCardPreview from '../components/CreditCardPreview'
import ChangePaymentModal from '../components/ChangePaymentModal'
import { useIsMobile } from '../hooks/useIsMobile'
import infoCircleIcon from '../assets/info-circle.svg'

const { Title, Text } = Typography

function detectCardBrand(number: string): string {
  const clean = number.replace(/\D/g, '')
  if (/^4/.test(clean)) return 'Visa'
  if (/^5[1-5]/.test(clean)) return 'Mastercard'
  if (/^(636368|438935|504175|451416|636297|5067|4576|4011|506699)/.test(clean))
    return 'Elo'
  if (/^(34|37)/.test(clean)) return 'Amex'
  return ''
}

function getCvvLength(brand: string): number {
  if (brand === 'Amex') return 4
  if (!brand) return 4
  return 3
}

function formatCardNumber(value: string) {
  const numbers = value.replace(/\D/g, '').slice(0, 16)
  return numbers.replace(/(\d{4})(?=\d)/g, '$1 ')
}

function formatExpiry(value: string) {
  const numbers = value.replace(/\D/g, '').slice(0, 4)
  if (numbers.length >= 3) return numbers.slice(0, 2) + '/' + numbers.slice(2)
  return numbers
}

function formatCPF(value: string) {
  const numbers = value.replace(/\D/g, '').slice(0, 11)
  return numbers
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
}

interface CardUsage {
  contrato: string
  produto: string
  role: string
  tipoFrequencia: string
  frequencia: string
  limiteCobrancas: string
}

function getCardUsage(cardId: string): CardUsage[] {
  const usages: CardUsage[] = []
  for (const detail of Object.values(subscriptionDetails)) {
    if (detail.primaryCardId === cardId) {
      usages.push({
        contrato: detail.contrato,
        produto: detail.produto,
        role: 'Principal',
        tipoFrequencia: detail.tipoFrequencia,
        frequencia: detail.frequencia,
        limiteCobrancas: detail.limiteCobrancas,
      })
    }
  }
  // Cartão alternativo da conta — vinculado a todos os contratos
  if (accountAlternativeCardId === cardId) {
    for (const detail of Object.values(subscriptionDetails)) {
      usages.push({
        contrato: detail.contrato,
        produto: detail.produto,
        role: 'Alternativo',
        tipoFrequencia: detail.tipoFrequencia,
        frequencia: detail.frequencia,
        limiteCobrancas: detail.limiteCobrancas,
      })
    }
  }
  return usages
}

export default function MinhasFormasPagamento() {
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const [cards, setCards] = useState<SavedCard[]>([...savedCards])
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [alternativeModalOpen, setAlternativeModalOpen] = useState(false)
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null)

  // New card form state
  const [form] = Form.useForm()
  const [cardNumber, setCardNumber] = useState('')
  const [cardHolder, setCardHolder] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')
  const [cpf, setCpf] = useState('')
  const [isCardFlipped, setIsCardFlipped] = useState(false)
  const [loading, setLoading] = useState(false)
  const [addView, setAddView] = useState<'form' | 'success'>('form')
  const [bulkEnabled, setBulkEnabled] = useState(false)
  const [cardRole, setCardRole] = useState<'primary' | 'alternative'>('primary')
  const [, setTick] = useState(0)
  const forceUpdate = () => setTick((t) => t + 1)

  const cardBrand = detectCardBrand(cardNumber)
  const cvvMax = getCvvLength(cardBrand)

  const handleCvvFocus = useCallback(() => setIsCardFlipped(true), [])
  const handleCvvBlur = useCallback(() => setIsCardFlipped(false), [])

  const setCardAsPrimaryInAll = (cardId: string, cardBrand: string, cardLast4: string) => {
    for (const detail of Object.values(subscriptionDetails)) {
      detail.primaryCardId = cardId
      detail.cardBrand = cardBrand as SubscriptionDetail['cardBrand']
      detail.cardFinal = cardLast4
      detail.formaPagamento = 'Cartão de crédito'
    }
    // Se o cartão que virou principal era o alternativo da conta, limpa
    if (accountAlternativeCardId === cardId) {
      setAccountAlternativeCardId(null)
    }
  }

  const setCardAsAlternative = (cardId: string) => {
    setAccountAlternativeCardId(cardId)
  }

  const resetAddForm = () => {
    setCardNumber('')
    setCardHolder('')
    setExpiry('')
    setCvv('')
    setCpf('')
    setIsCardFlipped(false)
    setLoading(false)
    setAddView('form')
    setBulkEnabled(false)
    setCardRole('primary')
    form.resetFields()
  }

  const handleCloseAddModal = () => {
    resetAddForm()
    setAddModalOpen(false)
  }

  const handleAddCard = async () => {
    try {
      await form.validateFields()
      const last4 = cardNumber.replace(/\D/g, '').slice(-4)
      const brand = detectCardBrand(cardNumber) as SavedCard['brand']
      const duplicate = savedCards.find(
        (c) => c.last4 === last4 && c.brand === brand && c.expiry === expiry
      )
      if (duplicate) {
        message.warning('Este cartão já está na sua lista de formas de pagamento')
        return
      }
      const created: SavedCard = {
        id: `card-new-${Date.now()}`,
        brand,
        last4,
        holderName: cardHolder,
        expiry,
      }
      setLoading(true)
      setTimeout(() => {
        setLoading(false)
        savedCards.push(created)
        setCards([...savedCards])
        if (bulkEnabled && cardRole === 'primary') {
          setCardAsPrimaryInAll(created.id, created.brand, last4)
          forceUpdate()
        }
        if (bulkEnabled && cardRole === 'alternative') {
          setCardAsAlternative(created.id)
          forceUpdate()
        }
        handleCloseAddModal()
        message.success('Cartão cadastrado com sucesso')
      }, 1500)
    } catch {
      // validation errors
    }
  }

  const handleDelete = (card: SavedCard) => {
    const usages = getCardUsage(card.id)
    if (usages.length > 0) {
      Modal.warning({
        icon: null,
        centered: true,
        width: isMobile ? 'calc(100vw - 32px)' : 480,
        okText: 'Entendi',
        okButtonProps: { size: 'large', style: { backgroundColor: '#0d2772', borderColor: '#0d2772' } },
        content: (
          <div className="flex flex-col items-center text-center gap-4 py-2">
            <img src={infoCircleIcon} alt="" className="w-16 h-16" />
            <div className="text-2xl font-semibold text-[rgba(0,0,0,0.88)]">Cartão em uso</div>
            <div className="text-sm text-[rgba(0,0,0,0.88)]">
              Este cartão está vinculado a assinaturas e não pode ser excluído.
              Troque a forma de pagamento antes de excluir o cartão.
            </div>
          </div>
        ),
      })
      return
    }

    Modal.confirm({
      icon: null,
      centered: true,
      width: isMobile ? 'calc(100vw - 32px)' : 480,
      content: (
        <div className="flex flex-col items-center text-center gap-4 py-2">
          <img src={infoCircleIcon} alt="" className="w-16 h-16" />
          <div className="text-2xl font-semibold text-[rgba(0,0,0,0.88)]">Excluir cartão?</div>
          <div className="text-sm text-[rgba(0,0,0,0.88)]">
            Deseja excluir o cartão <strong>{card.brand || 'Cartão'} •••• {card.last4}</strong>?
          </div>
        </div>
      ),
      okText: 'Excluir',
      okType: 'danger',
      okButtonProps: { size: 'large' },
      cancelButtonProps: { size: 'large' },
      cancelText: 'Cancelar',
      onOk: () => {
        const idx = savedCards.findIndex((c) => c.id === card.id)
        if (idx !== -1) savedCards.splice(idx, 1)
        setCards([...savedCards])
        if (expandedCardId === card.id) setExpandedCardId(null)
      },
    })
  }

  const handleSetPrimaryAll = (card: SavedCard) => {
    Modal.confirm({
      icon: null,
      centered: true,
      width: isMobile ? 'calc(100vw - 32px)' : 480,
      okButtonProps: { size: 'large', style: { backgroundColor: '#0d2772', borderColor: '#0d2772' } },
      cancelButtonProps: { size: 'large' },
      content: (
        <div className="flex flex-col items-center text-center gap-4 py-2">
          <img src={infoCircleIcon} alt="" className="w-16 h-16" />
          <div className="text-2xl font-semibold text-[rgba(0,0,0,0.88)]">
            Usar este cartão como meio de pagamento principal de todos os contratos?
          </div>
          <div className="text-sm text-[rgba(0,0,0,0.88)]">
            O cartão <strong>{card.brand || 'Cartão'} •••• {card.last4}</strong> será definido como forma
            de pagamento principal de todos os contratos, substituindo a forma de pagamento atual de cada um.
          </div>
        </div>
      ),
      okText: 'Confirmar',
      cancelText: 'Cancelar',
      onOk: () => {
        setCardAsPrimaryInAll(card.id, card.brand, card.last4)
        setCards([...savedCards])
        setExpandedCardId(null)
        forceUpdate()
        message.success(`Cartão ${card.brand || 'Cartão'} •••• ${card.last4} definido como principal em todos os contratos`)
      },
    })
  }

  const handleSetAlternative = (card: SavedCard) => {
    const allContracts = Object.values(subscriptionDetails)
    const isPrimaryInAny = allContracts.some((d) => d.primaryCardId === card.id)

    if (isPrimaryInAny) {
      Modal.warning({
        icon: null,
        centered: true,
        width: isMobile ? 'calc(100vw - 32px)' : 480,
        okText: 'Entendi',
        okButtonProps: { size: 'large', style: { backgroundColor: '#0d2772', borderColor: '#0d2772' } },
        content: (
          <div className="flex flex-col items-center text-center gap-4 py-2">
            <img src={infoCircleIcon} alt="" className="w-16 h-16" />
            <div className="text-2xl font-semibold text-[rgba(0,0,0,0.88)]">Cartão não disponível</div>
            <div className="text-sm text-[rgba(0,0,0,0.88)]">
              O cartão <strong>{card.brand || 'Cartão'} •••• {card.last4}</strong> está sendo usado como
              pagamento principal em um ou mais contratos e não pode ser definido como alternativo.
            </div>
          </div>
        ),
      })
      return
    }

    const count = allContracts.length

    Modal.confirm({
      icon: null,
      centered: true,
      width: isMobile ? 'calc(100vw - 32px)' : 480,
      okButtonProps: { size: 'large', style: { backgroundColor: '#0d2772', borderColor: '#0d2772' } },
      cancelButtonProps: { size: 'large' },
      content: (
        <div className="flex flex-col items-center text-center gap-4 py-2">
          <img src={infoCircleIcon} alt="" className="w-16 h-16" />
          <div className="text-2xl font-semibold text-[rgba(0,0,0,0.88)]">
            Definir como cartão alternativo da conta?
          </div>
          <div className="text-sm text-[rgba(0,0,0,0.88)]">
            O cartão <strong>{card.brand || 'Cartão'} •••• {card.last4}</strong> será definido como
            cartão alternativo da sua conta, vinculado automaticamente a {count > 1 ? `todos os ${count} contratos` : '1 contrato'}.
            Esse cartão será usado automaticamente caso a cobrança no método principal falhe em qualquer contrato.
          </div>
        </div>
      ),
      okText: 'Confirmar',
      cancelText: 'Cancelar',
      onOk: () => {
        setCardAsAlternative(card.id)
        setCards([...savedCards])
        setExpandedCardId(null)
        forceUpdate()
        message.success(`Cartão ${card.brand || 'Cartão'} •••• ${card.last4} definido como alternativo da conta`)
      },
    })
  }

  const handleGoToContract = (contrato: string) => {
    navigate(`/assinaturas/${contrato}`)
  }

  const handleAlternativeConfirm = (cardId: string) => {
    setAccountAlternativeCardId(cardId)
    setCards([...savedCards])
    forceUpdate()
    message.success('Cartão alternativo da conta definido com sucesso')
  }

  const usageColumns = [
    {
      title: 'Contrato',
      dataIndex: 'contrato',
      key: 'contrato',
      width: 110,
    },
    {
      title: 'Produto',
      dataIndex: 'produto',
      key: 'produto',
    },
    {
      title: 'Vinculado como',
      dataIndex: 'role',
      key: 'role',
      width: 140,
      render: (role: string) => (
        <Tag color={role === 'Principal' ? 'blue' : 'orange'}>{role}</Tag>
      ),
    },
    ...(isMobile
      ? []
      : [
          {
            title: 'Frequência',
            dataIndex: 'tipoFrequencia',
            key: 'tipoFrequencia',
            width: 100,
          },
          {
            title: 'Limite',
            dataIndex: 'limiteCobrancas',
            key: 'limiteCobrancas',
            width: 80,
          },
        ]),
    {
      title: '',
      key: 'action',
      width: isMobile ? 80 : 120,
      render: (_: unknown, record: CardUsage) => (
        <Button
          type="link"
          size="small"
          onClick={() => handleGoToContract(record.contrato)}
        >
          {isMobile ? 'Ver' : 'Ver contrato'}
        </Button>
      ),
    },
  ]

  const cardDropdownItems = (card: SavedCard) => {
    const allContracts = Object.values(subscriptionDetails)
    const isAlreadyPrimaryInAll = allContracts.length > 0 && allContracts.every((d) => d.primaryCardId === card.id)
    const isAlreadyAlternative = accountAlternativeCardId === card.id
    const isPrimaryInAny = allContracts.some((d) => d.primaryCardId === card.id)

    if (card.disabled) {
      return [
        {
          key: 'delete',
          icon: <DeleteOutlined />,
          label: 'Excluir cartão',
          danger: true,
          onClick: () => handleDelete(card),
        },
      ]
    }

    return [
      {
        key: 'primary',
        icon: <StarOutlined />,
        label: 'Usar como principal em todos',
        disabled: isAlreadyPrimaryInAll || allContracts.length === 0,
        onClick: () => handleSetPrimaryAll(card),
      },
      {
        key: 'alternative',
        icon: <SafetyOutlined />,
        label: 'Definir como alternativo da conta',
        disabled: isAlreadyAlternative || isPrimaryInAny,
        onClick: () => handleSetAlternative(card),
      },
      { type: 'divider' as const },
      {
        key: 'delete',
        icon: <DeleteOutlined />,
        label: 'Excluir cartão',
        danger: true,
        onClick: () => handleDelete(card),
      },
    ]
  }

  const renderMobileCardItem = (card: SavedCard) => {
    const usages = getCardUsage(card.id)
    const inUse = usages.length > 0
    const isExpanded = expandedCardId === card.id

    return (
      <div
        key={card.id}
        className="bg-white border border-[#d9d9d9] rounded-lg p-4 flex flex-col gap-2"
      >
        {/* Card header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <CardBrandIcon brand={card.brand} size={36} opacity={card.disabled ? 0.3 : undefined} />
            <div className="min-w-0">
              <Text strong className={`text-base block truncate ${card.disabled ? 'opacity-30' : ''}`}>
                {card.brand || 'Cartão'} •••• {card.last4}
              </Text>
              {card.disabled ? (
                <Text className="!text-xs !text-[#ff4d4f]">
                  Este cartão não pode ser usado no momento
                </Text>
              ) : (
                <Text type="secondary" className="!text-sm">
                  {inUse
                    ? `Em uso em ${usages.length} assinatura${usages.length > 1 ? 's' : ''}`
                    : 'Não vinculado a nenhuma cobrança'}
                </Text>
              )}
            </div>
          </div>
          <Dropdown
            menu={{ items: cardDropdownItems(card) }}
            trigger={['click']}
          >
            <Button type="text" icon={<MoreOutlined style={{ fontSize: 18 }} />} className="flex-shrink-0" />
          </Dropdown>
        </div>

        {/* Expanded: usage cards */}
        {isExpanded && inUse && !card.disabled && (
          <>
            <Divider className="!my-0" />
            {usages.map((usage) => (
              <div
                key={`${usage.contrato}-${usage.role}`}
                className="bg-[#f5f5f5] rounded p-2 flex flex-col gap-2"
              >
                <div>
                  <Text className="text-base block">{usage.produto}</Text>
                  <Text className="!text-xs block">{usage.contrato}</Text>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1">
                    <Text className="text-sm">Vinculado como:</Text>
                    <Tag className="!text-xs !m-0">{usage.role}</Tag>
                  </div>
                  <Text className="text-sm">Frequência: {usage.tipoFrequencia}</Text>
                </div>
                <Divider className="!my-0" />
                <div
                  className="text-center cursor-pointer"
                  onClick={() => handleGoToContract(usage.contrato)}
                >
                  <Text className="text-sm !text-[#153fb8]">Ver contrato</Text>
                </div>
              </div>
            ))}
          </>
        )}

        {/* Accordion toggle */}
        {inUse && !card.disabled && (
          <>
            {!isExpanded && <Divider className="!my-0" />}
            <div
              className="flex items-center justify-center gap-2 cursor-pointer pt-1"
              onClick={() => setExpandedCardId(isExpanded ? null : card.id)}
            >
              <Text className="text-sm !text-[#0d2772]">
                {isExpanded ? 'Ocultar' : 'Ver uso'}
              </Text>
              {isExpanded ? (
                <UpOutlined className="!text-xs !text-[#0d2772]" />
              ) : (
                <DownOutlined className="!text-xs !text-[#0d2772]" />
              )}
            </div>
          </>
        )}
      </div>
    )
  }

  const renderDesktopCardItem = (card: SavedCard) => {
    const usages = getCardUsage(card.id)
    const inUse = usages.length > 0
    const isExpanded = expandedCardId === card.id
    const isAccountAlternative = accountAlternativeCardId === card.id

    return (
      <Card key={card.id} size="small">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-4 min-w-0">
            <CardBrandIcon brand={card.brand} size={48} opacity={card.disabled ? 0.3 : undefined} />
            <div className="min-w-0">
              <div className={`flex items-center gap-2 ${card.disabled ? 'opacity-30' : ''}`}>
                <Text strong className="text-base block truncate">
                  {card.brand || 'Cartão'} •••• {card.last4}
                </Text>
                {isAccountAlternative && (
                  <Tag color="orange" className="!text-xs !m-0">Alternativo da conta</Tag>
                )}
              </div>
              <div className="mt-1">
                {card.disabled ? (
                  <Text className="!text-xs !text-[#ff4d4f]">
                    Este cartão não pode ser usado no momento
                  </Text>
                ) : inUse ? (
                  <Text type="secondary" className="!text-xs">
                    Em uso em {usages.length} assinatura{usages.length > 1 ? 's' : ''}
                  </Text>
                ) : (
                  <Text type="secondary" className="!text-xs">
                    Não vinculado a nenhuma assinatura
                  </Text>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {inUse && !card.disabled && (
              <Button
                type="link"
                size="small"
                icon={isExpanded ? <UpOutlined /> : <DownOutlined />}
                onClick={() => setExpandedCardId(isExpanded ? null : card.id)}
              >
                {isExpanded ? 'Ocultar' : 'Onde está sendo usado'}
              </Button>
            )}
            <Dropdown
              menu={{ items: cardDropdownItems(card) }}
              trigger={['click']}
            >
              <Button type="text" icon={<MoreOutlined style={{ fontSize: 20 }} />} />
            </Dropdown>
          </div>
        </div>

        {isExpanded && !card.disabled && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <Table
              columns={usageColumns}
              dataSource={usages}
              rowKey={(r) => `${r.contrato}-${r.role}`}
              pagination={false}
              size="small"
            />
          </div>
        )}
      </Card>
    )
  }

  const renderCardItem = (card: SavedCard) => {
    return isMobile ? renderMobileCardItem(card) : renderDesktopCardItem(card)
  }

  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      <div className="px-4 py-4 md:px-8 md:py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
          <HomeOutlined />
          <span>/</span>
          <Text type="secondary">Meus cartões</Text>
        </div>

        {/* Page title */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <Title level={3} className="!mb-1 !text-xl md:!text-2xl">
              Meus cartões
            </Title>
            <Text type="secondary" className="text-sm md:text-base">
              Gerencie os cartões salvos na sua conta e escolha quais podem ser usados nas suas assinaturas.
            </Text>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={() => setAddModalOpen(true)}
            block={isMobile}
          >
            Adicionar cartão
          </Button>
        </div>

        {/* Cards list */}
        {cards.length === 0 ? (
          <Card>
            <Empty
              description="Nenhum cartão cadastrado"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            >
              <Button type="primary" onClick={() => setAddModalOpen(true)}>
                Cadastrar cartão
              </Button>
            </Empty>
          </Card>
        ) : (
          (() => {
            const cardsInUse = cards.filter((c) => getCardUsage(c.id).length > 0)
            const cardsNotInUse = cards.filter((c) => getCardUsage(c.id).length === 0)

            return (
              <div className="flex flex-col gap-3">
                {/* Cartões em uso */}
                {cardsInUse.map((card) => renderCardItem(card))}

                {/* Banner: cadastrar cartão alternativo */}
                {!accountAlternativeCardId && (
                  <Card
                    className="!bg-[#fffbe6] !border-[#ffe58f]"
                    size="small"
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div className="flex gap-3 items-start">
                        <SafetyOutlined className="text-2xl text-[#faad14] mt-0.5 flex-shrink-0" />
                        <div>
                          <Text strong className="block text-sm md:text-base">
                            Proteja suas assinaturas com um cartão alternativo
                          </Text>
                          <Text type="secondary" className="!text-xs md:!text-sm block mt-1">
                            Cadastre um cartão alternativo para a sua conta. Caso a cobrança no cartão principal falhe,
                            o cartão alternativo será usado automaticamente, evitando a suspensão das suas assinaturas.
                          </Text>
                        </div>
                      </div>
                      <Button
                        type="default"
                        onClick={() => setAlternativeModalOpen(true)}
                        className="flex-shrink-0"
                        block={isMobile}
                      >
                        Escolher cartão
                      </Button>
                    </div>
                  </Card>
                )}

                {/* Divider entre em uso e sem uso */}
                {cardsNotInUse.length > 0 && (
                  <Divider className="!my-1" />
                )}

                {/* Cartões sem uso */}
                {cardsNotInUse.map((card) => renderCardItem(card))}
              </div>
            )
          })()
        )}
      </div>

      {/* Add card modal */}
      <Modal
        title={
          addView === 'form' ? (
            <div className="flex items-center gap-2">
              <CreditCardOutlined className="text-lg" />
              <span>Cadastrar novo cartão</span>
            </div>
          ) : null
        }
        open={addModalOpen}
        onCancel={handleCloseAddModal}
        footer={null}
        width={isMobile ? 'calc(100vw - 32px)' : 480}
        centered
        styles={isMobile ? { body: { maxHeight: '80vh', overflowY: 'auto' } } : undefined}
        destroyOnClose
      >
        {addView === 'form' && (
          <div className="py-2">
            <CreditCardPreview
              cardNumber={cardNumber}
              cardHolder={cardHolder}
              expiry={expiry}
              cvv={cvv}
              brand={cardBrand}
              isFlipped={isCardFlipped}
            />

            <Form form={form} layout="vertical" size="large">
              <Form.Item
                label="Número do cartão"
                name="cardNumber"
                rules={[
                  { required: true, message: 'Informe o número do cartão' },
                  {
                    validator: (_, value) => {
                      const clean = (value || '').replace(/\D/g, '')
                      if (clean.length < 13 || clean.length > 16)
                        return Promise.reject('Número inválido')
                      return Promise.resolve()
                    },
                  },
                ]}
              >
                <Input
                  prefix={<CreditCardOutlined className="text-gray-400" />}
                  suffix={
                    cardBrand ? (
                      <Text type="secondary" className="text-xs">
                        {cardBrand}
                      </Text>
                    ) : null
                  }
                  placeholder="0000 0000 0000 0000"
                  maxLength={19}
                  value={cardNumber}
                  onChange={(e) => {
                    const formatted = formatCardNumber(e.target.value)
                    setCardNumber(formatted)
                    form.setFieldValue('cardNumber', formatted)
                    const newBrand = detectCardBrand(formatted)
                    const newMax = getCvvLength(newBrand)
                    if (cvv.length > newMax) {
                      const trimmed = cvv.slice(0, newMax)
                      setCvv(trimmed)
                      form.setFieldValue('cvv', trimmed)
                    }
                  }}
                />
              </Form.Item>

              <Form.Item
                label="Nome impresso no cartão"
                name="cardHolder"
                rules={[{ required: true, message: 'Informe o nome no cartão' }]}
              >
                <Input
                  placeholder="NOME COMO ESTÁ NO CARTÃO"
                  value={cardHolder}
                  onChange={(e) => {
                    const val = e.target.value.toUpperCase()
                    setCardHolder(val)
                    form.setFieldValue('cardHolder', val)
                  }}
                />
              </Form.Item>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Validade"
                    name="expiry"
                    rules={[
                      { required: true, message: 'Informe a validade' },
                      {
                        validator: (_, value) => {
                          const clean = (value || '').replace(/\D/g, '')
                          if (clean.length < 4) return Promise.reject('Data inválida')
                          const month = parseInt(clean.slice(0, 2))
                          if (month < 1 || month > 12) return Promise.reject('Mês inválido')
                          return Promise.resolve()
                        },
                      },
                    ]}
                  >
                    <Input
                      placeholder="MM/AA"
                      maxLength={5}
                      value={expiry}
                      onChange={(e) => {
                        const formatted = formatExpiry(e.target.value)
                        setExpiry(formatted)
                        form.setFieldValue('expiry', formatted)
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="CVV"
                    name="cvv"
                    rules={[
                      { required: true, message: 'Informe o CVV' },
                      {
                        validator: (_, value) => {
                          const clean = (value || '').replace(/\D/g, '')
                          if (clean.length < cvvMax)
                            return Promise.reject(`CVV deve ter ${cvvMax} dígitos`)
                          return Promise.resolve()
                        },
                      },
                    ]}
                  >
                    <Input
                      prefix={<LockOutlined className="text-gray-400" />}
                      placeholder={cvvMax === 4 ? '0000' : '000'}
                      maxLength={cvvMax}
                      value={cvv}
                      onFocus={handleCvvFocus}
                      onBlur={handleCvvBlur}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, cvvMax)
                        setCvv(val)
                        form.setFieldValue('cvv', val)
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                label="CPF do titular"
                name="cpf"
                rules={[
                  { required: true, message: 'Informe o CPF' },
                  {
                    validator: (_, value) => {
                      const clean = (value || '').replace(/\D/g, '')
                      if (clean.length !== 11) return Promise.reject('CPF inválido')
                      return Promise.resolve()
                    },
                  },
                ]}
              >
                <Input
                  placeholder="000.000.000-00"
                  maxLength={14}
                  value={cpf}
                  onChange={(e) => {
                    const formatted = formatCPF(e.target.value)
                    setCpf(formatted)
                    form.setFieldValue('cpf', formatted)
                  }}
                />
              </Form.Item>
            </Form>

            <div>
              <Checkbox
                checked={bulkEnabled}
                onChange={(e) => setBulkEnabled(e.target.checked)}
              >
                <Text className="!text-sm">
                  Vincular a todos os contratos
                </Text>
              </Checkbox>
              {bulkEnabled && (
                <Radio.Group
                  value={cardRole}
                  onChange={(e) => setCardRole(e.target.value)}
                  className="ml-6 mt-2"
                >
                  <div className="flex flex-col gap-1">
                    <Radio value="primary">
                      <span className="inline-flex items-center gap-1">
                        <Text className="!text-sm">Como forma de pagamento principal</Text>
                        <Tooltip title="Todas as cobranças futuras dos seus contratos serão realizadas neste cartão.">
                          <QuestionCircleOutlined className="text-xs text-gray-400 cursor-help" />
                        </Tooltip>
                      </span>
                    </Radio>
                    <Radio value="alternative">
                      <span className="inline-flex items-center gap-1">
                        <Text className="!text-sm">Como cartão alternativo da conta</Text>
                        <Tooltip title="Este cartão será usado automaticamente caso a cobrança no método principal falhe em qualquer contrato, evitando interrupções no seu acesso.">
                          <QuestionCircleOutlined className="text-xs text-gray-400 cursor-help" />
                        </Tooltip>
                      </span>
                    </Radio>
                  </div>
                </Radio.Group>
              )}
            </div>

            <div className="flex items-center gap-2 text-gray-400 text-xs mt-3">
              <LockOutlined />
              <Text type="secondary" className="!text-xs">
                Seus dados estão protegidos com criptografia de ponta a ponta
              </Text>
            </div>

            <Divider className="!my-4" />

            <div className="flex flex-col-reverse gap-2 md:flex-row md:justify-end">
              <Button size="large" onClick={handleCloseAddModal} block={isMobile}>
                Cancelar
              </Button>
              <Button type="primary" size="large" onClick={handleAddCard} loading={loading} block={isMobile}>
                Cadastrar cartão
              </Button>
            </div>
          </div>
        )}

      </Modal>

      {/* Alternative card selection modal */}
      <ChangePaymentModal
        open={alternativeModalOpen}
        onClose={() => setAlternativeModalOpen(false)}
        target="alternative"
        currentCardId={accountAlternativeCardId}
        disabledCardIds={Object.values(subscriptionDetails).map((d) => d.primaryCardId).filter(Boolean)}
        allCards={cards}
        onConfirm={handleAlternativeConfirm}
      />
    </div>
  )
}
