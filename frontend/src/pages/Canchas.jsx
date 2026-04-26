import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Phone, Clock } from 'lucide-react'
import AppLayout from '../components/AppLayout'
import api from '../api/client'

const communes = ['Providencia','Las Condes','Ñuñoa','Santiago Centro','Vitacura','La Florida','Macul','San Miguel','Peñalolén','Lo Barnechea']

function formatCLP(n) {
  if (!n) return 'Consultar'
  return '$' + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '/hr'
}

function VenueCard({ venue: v }) {
  const [hovered, setHovered] = useState(false)
  return (
    <Link to={`/canchas/${v.id}`} style={{ textDecoration: 'none' }}>
      <div
        className="card card-green"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ overflow: 'hidden', transition: 'transform 0.18s, border-color 0.18s', transform: hovered ? 'translateY(-3px)' : 'translateY(0)' }}
      >
        {/* Image / Icon area */}
        <div style={{ height: 120, background: `linear-gradient(135deg, rgba(20,83,45,0.6) 0%, rgba(10,10,10,0.8) 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, position: 'relative' }}>
          {v.sport?.icon || '🏟️'}
          <div style={{ position: 'absolute', bottom: '0.75rem', right: '0.75rem', background: 'rgba(0,0,0,0.5)', borderRadius: 99, padding: '0.25rem 0.625rem', fontSize: 11, fontWeight: 700, color: '#84cc16' }}>
            {formatCLP(v.price_per_hour)}
          </div>
        </div>

        <div style={{ padding: '1.125rem' }}>
          <h3 style={{ color: hovered ? '#84cc16' : '#fff', fontSize: 14, fontWeight: 600, marginBottom: '0.375rem', transition: 'color 0.15s', lineHeight: 1.3 }}>
            {v.name}
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'rgba(255,255,255,0.4)', fontSize: 12, marginBottom: '0.25rem' }}>
            <MapPin size={10} /> {v.commune}, {v.city}
          </div>
          <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11 }}>{v.sport?.name}</p>
        </div>
      </div>
    </Link>
  )
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
    api.get('/venues', { params }).then(r => { setVenues(r.data); setLoading(false) }).catch(() => setLoading(false))
  }, [filters])

  return (
    <AppLayout>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: '#fff', letterSpacing: '-0.5px', marginBottom: '0.25rem' }}>Canchas</h1>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14 }}>Instalaciones deportivas en Santiago</p>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.75rem', flexWrap: 'wrap' }}>
        {[
          { key: 'sport_id', placeholder: 'Todos los deportes', options: sports.map(s => ({ value: s.id, label: `${s.icon} ${s.name}` })) },
          { key: 'commune', placeholder: 'Todas las comunas', options: communes.map(c => ({ value: c, label: c })) },
        ].map(f => (
          <select key={f.key} value={filters[f.key]} onChange={e => setFilters(p => ({ ...p, [f.key]: e.target.value }))}
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.625rem', padding: '0.625rem 1rem', color: filters[f.key] ? '#fff' : 'rgba(255,255,255,0.45)', fontSize: 13, outline: 'none' }}
          >
            <option value="">{f.placeholder}</option>
            {f.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        ))}
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
          {[1,2,3,4,5,6].map(i => <div key={i} className="card" style={{ height: 200 }} />)}
        </div>
      ) : venues.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem 0' }}>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 15 }}>No se encontraron canchas</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
          {venues.map(v => <VenueCard key={v.id} venue={v} />)}
        </div>
      )}
    </AppLayout>
  )
}
