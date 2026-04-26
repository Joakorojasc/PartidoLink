import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Phone, Clock } from 'lucide-react'
import AppLayout from '../components/AppLayout'
import api from '../api/client'

const communes = ['Providencia', 'Las Condes', 'Ñuñoa', 'Santiago Centro', 'Vitacura', 'La Florida', 'Macul', 'San Miguel', 'Peñalolén', 'Lo Barnechea']

function formatCLP(n) {
  if (!n) return 'Consultar precio'
  return '$' + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '/hr'
}

export default function Canchas() {
  const [venues, setVenues] = useState([])
  const [sports, setSports] = useState([])
  const [filters, setFilters] = useState({ sport_id: '', commune: '' })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/sports').then(r => setSports(r.data)).catch(() => {})
  }, [])

  useEffect(() => {
    setLoading(true)
    const params = {}
    if (filters.sport_id) params.sport_id = filters.sport_id
    if (filters.commune) params.commune = filters.commune
    api.get('/venues', { params }).then(r => {
      setVenues(r.data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [filters])

  return (
    <AppLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-1">Canchas</h1>
        <p className="text-white/40">Encuentra y reserva canchas deportivas en Santiago.</p>
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
        <div className="text-white/40 text-center py-20">Cargando canchas...</div>
      ) : venues.length === 0 ? (
        <div className="text-white/40 text-center py-20">No se encontraron canchas con esos filtros.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {venues.map(v => (
            <Link key={v.id} to={`/canchas/${v.id}`}
              className="bg-white/[0.03] border border-white/8 rounded-2xl overflow-hidden hover:border-[#84cc16]/30 transition-colors group"
            >
              {/* Image placeholder */}
              <div className="h-40 bg-gradient-to-br from-[#14532d]/40 to-[#0a0a0a] flex items-center justify-center text-5xl">
                {v.sport?.icon || '🏟️'}
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-white font-semibold group-hover:text-[#84cc16] transition-colors leading-tight">
                    {v.name}
                  </h3>
                  <span className="text-[#84cc16] font-bold text-sm whitespace-nowrap ml-2">
                    {formatCLP(v.price_per_hour)}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-white/40 text-xs mb-1">
                  <MapPin size={11} />
                  {v.commune}, {v.city}
                </div>

                {v.address && (
                  <p className="text-white/30 text-xs">{v.address}</p>
                )}

                <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="text-white/30 text-xs">{v.sport?.icon} {v.sport?.name}</span>
                  {v.phone && (
                    <span className="flex items-center gap-1 text-white/30 text-xs">
                      <Phone size={10} /> {v.phone}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </AppLayout>
  )
}
