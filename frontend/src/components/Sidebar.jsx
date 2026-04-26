import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Home, Users, MapPin, Trophy, MessageCircle, User, LogOut, Zap } from 'lucide-react'
import useAuthStore from '../stores/authStore'

const navItems = [
  { to: '/dashboard', icon: Home,          label: 'Inicio' },
  { to: '/equipos',   icon: Users,          label: 'Equipos' },
  { to: '/canchas',   icon: MapPin,         label: 'Canchas' },
  { to: '/partidos',  icon: Trophy,         label: 'Partidos' },
  { to: '/mensajes',  icon: MessageCircle,  label: 'Mensajes' },
  { to: '/perfil',    icon: User,           label: 'Mi Perfil' },
]

export default function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-[#111111] border-r border-white/5 flex flex-col z-40">
      {/* Logo */}
      <div className="p-6 border-b border-white/5">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#84cc16] rounded-lg flex items-center justify-center">
            <Zap size={18} className="text-[#14532d]" />
          </div>
          <span className="text-white font-bold text-lg tracking-tight">PartidoLink</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => {
          const active = location.pathname.startsWith(to)
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                active
                  ? 'bg-[#14532d] text-[#84cc16]'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* User */}
      {user && (
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-[#14532d] flex items-center justify-center text-[#84cc16] font-bold text-sm">
              {user.name?.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">{user.name}</p>
              <p className="text-white/40 text-xs truncate">{user.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-white/50 hover:text-red-400 hover:bg-white/5 rounded-lg text-sm transition-all"
          >
            <LogOut size={15} />
            Cerrar sesión
          </button>
        </div>
      )}
    </aside>
  )
}
