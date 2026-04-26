import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Home, Users, MapPin, Trophy, MessageCircle, User, LogOut, Zap, ChevronRight, X } from 'lucide-react'
import useAuthStore from '../stores/authStore'

const navItems = [
  { to: '/dashboard', icon: Home,          label: 'Inicio' },
  { to: '/equipos',   icon: Users,         label: 'Equipos' },
  { to: '/canchas',   icon: MapPin,        label: 'Canchas' },
  { to: '/partidos',  icon: Trophy,        label: 'Partidos' },
  { to: '/mensajes',  icon: MessageCircle, label: 'Mensajes' },
  { to: '/perfil',    icon: User,          label: 'Mi Perfil' },
]

export default function Sidebar({ mobileOpen = false, onClose }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  const handleLogout = async () => {
    await logout()
    onClose?.()
    navigate('/')
  }

  const handleNavClick = () => {
    onClose?.()
  }

  return (
    <aside className={`sidebar${mobileOpen ? ' sidebar-mobile-open' : ''}`}>
      {/* Mobile close button */}
      <button className="sidebar-close-btn" onClick={onClose} aria-label="Cerrar menú">
        <X size={16} />
      </button>

      {/* Logo */}
      <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <Link to="/dashboard" onClick={handleNavClick} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', textDecoration: 'none' }}>
          <div style={{
            width: 34, height: 34,
            background: '#84cc16',
            borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 0 20px rgba(132,204,22,0.3)'
          }}>
            <Zap size={18} color="#14532d" />
          </div>
          <span style={{ color: '#fff', fontWeight: 700, fontSize: 17, letterSpacing: '-0.3px' }}>
            PartidoLink
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '0.75rem' }}>
        {navItems.map(({ to, icon: Icon, label }) => {
          const active = to === '/dashboard'
            ? location.pathname === '/dashboard'
            : location.pathname.startsWith(to)

          return (
            <Link
              key={to}
              to={to}
              onClick={handleNavClick}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.625rem 0.875rem',
                borderRadius: '0.625rem',
                marginBottom: '0.125rem',
                textDecoration: 'none',
                fontSize: '0.875rem',
                fontWeight: active ? 600 : 500,
                color: active ? '#84cc16' : 'rgba(255,255,255,0.55)',
                background: active ? 'rgba(20,83,45,0.5)' : 'transparent',
                transition: 'background 0.15s, color 0.15s',
              }}
              onMouseEnter={e => {
                if (!active) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                  e.currentTarget.style.color = '#fff'
                }
              }}
              onMouseLeave={e => {
                if (!active) {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = 'rgba(255,255,255,0.55)'
                }
              }}
            >
              <Icon size={17} />
              <span style={{ flex: 1 }}>{label}</span>
              {active && <ChevronRight size={13} style={{ opacity: 0.5 }} />}
            </Link>
          )
        })}
      </nav>

      {/* User footer */}
      {user && (
        <div style={{ padding: '0.875rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <Link to="/perfil" onClick={handleNavClick} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.625rem',
            padding: '0.625rem',
            borderRadius: '0.625rem',
            textDecoration: 'none',
            marginBottom: '0.375rem',
            transition: 'background 0.15s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <div style={{
              width: 34, height: 34,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #14532d, #166534)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#84cc16',
              fontWeight: 700,
              fontSize: 13,
              flexShrink: 0,
            }}>
              {user.name?.charAt(0)?.toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ color: '#fff', fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.name}
              </p>
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.email}
              </p>
            </div>
          </Link>
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 0.75rem',
              borderRadius: '0.5rem',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'rgba(255,255,255,0.35)',
              fontSize: 13,
              transition: 'background 0.15s, color 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#f87171' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.35)' }}
          >
            <LogOut size={14} />
            Cerrar sesión
          </button>
        </div>
      )}
    </aside>
  )
}
