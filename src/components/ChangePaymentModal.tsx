import { useState, useCallback } from 'react'
import {
  Modal,
  Button,
  Form,
  Input,
  Typography,
  Divider,
  Card,
  Row,
  Col,
  Radio,
  Space,
  message,
} from 'antd'
import { CreditCard, Lock, Plus, Barcode, QrCode } from 'lucide-react'
import { savedCards, type SavedCard } from '../data/mockData'
import CreditCardPreview from './CreditCardPreview'
import CardBrandIcon from './CardBrandIcon'
import { useIsMobile } from '../hooks/useIsMobile'
import infoCircleIcon from '../assets/info-circle.svg'

const { Text } = Typography

export type PaymentMethodType = 'card' | 'pix' | 'boleto'

interface Props {
  open: boolean
  onClose: () => void
  target: 'primary' | 'alternative' | 'change'
  currentCardId: string | null
  disabledCardIds?: (string | null)[]
  primaryCardId?: string | null
  alternativeCardId?: string | null
  allCards: SavedCard[]
  onConfirm: (cardId: string, method?: PaymentMethodType) => void
}

function formatCardNumber(value: string) {
  const numbers = value.replace(/\D/g, '').slice(0, 16)
  return numbers.replace(/(\d{4})(?=\d)/g, '$1 ')
}

function formatExpiry(value: string) {
  const numbers = value.replace(/\D/g, '').slice(0, 4)
  if (numbers.length >= 3) {
    return numbers.slice(0, 2) + '/' + numbers.slice(2)
  }
  return numbers
}

function formatCPF(value: string) {
  const numbers = value.replace(/\D/g, '').slice(0, 11)
  return numbers
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
}

function getCvvLength(brand: string): number {
  if (brand === 'Amex') return 4
  if (!brand) return 4
  return 3
}

function detectCardBrand(number: string): string {
  const clean = number.replace(/\D/g, '')
  if (/^4/.test(clean)) return 'Visa'
  if (/^5[1-5]/.test(clean)) return 'Mastercard'
  if (/^(636368|438935|504175|451416|636297|5067|4576|4011|506699)/.test(clean))
    return 'Elo'
  if (/^(34|37)/.test(clean)) return 'Amex'
  return ''
}

type View = 'select' | 'new-card' | 'confirm'

export default function ChangePaymentModal({
  open,
  onClose,
  target,
  currentCardId,
  disabledCardIds,
  primaryCardId,
  alternativeCardId: altCardId,
  allCards,
  onConfirm,
}: Props) {
  const isMobile = useIsMobile()
  const isAlternative = target === 'alternative'
  const hasNoCards = allCards.length === 0
  const isAlternativeRegister = isAlternative && !currentCardId && hasNoCards
  const [view, setView] = useState<View>(isAlternativeRegister ? 'new-card' : 'select')
  const [selectedCardId, setSelectedCardId] = useState<string | null>(currentCardId)
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType>('card')
  const [form] = Form.useForm()
  const [cardNumber, setCardNumber] = useState('')
  const [cardHolder, setCardHolder] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')
  const [cpf, setCpf] = useState('')
  const [loading, setLoading] = useState(false)
  const [newCard, setNewCard] = useState<SavedCard | null>(null)
  const [isCardFlipped, setIsCardFlipped] = useState(false)

  const handleCvvFocus = useCallback(() => setIsCardFlipped(true), [])
  const handleCvvBlur = useCallback(() => setIsCardFlipped(false), [])

  const cardBrand = detectCardBrand(cardNumber)
  const cvvMax = getCvvLength(cardBrand)
  const isChangeMode = target === 'change'

  const targetLabel =
    target === 'primary'
      ? 'forma de pagamento principal'
      : target === 'alternative'
        ? 'cartão alternativo da conta'
        : 'forma de pagamento'

  const handleClose = () => {
    setView(isAlternativeRegister ? 'new-card' : 'select')
    setSelectedCardId(currentCardId)
    setSelectedMethod('card')
    setCardNumber('')
    setCardHolder('')
    setExpiry('')
    setCvv('')
    setCpf('')
    setNewCard(null)
    setIsCardFlipped(false)
    form.resetFields()
    onClose()
  }

  const completeAndClose = (cardOverride?: SavedCard | null) => {
    const cardId = cardOverride?.id ?? selectedCardId
    if (selectedMethod !== 'card') {
      onConfirm('', selectedMethod)
    } else if (cardId) {
      onConfirm(cardId, 'card')
    }
    const resolvedCard = cardOverride ?? selectedCard
    const cardLabel = resolvedCard
      ? `Cartão ${resolvedCard.brand || 'Cartão'} •••• ${resolvedCard.last4}`
      : 'Cartão'

    handleClose()
  }

  const handleSelectConfirm = () => {
    if (selectedMethod === 'pix' || selectedMethod === 'boleto') {
      setView('confirm')
      return
    }
    if (!selectedCardId || selectedCardId === currentCardId) return
    if (isAlternative) {
      setLoading(true)
      setTimeout(() => {
        setLoading(false)
        completeAndClose()
      }, 1500)
      return
    }
    setView('confirm')
  }

  const handleNewCardSubmit = async () => {
    try {
      await form.validateFields()
      const last4 = cardNumber.replace(/\D/g, '').slice(-4)
      const brand = detectCardBrand(cardNumber) as SavedCard['brand']
      const created: SavedCard = {
        id: `card-new-${Date.now()}`,
        brand,
        last4,
        holderName: cardHolder,
        expiry,
      }
      setNewCard(created)
      setSelectedCardId(created.id)
      setSelectedMethod('card')

      if (isAlternative) {
        setLoading(true)
        setTimeout(() => {
          setLoading(false)
          savedCards.push(created)
          completeAndClose(created)
        }, 1500)
      } else {
        setView('confirm')
      }
    } catch {
      // form validation errors
    }
  }

  const handleFinalConfirm = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      if (newCard) {
        savedCards.push(newCard)
      }
      completeAndClose()
    }, 1500)
  }

  const selectedCard =
    newCard && selectedCardId === newCard.id
      ? newCard
      : allCards.find((c) => c.id === selectedCardId)

  const isSelectDisabled = () => {
    if (selectedMethod === 'pix' || selectedMethod === 'boleto') return false
    return !selectedCardId || selectedCardId === currentCardId
  }

  const title = () => {
    switch (view) {
      case 'select':
        return isChangeMode
          ? 'Trocar forma de pagamento'
          : target === 'alternative'
            ? 'Cartão alternativo da conta'
            : 'Editar forma de pagamento'
      case 'new-card':
        return 'Cadastrar novo cartão'
      case 'confirm':
        return 'Confirmar alteração'
    }
  }

  const confirmLabel = () => {
    if (selectedMethod === 'pix') return 'PIX'
    if (selectedMethod === 'boleto') return 'Boleto bancário'
    return `${selectedCard?.brand || 'Cartão'} •••• ${selectedCard?.last4}`
  }

  return (
    <Modal
      title={
        title() ? (
          <div className="flex items-center gap-2">
            <CreditCard size={18} />
            <span>{title()}</span>
          </div>
        ) : null
      }
      open={open}
      onCancel={handleClose}
      footer={null}
      width={isMobile ? 'calc(100vw - 32px)' : 480}
      centered
      styles={isMobile ? { body: { maxHeight: '80vh', overflowY: 'auto' } } : undefined}
      destroyOnClose
    >
      {/* VIEW: Select payment method */}
      {view === 'select' && (
        <div className="py-2">
          <Text type="secondary" className="text-sm block mb-4">
            {isChangeMode
              ? 'Escolha como deseja pagar as próximas cobranças desta assinatura.'
              : `Selecione um cartão para usar como ${targetLabel} ou cadastre um novo.`}
          </Text>

          {/* Cards section */}
          <Text strong className="text-xs text-gray-500 uppercase tracking-wide block mb-2">
            Cartões salvos
          </Text>

          <Radio.Group
            value={selectedMethod === 'card' ? selectedCardId : selectedMethod}
            onChange={(e) => {
              const val = e.target.value
              if (val === 'pix' || val === 'boleto') {
                setSelectedMethod(val)
                setSelectedCardId(null)
              } else {
                setSelectedMethod('card')
                setSelectedCardId(val)
              }
            }}
            className="w-full"
          >
            <Space direction="vertical" className="w-full" size="small">
              {(() => {
                const availableCards = allCards.filter((c) => !c.disabled)
                const primCard = availableCards.find((c) => c.id === primaryCardId)
                const altCard = availableCards.find((c) => c.id === altCardId)
                const otherCards = availableCards.filter(
                  (c) => c.id !== primaryCardId && c.id !== altCardId
                )
                const priorityCards = [primCard, altCard].filter(Boolean) as SavedCard[]
                const hasOthers = otherCards.length > 0

                const renderCard = (card: SavedCard) => {
                  const isCurrent = card.id === currentCardId
                  const isOtherSlot = disabledCardIds?.some((id) => id && id === card.id) ?? false
                  const isBlocked = isCurrent || isOtherSlot
                  const isSelected = !isBlocked && selectedMethod === 'card' && selectedCardId === card.id

                  const isPrimary = card.id === primaryCardId
                  const isAlt = card.id === altCardId
                  const disabledReason = isCurrent
                    ? 'Já é o cartão alternativo atual'
                    : isOtherSlot
                      ? 'Em uso como forma de pagamento principal'
                      : isPrimary
                        ? 'Em uso como forma de pagamento principal'
                        : isAlt
                          ? 'Em uso como forma de pagamento alternativa'
                          : ''

                  return (
                    <Card
                      key={card.id}
                      hoverable={!isBlocked}
                      className={`transition-all ${
                        isBlocked
                          ? '!opacity-50 !cursor-not-allowed'
                          : isSelected
                            ? '!border-blue-500 !bg-blue-50/50 !cursor-pointer'
                            : '!cursor-pointer'
                      }`}
                      onClick={() => {
                        if (isBlocked) return
                        setSelectedMethod('card')
                        setSelectedCardId(card.id)
                      }}
                      size="small"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 md:gap-3 min-w-0">
                          <Radio value={card.id} disabled={isBlocked} />
                          <CardBrandIcon brand={card.brand} size={isMobile ? 28 : 36} />
                          <div className="min-w-0">
                            <Text strong className={`${isBlocked ? '!text-gray-400' : ''} text-sm md:text-base truncate block`}>
                              {card.brand || 'Cartão'} •••• {card.last4}
                            </Text>
                            {isBlocked && (
                              <Text type="secondary" className="!text-xs block truncate">
                                {disabledReason}
                              </Text>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  )
                }

                return (
                  <>
                    {priorityCards.map(renderCard)}
                    {hasOthers && priorityCards.length > 0 && (
                      <Divider className="!my-1" />
                    )}
                    {otherCards.map(renderCard)}
                  </>
                )
              })()}

              {/* Add new card */}
              <Button
                type="dashed"
                icon={<Plus size={16} />}
                block
                size="large"
                onClick={() => setView('new-card')}
              >
                Cadastrar novo cartão
              </Button>

              {/* PIX and Boleto - only in change mode */}
              {isChangeMode && (
                <>
                  <Divider className="!my-2">
                    <Text type="secondary" className="!text-xs uppercase tracking-wide">
                      Outros métodos
                    </Text>
                  </Divider>

                  <Card
                    hoverable
                    className={`!cursor-pointer transition-all ${
                      selectedMethod === 'pix' ? '!border-green-500 !bg-green-50/50' : ''
                    }`}
                    onClick={() => {
                      setSelectedMethod('pix')
                      setSelectedCardId(null)
                    }}
                    size="small"
                  >
                    <div className="flex items-center gap-2 md:gap-3">
                      <Radio value="pix" />
                      <QrCode size={20} className="text-green-600" />
                      <div className="min-w-0">
                        <Text strong>PIX</Text>
                        <br />
                        <Text type="secondary" className="!text-xs">
                          Pagamento instantâneo · QR Code gerado a cada cobrança
                        </Text>
                      </div>
                    </div>
                  </Card>

                  <Card
                    hoverable
                    className={`!cursor-pointer transition-all ${
                      selectedMethod === 'boleto' ? '!border-orange-500 !bg-orange-50/50' : ''
                    }`}
                    onClick={() => {
                      setSelectedMethod('boleto')
                      setSelectedCardId(null)
                    }}
                    size="small"
                  >
                    <div className="flex items-center gap-2 md:gap-3">
                      <Radio value="boleto" />
                      <Barcode size={20} className="text-orange-500" />
                      <div className="min-w-0">
                        <Text strong>Boleto bancário</Text>
                        <br />
                        <Text type="secondary" className="!text-xs">
                          Vencimento em até 3 dias úteis · Enviado por e-mail
                        </Text>
                      </div>
                    </div>
                  </Card>
                </>
              )}
            </Space>
          </Radio.Group>

          <Divider className="!my-4" />

          <div className="flex flex-col-reverse gap-2 md:flex-row md:justify-end">
            <Button size="large" onClick={handleClose} block={isMobile}>
              Cancelar
            </Button>
            <Button
              type="primary"
              size="large"
              onClick={handleSelectConfirm}
              disabled={isSelectDisabled()}
              block={isMobile}
            >
              {selectedMethod === 'card' ? 'Usar este cartão' : 'Continuar'}
            </Button>
          </div>
        </div>
      )}

      {/* VIEW: New card form */}
      {view === 'new-card' && (
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
                prefix={<CreditCard size={16} className="text-gray-400" />}
                suffix={
                  cardBrand ? (
                    <Text type="secondary" className="text-xs">
                      {cardBrand}
                    </Text>
                  ) : null
                }
                placeholder="0000 0000 0000 0000"
                inputMode="numeric"
                maxLength={19}
                value={cardNumber}
                onChange={(e) => {
                  const formatted = formatCardNumber(e.target.value)
                  setCardNumber(formatted)
                  form.setFieldValue('cardNumber', formatted)
                  // Truncate CVV if brand changed to one with shorter CVV
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
              rules={[
                { required: true, message: 'Informe o nome no cartão' },
              ]}
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
                        if (clean.length < 4)
                          return Promise.reject('Data inválida')
                        const month = parseInt(clean.slice(0, 2))
                        if (month < 1 || month > 12)
                          return Promise.reject('Mês inválido')
                        return Promise.resolve()
                      },
                    },
                  ]}
                >
                  <Input
                    placeholder="MM/AA"
                    inputMode="numeric"
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
                    prefix={<Lock size={16} className="text-gray-400" />}
                    placeholder={cvvMax === 4 ? '0000' : '000'}
                    inputMode="numeric"
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
                    if (clean.length !== 11)
                      return Promise.reject('CPF inválido')
                    return Promise.resolve()
                  },
                },
              ]}
            >
              <Input
                placeholder="000.000.000-00"
                inputMode="numeric"
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

          <div className="flex items-center gap-2 text-gray-400 text-xs mt-1">
            <Lock size={12} />
            <Text type="secondary" className="!text-xs">
              Seus dados estão protegidos com criptografia de ponta a ponta
            </Text>
          </div>

          <Divider className="!my-4" />

          <div className="flex flex-col-reverse gap-2 md:flex-row md:justify-end">
            <Button size="large" onClick={() => setView('select')} block={isMobile}>
              Cancelar
            </Button>
            <Button type="primary" size="large" onClick={handleNewCardSubmit} loading={loading} block={isMobile}>
              Cadastrar e usar
            </Button>
          </div>
        </div>
      )}

      {/* VIEW: Confirm */}
      {view === 'confirm' && (
        <div className="py-4">
          <div className="flex flex-col items-center text-center gap-4">
            <img src={infoCircleIcon} alt="" className="w-16 h-16" />
            <div className="text-2xl font-semibold text-[rgba(0,0,0,0.88)]">
              {target === 'alternative'
                ? 'Definir como cartão alternativo da conta?'
                : selectedMethod === 'pix'
                  ? 'Alterar para PIX?'
                  : selectedMethod === 'boleto'
                    ? 'Alterar para Boleto bancário?'
                    : `Usar ${confirmLabel()} como pagamento principal?`}
            </div>
            <div className="text-sm text-[rgba(0,0,0,0.88)]">
              {target === 'alternative' ? (
                <>
                  O cartão <strong>{confirmLabel()}</strong> será definido como cartão alternativo da sua conta,
                  vinculado automaticamente a todos os seus contratos.
                </>
              ) : selectedMethod === 'pix' ? (
                <>Um QR Code será gerado a cada cobrança. As próximas cobranças desta assinatura serão realizadas via PIX.</>
              ) : selectedMethod === 'boleto' ? (
                <>O boleto será enviado por e-mail antes do vencimento. As próximas cobranças desta assinatura serão realizadas via Boleto.</>
              ) : (
                <>
                  O cartão <strong>{confirmLabel()}</strong> será definido como forma de pagamento principal desta assinatura.
                  As próximas cobranças serão realizadas neste cartão.
                </>
              )}
            </div>
          </div>

          <Divider className="!my-4" />

          <div className="flex flex-col-reverse gap-2 md:flex-row md:justify-end">
            <Button
              size="large"
              onClick={() => setView(newCard ? 'new-card' : 'select')}
              block={isMobile}
            >
              Cancelar
            </Button>
            <Button
              type="primary"
              size="large"
              onClick={handleFinalConfirm}
              loading={loading}
              block={isMobile}
            >
              Confirmar
            </Button>
          </div>
        </div>
      )}

    </Modal>
  )
}
