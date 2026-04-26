import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { MapPin, Phone, Globe, ArrowLeft, Calendar, ChevronRight } from 'lucide-react'
import AppLayout from '../components/AppLayout'
import api from '../api/client'

function formatCLP(n) {
  if (!n) return 'Consultar precio'
  return '$' + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

export default function CanchaDetalle() {
  const { id } = useParams()
  const [venue, setVenue] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/venues/${id}`).then(r => { setVenue(r.data); setLoading(false) }).catch(() => setLoading(false))
  }, [id])

  if (loading) return <AppLayout><div style={{ textAlign: 'center', padding: '5rem', color: 'rgba(255,255,255,0.3)' }}>Cargando…</div></AppLayout>
  if (!venue) return <AppLayout><div style={{ textAlign: 'center', padding: '5rem', color: 'rgba(255,255,255,0.3)' }}>Cancha no encontrada.</div></AppLayout>

  return (
    <AppLayout>
      <Link to="/canchas" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', color: 'rgba(255,255,255,0.35)', fontSize: 13, textDecoration: 'none', marginBottom: '1.5rem', transition: 'color 0.15s' }}
        onMouseEnter={e => e.currentTarget.style.color = '#fff'}
        onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.35)'}
      >
        <ArrowLeft size={14} /> Volver a canchas
      </Link>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.5rem', alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Hero */}
          <div style={{ height: 220, background: `linear-gradient(135deg, rgba(20,83,45,0.5) 0%, rgba(10,10,10,0.9) 100%)`, borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 72 }}>
            {venue.sport?.icon || '🏟️'}
          </div>

          {/* Info card */}
          <div className="card" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem', gap: '1rem', flexWrap: 'wrap' }}>
              <div>
                <h1 style={{ fontSize: 22, fontWeight: 700, color: '#fff', letterSpacing: '-0.25px', marginBottom: '0.5rem' }}>{venue.name}</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    {venue.sport?.icon} {venue.sport?.name}
                  </span>
                  <span style={{ color: 'rgba(255,255,255,0.2)' }}>·</span>
                  <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <MapPin size={12} /> {venue.commune}, {venue.city}
                  </span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 26, fontWeight: 800, color: '#84cc16', letterSpacing: '-0.5px' }}>{formatCLP(venue.price_per_hour)}</div>
                <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12 }}>por hora</div>
              </div>
            </div>

            {venue.address && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.35)', fontSize: 13, marginBottom: '1rem' }}>
                <MapPin size={13} /> {venue.address}
              </div>
            )}

            {venue.description && (
              <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14, lineHeight: 1.7, marginBottom: '1rem' }}>{venue.description}</p>
            )}

            <div style={{ display: 'flex', gap: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.06)', flexWrap: 'wrap' }}>
              {venue.phone && (
                <a href={`tel:${venue.phone}`} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.4)', fontSize: 13, textDecoration: 'none', transition: 'color 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
                >
                  <Phone size={13} /> {venue.phone}
                </a>
              )}
              {venue.website && (
                <a href={venue.website} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.4)', fontSize: 13, textDecoration: 'none', transition: 'color 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#84cc16'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
                >
                  <Globe size={13} /> Sitio web
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Booking sidebar */}
        <div className="card" style={{ padding: '1.5rem', position: 'sticky', top: '2rem' }}>
          <h2 style={{ color: '#fff', fontWeight: 600, fontSize: 16, marginBottom: '1.25rem' }}>Reservar cancha</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
            {[
              { label: 'Precio por hora', value: formatCLP(venue.price_per_hour) },
              { label: 'Deporte', value: `${venue.sport?.icon} ${venue.sport?.name}` },
              { label: 'Ubicación', value: venue.commune },
            ].map(row => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>{row.label}</span>
                <span style={{ color: '#fff', fontSize: 13, fontWeight: 500 }}>{row.value}</span>
              </div>
            ))}
          </div>
          <Link to="/dashboard" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
            <Calendar size={14} /> Solicitar reserva
          </Link>
          <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 11, textAlign: 'center', marginTop: '0.875rem', lineHeight: 1.5 }}>
            Contacta al recinto para confirmar disponibilidad y horarios
          </p>
        </div>
      </div>
    </AppLayout>
  )
}
