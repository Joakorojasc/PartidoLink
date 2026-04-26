import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Users } from 'lucide-react'
import AppLayout from '../components/AppLayout'
import api from '../api/client'

export default function Equipos() {
  const [teams, setTeams] = useState([])
  const [sports, setSports] = useState([])
  const [filters, setFilters] = useState({ sport_id: '', is_open: '' })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/sports').then(r => setSports(r.data)).catch(() => {})
  }, [])

  useEffect(() => {
    setLoading(true)
    const params = {}
    if (filters.sport_id) params.sport_id = filters.sport_id
    if (filters.is_open) params.is_open = filters.is_open
    api.get('/teams', { params }).then(r => {
      setTeams(r.data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [filters])

  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Equipos</h1>
          <p className="text-white/40">Encuentra equipos, únete o crea el tuyo.</p>
        </div>
        <Link to="/equipos/nuevo"
          className="flex items-center gap-2 bg-[#84cc16] text-[#14532d] px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#a3e635] transition-colors"
        >
          <Plus size={16} />
          Crear equipo
        </Link>
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
          value={filters.is_open}
          onChange={e => setFilters(f => ({ ...f, is_open: e.target.value }))}
          className="bg-white/5 border border-white/10 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#84cc16]/50"
        >
          <option value="">Todos los equipos</option>
          <option value="true">Solo equipos abiertos</option>
        </select>
      </div>

      {loading ? (
        <div className="text-white/40 text-center py-20">Cargando equipos...</div>
      ) : teams.length === 0 ? (
        <div className="text-white/40 text-center py-20">No se encontraron equipos.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teams.map(team => (
            <Link key={team.id} to={`/equipos/${team.id}`}
              className="bg-white/[0.03] border border-white/8 rounded-2xl p-6 hover:border-[#84cc16]/30 transition-colors group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-[#14532d] rounded-xl flex items-center justify-center text-[#84cc16] font-bold text-lg">
                  {team.name?.charAt(0)}
                </div>
                {team.is_open && (
                  <span className="bg-[#84cc16]/20 text-[#84cc16] text-xs px-2 py-1 rounded-full">Abierto</span>
                )}
              </div>
              <h3 className="text-white font-semibold mb-1 group-hover:text-[#84cc16] transition-colors">
                {team.name}
              </h3>
              <p className="text-white/40 text-sm">{team.sport?.icon} {team.sport?.name}</p>
              <p className="text-white/30 text-sm">{team.commune}</p>
              <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-2 text-white/30 text-xs">
                <Users size={12} />
                Capitán: {team.captain?.name}
              </div>
            </Link>
          ))}
        </div>
      )}
    </AppLayout>
  )
}
