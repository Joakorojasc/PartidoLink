import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Trophy, MapPin, Calendar } from 'lucide-react'
import AppLayout from '../components/AppLayout'
import useMatchStore from '../stores/matchStore'
import api from '../api/client'

const communes = ['Providencia', 'Las Condes', 'Ñuñoa', 'Santiago Centro', 'Vitacura', 'La Florida', 'Macul', 'San Miguel']

function formatDate(dt) {
  if (!dt) return 'Por confirmar'
  return new Date(dt).toLocaleDateString('es-CL', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

export default function Partidos() {
  const { openMatches, fetchOpenMatches, loading } = useMatchStore()
  const [sports, setSports] = useState([])
  const [filters, setFilters] = useState({ sport_id: '', commune: '' })

  useEffect(() => {
    api.get('/sports').then(r => setSports(r.data)).catch(() => {})
  }, [])

  useEffect(() => {
    fetchOpenMatches(filters)
  }, [filters])

  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Partidos abiertos</h1>
          <p className="text-white/40">Encuentra un rival o publica tu propio partido.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        <select
          value={filters.sport_id}
          onChange={e => setFilters(f => ({ ...f, sport_id: e.target.value }))}
          className="bg-white/5 border border-white/10 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#84cc16]/50"
        >
          <option value="">Todos los deportes</option>
          {sports.map(s => <option key={s.id} value={s.id}>{s.icon} {s.name}</option>)}
        </select>
        <select
          value={filters.commune}
          onChange={e => setFilters(f => ({ ...f, commune: e.target.value }))}
          className="bg-white/5 border border-white/10 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#84cc16]/50"
        >
          <option value="">Todas las comunas</option>
          {communes.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="text-white/40 text-center py-20">Cargando partidos...</div>
      ) : openMatches.length === 0 ? (
        <div className="text-center py-20">
          <Trophy size={48} className="text-white/10 mx-auto mb-4" />
          <p className="text-white/40">No hay partidos abiertos con esos filtros.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {openMatches.map(m => (
            <Link key={m.id} to={`/partidos/${m.id}`}
              className="bg-white/[0.03] border border-white/8 rounded-2xl p-6 hover:border-[#84cc16]/30 transition-colors group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-3xl">{m.sport?.icon}</div>
                <span className="bg-[#84cc16]/20 text-[#84cc16] text-xs px-2.5 py-1 rounded-full font-medium">Abierto</span>
              </div>
              <h3 className="text-white font-semibold mb-1 group-hover:text-[#84cc16] transition-colors">
                {m.home_team?.name}
              </h3>
              <p className="text-white/50 text-sm mb-1">vs {m.away_team?.name}</p>
              <div className="flex items-center gap-4 mt-4 text-white/30 text-xs">
                <span className="flex items-center gap-1">
                  <MapPin size={11} /> {m.commune}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar size={11} /> {formatDate(m.scheduled_at)}
                </span>
              </div>
              {m.venue && (
                <p className="text-white/25 text-xs mt-2">{m.venue.name}</p>
              )}
            </Link>
          ))}
        </div>
      )}
    </AppLayout>
  )
}
