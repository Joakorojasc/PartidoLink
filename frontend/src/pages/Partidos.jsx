import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Trophy, MapPin, Calendar, Swords } from 'lucide-react'
import AppLayout from '../components/AppLayout'
import useMatchStore from '../stores/matchStore'
import api from '../api/client'

const communes = ['Providencia','Las Condes','Ñuñoa','Santiago Centro','Vitacura','La Florida','Macul','San Miguel']

function formatDate(dt) {
  if (!dt) return 'Por confirmar'
  return new Date(dt).toLocaleDateString('es-CL', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

function MatchCard({ match: m }) {
  const [hovered, setHovered] = useState(false)
  return (
    <Link to={`/partidos/${m.id}`} style={{ textDecoration: 'none' }}>
      <div
        className="card card-green"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ padding: '1.5rem', transition: 'transform 0.18s, border-color 0.18s', transform: hovered ? 'translateY(-3px)' : 'translateY(0)' }}
      >
        {/* Sport + badge */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: 22 }}>{m.sport?.icon}</span>
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: 500 }}>{m.sport?.name}</span>
          </div>
          <span className="badge-open" style={{ fontSize: 11, fontWeight: 600, padding: '0.25rem 0.625rem', borderRadius: 99 }}>
            Abierto
          </span>
        </div>

        {/* Teams VS */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ width: 38, height: 38, borderRadius: '0.625rem', background: 'linear-gradient(135deg,#14532d,#166534)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#84cc16', fontWeight: 700, fontSize: 15, marginBottom: '0.375rem' }}>
              {m.home_team?.name?.charAt(0)}
            </div>
            <p style={{ color: '#fff', fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.home_team?.name}</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', flexShrink: 0 }}>
            <Swords size={14} color="rgba(255,255,255,0.25)" />
            <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 11, fontWeight: 700, letterSpacing: '1px' }}>VS</span>
          </div>
          <div style={{ flex: 1, minWidth: 0, textAlign: 'right' }}>
            <div style={{ width: 38, height: 38, borderRadius: '0.625rem', background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.6)', fontWeight: 700, fontSize: 15, marginBottom: '0.375rem', marginLeft: 'auto' }}>
              {m.away_team?.name?.charAt(0)}
            </div>
            <p style={{ color: '#fff', fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.away_team?.name}</p>
          </div>
        </div>

        {/* Meta */}
        <div style={{ display: 'flex', gap: '0.875rem', paddingTop: '0.875rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>
            <MapPin size={10} /> {m.commune}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>
            <Calendar size={10} /> {formatDate(m.scheduled_at)}
          </span>
        </div>
      </div>
    </Link>
  )
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
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: '#fff', letterSpacing: '-0.5px', marginBottom: '0.25rem' }}>Partidos abiertos</h1>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14 }}>Equipos buscando rival ahora mismo</p>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.75rem', flexWrap: 'wrap' }}>
        <select value={filters.sport_id} onChange={e => setFilters(f => ({ ...f, sport_id: e.target.value }))}
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.625rem', padding: '0.625rem 1rem', color: filters.sport_id ? '#fff' : 'rgba(255,255,255,0.45)', fontSize: 13, outline: 'none' }}
        >
          <option value="">Todos los deportes</option>
          {sports.map(s => <option key={s.id} value={s.id}>{s.icon} {s.name}</option>)}
        </select>
        <select value={filters.commune} onChange={e => setFilters(f => ({ ...f, commune: e.target.value }))}
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.625rem', padding: '0.625rem 1rem', color: filters.commune ? '#fff' : 'rgba(255,255,255,0.45)', fontSize: 13, outline: 'none' }}
        >
          <option value="">Todas las comunas</option>
          {communes.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {[1,2,3,4].map(i => (
            <div key={i} className="card" style={{ padding: '1.5rem', height: 200 }} />
          ))}
        </div>
      ) : openMatches.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem 0' }}>
          <Trophy size={48} color="rgba(255,255,255,0.07)" style={{ margin: '0 auto 1rem' }} />
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 15, marginBottom: '0.5rem' }}>No hay partidos abiertos con esos filtros</p>
          <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 13 }}>Intenta con otros criterios o crea tú el primero</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {openMatches.map(m => <MatchCard key={m.id} match={m} />)}
        </div>
      )}
    </AppLayout>
  )
}
