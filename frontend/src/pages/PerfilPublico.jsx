import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Trophy, Star } from 'lucide-react'
import AppLayout from '../components/AppLayout'
import api from '../api/client'

const skillLabels = { beginner: 'Principiante', intermediate: 'Intermedio', advanced: 'Avanzado', pro: 'Profesional' }
const skillColors = {
  beginner:     { bg: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.5)' },
  intermediate: { bg: 'rgba(59,130,246,0.12)', color: '#60a5fa' },
  advanced:     { bg: 'rgba(132,204,22,0.12)', color: '#84cc16' },
  pro:          { bg: 'rgba(234,179,8,0.12)',  color: '#facc15' },
}

function StatBadge({ label, value, color }) {
  return (
    <div style={{ textAlign: 'center', padding: '0.875rem 1.25rem', background: 'rgba(255,255,255,0.03)', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.07)' }}>
      <div style={{ fontSize: 22, fontWeight: 800, color, marginBottom: '0.125rem' }}>{value}</div>
      <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11 }}>{label}</div>
    </div>
  )
}

export default function PerfilPublico() {
  const { id } = useParams()
  const [profileUser, setProfileUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/users/${id}`)
      .then(r => { setProfileUser(r.data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [id])

  if (loading) return (
    <AppLayout>
      <div style={{ textAlign: 'center', padding: '5rem', color: 'rgba(255,255,255,0.3)' }}>Cargando perfil…</div>
    </AppLayout>
  )

  if (!profileUser) return (
    <AppLayout>
      <div style={{ textAlign: 'center', padding: '5rem', color: 'rgba(255,255,255,0.3)' }}>Usuario no encontrado.</div>
    </AppLayout>
  )

  const u = profileUser

  return (
    <AppLayout>
      <Link to="/equipos" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', color: 'rgba(255,255,255,0.35)', fontSize: 13, textDecoration: 'none', marginBottom: '1.5rem', transition: 'color 0.15s' }}
        onMouseEnter={e => e.currentTarget.style.color = '#fff'}
        onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.35)'}
      >
        <ArrowLeft size={14} /> Volver
      </Link>

      <div style={{ maxWidth: 640 }}>
        {/* Profile hero */}
        <div className="card" style={{ padding: '2rem', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem', marginBottom: '1.5rem' }}>
            {/* Avatar */}
            <div style={{ width: 80, height: 80, borderRadius: '1.125rem', background: 'linear-gradient(135deg,#14532d,#166534)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#84cc16', fontWeight: 800, fontSize: 32, flexShrink: 0 }}>
              {u.name?.charAt(0)}
            </div>
            <div style={{ flex: 1 }}>
              <h1 style={{ color: '#fff', fontWeight: 700, fontSize: 22, letterSpacing: '-0.25px', marginBottom: '0.25rem' }}>{u.name}</h1>
              {u.bio && <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, lineHeight: 1.6 }}>{u.bio}</p>}
            </div>
          </div>

          {/* Stats row */}
          {(u.matches_played || u.teams?.length) && (
            <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
              {u.matches_played != null && <StatBadge label="Partidos" value={u.matches_played} color="#fff" />}
              {u.wins != null && <StatBadge label="Victorias" value={u.wins} color="#4ade80" />}
              {u.average_rating && (
                <div style={{ textAlign: 'center', padding: '0.875rem 1.25rem', background: 'rgba(234,179,8,0.08)', borderRadius: '0.75rem', border: '1px solid rgba(234,179,8,0.15)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Star size={14} color="#facc15" />
                  <div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: '#facc15', lineHeight: 1 }}>{u.average_rating}</div>
                    <div style={{ color: 'rgba(234,179,8,0.6)', fontSize: 11 }}>Valoración</div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sports */}
        {u.sports?.length > 0 && (
          <div className="card" style={{ padding: '1.5rem', marginBottom: '1.25rem' }}>
            <h2 style={{ color: '#fff', fontWeight: 600, fontSize: 15, marginBottom: '1rem' }}>Deportes</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {u.sports.map(us => {
                const sc = skillColors[us.skill_level] || skillColors.beginner
                return (
                  <div key={us.sport?.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.625rem', padding: '0.5rem 0.875rem' }}>
                    <span style={{ fontSize: 16 }}>{us.sport?.icon}</span>
                    <span style={{ color: '#fff', fontSize: 13 }}>{us.sport?.name}</span>
                    <span style={{ background: sc.bg, color: sc.color, fontSize: 11, fontWeight: 600, padding: '0.15rem 0.5rem', borderRadius: 99 }}>
                      {skillLabels[us.skill_level] || us.skill_level}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Teams */}
        {u.teams?.length > 0 && (
          <div className="card" style={{ padding: '1.5rem' }}>
            <h2 style={{ color: '#fff', fontWeight: 600, fontSize: 15, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Trophy size={14} color="#84cc16" /> Equipos
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              {u.teams.map(t => (
                <Link key={t.id} to={`/equipos/${t.id}`} style={{ textDecoration: 'none' }}>
                  <div
                    style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem 0.5rem', borderRadius: '0.5rem', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{ width: 36, height: 36, borderRadius: '0.5rem', background: 'linear-gradient(135deg,#14532d,#166534)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#84cc16', fontWeight: 700, fontSize: 15, flexShrink: 0 }}>
                      {t.name?.charAt(0)}
                    </div>
                    <div>
                      <p style={{ color: '#fff', fontSize: 13, fontWeight: 500 }}>{t.name}</p>
                      {t.sport && <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12 }}>{t.sport}</p>}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
