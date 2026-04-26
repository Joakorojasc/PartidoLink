import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { CheckCircle, AlertTriangle, Clock, Send, ArrowLeft, MapPin, Calendar, Swords } from 'lucide-react'
import AppLayout from '../components/AppLayout'
import useMatchStore from '../stores/matchStore'
import useAuthStore from '../stores/authStore'

function formatDate(dt) {
  if (!dt) return 'Por confirmar'
  return new Date(dt).toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })
}

function ScoreInput({ label, value, onChange }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginBottom: '0.625rem', fontWeight: 500 }}>{label}</p>
      <input
        type="number" min="0" value={value} onChange={onChange} required
        style={{ width: 80, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '0.75rem', padding: '0.75rem', color: '#fff', fontSize: 28, fontWeight: 800, textAlign: 'center', outline: 'none', transition: 'border-color 0.15s' }}
        onFocus={e => e.target.style.borderColor = 'rgba(132,204,22,0.5)'}
        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
      />
    </div>
  )
}

function StatusBadge({ status }) {
  const map = {
    played:    { label: '✓ Validado',   bg: 'rgba(34,197,94,0.15)',  color: '#4ade80',  border: 'rgba(34,197,94,0.3)' },
    disputed:  { label: '⚠ Disputado',  bg: 'rgba(239,68,68,0.15)', color: '#f87171',  border: 'rgba(239,68,68,0.3)' },
    cancelled: { label: 'Cancelado',    bg: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)', border: 'rgba(255,255,255,0.1)' },
    scheduled: { label: 'Programado',   bg: 'rgba(132,204,22,0.12)', color: '#84cc16', border: 'rgba(132,204,22,0.25)' },
  }
  const s = map[status] || map.scheduled
  return (
    <span style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}`, borderRadius: 99, padding: '0.3rem 0.875rem', fontSize: 12, fontWeight: 600 }}>
      {s.label}
    </span>
  )
}

export default function PartidoDetalle() {
  const { id } = useParams()
  const { currentMatch, fetchMatch, submitResult, acceptResult, rejectResult } = useMatchStore()
  const { user } = useAuthStore()
  const [form, setForm] = useState({ home_score: '', away_score: '' })
  const [submitting, setSubmitting] = useState(false)
  const [msg, setMsg] = useState(null)
  const [msgType, setMsgType] = useState('success')

  useEffect(() => { fetchMatch(id) }, [id])

  if (!currentMatch) return (
    <AppLayout>
      <div style={{ textAlign: 'center', padding: '5rem', color: 'rgba(255,255,255,0.3)' }}>Cargando partido…</div>
    </AppLayout>
  )

  const m = currentMatch
  const myTeamIds = user?.teams?.map(t => t.id) || []
  const myTeamInMatch = myTeamIds.find(tid => tid === m.home_team?.id || tid === m.away_team?.id)
  const myResult = m.results?.find(r => r.submitted_by_team_id === myTeamInMatch)
  const otherResult = m.results?.find(r => r.submitted_by_team_id !== myTeamInMatch)
  const bothValidated = m.results?.every(r => r.is_validated)
  const validatedResult = bothValidated ? m.results?.[0] : null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setMsg(null)
    try {
      await submitResult(id, { ...form, submitted_by_team_id: myTeamInMatch })
      await fetchMatch(id)
      setMsg('Resultado enviado. Esperando confirmación del rival.')
      setMsgType('success')
    } catch (err) {
      setMsg(err.response?.data?.errors?.join(', ') || 'Error al enviar resultado')
      setMsgType('error')
    }
    setSubmitting(false)
  }

  const handleAccept = async (resultId) => {
    await acceptResult(id, resultId)
    await fetchMatch(id)
  }

  const handleReject = async (resultId) => {
    await rejectResult(id, resultId)
    await fetchMatch(id)
  }

  return (
    <AppLayout>
      <Link to="/partidos" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', color: 'rgba(255,255,255,0.35)', fontSize: 13, textDecoration: 'none', marginBottom: '1.5rem', transition: 'color 0.15s' }}
        onMouseEnter={e => e.currentTarget.style.color = '#fff'}
        onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.35)'}
      >
        <ArrowLeft size={14} /> Volver a partidos
      </Link>

      {/* ── Hero match card ── */}
      <div className="card" style={{ padding: '2.5rem', marginBottom: '1.25rem' }}>
        {/* Top row: sport + status */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: 20 }}>{m.sport?.icon}</span>
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>{m.sport?.name}</span>
          </div>
          <StatusBadge status={m.status} />
        </div>

        {/* VS layout */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2rem' }}>
          {/* Home team */}
          <div style={{ textAlign: 'center', flex: 1 }}>
            <div style={{ width: 72, height: 72, borderRadius: '1.125rem', background: 'linear-gradient(135deg,#14532d,#166534)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#84cc16', fontWeight: 800, fontSize: 28, margin: '0 auto 0.875rem' }}>
              {m.home_team?.name?.charAt(0)}
            </div>
            <p style={{ color: '#fff', fontWeight: 600, fontSize: 15, marginBottom: '0.25rem' }}>{m.home_team?.name}</p>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>Local</p>
          </div>

          {/* Score / VS */}
          <div style={{ textAlign: 'center', flexShrink: 0 }}>
            {validatedResult ? (
              <div style={{ fontSize: 48, fontWeight: 900, color: '#fff', letterSpacing: '-2px', lineHeight: 1 }}>
                {validatedResult.home_score}<span style={{ color: 'rgba(255,255,255,0.2)', margin: '0 0.25rem' }}>–</span>{validatedResult.away_score}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <Swords size={24} color="rgba(255,255,255,0.15)" />
                <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: 13, fontWeight: 700, letterSpacing: '2px' }}>VS</span>
              </div>
            )}
          </div>

          {/* Away team */}
          <div style={{ textAlign: 'center', flex: 1 }}>
            <div style={{ width: 72, height: 72, borderRadius: '1.125rem', background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.6)', fontWeight: 800, fontSize: 28, margin: '0 auto 0.875rem' }}>
              {m.away_team?.name?.charAt(0)}
            </div>
            <p style={{ color: '#fff', fontWeight: 600, fontSize: 15, marginBottom: '0.25rem' }}>{m.away_team?.name}</p>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>Visitante</p>
          </div>
        </div>

        {/* Meta info */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '1.75rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.06)', flexWrap: 'wrap' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'rgba(255,255,255,0.35)', fontSize: 13 }}>
            <Calendar size={13} /> {formatDate(m.scheduled_at)}
          </span>
          {m.venue && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'rgba(255,255,255,0.35)', fontSize: 13 }}>
              <MapPin size={13} /> {m.venue.name}
            </span>
          )}
          {m.commune && !m.venue && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'rgba(255,255,255,0.35)', fontSize: 13 }}>
              <MapPin size={13} /> {m.commune}
            </span>
          )}
        </div>
      </div>

      {/* ── Result section (only for match participants) ── */}
      {myTeamInMatch && m.status !== 'played' && m.status !== 'cancelled' && (
        <div style={{ display: 'grid', gridTemplateColumns: otherResult ? '1fr 1fr' : '1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
          {/* Submit form or already submitted */}
          {!myResult ? (
            <div className="card" style={{ padding: '1.75rem' }}>
              <h2 style={{ color: '#fff', fontWeight: 600, fontSize: 15, marginBottom: '1.5rem' }}>Enviar resultado</h2>

              {msg && (
                <div style={{ background: msgType === 'success' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${msgType === 'success' ? 'rgba(34,197,94,0.25)' : 'rgba(239,68,68,0.25)'}`, borderRadius: '0.625rem', padding: '0.75rem', marginBottom: '1.25rem' }}>
                  <p style={{ color: msgType === 'success' ? '#4ade80' : '#f87171', fontSize: 13 }}>{msg}</p>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', justifyContent: 'center', marginBottom: '1.5rem' }}>
                  <ScoreInput label={m.home_team?.name} value={form.home_score} onChange={e => setForm(f => ({ ...f, home_score: e.target.value }))} />
                  <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 28, fontWeight: 800, paddingTop: '1.5rem' }}>–</span>
                  <ScoreInput label={m.away_team?.name} value={form.away_score} onChange={e => setForm(f => ({ ...f, away_score: e.target.value }))} />
                </div>
                <button type="submit" disabled={submitting} className="btn-primary" style={{ width: '100%', justifyContent: 'center', opacity: submitting ? 0.6 : 1 }}>
                  <Send size={14} /> {submitting ? 'Enviando…' : 'Enviar resultado'}
                </button>
              </form>
            </div>
          ) : (
            <div className="card" style={{ padding: '1.75rem' }}>
              <h2 style={{ color: '#fff', fontWeight: 600, fontSize: 15, marginBottom: '1.5rem' }}>Tu resultado enviado</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <span style={{ fontSize: 40, fontWeight: 900, color: '#fff' }}>{myResult.home_score}</span>
                <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 28 }}>–</span>
                <span style={{ fontSize: 40, fontWeight: 900, color: '#fff' }}>{myResult.away_score}</span>
              </div>
              {myResult.suspicious && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(234,179,8,0.1)', border: '1px solid rgba(234,179,8,0.25)', borderRadius: '0.5rem', padding: '0.75rem', marginBottom: '1rem' }}>
                  <AlertTriangle size={14} color="#facc15" />
                  <p style={{ color: '#facc15', fontSize: 12 }}>Resultado inusualmente alto — marcado para revisión</p>
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>
                <Clock size={14} /> Esperando respuesta del rival
              </div>
            </div>
          )}

          {/* Opponent result */}
          {otherResult && (
            <div className="card" style={{ padding: '1.75rem' }}>
              <h2 style={{ color: '#fff', fontWeight: 600, fontSize: 15, marginBottom: '1.5rem' }}>Resultado del rival</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <span style={{ fontSize: 40, fontWeight: 900, color: '#fff' }}>{otherResult.home_score}</span>
                <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 28 }}>–</span>
                <span style={{ fontSize: 40, fontWeight: 900, color: '#fff' }}>{otherResult.away_score}</span>
              </div>
              {myResult && !otherResult.is_validated && (
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button
                    onClick={() => handleAccept(otherResult.id)}
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: '0.625rem', padding: '0.75rem', color: '#4ade80', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(34,197,94,0.18)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(34,197,94,0.1)'}
                  >
                    <CheckCircle size={14} /> Aceptar
                  </button>
                  <button
                    onClick={() => handleReject(otherResult.id)}
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '0.625rem', padding: '0.75rem', color: '#f87171', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.18)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
                  >
                    <AlertTriangle size={14} /> Rechazar
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── Outcome banners ── */}
      {m.status === 'played' && (
        <div style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '1rem', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: 48, height: 48, background: 'rgba(34,197,94,0.15)', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <CheckCircle size={24} color="#4ade80" />
          </div>
          <div>
            <h3 style={{ color: '#4ade80', fontWeight: 600, fontSize: 15, marginBottom: '0.25rem' }}>Resultado validado</h3>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>Ambos equipos confirmaron el mismo marcador. El resultado está en el historial de ambos equipos.</p>
          </div>
        </div>
      )}

      {m.status === 'disputed' && (
        <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '1rem', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: 48, height: 48, background: 'rgba(239,68,68,0.15)', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <AlertTriangle size={24} color="#f87171" />
          </div>
          <div>
            <h3 style={{ color: '#f87171', fontWeight: 600, fontSize: 15, marginBottom: '0.25rem' }}>Resultado disputado</h3>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>Los equipos enviaron marcadores distintos. Contacta al equipo rival para resolverlo o comunícate con el administrador.</p>
          </div>
        </div>
      )}
    </AppLayout>
  )
}
