import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Trophy, MapPin, Calendar, Swords, Plus, Search } from 'lucide-react'
import AppLayout from '../components/AppLayout'
import useMatchStore from '../stores/matchStore'
import useAuthStore from '../stores/authStore'
import api from '../api/client'

const communes = ['Providencia','Las Condes','Ñuñoa','Santiago Centro','Vitacura','La Florida','Macul','San Miguel']

function formatDate(dt) {
  if (!dt) return 'Por confirmar'
  return new Date(dt).toLocaleDateString('es-CL', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

function TeamAvatar({ team, align = 'left' }) {
  if (!team) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: align === 'right' ? 'flex-end' : 'flex-start', gap: 4 }}>
        <div style={{
          width: 38, height: 38, borderRadius: '0.625rem',
          background: 'rgba(255,255,255,0.04)',
          border: '1.5px dashed rgba(255,255,255,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'rgba(255,255,255,0.2)', fontSize: 16,
          marginLeft: align === 'right' ? 'auto' : 0,
        }}>
          <Search size={14} />
        </div>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, fontWeight: 500 }}>Buscando rival</p>
      </div>
    )
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: align === 'right' ? 'flex-end' : 'flex-start', gap: 4 }}>
      <div style={{
        width: 38, height: 38, borderRadius: '0.625rem',
        background: align === 'left' ? 'linear-gradient(135deg,#14532d,#166534)' : 'rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: align === 'left' ? '#84cc16' : 'rgba(255,255,255,0.6)', fontWeight: 700, fontSize: 15,
        marginLeft: align === 'right' ? 'auto' : 0,
      }}>
        {team.name?.charAt(0)}
      </div>
      <p style={{ color: '#fff', fontSize: 13, fontWeight: 600, textAlign: align === 'right' ? 'right' : 'left' }}>{team.name}</p>
    </div>
  )
}

function MatchCard({ match: m }) {
  const [hovered, setHovered] = useState(false)
  const isOpen = !m.away_team
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
          {isOpen ? (
            <span style={{ background: 'rgba(132,204,22,0.12)', color: '#84cc16', fontSize: 11, fontWeight: 700, padding: '0.25rem 0.625rem', borderRadius: 99, border: '1px solid rgba(132,204,22,0.2)' }}>
              Busca rival
            </span>
          ) : (
            <span className="badge-open" style={{ fontSize: 11, fontWeight: 600, padding: '0.25rem 0.625rem', borderRadius: 99 }}>
              Abierto
            </span>
          )}
        </div>

        {/* Teams VS */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <TeamAvatar team={m.home_team} align="left" />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', flexShrink: 0 }}>
            <Swords size={14} color="rgba(255,255,255,0.25)" />
            <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 11, fontWeight: 700, letterSpacing: '1px' }}>VS</span>
          </div>
          <TeamAvatar team={m.away_team} align="right" />
        </div>

        {/* Meta */}
        <div style={{ display: 'flex', gap: '0.875rem', paddingTop: '0.875rem', borderTop: '1px solid rgba(255,255,255,0.06)', flexWrap: 'wrap' }}>
          {m.commune && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>
              <MapPin size={10} /> {m.commune}
            </span>
          )}
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
  const { token } = useAuthStore()
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
          <h1 style={{ fontSize: 26, fontWeight: 700, color: '#fff', letterSpacing: '-0.5px', marginBottom: '0.25rem' }}>Partidos</h1>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14 }}>Partidos programados y equipos buscando rival</p>
        </div>
        {token && (
          <Link to="/partidos/nuevo" className="btn-primary">
            <Plus size={15} /> Crear partido
          </Link>
        )}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.75rem', flexWrap: 'wrap' }}>
        <select value={filters.sport_id} onChange={e => setFilters(f => ({ ...f, sport_id: e.target.value }))}
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.625rem', padding: '0.625rem 1rem', color: filters.sport_id ? '#fff' : 'rgba(255,255,255,0.45)', fontSize: 13, outline: 'none', colorScheme: 'dark' }}
        >
          <option value="">Todos los deportes</option>
          {sports.map(s => <option key={s.id} value={s.id}>{s.icon} {s.name}</option>)}
        </select>
        <select value={filters.commune} onChange={e => setFilters(f => ({ ...f, commune: e.target.value }))}
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.625rem', padding: '0.625rem 1rem', color: filters.commune ? '#fff' : 'rgba(255,255,255,0.45)', fontSize: 13, outline: 'none', colorScheme: 'dark' }}
        >
          <option value="">Todas las comunas</option>
          {communes.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        {(filters.sport_id || filters.commune) && (
          <button onClick={() => setFilters({ sport_id: '', commune: '' })}
            style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.625rem', padding: '0.625rem 1rem', color: 'rgba(255,255,255,0.4)', fontSize: 13, cursor: 'pointer', transition: 'color 0.15s, border-color 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
          >
            Limpiar
          </button>
        )}
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {[1,2,3,4].map(i => (
            <div key={i} className="card" style={{ padding: '1.5rem', height: 200 }}>
              <div style={{ height: 12, background: 'rgba(255,255,255,0.05)', borderRadius: 6, marginBottom: '0.75rem', width: '40%' }} />
              <div style={{ height: 48, background: 'rgba(255,255,255,0.03)', borderRadius: '0.625rem', marginBottom: '0.75rem' }} />
              <div style={{ height: 10, background: 'rgba(255,255,255,0.03)', borderRadius: 6, width: '60%' }} />
            </div>
          ))}
        </div>
      ) : openMatches.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem 0' }}>
          <div style={{ width: 72, height: 72, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
            <Trophy size={30} color="rgba(255,255,255,0.1)" />
          </div>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 15, marginBottom: '0.375rem' }}>No hay partidos con esos filtros</p>
          <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 13, marginBottom: '1.75rem' }}>Intenta con otros criterios o crea tú el primero</p>
          {token && (
            <Link to="/partidos/nuevo" className="btn-primary" style={{ fontSize: 14 }}>
              <Plus size={15} /> Crear partido
            </Link>
          )}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {openMatches.map(m => <MatchCard key={m.id} match={m} />)}
        </div>
      )}
    </AppLayout>
  )
}
