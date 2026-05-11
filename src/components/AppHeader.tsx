import { Input, Typography, Avatar, Dropdown } from 'antd'
import { Search, HelpCircle, ChevronDown } from 'lucide-react'
import eduzzContaLogo from '../assets/eduzz-conta-logo.png'
import mobileTopbarIcon from '../assets/mobile-topbar-icon.svg'

const { Text } = Typography

interface Props {
  onMenuClick: () => void
  isMobile: boolean
}

export default function AppHeader({ onMenuClick, isMobile }: Props) {
  return (
    <header className="h-16 bg-white border-b border-[#f0f0f0] flex items-center px-4 md:px-8 justify-between sticky top-0 z-50">
      {/* Left */}
      <div className="flex items-center gap-4 min-w-0">
        {isMobile ? (
          <img
            src={mobileTopbarIcon}
            alt="Eduzz"
            className="h-10 w-auto flex-shrink-0 cursor-pointer"
            onClick={onMenuClick}
          />
        ) : (
          <img src={eduzzContaLogo} alt="Eduzz Conta" className="h-8 flex-shrink-0" />
        )}
      </div>

      {/* Center - Search */}
      {!isMobile && (
        <div className="flex-1 flex justify-center max-w-[345px] mx-auto">
          <Input
            prefix={<Search className="text-gray-400" size={12} />}
            placeholder="Pesquisar no Eduzz Conta"
            className="w-full"
            size="middle"
          />
        </div>
      )}

      {/* Right */}
      <div className="flex items-center gap-4">
        <HelpCircle className="text-gray-500 cursor-pointer hover:text-gray-700" size={20} />
        <Dropdown
          menu={{
            items: [
              { key: 'profile', label: 'Meu perfil', disabled: true },
              { type: 'divider' },
              { key: 'logout', label: 'Sair', danger: true },
            ],
          }}
          trigger={['click']}
        >
          <div className="flex items-center gap-2 cursor-pointer px-4 h-10">
            <Avatar size={32} src="https://i.pravatar.cc/64?img=12" />
            {!isMobile && (
              <Text strong className="text-base whitespace-nowrap">
                Carlos Ferrari
              </Text>
            )}
            <ChevronDown className="text-gray-500" size={12} />
          </div>
        </Dropdown>
      </div>
    </header>
  )
}
