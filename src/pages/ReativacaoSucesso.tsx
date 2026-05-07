import { Typography, Button } from 'antd'
import {
  CheckCircleOutlined,
  CloseOutlined,
} from '@ant-design/icons'
import { useParams, useNavigate } from 'react-router-dom'
import { subscriptionDetails } from '../data/mockData'
import { useIsMobile } from '../hooks/useIsMobile'
import eduzzContaLogo from '../assets/eduzz-conta-logo.png'
import mobileTopbarIcon from '../assets/mobile-topbar-icon.svg'

const { Title, Text } = Typography

export default function ReativacaoSucesso() {
  const { contrato } = useParams<{ contrato: string }>()
  const navigate = useNavigate()
  const isMobile = useIsMobile()

  const detail = contrato ? subscriptionDetails[contrato] : null

  if (!detail) {
    navigate('/assinaturas')
    return null
  }

  const productLabel = `${detail.produto} (${detail.contrato})`

  const handleClose = () => {
    navigate('/assinaturas')
  }

  return (
    <div className="fixed inset-0 z-[1000] flex flex-col bg-[#f0f0f0]">
      {/* Topbar - no progress bar */}
      <div className="bg-white border-b border-[#d9d9d9] flex items-center justify-between px-4 md:px-8 py-2 shrink-0">
        <div className="flex items-center gap-4 min-w-0">
          {isMobile ? (
            <img src={mobileTopbarIcon} alt="Eduzz" className="h-10 w-auto shrink-0" />
          ) : (
            <img src={eduzzContaLogo} alt="MyEduzz" className="h-8 shrink-0" />
          )}
          {!isMobile && (
            <Text className="text-sm truncate">
              Reativar assinatura <span className="text-black/65 px-1">|</span> {productLabel}
            </Text>
          )}
        </div>
        <Button type="text" onClick={handleClose} className="!flex items-center gap-2 shrink-0">
          Fechar <CloseOutlined className="!text-xs" />
        </Button>
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
            isMobile ? 'w-full mt-4 pb-20 mb-16' : 'w-[560px] mt-16 rounded-lg h-fit'
          }`}
        >
          {/* Icon + Title + Description */}
          <div className="flex flex-col gap-8 items-center w-full">
            <CheckCircleOutlined className="!text-[64px] !text-[#52c41a]" />
            <div className="flex flex-col gap-4 items-center w-full">
              <Title
                level={isMobile ? 3 : 2}
                className="!mb-0 text-center"
                style={{ color: '#52c41a' }}
              >
                Sua assinatura está reativada
              </Title>
              <Text className="text-sm text-center">
                Seu acesso foi restaurado. Boas-vindas de volta ao{' '}
                <Text strong>{detail.produto}</Text>
              </Text>
            </div>
          </div>

          {/* Button + footer text */}
          <div className="flex flex-col gap-4 w-full">
            <Button
              type="primary"
              size="large"
              block
              onClick={handleClose}
            >
              Voltar para minhas assinaturas
            </Button>
            <Text type="secondary" className="text-xs text-center block">
              Enviamos uma confirmação dessa ação em seu e-mail.
            </Text>
          </div>
        </div>
      </div>
    </div>
  )
}
