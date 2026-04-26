import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Trophy, Star, AlertTriangle, Users, ArrowLeft, CheckCircle, Swords } from 'lucide-react'
import AppLayout from '../components/AppLayout'
import api from '../api/client'
import useAuthStore from '../stores/authStore'

function RecordBadge({ label, value, bg, color }) {
  return (
    <div style={{ textAlign: 'center', padding: '1rem 1.5rem', borderRadius: '0.875rem', background: bg }}>
      <div style={{ fontSize: 26, fontWeight: 800, color, letterSpacing: '-0.5px' }}>{value}</div>
      <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: '0.125rem' }}>{label}</div>
    </div>
  )
}

function formatDate(dt) {
  if (!dt) return '—'
  return new Date(dt).toLocaleDateString('es-CL', { day: 'numeric', month: 'short', year: 'numeric' })
}

const tabs = [['validated','✓ Validados'],['all','Todos'],['disputed','⚠ Disputados']]

export default function EquipoDetalle() {
  const { id } = useParams()
  const { user } = useAuthStore()
  const [team, setTeam] = useState(null)
  const [stats, setStats] = useState(null)
  const [matches, setMatches] = useState([])
  const [tab, setTab] = useState('validated')
  const [loading, setLoading] = useState(true)
  const [joining, setJoining] = useState(false)
  const [joined, setJoined] = useState(false)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      api.get(`/teams/${id}`),
      api.get(`/teams/${id}/stats`),
      api.get(`/teams/${id}/matches`, { params: { filter: 'validated' } }),
    ]).then(([t, s, m]) => { setTeam(t.data); setStats(s.data); setMatches(m.data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [id])

  useEffect(() => {
    if (!loading) {
      api.get(`/teams/${id}/matches`, { params: { filter: tab } }).then(r => setMatches(r.data)).catch(() => {})
    }
  }, [tab])

  const handleJoin = async () => {
    setJoining(true)
    try { await api.post(`/teams/${id}/join`); setJoined(true) } catch {}
    setJoining(false)
  }

  if (loading) return <AppLayout><div style={{ textAlign: 'center', padding: '5rem', color: 'rgba(255,255,255,0.3)' }}>Cargando equipo…</div></AppLayout>
  if (!team) return <AppLayout><div style={{ textAlign: 'center', padding: '5rem', color: 'rgba(255,255,255,0.3)' }}>Equipo no encontrado.</div></AppLayout>

  const isMember = user && team.members?.some(m => m.id === user.id)

  return (
    <AppLayout>
      <Link to="/equipos" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', color: 'rgba(255,255,255,0.35)', fontSize: 13, textDecoration: 'none', marginBottom: '1.5rem', transition: 'color 0.15s' }}
        onMouseEnter={e => e.currentTarget.style.color = '#fff'}
        onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.35)'}
      >
        <ArrowLeft size={14} /> Volver a equipos
      </Link>

      {/* ── Header ── */}
      <div className="card" style={{ padding: '2rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: 60, height: 60, borderRadius: '1rem', background: 'linear-gradient(135deg,#14532d,#166534)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#84cc16', fontWeight: 800, fontSize: 26, flexShrink: 0 }}>
              {team.name?.charAt(0)}
            </div>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: '#fff', letterSpacing: '-0.25px', marginBottom: '0.375rem' }}>{team.name}</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13 }}>{team.sport?.icon} {team.sport?.name}</span>
                {team.commune && <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>· {team.commune}</span>}
                {team.is_open && <span className="badge-open" style={{ fontSize: 11, fontWeight: 600, padding: '0.2rem 0.625rem', borderRadius: 99 }}>Abierto</span>}
              </div>
              {team.description && <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13, marginTop: '0.5rem', maxWidth: 500 }}>{team.description}</p>}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
            {user && !isMember && (
              <Link
                to={`/partidos/nuevo?opponent=${id}`}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '0.75rem', padding: '0.625rem 1.25rem', color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: 600, textDecoration: 'none', transition: 'background 0.15s, border-color 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)' }}
              >
                <Swords size={14} /> Desafiar equipo
              </Link>
            )}
            {!isMember && team.is_open && !joined && (
              <button onClick={handleJoin} disabled={joining} className="btn-primary" style={{ opacity: joining ? 0.6 : 1 }}>
                <Users size={14} /> {joining ? 'Uniéndose…' : 'Unirse al equipo'}
              </button>
            )}
            {joined && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#84cc16', fontSize: 14 }}>
                <CheckCircle size={16} /> ¡Te uniste!
              </div>
            )}
          </div>
        </div>

        {/* Record */}
        {stats && (
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <RecordBadge label="Victorias" value={stats.overall?.wins ?? 0} bg="rgba(34,197,94,0.1)" color="#4ade80" />
            <RecordBadge label="Empates" value={stats.overall?.draws ?? 0} bg="rgba(234,179,8,0.1)" color="#facc15" />
            <RecordBadge label="Derrotas" value={stats.overall?.losses ?? 0} bg="rgba(239,68,68,0.1)" color="#f87171" />
            <RecordBadge label="Partidos" value={stats.total_matches ?? 0} bg="rgba(255,255,255,0.04)" color="#fff" />
            {stats.rejection_count > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '1rem 1.5rem', borderRadius: '0.875rem', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                <AlertTriangle size={16} color="#f87171" />
                <div>
                  <div style={{ fontSize: 26, fontWeight: 800, color: '#f87171', letterSpacing: '-0.5px' }}>{stats.rejection_count}</div>
                  <div style={{ color: 'rgba(239,68,68,0.6)', fontSize: 12 }}>Rechazados</div>
                </div>
              </div>
            )}
            {team.average_rating && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '1rem 1.5rem', borderRadius: '0.875rem', background: 'rgba(234,179,8,0.08)' }}>
                <Star size={16} color="#facc15" />
                <div>
                  <div style={{ fontSize: 26, fontWeight: 800, color: '#facc15', letterSpacing: '-0.5px' }}>{team.average_rating}</div>
                  <div style={{ color: 'rgba(234,179,8,0.6)', fontSize: 12 }}>Valoración</div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: '1.25rem', alignItems: 'start' }}>
        {/* Match history */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h2 style={{ color: '#fff', fontWeight: 600, fontSize: 15, marginBottom: '1rem' }}>Historial de partidos</h2>
          <div style={{ display: 'flex', gap: '0.375rem', marginBottom: '1.25rem' }}>
            {tabs.map(([val, label]) => (
              <button key={val} onClick={() => setTab(val)}
                style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: tab === val ? 600 : 400, background: tab === val ? 'rgba(20,83,45,0.5)' : 'transparent', color: tab === val ? '#84cc16' : 'rgba(255,255,255,0.4)', transition: 'background 0.15s, color 0.15s' }}
              >
                {label}
              </button>
            ))}
          </div>

          {matches.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 0' }}>
              <Swords size={32} color="rgba(255,255,255,0.07)" style={{ margin: '0 auto 0.75rem' }} />
              <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 13 }}>Sin partidos en esta categoría</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {matches.map(m => {
                const result = m.results?.[0]
                return (
                  <Link key={m.id} to={`/partidos/${m.id}`} style={{ textDecoration: 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.875rem', borderRadius: '0.75rem', transition: 'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ color: '#fff', fontSize: 13, fontWeight: 500, marginBottom: '0.125rem' }}>
                          {m.home_team?.name} <span style={{ color: 'rgba(255,255,255,0.3)' }}>vs</span> {m.away_team?.name || <span style={{ color: 'rgba(255,255,255,0.25)', fontStyle: 'italic' }}>Por definir</span>}
                        </p>
                        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>{formatDate(m.scheduled_at)} · {m.sport?.name}</p>
                      </div>
                      {result && (
                        <span style={{ color: '#fff', fontWeight: 700, fontSize: 15, flexShrink: 0 }}>
                          {result.home_score} – {result.away_score}
                        </span>
                      )}
                      <span className={m.status === 'played' ? 'badge-played' : m.status === 'disputed' ? 'badge-disp' : 'badge-sched'} style={{ fontSize: 11, fontWeight: 600, padding: '0.2rem 0.625rem', borderRadius: 99, flexShrink: 0 }}>
                        {m.status === 'played' ? '✓ Validado' : m.status === 'disputed' ? '⚠ Disputado' : 'Programado'}
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        {/* Roster */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h2 style={{ color: '#fff', fontWeight: 600, fontSize: 15, marginBottom: '1rem' }}>
            Plantilla · {team.members?.length || 0} jugadores
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
            {team.members?.map(m => {
              const isCaptain = m.id === team.captain?.id
              return (
                <Link key={m.id} to={`/perfil/${m.id}`} style={{ textDecoration: 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '0.625rem 0.5rem', borderRadius: '0.5rem', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: isCaptain ? 'linear-gradient(135deg,#14532d,#166534)' : 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isCaptain ? '#84cc16' : 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                      {m.name?.charAt(0)}
                    </div>
                    <span style={{ color: '#fff', fontSize: 13, flex: 1 }}>{m.name?.split(' ')[0]}</span>
                    {isCaptain && <span style={{ fontSize: 10, color: '#84cc16', fontWeight: 600 }}>CAP</span>}
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
