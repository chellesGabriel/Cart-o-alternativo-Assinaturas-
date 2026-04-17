import { Drawer } from 'antd'
import { useNavigate, useLocation } from 'react-router-dom'

interface Props {
  isMobile: boolean
  open: boolean
  onClose: () => void
}

interface MenuItem {
  key: string
  label: string
}

interface MenuGroup {
  label: string
  items: MenuItem[]
}

const standalone: MenuItem[] = [
  { key: 'inicio', label: 'Início' },
]

const groups: MenuGroup[] = [
  {
    label: 'CONTA',
    items: [
      { key: 'info-pessoais', label: 'Informações pessoais' },
      { key: 'senha-seguranca', label: 'Senha e segurança' },
      { key: 'apps-autorizados', label: 'Apps autorizados' },
      { key: 'sessoes-ativas', label: 'Sessões ativas' },
      { key: 'notificacoes', label: 'Notificações' },
    ],
  },
  {
    label: 'COMPRAS',
    items: [
      { key: 'assinaturas', label: 'Minhas assinaturas' },
      { key: 'meios-pagamento', label: 'Meus cartões' },
    ],
  },
]

const routeMap: Record<string, string> = {
  assinaturas: '/assinaturas',
  'meios-pagamento': '/formas-pagamento',
}

function getSelectedKey(pathname: string): string {
  if (pathname.startsWith('/assinaturas')) return 'assinaturas'
  if (pathname === '/formas-pagamento') return 'meios-pagamento'
  return ''
}

function NavContent({
  selectedKey,
  onSelect,
}: {
  selectedKey: string
  onSelect: (key: string) => void
}) {
  return (
    <nav className="flex flex-col pt-8">
      {/* Standalone items */}
      {standalone.map((item) => (
        <div
          key={item.key}
          className={`flex items-center gap-2 px-4 py-1 cursor-pointer w-[248px] ${
            selectedKey === item.key ? 'font-bold' : ''
          }`}
          onClick={() => onSelect(item.key)}
        >
          <span className="w-6 h-6 flex-shrink-0" />
          <span className="text-base leading-6 text-black truncate">{item.label}</span>
        </div>
      ))}

      {/* Groups */}
      {groups.map((group) => (
        <div key={group.label} className="flex flex-col">
          {/* Group header with line separator */}
          <div className="flex items-center gap-4 h-9 pr-4 py-4 w-[248px]">
            <div className="w-[30px] h-px bg-black/20 flex-shrink-0" />
            <span className="text-sm leading-[22px] text-black/65 w-40">
              {group.label}
            </span>
          </div>

          {/* Group items */}
          <div className="flex flex-col pb-4">
            {group.items.map((item) => {
              const isActive = selectedKey === item.key

              return (
                <div
                  key={item.key}
                  className={`flex items-center gap-2 px-4 py-1 cursor-pointer w-[248px] hover:bg-black/[0.04] transition-colors ${
                    isActive ? 'font-bold' : ''
                  }`}
                  onClick={() => onSelect(item.key)}
                >
                  {/* Yellow bullet for active, empty space for inactive */}
                  <span className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                    {isActive && (
                      <span className="w-2.5 h-2.5 rounded-full bg-[#FFBC00]" />
                    )}
                  </span>
                  <span
                    className={`text-base leading-6 text-black truncate ${
                      isActive ? 'font-bold' : 'font-normal'
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </nav>
  )
}

export default function AppSidebar({ isMobile, open, onClose }: Props) {
  const navigate = useNavigate()
  const location = useLocation()
  const selectedKey = getSelectedKey(location.pathname)

  const handleSelect = (key: string) => {
    const route = routeMap[key]
    if (route) navigate(route)
    if (isMobile) onClose()
  }

  if (isMobile) {
    return (
      <Drawer
        placement="left"
        open={open}
        onClose={onClose}
        width={280}
        styles={{ body: { padding: 0 } }}
        title="Menu"
      >
        <NavContent selectedKey={selectedKey} onSelect={handleSelect} />
      </Drawer>
    )
  }

  return (
    <aside className="w-[248px] min-h-screen border-r border-gray-200 bg-white flex-shrink-0">
      <NavContent selectedKey={selectedKey} onSelect={handleSelect} />
    </aside>
  )
}
