import { useState } from 'react'
import { Typography, Button, Checkbox, Input, Divider } from 'antd'
import { X } from 'lucide-react'
import { useParams, useNavigate } from 'react-router-dom'
import { subscriptionDetails } from '../data/mockData'
import { useIsMobile } from '../hooks/useIsMobile'
import eduzzContaLogo from '../assets/eduzz-conta-logo.png'
import mobileTopbarIcon from '../assets/mobile-topbar-icon.svg'

const { Title, Text, } = Typography
const { TextArea } = Input

const MOTIVOS = [
  'O custo mensal está alto para mim',
  'O conteúdo não atendeu minhas expectativas',
  'Não estou usando mais ou já consegui o que precisava',
  'Encontrei uma alternativa melhor',
  'Tive problemas para acessar ou usar o conteúdo',
  'Tive problemas com pagamento, cobrança ou renovação',
  'Comprei por impulso e me arrependi',
]

export default function MotivosCancelamento() {
  const { contrato } = useParams<{ contrato: string }>()
  const navigate = useNavigate()
  const isMobile = useIsMobile()

  const [selected, setSelected] = useState<string[]>([])
  const [outroChecked, setOutroChecked] = useState(false)
  const [outroMotivo, setOutroMotivo] = useState('')
  const [comentario, setComentario] = useState('')

  const detail = contrato ? subscriptionDetails[contrato] : null

  if (!detail) {
    navigate('/assinaturas')
    return null
  }

  const productLabel = `${detail.produto} (${detail.contrato})`

  const handleClose = () => navigate(`/assinaturas/${contrato}`)
  const handleVoltar = () => navigate(`/assinaturas/${contrato}/suspensao`)

  const toggleMotivo = (m: string) => {
    setSelected((prev) => prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m])
  }

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
            <Text className="text-sm whitespace-nowrap">Etapa 2 de 3</Text>
          ) : (
            <Text className="text-sm truncate">
              Cancelar assinatura <span className="text-black/65 px-1">|</span> {productLabel}
            </Text>
          )}
        </div>
        <Button type="text" onClick={handleClose} className="!flex items-center gap-2 shrink-0">
          Fechar <X size={12} />
        </Button>
      </div>

      {/* Progress bar ~60% */}
      <div className="relative h-1 bg-black/15 shrink-0">
        <div className="absolute left-0 top-0 h-full bg-[#FFBC00] w-3/5" />
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
        <div className={`bg-white flex flex-col gap-6 p-4 md:p-6 ${isMobile ? 'w-full mt-4 pb-20 mb-16' : 'w-[560px] mt-16 rounded-lg h-fit'}`}>
          <div className="flex flex-col gap-4 w-full">
            <Title level={5} className="!mb-0">Por que cancelar sua assinatura?</Title>

            <div className="flex flex-col gap-4 w-full">
              {MOTIVOS.map((m) => (
                <Checkbox key={m} checked={selected.includes(m)} onChange={() => toggleMotivo(m)}>
                  {m}
                </Checkbox>
              ))}
              <div className="flex flex-col gap-1">
                <Checkbox checked={outroChecked} onChange={() => setOutroChecked((v) => !v)}>
                  Outro motivo. Qual?
                </Checkbox>
                {outroChecked && (
                  <Input
                    size="large"
                    placeholder="Descreva o motivo"
                    value={outroMotivo}
                    onChange={(e) => setOutroMotivo(e.target.value)}
                    className="!ml-6"
                    style={{ width: 'calc(100% - 24px)' }}
                  />
                )}
              </div>
            </div>

            <Divider className="!my-0" />

            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1">
                <Text className="text-sm">Gostaria de comentar mais sobre sua experiência?</Text>
                <Text type="secondary" className="text-xs">(Opcional)</Text>
              </div>
              <TextArea
                rows={2}
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 w-full">
            <Button
              type="primary"
              size="large"
              block
              disabled={!hasSelection}
              onClick={() => navigate(`/assinaturas/${contrato}/cancelamento/confirmar`)}
            >
              Próxima etapa
            </Button>
            <Button size="large" block onClick={handleVoltar}>
              Voltar
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
