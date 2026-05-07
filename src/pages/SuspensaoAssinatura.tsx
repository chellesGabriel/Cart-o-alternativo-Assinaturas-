import { useState, useMemo } from 'react'
import { Typography, Button, Divider, InputNumber } from 'antd'
import {
  PauseCircleOutlined,
  MinusOutlined,
  PlusOutlined,
  CloseOutlined,
} from '@ant-design/icons'
import { useParams, useNavigate } from 'react-router-dom'
import { subscriptionDetails } from '../data/mockData'
import { useIsMobile } from '../hooks/useIsMobile'
import eduzzContaLogo from '../assets/eduzz-conta-logo.png'
import mobileTopbarIcon from '../assets/mobile-topbar-icon.svg'

const { Title, Text } = Typography

export default function SuspensaoAssinatura() {
  const { contrato } = useParams<{ contrato: string }>()
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const [meses, setMeses] = useState(1)

  const detail = contrato ? subscriptionDetails[contrato] : null

  const handleClose = () => {
    navigate(`/assinaturas/${contrato}`)
  }

  const { accessDate, pauseDate } = useMemo(() => {
    if (!detail) return { accessDate: '', pauseDate: '' }
    const fmt = (d: Date) =>
      `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`
    // Access date = end of current paid period (renovation date)
    const renovacaoMatch = detail.renovacao.match(/(\d{2})\/(\d{2})\/(\d{4})/)
    const accessD = renovacaoMatch
      ? new Date(+renovacaoMatch[3], +renovacaoMatch[2] - 1, +renovacaoMatch[1])
      : new Date()
    // Pause date = today + X months
    const today = new Date()
    const pauseD = new Date(today.getFullYear(), today.getMonth() + meses, today.getDate())
    return { accessDate: fmt(accessD), pauseDate: fmt(pauseD) }
  }, [detail, meses])

  if (!detail) {
    navigate('/assinaturas')
    return null
  }

  const productLabel = `${detail.produto} (${detail.contrato})`

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
            <Text className="text-sm whitespace-nowrap">Etapa 1 de 2</Text>
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

      {/* Progress bar */}
      <div className="relative h-1 bg-black/15 shrink-0">
        <div className="absolute left-0 top-0 h-full bg-[#FFBC00] w-1/3" />
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
        <div
          className={`bg-white flex flex-col gap-6 md:gap-8 items-center p-4 md:p-6 ${
            isMobile ? 'w-full mt-4 pb-20 mb-16' : 'w-[560px] mt-16 rounded-lg h-fit'
          }`}
        >
          {/* Icon */}
          <PauseCircleOutlined className="!text-[64px] text-black/75" />

          {/* Title + Description */}
          <div className="flex flex-col gap-4 items-center w-full">
            <Title
              level={isMobile ? 3 : 2}
              className="!mb-0 text-center"
            >
              Que tal pausar em vez de cancelar?
            </Title>
            <Text className={`text-center ${isMobile ? 'text-xs' : 'text-sm'}`}>
              Você pode suspender sua assinatura por até 6 meses e{' '}
              <Text strong>retomar quando quiser, sem perder seu histórico, progresso ou acesso aos conteúdos.</Text>
            </Text>
          </div>

          {/* Gray box */}
          <div className="bg-[#f5f5f5] rounded p-4 w-full flex flex-col gap-4">
            <div className="flex flex-col gap-1 md:gap-2">
              <Title level={5} className="!mb-0">
                Por quanto tempo quer suspender?
              </Title>
              <Text className="text-sm">
                Nenhuma cobrança será feita durante este período.
              </Text>
            </div>

            {/* Counter */}
            <div className="flex items-center gap-2">
              <Button
                icon={<MinusOutlined />}
                onClick={() => setMeses((v) => Math.max(1, v - 1))}
                disabled={meses <= 1}
                className="!w-10 !h-10"
                size="large"
              />
              <InputNumber
                min={1}
                max={6}
                value={meses}
                onChange={(v) => v && setMeses(v)}
                controls={false}
                className="!w-20 text-center [&_input]:!text-center"
                size="large"
              />
              <Button
                icon={<PlusOutlined />}
                onClick={() => setMeses((v) => Math.min(6, v + 1))}
                disabled={meses >= 6}
                className="!w-10 !h-10 !border-[#0d2772] !text-[#0d2772]"
                size="large"
              />
            </div>

            <Divider className="!my-0" />

            {/* Dates info */}
            <div className={`flex flex-col gap-1 ${isMobile ? '' : ''}`}>
              <div className="flex flex-wrap gap-1 items-center">
                <Text className="text-sm">Você terá acesso ao conteúdo até</Text>
                <Text className="text-sm">{accessDate} (fim do período pago)</Text>
              </div>
              <div className="flex flex-wrap gap-1 items-center">
                <Text className="text-sm">Pausa na cobrança até:</Text>
                <Text className="text-sm">{pauseDate}</Text>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-3 w-full">
            <Button
              type="primary"
              size="large"
              icon={<PauseCircleOutlined />}
              block
              onClick={() => navigate(`/assinaturas/${contrato}/suspensao/motivos?meses=${meses}&pauseDate=${encodeURIComponent(pauseDate)}`)}
            >
              Suspender assinatura por {meses} {meses === 1 ? 'mês' : 'meses'}
            </Button>
            <Button
              danger
              ghost
              size="large"
              icon={<CloseOutlined />}
              block
              onClick={() => navigate(`/assinaturas/${contrato}/cancelamento/motivos`)}
            >
              Cancelar Assinatura
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
