import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import useAuthStore from './stores/authStore'

import Landing from './pages/Landing'
import Login from './pages/Login'
import Registro from './pages/Registro'
import Dashboard from './pages/Dashboard'
import Equipos from './pages/Equipos'
import NuevoEquipo from './pages/NuevoEquipo'
import EquipoDetalle from './pages/EquipoDetalle'
import Canchas from './pages/Canchas'
import CanchaDetalle from './pages/CanchaDetalle'
import Partidos from './pages/Partidos'
import PartidoDetalle from './pages/PartidoDetalle'
import Mensajes from './pages/Mensajes'
import MensajeDetalle from './pages/MensajeDetalle'
import Perfil from './pages/Perfil'
import PerfilPublico from './pages/PerfilPublico'
import NuevoPartido from './pages/NuevoPartido'
import Mapa from './pages/Mapa'
import PrivateRoute from './components/PrivateRoute'

export default function App() {
  const { fetchMe, token } = useAuthStore()

  useEffect(() => {
    if (token) fetchMe()
  }, [token])

  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />

        {/* Public browse (no auth required) */}
        <Route path="/partidos" element={<Partidos />} />
        <Route path="/partidos/:id" element={<PartidoDetalle />} />
        <Route path="/equipos" element={<Equipos />} />
        <Route path="/equipos/:id" element={<EquipoDetalle />} />
        <Route path="/canchas" element={<Canchas />} />
        <Route path="/canchas/:id" element={<CanchaDetalle />} />
        <Route path="/mapa" element={<Mapa />} />
        <Route path="/perfil/:id" element={<PerfilPublico />} />

        {/* Private */}
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/equipos/nuevo" element={<PrivateRoute><NuevoEquipo /></PrivateRoute>} />
        <Route path="/partidos/nuevo" element={<PrivateRoute><NuevoPartido /></PrivateRoute>} />
        <Route path="/mensajes" element={<PrivateRoute><Mensajes /></PrivateRoute>} />
        <Route path="/mensajes/:id" element={<PrivateRoute><MensajeDetalle /></PrivateRoute>} />
        <Route path="/perfil" element={<PrivateRoute><Perfil /></PrivateRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
