import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Users, MapPin, Trophy } from 'lucide-react'
import AppLayout from '../components/AppLayout'
import api from '../api/client'

const communes = ['Providencia','Las Condes','Ñuñoa','Santiago Centro','Vitacura','La Florida','Macul','San Miguel','Peñalolén','Lo Barnechea']

function TeamCard({ team }) {
  const [hovered, setHovered] = useState(false)
  return (
    <Link to={`/equipos/${team.id}`} style={{ textDecoration: 'none' }}>
      <div
        className="card card-green"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ padding: '1.5rem', height: '100%', display: 'flex', flexDirection: 'column', gap: '1rem', transition: 'transform 0.18s, border-color 0.18s', transform: hovered ? 'translateY(-3px)' : 'translateY(0)' }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div style={{ width: 46, height: 46, borderRadius: '0.875rem', background: 'linear-gradient(135deg,#14532d,#166534)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#84cc16', fontWeight: 700, fontSize: 19 }}>
            {team.name?.charAt(0)}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem' }}>
            {team.is_open && (
              <span className="badge-open" style={{ fontSize: 11, fontWeight: 600, padding: '0.25rem 0.625rem', borderRadius: 99 }}>
                Abierto
              </span>
            )}
            <span style={{ fontSize: 20 }}>{team.sport?.icon}</span>
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <h3 style={{ color: hovered ? '#84cc16' : '#fff', fontWeight: 600, fontSize: 15, marginBottom: '0.375rem', transition: 'color 0.15s' }}>
            {team.name}
          </h3>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>{team.sport?.name}</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.875rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>
            <MapPin size={11} /> {team.commune || 'Santiago'}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>
            <Users size={11} /> {team.captain?.name?.split(' ')[0]}
          </span>
        </div>
      </div>
    </Link>
  )
}

export default function Equipos() {
  const [teams, setTeams] = useState([])
  const [sports, setSports] = useState([])
  const [filters, setFilters] = useState({ sport_id: '', commune: '', is_open: '' })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/sports').then(r => setSports(r.data)).catch(() => {})
  }, [])

  useEffect(() => {
    setLoading(true)
    const params = {}
    if (filters.sport_id) params.sport_id = filters.sport_id
    if (filters.commune) params.commune = filters.commune
    if (filters.is_open) params.is_open = filters.is_open
    api.get('/teams', { params }).then(r => { setTeams(r.data); setLoading(false) }).catch(() => setLoading(false))
  }, [filters])

  return (
    <AppLayout>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2rem', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: '#fff', letterSpacing: '-0.5px', marginBottom: '0.25rem' }}>Equipos</h1>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14 }}>{teams.length} equipos en PartidoLink</p>
        </div>
        <Link to="/equipos/nuevo" className="btn-primary">
          <Plus size={15} /> Crear equipo
        </Link>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.75rem', flexWrap: 'wrap' }}>
        {[
          { key: 'sport_id', placeholder: 'Todos los deportes', options: sports.map(s => ({ value: s.id, label: `${s.icon} ${s.name}` })) },
          { key: 'commune', placeholder: 'Todas las comunas', options: communes.map(c => ({ value: c, label: c })) },
          { key: 'is_open', placeholder: 'Todos', options: [{ value: 'true', label: '✅ Solo abiertos' }] },
        ].map(f => (
          <select key={f.key}
            value={filters[f.key]}
            onChange={e => setFilters(prev => ({ ...prev, [f.key]: e.target.value }))}
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.625rem', padding: '0.625rem 1rem', color: filters[f.key] ? '#fff' : 'rgba(255,255,255,0.45)', fontSize: 13, outline: 'none', cursor: 'pointer', transition: 'border-color 0.15s' }}
            onFocus={e => e.target.style.borderColor = 'rgba(132,204,22,0.4)'}
            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
          >
            <option value="">{f.placeholder}</option>
            {f.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        ))}
        {(filters.sport_id || filters.commune || filters.is_open) && (
          <button onClick={() => setFilters({ sport_id: '', commune: '', is_open: '' })}
            style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.625rem', padding: '0.625rem 1rem', color: 'rgba(255,255,255,0.4)', fontSize: 13, cursor: 'pointer', transition: 'color 0.15s, border-color 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="card" style={{ padding: '1.5rem', height: 160 }}>
              <div style={{ width: 46, height: 46, borderRadius: '0.875rem', background: 'rgba(255,255,255,0.05)', marginBottom: '1rem' }} />
              <div style={{ height: 12, background: 'rgba(255,255,255,0.05)', borderRadius: 6, marginBottom: '0.5rem', width: '70%' }} />
              <div style={{ height: 10, background: 'rgba(255,255,255,0.03)', borderRadius: 6, width: '45%' }} />
            </div>
          ))}
        </div>
      ) : teams.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem 0' }}>
          <Users size={48} color="rgba(255,255,255,0.07)" style={{ margin: '0 auto 1rem' }} />
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 15, marginBottom: '0.5rem' }}>No se encontraron equipos</p>
          <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 13 }}>Prueba cambiando los filtros</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
          {teams.map(t => <TeamCard key={t.id} team={t} />)}
        </div>
      )}
    </AppLayout>
  )
}
