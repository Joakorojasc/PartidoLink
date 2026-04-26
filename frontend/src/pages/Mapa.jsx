import { useEffect, useState, useRef } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { MapPin, ExternalLink } from 'lucide-react'
import AppLayout from '../components/AppLayout'
import api from '../api/client'

const COMMUNE_COORDS = {
  'Providencia':     [-33.4344, -70.6100],
  'Las Condes':      [-33.4077, -70.5740],
  'Ñuñoa':          [-33.4567, -70.5999],
  'Lo Barnechea':    [-33.3580, -70.5330],
  'Macul':           [-33.4943, -70.5882],
  'Vitacura':        [-33.3927, -70.5778],
  'San Miguel':      [-33.5035, -70.6590],
  'Peñalolén':      [-33.4851, -70.5380],
  'La Florida':      [-33.5343, -70.5950],
  'Santiago Centro': [-33.4540, -70.6534],
}

const SPORT_COLORS = {
  'Fútbol':     '#4ade80',
  'Pádel':      '#facc15',
  'Tenis':      '#fb923c',
  'Golf':       '#34d399',
  'Básquetbol': '#f97316',
  'Volleyball': '#60a5fa',
}

function formatCLP(n) {
  if (!n) return '—'
  return '$' + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

function FitBounds({ venues }) {
  const map = useMap()
  useEffect(() => {
    const points = venues
      .map(v => COMMUNE_COORDS[v.commune])
      .filter(Boolean)
    if (points.length) {
      map.fitBounds(points, { padding: [48, 48], maxZoom: 14 })
    }
  }, [venues])
  return null
}

export default function Mapa() {
  const [venues, setVenues] = useState([])
  const [sports, setSports] = useState([])
  const [filter, setFilter] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([api.get('/venues'), api.get('/sports')])
      .then(([v, s]) => { setVenues(v.data); setSports(s.data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const displayed = filter ? venues.filter(v => v.sport?.name === filter) : venues
  const withCoords = displayed.filter(v => COMMUNE_COORDS[v.commune])

  return (
    <AppLayout>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: '#fff', letterSpacing: '-0.5px', marginBottom: '0.25rem' }}>
          Mapa de canchas
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14 }}>
          {venues.length} instalaciones deportivas en Santiago
        </p>
      </div>

      {/* Sport filter pills */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
        <button
          onClick={() => setFilter(null)}
          style={{
            padding: '0.4rem 1rem', borderRadius: 99, fontSize: 13, fontWeight: filter === null ? 700 : 500,
            border: 'none', cursor: 'pointer', transition: 'all 0.15s',
            background: filter === null ? '#84cc16' : 'rgba(255,255,255,0.07)',
            color: filter === null ? '#14532d' : 'rgba(255,255,255,0.6)',
          }}
        >
          Todos
        </button>
        {sports.map(s => (
          <button
            key={s.id}
            onClick={() => setFilter(filter === s.name ? null : s.name)}
            style={{
              padding: '0.4rem 1rem', borderRadius: 99, fontSize: 13, fontWeight: filter === s.name ? 700 : 500,
              border: `1px solid ${filter === s.name ? (SPORT_COLORS[s.name] || '#84cc16') : 'rgba(255,255,255,0.1)'}`,
              cursor: 'pointer', transition: 'all 0.15s',
              background: filter === s.name ? `${(SPORT_COLORS[s.name] || '#84cc16')}20` : 'rgba(255,255,255,0.04)',
              color: filter === s.name ? (SPORT_COLORS[s.name] || '#84cc16') : 'rgba(255,255,255,0.6)',
            }}
          >
            {s.icon} {s.name}
          </button>
        ))}
      </div>

      {/* Stats bar */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
        {sports.map(s => {
          const count = venues.filter(v => v.sport?.name === s.name).length
          if (!count) return null
          const color = SPORT_COLORS[s.name] || '#84cc16'
          return (
            <div key={s.id} style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.5rem 0.875rem', borderRadius: '0.625rem',
              background: `${color}12`, border: `1px solid ${color}25`,
            }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />
              <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>{s.name}</span>
              <span style={{ color, fontSize: 13, fontWeight: 700 }}>{count}</span>
            </div>
          )
        })}
      </div>

      {/* Map */}
      <div style={{ borderRadius: '1rem', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.07)', height: 520 }}>
        {!loading && (
          <MapContainer
            center={[-33.45, -70.60]}
            zoom={12}
            style={{ height: '100%', width: '100%', background: '#0f0f0f' }}
            zoomControl={true}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
              subdomains="abcd"
              maxZoom={20}
            />
            <FitBounds venues={displayed} />
            {withCoords.map(v => {
              const coords = COMMUNE_COORDS[v.commune]
              const color = SPORT_COLORS[v.sport?.name] || '#84cc16'
              return (
                <CircleMarker
                  key={v.id}
                  center={coords}
                  radius={10}
                  pathOptions={{
                    color: color,
                    fillColor: color,
                    fillOpacity: 0.85,
                    weight: 2,
                    opacity: 1,
                  }}
                >
                  <Popup className="map-popup-dark">
                    <div style={{ minWidth: 200 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: 18 }}>{v.sport?.icon}</span>
                        <div>
                          <p style={{ fontWeight: 700, fontSize: 14, color: '#fff', lineHeight: 1.2, margin: 0 }}>{v.name}</p>
                          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', margin: 0 }}>{v.sport?.name}</p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.375rem' }}>
                        <MapPin size={11} color="rgba(255,255,255,0.35)" />
                        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{v.address}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.625rem', paddingTop: '0.625rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: '#84cc16' }}>
                          {v.price_formatted}/hr
                        </span>
                        <a
                          href={`/canchas/${v.id}`}
                          style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: 12, color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}
                          onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                          onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
                        >
                          Ver detalle <ExternalLink size={10} />
                        </a>
                      </div>
                    </div>
                  </Popup>
                </CircleMarker>
              )
            })}
          </MapContainer>
        )}
        {loading && (
          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#111', color: 'rgba(255,255,255,0.2)', fontSize: 14 }}>
            Cargando mapa…
          </div>
        )}
      </div>

      {/* Venue list */}
      <div style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '0.75rem' }}>
        {displayed.map(v => {
          const color = SPORT_COLORS[v.sport?.name] || '#84cc16'
          return (
            <a key={v.id} href={`/canchas/${v.id}`} style={{ textDecoration: 'none' }}>
              <div className="card" style={{ padding: '1rem 1.25rem', transition: 'transform 0.15s, border-color 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = `${color}40` }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '0.75rem', background: `${color}18`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
                    {v.sport?.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ color: '#fff', fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.name}</p>
                    <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12 }}>{v.commune} · {v.price_formatted}/hr</p>
                  </div>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />
                </div>
              </div>
            </a>
          )
        })}
      </div>
    </AppLayout>
  )
}
