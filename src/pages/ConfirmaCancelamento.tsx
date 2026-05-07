import { useState, useEffect } from 'react'
import { Typography, Button, Alert, Modal } from 'antd'
import {
  WarningOutlined,
  CloseOutlined,
  SyncOutlined,
} from '@ant-design/icons'
import { useParams, useNavigate } from 'react-router-dom'
import { subscriptionDetails, updateSubscriptionStatus } from '../data/mockData'
import { useIsMobile } from '../hooks/useIsMobile'
import eduzzContaLogo from '../assets/eduzz-conta-logo.png'
import mobileTopbarIcon from '../assets/mobile-topbar-icon.svg'
import produtoCursoImg from '../assets/produto-curso.png'
import whatsappGroupImg from '../assets/whatsapp-group.png'

const { Title, Text } = Typography

export default function ConfirmaCancelamento() {
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

  const renovacaoMatch = detail.renovacao.match(/(\d{2})\/(\d{2})\/(\d{4})/)
  const accessDate = renovacaoMatch
    ? `${renovacaoMatch[1]}/${renovacaoMatch[2]}/${renovacaoMatch[3]}`
    : ''

  const handleClose = () => navigate(`/assinaturas/${contrato}`)
  const handleVoltar = () => navigate(`/assinaturas/${contrato}/cancelamento/motivos`)

  const handleCancelar = () => setProcessing(true)

  useEffect(() => {
    if (!processing) return
    const timer = setTimeout(() => {
      updateSubscriptionStatus(contrato!, 'Cancelado')
      navigate(`/assinaturas/${contrato}/cancelamento/sucesso`)
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
            <Text className="text-sm whitespace-nowrap">Etapa 3 de 3</Text>
          ) : (
            <Text className="text-sm truncate">
              Cancelar assinatura <span className="text-black/65 px-1">|</span> {productLabel}
            </Text>
          )}
        </div>
        <Button type="text" onClick={handleClose} className="!flex items-center gap-2 shrink-0">
          Fechar <CloseOutlined className="!text-xs" />
        </Button>
      </div>

      {/* Progress bar 100% */}
      <div className="relative h-1 bg-black/15 shrink-0">
        <div className="absolute left-0 top-0 h-full bg-[#FFBC00] w-full" />
      </div>

      {/* Mobile subtitle */}
      {isMobile && (
        <div className="px-4 pt-3 pb-0">
          <Text className="text-xs block text-black/88">Cancelar assinatura</Text>
          <Text className="text-xs block text-black/88">{productLabel}</Text>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-auto flex justify-center">
        <div className={`bg-white flex flex-col gap-8 items-center p-4 md:p-6 ${isMobile ? 'w-full mt-4 pb-10' : 'w-[560px] mt-16 rounded-lg h-fit'}`}>
          {/* Icon + Title + Description */}
          <div className="flex flex-col gap-8 items-center w-full">
            <WarningOutlined className="!text-[64px] !text-[#ff4d4f]" />
            <div className="flex flex-col gap-4 items-center w-full">
              <Title level={isMobile ? 3 : 2} className="!mb-0 text-center">
                Você está prestes a perder
              </Title>
              <Text className="text-sm text-center">
                Veja o que está incluído na sua assinatura ativa
              </Text>
            </div>
          </div>

          {/* Benefit cards */}
          <div className="flex flex-col gap-2 w-full">
            <div className="bg-[#fff2f0] rounded p-4 flex gap-4 md:gap-6 items-center">
              <img
                src={produtoCursoImg}
                alt={detail.produto}
                className={`rounded-lg object-cover shrink-0 ${isMobile ? 'w-12 h-12' : 'w-[88px] h-[88px]'}`}
              />
              <div className="flex flex-col gap-2 min-w-0">
                <Title level={5} className="!mb-0">Acesso ao {detail.produto}</Title>
                <Text type="secondary" className="text-sm">
                  Aprenda com {detail.produtor} as melhores práticas para estudar e passar nos vestibulares das melhores universidades.
                </Text>
              </div>
            </div>
            <div className="bg-[#fff2f0] rounded p-4 flex gap-4 md:gap-6 items-center">
              <img
                src={whatsappGroupImg}
                alt="WhatsApp"
                className={`rounded-lg object-cover shrink-0 ${isMobile ? 'w-12 h-12' : 'w-[88px] h-[88px]'}`}
              />
              <div className="flex flex-col gap-2 min-w-0">
                <Title level={5} className="!mb-0">Grupo exclusivo no whatsapp</Title>
                <Text type="secondary" className="text-sm">
                  Tenha acesso a conteúdos diários no maior grupo de whatsapp do Brasil!
                </Text>
              </div>
            </div>
          </div>

          {/* Alert + Buttons */}
          <div className="flex flex-col gap-4 w-full">
            <Alert
              type="warning"
              showIcon
              message={
                <Text className="text-sm">
                  Após o cancelamento, você ainda terá acesso ao conteúdo até{' '}
                  <Text strong>{accessDate}</Text> (fim do período pago)
                </Text>
              }
            />
            <div className="flex flex-col gap-3 w-full">
              <Button
                type="primary"
                danger
                size="large"
                icon={<CloseOutlined />}
                block
                onClick={handleCancelar}
              >
                Cancelar minha assinatura
              </Button>
              <Button size="large" block onClick={handleVoltar}>
                Voltar
              </Button>
            </div>
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
              Cancelando assinatura...
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
