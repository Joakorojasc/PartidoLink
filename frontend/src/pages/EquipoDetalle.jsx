import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Trophy, Star, AlertTriangle, Users, MessageCircle } from 'lucide-react'
import AppLayout from '../components/AppLayout'
import api from '../api/client'
import useAuthStore from '../stores/authStore'

function StatBadge({ label, value, color }) {
  return (
    <div className={`text-center px-6 py-4 rounded-xl ${color}`}>
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-white/60 text-xs mt-1">{label}</div>
    </div>
  )
}

function formatDate(dt) {
  if (!dt) return 'Por confirmar'
  return new Date(dt).toLocaleDateString('es-CL', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function EquipoDetalle() {
  const { id } = useParams()
  const { user } = useAuthStore()
  const [team, setTeam] = useState(null)
  const [stats, setStats] = useState(null)
  const [matches, setMatches] = useState([])
  const [tab, setTab] = useState('validated')
  const [ratings, setRatings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      api.get(`/teams/${id}`),
      api.get(`/teams/${id}/stats`),
      api.get(`/teams/${id}/matches`, { params: { filter: tab } })
    ]).then(([teamRes, statsRes, matchRes]) => {
      setTeam(teamRes.data)
      setStats(statsRes.data)
      setMatches(matchRes.data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [id])

  useEffect(() => {
    api.get(`/teams/${id}/matches`, { params: { filter: tab } })
      .then(r => setMatches(r.data))
      .catch(() => {})
  }, [tab])

  const handleJoin = async () => {
    await api.post(`/teams/${id}/join`)
    alert('¡Te uniste al equipo!')
  }

  if (loading) return <AppLayout><div className="text-white/40 text-center py-20">Cargando...</div></AppLayout>
  if (!team) return <AppLayout><div className="text-white/40 text-center py-20">Equipo no encontrado.</div></AppLayout>

  const isMember = user && team.members?.some(m => m.id === user.id)

  return (
    <AppLayout>
      {/* Header */}
      <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-8 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-[#14532d] rounded-2xl flex items-center justify-center text-[#84cc16] font-bold text-2xl">
              {team.name?.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">{team.name}</h1>
              <div className="flex items-center gap-3 text-white/50 text-sm">
                <span>{team.sport?.icon} {team.sport?.name}</span>
                <span>·</span>
                <span>{team.commune}</span>
                {team.is_open && <span className="bg-[#84cc16]/20 text-[#84cc16] text-xs px-2 py-1 rounded-full">Abierto</span>}
              </div>
              {team.description && <p className="text-white/40 text-sm mt-2 max-w-md">{team.description}</p>}
            </div>
          </div>
          <div className="flex gap-2">
            {!isMember && team.is_open && (
              <button onClick={handleJoin}
                className="bg-[#84cc16] text-[#14532d] px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#a3e635] transition-colors"
              >
                <Users size={15} className="inline mr-2" />
                Unirse
              </button>
            )}
          </div>
        </div>

        {/* Record */}
        {stats && (
          <div className="flex gap-4 mt-6">
            <StatBadge label="Victorias" value={stats.overall?.wins ?? 0} color="bg-green-900/30" />
            <StatBadge label="Empates"   value={stats.overall?.draws ?? 0} color="bg-yellow-900/30" />
            <StatBadge label="Derrotas"  value={stats.overall?.losses ?? 0} color="bg-red-900/30" />
            <StatBadge label="Partidos"  value={stats.total_matches ?? 0} color="bg-white/5" />
            {stats.rejection_count > 0 && (
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-5 py-4">
                <AlertTriangle size={16} className="text-red-400" />
                <div>
                  <div className="text-red-400 font-bold text-xl">{stats.rejection_count}</div>
                  <div className="text-red-400/70 text-xs">Resultados rechazados</div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          {/* Match History */}
          <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6">
            <h2 className="text-white font-semibold mb-4">Historial de partidos</h2>
            <div className="flex gap-2 mb-4">
              {[['validated', 'Validados'], ['all', 'Todos'], ['disputed', 'Disputados']].map(([val, label]) => (
                <button key={val} onClick={() => setTab(val)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    tab === val ? 'bg-[#14532d] text-[#84cc16]' : 'text-white/40 hover:text-white'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            {matches.length === 0 ? (
              <p className="text-white/30 text-sm py-8 text-center">Sin partidos en esta categoría.</p>
            ) : (
              <div className="space-y-3">
                {matches.map(m => (
                  <div key={m.id} className="flex items-center justify-between p-4 bg-white/3 rounded-xl">
                    <div>
                      <p className="text-white text-sm font-medium">
                        {m.home_team?.name} vs {m.away_team?.name}
                      </p>
                      <p className="text-white/40 text-xs">{formatDate(m.scheduled_at)} · {m.sport?.name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {m.results?.[0] && (
                        <span className="text-white font-bold text-sm">
                          {m.results[0].home_score} - {m.results[0].away_score}
                        </span>
                      )}
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        m.status === 'played' ? 'bg-green-900/30 text-green-400' :
                        m.status === 'disputed' ? 'bg-red-900/30 text-red-400' :
                        'bg-white/10 text-white/50'
                      }`}>
                        {m.status === 'played' ? 'Validado' : m.status === 'disputed' ? 'Disputado' : 'Programado'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Roster */}
        <div className="space-y-4">
          <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6">
            <h2 className="text-white font-semibold mb-4">Plantilla</h2>
            <div className="space-y-3">
              {team.members?.map(m => (
                <div key={m.id} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#14532d]/50 rounded-full flex items-center justify-center text-[#84cc16] text-xs font-bold">
                    {m.name?.charAt(0)}
                  </div>
                  <span className="text-white text-sm">{m.name}</span>
                  {m.id === team.captain?.id && (
                    <span className="text-xs text-[#84cc16] ml-auto">Capitán</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Avg rating */}
          {team.average_rating && (
            <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6">
              <h2 className="text-white font-semibold mb-3">Valoración</h2>
              <div className="flex items-center gap-2">
                <Star size={20} className="text-yellow-400 fill-yellow-400" />
                <span className="text-white text-2xl font-bold">{team.average_rating}</span>
                <span className="text-white/40 text-sm">/ 5</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  )
}
