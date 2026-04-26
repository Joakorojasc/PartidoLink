import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { MapPin, Phone, Globe, ArrowLeft, Calendar } from 'lucide-react'
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
    api.get(`/venues/${id}`)
      .then(r => { setVenue(r.data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [id])

  if (loading) return <AppLayout><div className="text-white/40 text-center py-20">Cargando cancha...</div></AppLayout>
  if (!venue) return <AppLayout><div className="text-white/40 text-center py-20">Cancha no encontrada.</div></AppLayout>

  return (
    <AppLayout>
      <Link to="/canchas" className="flex items-center gap-2 text-white/40 hover:text-white text-sm mb-6 transition-colors">
        <ArrowLeft size={15} /> Volver a canchas
      </Link>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          {/* Hero */}
          <div className="h-64 bg-gradient-to-br from-[#14532d]/40 to-[#111111] rounded-2xl flex items-center justify-center text-8xl border border-white/5">
            {venue.sport?.icon || '🏟️'}
          </div>

          {/* Info */}
          <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-8">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-white mb-1">{venue.name}</h1>
                <div className="flex items-center gap-2 text-white/50 text-sm">
                  <span>{venue.sport?.icon} {venue.sport?.name}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1"><MapPin size={12} /> {venue.commune}, {venue.city}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-extrabold text-[#84cc16]">{formatCLP(venue.price_per_hour)}</div>
                <div className="text-white/40 text-xs">por hora</div>
              </div>
            </div>

            {venue.address && (
              <p className="text-white/40 text-sm mb-4 flex items-center gap-2">
                <MapPin size={14} /> {venue.address}
              </p>
            )}

            {venue.description && (
              <p className="text-white/60 text-sm leading-relaxed">{venue.description}</p>
            )}

            <div className="flex gap-4 mt-6 pt-6 border-t border-white/5">
              {venue.phone && (
                <a href={`tel:${venue.phone}`}
                  className="flex items-center gap-2 text-white/50 hover:text-white text-sm transition-colors"
                >
                  <Phone size={15} /> {venue.phone}
                </a>
              )}
              {venue.website && (
                <a href={venue.website} target="_blank" rel="noreferrer"
                  className="flex items-center gap-2 text-white/50 hover:text-[#84cc16] text-sm transition-colors"
                >
                  <Globe size={15} /> Sitio web
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Booking CTA */}
        <div className="space-y-4">
          <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6 sticky top-8">
            <h2 className="text-white font-semibold mb-4">Reservar esta cancha</h2>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-white/50">Precio por hora</span>
                <span className="text-white font-medium">{formatCLP(venue.price_per_hour)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/50">Deporte</span>
                <span className="text-white">{venue.sport?.icon} {venue.sport?.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/50">Ubicación</span>
                <span className="text-white">{venue.commune}</span>
              </div>
            </div>
            <Link to="/dashboard"
              className="w-full flex items-center justify-center gap-2 bg-[#84cc16] text-[#14532d] py-3 rounded-xl font-bold text-sm hover:bg-[#a3e635] transition-colors"
            >
              <Calendar size={15} />
              Solicitar reserva
            </Link>
            <p className="text-white/25 text-xs text-center mt-3">
              Contacta al recinto para confirmar disponibilidad
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
