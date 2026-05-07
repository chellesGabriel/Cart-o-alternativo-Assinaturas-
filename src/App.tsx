import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AppHeader from './components/AppHeader'
import AppSidebar from './components/AppSidebar'
import MinhasFormasPagamento from './pages/MinhasFormasPagamento'
import Assinaturas from './pages/Assinaturas'
import AssinaturaDetalhe from './pages/AssinaturaDetalhe'
import SuspensaoAssinatura from './pages/SuspensaoAssinatura'
import MotivosSuspensao from './pages/MotivosSuspensao'
import SuspensaoSucesso from './pages/SuspensaoSucesso'
import ReativacaoAssinatura from './pages/ReativacaoAssinatura'
import ReativacaoSucesso from './pages/ReativacaoSucesso'
import MotivosCancelamento from './pages/MotivosCancelamento'
import ConfirmaCancelamento from './pages/ConfirmaCancelamento'
import CancelamentoSucesso from './pages/CancelamentoSucesso'
import { useIsMobile } from './hooks/useIsMobile'

function App() {
  const isMobile = useIsMobile()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <AppHeader onMenuClick={() => setSidebarOpen(true)} isMobile={isMobile} />
        <div className="flex">
          <AppSidebar
            isMobile={isMobile}
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
          <Routes>
            <Route path="/" element={<Navigate to="/assinaturas" replace />} />
            <Route path="/formas-pagamento" element={<MinhasFormasPagamento />} />
            <Route path="/assinaturas" element={<Assinaturas />} />
            <Route path="/assinaturas/:contrato" element={<AssinaturaDetalhe />} />
            <Route path="/assinaturas/:contrato/suspensao" element={<SuspensaoAssinatura />} />
            <Route path="/assinaturas/:contrato/suspensao/motivos" element={<MotivosSuspensao />} />
            <Route path="/assinaturas/:contrato/suspensao/sucesso" element={<SuspensaoSucesso />} />
            <Route path="/assinaturas/:contrato/reativacao" element={<ReativacaoAssinatura />} />
            <Route path="/assinaturas/:contrato/reativacao/sucesso" element={<ReativacaoSucesso />} />
            <Route path="/assinaturas/:contrato/cancelamento/motivos" element={<MotivosCancelamento />} />
            <Route path="/assinaturas/:contrato/cancelamento/confirmar" element={<ConfirmaCancelamento />} />
            <Route path="/assinaturas/:contrato/cancelamento/sucesso" element={<CancelamentoSucesso />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
