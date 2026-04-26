import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { ArrowLeft, Trophy, Users, AlertCircle, CheckCircle, Target } from 'lucide-react'
import AppLayout from '../components/AppLayout'
import api from '../api/client'
import useAuthStore from '../stores/authStore'

const communes = ['Providencia','Las Condes','Ñuñoa','Santiago Centro','Vitacura','La Florida','Macul','San Miguel','Peñalolén','Lo Barnechea']

const sel = {
  width: '100%',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '0.625rem',
  padding: '0.75rem 1rem',
  color: '#fff',
  fontSize: 14,
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.15s',
  colorScheme: 'dark',
  cursor: 'pointer',
}

function Field({ label, hint, children }) {
  return (
    <div>
      <label style={{ display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: '0.5rem', fontWeight: 500 }}>
        {label}
      </label>
      {children}
      {hint && <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 12, marginTop: '0.375rem' }}>{hint}</p>}
    </div>
  )
}

export default function NuevoPartido() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const prefilledOpponent = searchParams.get('opponent')
  const { user, fetchMe } = useAuthStore()
  const [allTeams, setAllTeams] = useState([])
  const [sports, setSports] = useState([])
  const [pageLoading, setPageLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState([])
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState({
    home_team_id: '',
    away_team_id: '',
    sport_id: '',
    commune: '',
    scheduled_at: '',
    is_open: true,
  })

  useEffect(() => {
    fetchMe()
    Promise.all([
      api.get('/sports'),
      api.get('/teams'),
    ]).then(([sp, tm]) => {
      setSports(sp.data)
      setAllTeams(tm.data)
      setPageLoading(false)
    }).catch(() => setPageLoading(false))
  }, [])

  // Auto-select if user has exactly one team, and pre-fill opponent from URL
  useEffect(() => {
    if (!user?.teams?.length || !allTeams.length) return
    setForm(f => {
      let next = { ...f }
      if (user.teams.length === 1) {
        const full = allTeams.find(t => t.id === user.teams[0].id)
        if (full) {
          next.home_team_id = String(full.id)
          if (full.sport?.id) next.sport_id = String(full.sport.id)
        }
      }
      if (prefilledOpponent) {
        const opp = allTeams.find(t => t.id === parseInt(prefilledOpponent))
        if (opp) {
          next.away_team_id = String(opp.id)
          next.is_open = false
        }
      }
      return next
    })
  }, [user?.teams?.length, allTeams.length])

  const setF = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleTeamChange = (teamId) => {
    const team = allTeams.find(t => t.id === parseInt(teamId))
    setForm(f => ({
      ...f,
      home_team_id: teamId,
      sport_id: team?.sport?.id ? String(team.sport.id) : f.sport_id,
      away_team_id: '',
    }))
  }

  const handleOpponentChange = (val) => {
    setForm(f => ({ ...f, away_team_id: val, is_open: !val }))
  }

  const myTeams = allTeams.filter(t => user?.teams?.some(ut => ut.id === t.id))

  const selectedHomeTeam = allTeams.find(t => t.id === parseInt(form.home_team_id))
  const opponentTeams = allTeams.filter(t => {
    if (t.id === parseInt(form.home_team_id)) return false
    if (selectedHomeTeam && t.sport?.id !== selectedHomeTeam.sport?.id) return false
    return true
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors([])
    if (!form.home_team_id) return setErrors(['Selecciona tu equipo'])
    if (!form.sport_id) return setErrors(['Selecciona un deporte'])

    setSubmitting(true)
    try {
      const payload = {
        home_team_id: parseInt(form.home_team_id),
        sport_id: parseInt(form.sport_id),
        is_open: !form.away_team_id ? true : form.is_open,
      }
      if (form.away_team_id) payload.away_team_id = parseInt(form.away_team_id)
      if (form.commune) payload.commune = form.commune
      if (form.scheduled_at) payload.scheduled_at = form.scheduled_at

      const res = await api.post('/matches', { match: payload })
      setSuccess(true)
      setTimeout(() => navigate(`/partidos/${res.data.id}`), 800)
    } catch (err) {
      setErrors(err.response?.data?.errors || ['Error al crear el partido'])
      setSubmitting(false)
    }
  }

  if (!user || pageLoading) {
    return (
      <AppLayout>
        <div style={{ textAlign: 'center', padding: '5rem', color: 'rgba(255,255,255,0.3)' }}>Cargando…</div>
      </AppLayout>
    )
  }

  if (!myTeams.length) {
    return (
      <AppLayout>
        <div style={{ textAlign: 'center', padding: '5rem 0' }}>
          <div style={{ width: 72, height: 72, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
            <Trophy size={30} color="rgba(255,255,255,0.15)" />
          </div>
          <h2 style={{ color: '#fff', fontWeight: 700, fontSize: 18, marginBottom: '0.5rem' }}>Necesitas un equipo primero</h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginBottom: '1.75rem', maxWidth: 360, margin: '0 auto 1.75rem' }}>
            Crea o únete a un equipo para poder publicar un partido.
          </p>
          <Link to="/equipos/nuevo" className="btn-primary">
            <Users size={15} /> Crear equipo
          </Link>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <Link to="/partidos"
        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', color: 'rgba(255,255,255,0.35)', fontSize: 13, textDecoration: 'none', marginBottom: '1.5rem', transition: 'color 0.15s' }}
        onMouseEnter={e => e.currentTarget.style.color = '#fff'}
        onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.35)'}
      >
        <ArrowLeft size={14} /> Volver a partidos
      </Link>

      <div style={{ maxWidth: 560 }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: '#fff', letterSpacing: '-0.5px', marginBottom: '0.25rem' }}>Crear partido</h1>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14 }}>Busca rival o programa un partido contra un equipo específico.</p>
        </div>

        <div className="card" style={{ padding: '2rem' }}>
          {errors.length > 0 && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '0.625rem', padding: '0.875rem 1rem', marginBottom: '1.5rem', display: 'flex', gap: '0.625rem', alignItems: 'flex-start' }}>
              <AlertCircle size={16} color="#f87171" style={{ flexShrink: 0, marginTop: 1 }} />
              <div>{errors.map((e, i) => <p key={i} style={{ color: '#f87171', fontSize: 13, lineHeight: 1.5 }}>{e}</p>)}</div>
            </div>
          )}

          {success && (
            <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: '0.625rem', padding: '0.875rem 1rem', marginBottom: '1.5rem', display: 'flex', gap: '0.625rem', alignItems: 'center' }}>
              <CheckCircle size={16} color="#4ade80" />
              <p style={{ color: '#4ade80', fontSize: 13 }}>¡Partido publicado! Redirigiendo…</p>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* My team */}
            <Field label="Tu equipo" hint="Serás el equipo local">
              <select
                value={form.home_team_id}
                onChange={e => handleTeamChange(e.target.value)}
                required
                style={sel}
                onFocus={e => e.target.style.borderColor = 'rgba(132,204,22,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              >
                <option value="">Selecciona tu equipo</option>
                {myTeams.map(t => (
                  <option key={t.id} value={t.id}>{t.name} — {t.sport?.name}</option>
                ))}
              </select>
            </Field>

            {/* Sport */}
            <Field label="Deporte">
              <select
                value={form.sport_id}
                onChange={e => setF('sport_id', e.target.value)}
                required
                style={sel}
                onFocus={e => e.target.style.borderColor = 'rgba(132,204,22,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              >
                <option value="">Selecciona un deporte</option>
                {sports.map(s => <option key={s.id} value={s.id}>{s.icon} {s.name}</option>)}
              </select>
            </Field>

            {/* Opponent — optional */}
            <Field
              label="Rival"
              hint={form.away_team_id ? 'Partido privado — solo tu equipo y el rival verán este partido' : 'Dejar en blanco para publicar y buscar rival online'}
            >
              <select
                value={form.away_team_id}
                onChange={e => handleOpponentChange(e.target.value)}
                style={sel}
                disabled={!form.home_team_id}
                onFocus={e => e.target.style.borderColor = 'rgba(132,204,22,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              >
                <option value="">🔍 Publicar y buscar rival (abierto)</option>
                {opponentTeams.map(t => (
                  <option key={t.id} value={t.id}>{t.name}{t.commune ? ` — ${t.commune}` : ''}</option>
                ))}
              </select>
            </Field>

            {/* Commune */}
            <Field label="Comuna">
              <select
                value={form.commune}
                onChange={e => setF('commune', e.target.value)}
                style={sel}
                onFocus={e => e.target.style.borderColor = 'rgba(132,204,22,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              >
                <option value="">Selecciona una comuna (opcional)</option>
                {communes.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>

            {/* Date/time */}
            <Field label="Fecha y hora" hint="Opcional — puedes confirmarla después">
              <input
                type="datetime-local"
                value={form.scheduled_at}
                onChange={e => setF('scheduled_at', e.target.value)}
                style={{ ...sel, cursor: 'default' }}
                onFocus={e => e.target.style.borderColor = 'rgba(132,204,22,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </Field>

            {/* Open/closed toggle — only relevant when opponent is selected */}
            {form.away_team_id && (
              <div
                onClick={() => setF('is_open', !form.is_open)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.875rem', padding: '1rem',
                  background: form.is_open ? 'rgba(132,204,22,0.06)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${form.is_open ? 'rgba(132,204,22,0.2)' : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: '0.625rem', cursor: 'pointer', transition: 'background 0.15s, border-color 0.15s',
                }}
              >
                <div style={{ width: 36, height: 20, background: form.is_open ? '#84cc16' : 'rgba(255,255,255,0.12)', borderRadius: 99, position: 'relative', flexShrink: 0, transition: 'background 0.2s' }}>
                  <div style={{ position: 'absolute', top: 3, left: form.is_open ? 19 : 3, width: 14, height: 14, background: '#fff', borderRadius: '50%', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }} />
                </div>
                <div>
                  <p style={{ color: form.is_open ? '#84cc16' : 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: 600 }}>
                    {form.is_open ? 'Partido abierto' : 'Partido privado'}
                  </p>
                  <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, marginTop: 2 }}>
                    {form.is_open ? 'Visible para otros equipos que quieran desafiar' : 'Solo visible para los equipos involucrados'}
                  </p>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting || success}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', opacity: submitting || success ? 0.7 : 1, marginTop: '0.5rem' }}
            >
              <Target size={15} />
              {submitting ? 'Publicando…' : success ? '¡Publicado!' : (form.away_team_id ? 'Programar partido' : 'Buscar rival')}
            </button>
          </form>
        </div>
      </div>
    </AppLayout>
  )
}
