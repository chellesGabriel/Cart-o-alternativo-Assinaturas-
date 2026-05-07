import { useState, useEffect } from 'react'
import { Typography, Button, Checkbox, Input, Alert, Modal } from 'antd'
import {
  PauseCircleOutlined,
  CloseOutlined,
  SyncOutlined,
} from '@ant-design/icons'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { subscriptionDetails, updateSubscriptionStatus } from '../data/mockData'
import { useIsMobile } from '../hooks/useIsMobile'
import eduzzContaLogo from '../assets/eduzz-conta-logo.png'
import mobileTopbarIcon from '../assets/mobile-topbar-icon.svg'

const { Title, Text } = Typography

const MOTIVOS = [
  'No momento, não posso manter esse gasto',
  'Não tenho tempo para consumir o conteúdo agora',
  'O conteúdo ainda não está completo',
]

export default function MotivosSuspensao() {
  const { contrato } = useParams<{ contrato: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const isMobile = useIsMobile()

  const meses = Number(searchParams.get('meses')) || 1
  const pauseDate = searchParams.get('pauseDate') || ''

  const [selected, setSelected] = useState<string[]>([])
  const [outroMotivo, setOutroMotivo] = useState('')
  const [outroChecked, setOutroChecked] = useState(false)
  const [processing, setProcessing] = useState(false)

  const detail = contrato ? subscriptionDetails[contrato] : null

  if (!detail) {
    navigate('/assinaturas')
    return null
  }

  const productLabel = `${detail.produto} (${detail.contrato})`

  const handleClose = () => {
    navigate(`/assinaturas/${contrato}`)
  }

  const handleVoltar = () => {
    navigate(`/assinaturas/${contrato}/suspensao`)
  }

  const toggleMotivo = (motivo: string) => {
    setSelected((prev) =>
      prev.includes(motivo) ? prev.filter((m) => m !== motivo) : [...prev, motivo]
    )
  }

  const handleConfirmar = () => {
    setProcessing(true)
  }

  useEffect(() => {
    if (!processing) return
    const timer = setTimeout(() => {
      updateSubscriptionStatus(contrato!, 'Suspenso')
      navigate(`/assinaturas/${contrato}/suspensao/sucesso?pauseDate=${encodeURIComponent(pauseDate)}`)
    }, 2500)
    return () => clearTimeout(timer)
  }, [processing, contrato, pauseDate, navigate, detail])

  const hasSelection = selected.length > 0 || outroChecked

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
            <Text className="text-sm whitespace-nowrap">Etapa 2 de 2</Text>
          ) : (
            <Text className="text-sm truncate">
              Suspender assinatura <span className="text-black/65 px-1">|</span> {productLabel}
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
          <Text className="text-xs block text-black/88">Suspender assinatura</Text>
          <Text className="text-xs block text-black/88">{productLabel}</Text>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-auto flex justify-center">
        <div
          className={`bg-white flex flex-col gap-6 p-4 md:p-6 ${
            isMobile ? 'w-full mt-4' : 'w-[560px] mt-16 rounded-lg h-fit'
          }`}
        >
          {/* Title + Checkbox list */}
          <div className="flex flex-col gap-4 w-full">
            <Title level={5} className="!mb-0">
              Por que suspender sua assinatura?
            </Title>

            <div className="flex flex-col gap-2 w-full">
              {MOTIVOS.map((motivo) => (
                <div
                  key={motivo}
                  className={`border rounded p-3 cursor-pointer transition-colors ${
                    selected.includes(motivo) ? 'border-[#0d2772]' : 'border-[#d9d9d9]'
                  }`}
                  onClick={() => toggleMotivo(motivo)}
                >
                  <Checkbox checked={selected.includes(motivo)}>
                    {motivo}
                  </Checkbox>
                </div>
              ))}

              {/* Outro motivo */}
              <div
                className={`border rounded p-3 flex flex-col gap-2.5 transition-colors ${
                  outroChecked ? 'border-[#0d2772]' : 'border-[#d9d9d9]'
                }`}
              >
                <div
                  className="cursor-pointer"
                  onClick={() => setOutroChecked((v) => !v)}
                >
                  <Checkbox checked={outroChecked}>
                    Outro motivo
                  </Checkbox>
                </div>
                {outroChecked && (
                  <Input
                    size="large"
                    placeholder="Descreva o motivo"
                    value={outroMotivo}
                    onChange={(e) => setOutroMotivo(e.target.value)}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Warning alert */}
          <Alert
            type="warning"
            message={
              <Text className="text-sm">
                Sua assinatura será pausada por {meses} {meses === 1 ? 'mês' : 'meses'}.{' '}
                <Text strong>Será retomada automaticamente em {pauseDate}</Text>
              </Text>
            }
            showIcon
          />

          {/* Action buttons */}
          <div className="flex flex-col gap-3 w-full">
            <Button
              type="primary"
              size="large"
              icon={<PauseCircleOutlined />}
              block
              disabled={!hasSelection}
              onClick={handleConfirmar}
            >
              Confirmar suspensão
            </Button>
            <Button
              size="large"
              block
              onClick={handleVoltar}
            >
              Voltar
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
              Suspendendo assinatura...
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
