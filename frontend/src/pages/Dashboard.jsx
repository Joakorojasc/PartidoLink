import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Trophy, Users, MapPin, ArrowRight, Calendar, TrendingUp, ChevronRight } from 'lucide-react'
import useAuthStore from '../stores/authStore'
import useMatchStore from '../stores/matchStore'
import AppLayout from '../components/AppLayout'
import api from '../api/client'

function formatDate(dt) {
  if (!dt) return 'Por confirmar'
  return new Date(dt).toLocaleDateString('es-CL', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

const quickActions = [
  { to: '/partidos', icon: Trophy,   label: 'Buscar Rival',    sub: 'Matchmaking abierto',  accent: true },
  { to: '/equipos/nuevo', icon: Users, label: 'Crear Equipo', sub: 'Sé el capitán',         accent: false },
  { to: '/canchas',  icon: MapPin,   label: 'Ver Canchas',     sub: 'Santiago y alrededores', accent: false },
]

function SkeletonRow() {
  return (
    <div style={{ display: 'flex', gap: '0.875rem', padding: '0.875rem', borderRadius: '0.75rem', background: 'rgba(255,255,255,0.02)' }}>
      <div style={{ width: 36, height: 36, borderRadius: '0.625rem', background: 'rgba(255,255,255,0.05)', flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div style={{ height: 12, background: 'rgba(255,255,255,0.05)', borderRadius: 6, marginBottom: '0.5rem', width: '60%' }} />
        <div style={{ height: 10, background: 'rgba(255,255,255,0.03)', borderRadius: 6, width: '40%' }} />
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { user, fetchMe } = useAuthStore()
  const { openMatches, fetchOpenMatches, loading: matchLoading } = useMatchStore()
  const [teams, setTeams] = useState([])
  const [teamsLoading, setTeamsLoading] = useState(true)

  useEffect(() => {
    fetchMe()
    fetchOpenMatches()
    api.get('/teams').then(r => { setTeams(r.data); setTeamsLoading(false) }).catch(() => setTeamsLoading(false))
  }, [])

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Buenos días' : hour < 20 ? 'Buenas tardes' : 'Buenas noches'

  return (
    <AppLayout>
      {/* ── Welcome banner ── */}
      <div style={{ marginBottom: '2rem' }}>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13, marginBottom: '0.25rem' }}>{greeting} 👋</p>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#fff', letterSpacing: '-0.5px' }}>
          {user?.name?.split(' ')[0] || 'Deportista'}
        </h1>
      </div>

      {/* ── Quick actions ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.875rem', marginBottom: '2rem' }}>
        {quickActions.map(a => (
          <Link key={a.to} to={a.to} style={{ textDecoration: 'none' }}>
            <div
              className="card card-green"
              style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', transition: 'transform 0.15s, border-color 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = a.accent ? 'rgba(132,204,22,0.4)' : 'rgba(255,255,255,0.15)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)' }}
            >
              <div style={{ width: 42, height: 42, borderRadius: '0.75rem', background: a.accent ? 'rgba(132,204,22,0.15)' : 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <a.icon size={19} color={a.accent ? '#84cc16' : 'rgba(255,255,255,0.6)'} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ color: '#fff', fontWeight: 600, fontSize: 14, marginBottom: '0.125rem' }}>{a.label}</p>
                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12 }}>{a.sub}</p>
              </div>
              <ChevronRight size={15} color="rgba(255,255,255,0.2)" />
            </div>
          </Link>
        ))}
      </div>

      {/* ── Main grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.25rem' }}>

        {/* Open matches */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              <Trophy size={16} color="#84cc16" />
              <h2 style={{ color: '#fff', fontWeight: 600, fontSize: 15 }}>Partidos abiertos</h2>
            </div>
            <Link to="/partidos" style={{ color: '#84cc16', fontSize: 12, textDecoration: 'none', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              Ver todos <ArrowRight size={12} />
            </Link>
          </div>

          {matchLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {[1,2,3].map(i => <SkeletonRow key={i} />)}
            </div>
          ) : openMatches.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2.5rem 0' }}>
              <Trophy size={32} color="rgba(255,255,255,0.08)" style={{ margin: '0 auto 0.75rem' }} />
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>No hay partidos abiertos ahora.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {openMatches.slice(0, 6).map(m => (
                <Link key={m.id} to={`/partidos/${m.id}`} style={{ textDecoration: 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', padding: '0.875rem', borderRadius: '0.75rem', transition: 'background 0.15s', cursor: 'pointer' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{ width: 38, height: 38, borderRadius: '0.625rem', background: 'rgba(20,83,45,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                      {m.sport?.icon || '⚽'}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ color: '#fff', fontSize: 13, fontWeight: 500, marginBottom: '0.125rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {m.home_team?.name} <span style={{ color: 'rgba(255,255,255,0.3)' }}>vs</span> {m.away_team?.name}
                      </p>
                      <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11 }}>
                        {m.commune} · {formatDate(m.scheduled_at)}
                      </p>
                    </div>
                    <span className="badge-open" style={{ fontSize: 11, fontWeight: 600, padding: '0.2rem 0.625rem', borderRadius: 99, flexShrink: 0 }}>
                      Abierto
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Teams */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              <Users size={16} color="#84cc16" />
              <h2 style={{ color: '#fff', fontWeight: 600, fontSize: 15 }}>Equipos</h2>
            </div>
            <Link to="/equipos" style={{ color: '#84cc16', fontSize: 12, textDecoration: 'none', fontWeight: 500 }}>Ver todos</Link>
          </div>

          {teamsLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[1,2,3,4].map(i => <SkeletonRow key={i} />)}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              {teams.slice(0, 6).map(t => (
                <Link key={t.id} to={`/equipos/${t.id}`} style={{ textDecoration: 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: '0.625rem', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{ width: 34, height: 34, borderRadius: '0.5rem', background: 'linear-gradient(135deg,#14532d,#166534)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#84cc16', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
                      {t.name?.charAt(0)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ color: '#fff', fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.name}</p>
                      <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>{t.sport?.name} · {t.commune}</p>
                    </div>
                    {t.is_open && <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#84cc16', flexShrink: 0 }} />}
                  </div>
                </Link>
              ))}
            </div>
          )}

          <Link to="/equipos/nuevo" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.3)', fontSize: 13, textDecoration: 'none', transition: 'color 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.color = '#84cc16'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.3)'}
          >
            + Crear equipo
          </Link>
        </div>
      </div>
    </AppLayout>
  )
}
