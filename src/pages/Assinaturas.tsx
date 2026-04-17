import { Typography, Tag, Card, Table, Empty } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { RightOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { subscriptions, subscriptionDetails, type Subscription } from '../data/mockData'
import { useIsMobile } from '../hooks/useIsMobile'

const { Title, Text } = Typography

const statusColor: Record<string, string> = {
  'Em dia': 'green',
  Suspenso: 'orange',
  Cancelado: 'default',
}

function splitProduto(produto: string): { nome: string; id: string } {
  const match = produto.match(/^(.+?)\s*\((\d+)\)$/)
  if (match) return { nome: match[1].trim(), id: match[2] }
  return { nome: produto, id: '' }
}

const columns: ColumnsType<Subscription> = [
  {
    title: 'Contrato',
    dataIndex: 'contrato',
    key: 'contrato',
    width: 95,
    render: (text: string, record: Subscription) => (
      <div className="flex flex-col gap-1">
        <span className="text-sm text-[rgba(0,0,0,0.85)]">{text}</span>
        <Tag color={statusColor[record.status]} className="!text-xs w-fit !m-0">
          {record.status}
        </Tag>
      </div>
    ),
  },
  {
    title: 'Início',
    dataIndex: 'inicio',
    key: 'inicio',
    width: 107,
    render: (text: string) => (
      <span className="text-sm text-[rgba(0,0,0,0.85)]">{text}</span>
    ),
  },
  {
    title: 'Produto',
    dataIndex: 'produto',
    key: 'produto',
    width: 169,
    render: (text: string) => {
      const { nome, id } = splitProduto(text)
      return (
        <div className="flex flex-col gap-1">
          <span className="text-sm text-[rgba(0,0,0,0.85)] truncate">{nome}</span>
          {id && <span className="text-sm text-[rgba(0,0,0,0.85)]">({id})</span>}
        </div>
      )
    },
  },
  {
    title: 'Cobrança',
    dataIndex: 'cobranca',
    key: 'cobranca',
    width: 90,
    render: (text: string) => (
      <span className="text-sm text-[rgba(0,0,0,0.85)]">{text}</span>
    ),
  },
  {
    title: 'Próx. Vencimento',
    dataIndex: 'proxVencimento',
    key: 'proxVencimento',
    width: 155,
    render: (text: string) => (
      <span className="text-sm text-[rgba(0,0,0,0.85)]">{text}</span>
    ),
  },
  {
    title: 'Valor',
    dataIndex: 'valor',
    key: 'valor',
    width: 150,
    render: (text: string) => (
      <span className="text-sm text-[rgba(0,0,0,0.85)]">{text}</span>
    ),
  },
  {
    title: 'Avaliação',
    key: 'avaliacao',
    width: 150,
    render: () => (
      <span className="text-sm text-[#153fb8] cursor-pointer hover:underline">
        Avaliar produto
      </span>
    ),
  },
  {
    title: '',
    key: 'action',
    width: 52,
    render: () => (
      <div className="flex items-center justify-center">
        <RightOutlined className="text-xs text-gray-400" />
      </div>
    ),
  },
]

const sortedSubscriptions = [...subscriptions].sort((a, b) => {
  const parseDate = (d: string) => {
    if (d === '-') return 0
    const [day, month, year] = d.split('/')
    return new Date(+year, +month - 1, +day).getTime()
  }
  return parseDate(b.inicio) - parseDate(a.inicio)
})

function MobileSubscriptionCard({
  sub,
  onClick,
}: {
  sub: Subscription
  onClick: () => void
}) {
  const detail = subscriptionDetails[sub.contrato]
  const { nome, id } = splitProduto(sub.produto)
  return (
    <Card size="small" className="!cursor-pointer" onClick={onClick}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {detail && (
            <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
              <img
                src={detail.imagemProduto}
                alt={sub.produto}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-0.5">
              <Text strong className="text-sm">{sub.contrato}</Text>
              <Tag color={statusColor[sub.status]} className="text-xs !m-0">
                {sub.status}
              </Tag>
            </div>
            <Text className="text-sm block truncate">{nome} {id && `(${id})`}</Text>
            <div className="flex items-center gap-3 mt-0.5">
              <Text type="secondary" className="!text-xs">{sub.valor}</Text>
              <Text type="secondary" className="!text-xs">Venc: {sub.proxVencimento}</Text>
            </div>
          </div>
        </div>
        <RightOutlined className="text-gray-400 ml-2 flex-shrink-0" />
      </div>
    </Card>
  )
}

export default function Assinaturas() {
  const navigate = useNavigate()
  const isMobile = useIsMobile()

  const handleSelectSubscription = (contrato: string) => {
    navigate(`/assinaturas/${contrato}`)
  }

  return (
    <div className="flex-1 bg-[#fafafa] min-h-screen">
      <div className="px-4 py-4 md:px-8 md:py-8">
        {/* Page title */}
        <Title level={3} className="!mb-1 !text-xl md:!text-2xl" style={{ color: 'rgba(0,0,0,0.85)' }}>
          Minhas assinaturas
        </Title>
        <Text style={{ color: 'rgba(0,0,0,0.85)' }} className="text-sm md:text-base">
          Veja todas as suas assinaturas feitas através da Eduzz.
        </Text>

        {/* Subscriptions list */}
        <div className="mt-6 md:mt-8">
          {sortedSubscriptions.length === 0 ? (
            <Card>
              <Empty
                description="Nenhuma assinatura encontrada"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            </Card>
          ) : isMobile ? (
            <div className="flex flex-col gap-2">
              {sortedSubscriptions.map((sub) => (
                <MobileSubscriptionCard
                  key={sub.contrato}
                  sub={sub}
                  onClick={() => handleSelectSubscription(sub.contrato)}
                />
              ))}
            </div>
          ) : (
            <Table
              columns={columns}
              dataSource={sortedSubscriptions}
              rowKey="contrato"
              pagination={false}
              onRow={(record) => ({
                onClick: () => handleSelectSubscription(record.contrato),
                className: 'cursor-pointer',
              })}
              size="middle"
              bordered={false}
            />
          )}
        </div>
      </div>
    </div>
  )
}
