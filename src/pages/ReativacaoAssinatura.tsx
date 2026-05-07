import { useState, useEffect } from 'react'
import { Typography, Button, Divider, Modal } from 'antd'
import {
  ReloadOutlined,
  CloseOutlined,
  SyncOutlined,
} from '@ant-design/icons'
import { useParams, useNavigate } from 'react-router-dom'
import { subscriptionDetails, savedCards } from '../data/mockData'
import { useIsMobile } from '../hooks/useIsMobile'
import CardBrandIcon from '../components/CardBrandIcon'
import eduzzContaLogo from '../assets/eduzz-conta-logo.png'
import mobileTopbarIcon from '../assets/mobile-topbar-icon.svg'

const { Title, Text } = Typography

export default function ReativacaoAssinatura() {
  const { contrato } = useParams<{ contrato: string }>()
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const [processing, setProcessing] = useState(false)

  const detail = contrato ? subscriptionDetails[contrato] : null

  if (!detail) {
    navigate('/assinaturas')
    return null
  }

  const productLabel = `${detail.produto} (${detail.contrato})`
  const primaryCard = savedCards.find((c) => c.id === detail.primaryCardId)
  const isBoleto = detail.formaPagamento === 'Boleto bancário'
  const isPix = detail.formaPagamento === 'PIX'

  const paymentLabel = isBoleto
    ? 'Boleto bancário'
    : isPix
      ? 'PIX'
      : primaryCard
        ? `Cartão final ${primaryCard.last4}`
        : 'Não definido'

  const handleClose = () => {
    navigate(`/assinaturas/${contrato}`)
  }

  const handleReativar = () => {
    setProcessing(true)
  }

  useEffect(() => {
    if (!processing) return
    const timer = setTimeout(() => {
      if (detail) {
        detail.status = 'Em dia'
      }
      navigate(`/assinaturas/${contrato}/reativacao/sucesso`)
    }, 2500)
    return () => clearTimeout(timer)
  }, [processing, contrato, navigate, detail])

  return (
    <div className="fixed inset-0 z-[1000] flex flex-col bg-[#f0f0f0]">
      {/* Topbar */}
      <div className="bg-white border-b border-[#d9d9d9] flex items-center justify-between px-4 md:px-8 py-2 shrink-0">
        <div className="flex items-center gap-4 min-w-0">
          {isMobile ? (
            <img src={mobileTopbarIcon} alt="Eduzz" className="h-10 w-auto shrink-0" />
          ) : (
            <img src={eduzzContaLogo} alt="MyEduzz" className="h-8 shrink-0" />
          )}
          {isMobile ? (
            <Text className="text-sm whitespace-nowrap">Etapa 1 de 1</Text>
          ) : (
            <Text className="text-sm truncate">
              Reativar assinatura <span className="text-black/65 px-1">|</span> {productLabel}
            </Text>
          )}
        </div>
        <Button type="text" onClick={handleClose} className="!flex items-center gap-2 shrink-0">
          Fechar <CloseOutlined className="!text-xs" />
        </Button>
      </div>

      {/* Progress bar - full */}
      <div className="relative h-1 bg-black/15 shrink-0">
        <div className="absolute left-0 top-0 h-full bg-[#FFBC00] w-full" />
      </div>

      {/* Mobile subtitle */}
      {isMobile && (
        <div className="px-4 pt-3 pb-0">
          <Text className="text-xs block text-black/88">Reativar assinatura</Text>
          <Text className="text-xs block text-black/88">{productLabel}</Text>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-auto flex justify-center">
        <div
          className={`bg-white flex flex-col gap-8 items-center p-4 md:p-6 ${
            isMobile ? 'w-full mt-4' : 'w-[560px] mt-16 rounded-lg h-fit'
          }`}
        >
          {/* Icon + Title + Description */}
          <div className="flex flex-col gap-8 items-center w-full">
            <ReloadOutlined className="!text-[64px] text-black/75" />
            <div className="flex flex-col gap-4 items-center w-full">
              <Title level={isMobile ? 3 : 2} className="!mb-0 text-center">
                Reativar assinatura agora?
              </Title>
              <Text className={`text-center ${isMobile ? 'text-xs' : 'text-sm'}`}>
                Ao reativar a assinatura, a cobrança será retomada normalmente e o acesso a todos os conteúdos será liberado imediatamente.
              </Text>
            </div>
          </div>

          {/* Gray info box */}
          <div className="bg-[#f5f5f5] rounded p-4 w-full flex flex-col gap-4">
            <div className="flex flex-wrap gap-1 items-center">
              <Text className="text-sm">Plano:</Text>
              <Text className="text-sm">{detail.tipoFrequencia} - {detail.valor}/mês</Text>
            </div>
            <Divider className="!my-0" />
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-1 items-center">
                <Text className="text-sm">Forma de pagamento:</Text>
                <div className="flex items-center gap-1">
                  <Text className="text-sm">{paymentLabel}</Text>
                  {primaryCard && <CardBrandIcon brand={primaryCard.brand} size={18} />}
                </div>
              </div>
              <Text className="text-sm text-[#153fb8] cursor-pointer">Alterar</Text>
            </div>
            <Divider className="!my-0" />
            <div className="flex flex-wrap gap-1 items-center">
              <Text className="text-sm">Próxima cobrança:</Text>
              <Text className="text-sm">Agora</Text>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-3 w-full">
            <Button
              type="primary"
              size="large"
              icon={<ReloadOutlined />}
              block
              onClick={handleReativar}
            >
              Reativar minha assinatura
            </Button>
            <Button
              size="large"
              block
              onClick={handleClose}
            >
              Agora não
            </Button>
          </div>
        </div>
      </div>

      {/* Processing modal */}
      <Modal
        open={processing}
        footer={null}
        closable
        onCancel={() => setProcessing(false)}
        centered
        width={isMobile ? '90%' : 520}
      >
        <div className="flex flex-col items-center gap-4 py-4">
          <SyncOutlined spin className="!text-[64px] text-black/75" />
          <div className="flex flex-col items-center gap-4 w-full">
            <Title level={isMobile ? 3 : 2} className="!mb-0 text-center">
              Reativando assinatura...
            </Title>
            <Text className="text-sm text-center">
              Aguarde, estamos processando sua solicitação.
            </Text>
          </div>
        </div>
      </Modal>
    </div>
  )
}
