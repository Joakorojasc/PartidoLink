import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Trophy, Users, MapPin, ArrowRight, Calendar, Zap } from 'lucide-react'
import useAuthStore from '../stores/authStore'
import useMatchStore from '../stores/matchStore'
import AppLayout from '../components/AppLayout'
import api from '../api/client'

function formatDate(dt) {
  if (!dt) return 'Por confirmar'
  return new Date(dt).toLocaleDateString('es-CL', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

function formatCLP(n) {
  if (!n) return '-'
  return '$' + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

export default function Dashboard() {
  const { user, fetchMe } = useAuthStore()
  const { openMatches, fetchOpenMatches } = useMatchStore()
  const [teams, setTeams] = useState([])

  useEffect(() => {
    fetchMe()
    fetchOpenMatches()
    api.get('/teams').then(r => setTeams(r.data)).catch(() => {})
  }, [])

  return (
    <AppLayout>
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-1">
          Hola, {user?.name?.split(' ')[0] || 'deportista'} 👋
        </h1>
        <p className="text-white/40">Aquí está lo que está pasando hoy en PartidoLink.</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { to: '/partidos', icon: Trophy, label: 'Buscar Rival', color: 'bg-[#14532d]/50 hover:bg-[#14532d]/70' },
          { to: '/equipos/nuevo', icon: Users, label: 'Crear Equipo', color: 'bg-white/5 hover:bg-white/10' },
          { to: '/canchas', icon: MapPin, label: 'Reservar Cancha', color: 'bg-white/5 hover:bg-white/10' },
        ].map(a => (
          <Link key={a.to} to={a.to}
            className={`${a.color} border border-white/10 rounded-xl p-5 flex items-center gap-4 transition-colors`}
          >
            <div className="w-10 h-10 bg-[#84cc16]/10 rounded-lg flex items-center justify-center">
              <a.icon size={20} className="text-[#84cc16]" />
            </div>
            <span className="text-white font-medium">{a.label}</span>
            <ArrowRight size={16} className="text-white/30 ml-auto" />
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Open Matches */}
        <div className="col-span-2 bg-white/[0.03] border border-white/8 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-white font-semibold">Partidos abiertos</h2>
            <Link to="/partidos" className="text-[#84cc16] text-sm hover:underline">Ver todos</Link>
          </div>
          {openMatches.length === 0 ? (
            <p className="text-white/40 text-sm py-8 text-center">No hay partidos abiertos ahora.</p>
          ) : (
            <div className="space-y-3">
              {openMatches.slice(0, 5).map(m => (
                <Link key={m.id} to={`/partidos/${m.id}`}
                  className="flex items-center gap-4 p-4 bg-white/3 hover:bg-white/6 rounded-xl transition-colors"
                >
                  <div className="text-2xl">{m.sport?.icon || '⚽'}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">
                      {m.home_team?.name} vs {m.away_team?.name}
                    </p>
                    <p className="text-white/40 text-xs">{m.commune} · {formatDate(m.scheduled_at)}</p>
                  </div>
                  <span className="bg-[#84cc16]/20 text-[#84cc16] text-xs px-2 py-1 rounded-full font-medium">Abierto</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Teams */}
        <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-white font-semibold">Equipos</h2>
            <Link to="/equipos" className="text-[#84cc16] text-sm hover:underline">Ver todos</Link>
          </div>
          <div className="space-y-3">
            {teams.slice(0, 5).map(t => (
              <Link key={t.id} to={`/equipos/${t.id}`}
                className="flex items-center gap-3 p-3 bg-white/3 hover:bg-white/6 rounded-xl transition-colors"
              >
                <div className="w-9 h-9 bg-[#14532d] rounded-lg flex items-center justify-center text-[#84cc16] font-bold text-sm">
                  {t.name?.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{t.name}</p>
                  <p className="text-white/40 text-xs">{t.sport?.name} · {t.commune}</p>
                </div>
                {t.is_open && <span className="text-[#84cc16] text-xs">Abierto</span>}
              </Link>
            ))}
          </div>
          <Link to="/equipos/nuevo" className="mt-4 block text-center text-sm text-white/40 hover:text-white/70 transition-colors">
            + Crear equipo
          </Link>
        </div>
      </div>
    </AppLayout>
  )
}
