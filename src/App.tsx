import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AppHeader from './components/AppHeader'
import AppSidebar from './components/AppSidebar'
import MinhasFormasPagamento from './pages/MinhasFormasPagamento'
import Assinaturas from './pages/Assinaturas'
import AssinaturaDetalhe from './pages/AssinaturaDetalhe'
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
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
