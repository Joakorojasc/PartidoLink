import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Users, AlertCircle, CheckCircle } from 'lucide-react'
import AppLayout from '../components/AppLayout'
import api from '../api/client'

const communes = ['Providencia','Las Condes','Ñuñoa','Santiago Centro','Vitacura','La Florida','Macul','San Miguel','Peñalolén','Lo Barnechea']

const inputStyle = {
  width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '0.625rem', padding: '0.75rem 1rem', color: '#fff', fontSize: 14,
  outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.15s',
}

function Field({ label, hint, children }) {
  return (
    <div>
      <label style={{ display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: '0.5rem', fontWeight: 500 }}>{label}</label>
      {children}
      {hint && <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 12, marginTop: '0.375rem' }}>{hint}</p>}
    </div>
  )
}

export default function NuevoEquipo() {
  const [form, setForm] = useState({ name: '', sport_id: '', description: '', commune: '', is_open: true })
  const [sports, setSports] = useState([])
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState([])
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/sports').then(r => setSports(r.data)).catch(() => {})
  }, [])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors([])
    setLoading(true)
    try {
      const res = await api.post('/teams', { team: form })
      setSuccess(true)
      setTimeout(() => navigate(`/equipos/${res.data.id}`), 800)
    } catch (err) {
      setErrors(err.response?.data?.errors || ['Error al crear el equipo'])
      setLoading(false)
    }
  }

  return (
    <AppLayout>
      <Link to="/equipos" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', color: 'rgba(255,255,255,0.35)', fontSize: 13, textDecoration: 'none', marginBottom: '1.5rem', transition: 'color 0.15s' }}
        onMouseEnter={e => e.currentTarget.style.color = '#fff'}
        onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.35)'}
      >
        <ArrowLeft size={14} /> Volver a equipos
      </Link>

      <div style={{ maxWidth: 540 }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: '#fff', letterSpacing: '-0.5px', marginBottom: '0.25rem' }}>Crear equipo</h1>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14 }}>Tú serás el capitán y podrás invitar miembros.</p>
        </div>

        <div className="card" style={{ padding: '2rem' }}>
          {/* Error banner */}
          {errors.length > 0 && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '0.625rem', padding: '0.875rem 1rem', marginBottom: '1.5rem', display: 'flex', gap: '0.625rem', alignItems: 'flex-start' }}>
              <AlertCircle size={16} color="#f87171" style={{ flexShrink: 0, marginTop: 1 }} />
              <div>
                {errors.map((e, i) => (
                  <p key={i} style={{ color: '#f87171', fontSize: 13, lineHeight: 1.5 }}>{e}</p>
                ))}
              </div>
            </div>
          )}

          {/* Success state */}
          {success && (
            <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: '0.625rem', padding: '0.875rem 1rem', marginBottom: '1.5rem', display: 'flex', gap: '0.625rem', alignItems: 'center' }}>
              <CheckCircle size={16} color="#4ade80" />
              <p style={{ color: '#4ade80', fontSize: 13 }}>¡Equipo creado! Redirigiendo…</p>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <Field label="Nombre del equipo" hint="Elige un nombre que represente a tu equipo">
              <input
                value={form.name}
                onChange={e => set('name', e.target.value)}
                required
                placeholder="Los Cóndores FC"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'rgba(132,204,22,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </Field>

            <Field label="Deporte">
              <select
                value={form.sport_id}
                onChange={e => set('sport_id', e.target.value)}
                required
                style={{ ...inputStyle, cursor: 'pointer' }}
                onFocus={e => e.target.style.borderColor = 'rgba(132,204,22,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              >
                <option value="">Selecciona un deporte</option>
                {sports.map(s => <option key={s.id} value={s.id}>{s.icon} {s.name}</option>)}
              </select>
            </Field>

            <Field label="Comuna">
              <select
                value={form.commune}
                onChange={e => set('commune', e.target.value)}
                style={{ ...inputStyle, cursor: 'pointer' }}
                onFocus={e => e.target.style.borderColor = 'rgba(132,204,22,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              >
                <option value="">Selecciona una comuna (opcional)</option>
                {communes.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>

            <Field label="Descripción" hint="Opcional — cuéntanos sobre tu equipo, nivel de juego, horarios, etc.">
              <textarea
                value={form.description}
                onChange={e => set('description', e.target.value)}
                placeholder="Equipo de fútbol 11 con experiencia en torneos amateur de Santiago…"
                rows={3}
                style={{ ...inputStyle, resize: 'none', lineHeight: 1.6 }}
                onFocus={e => e.target.style.borderColor = 'rgba(132,204,22,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </Field>

            {/* Open toggle */}
            <div
              onClick={() => set('is_open', !form.is_open)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', padding: '1rem', background: form.is_open ? 'rgba(132,204,22,0.06)' : 'rgba(255,255,255,0.03)', border: `1px solid ${form.is_open ? 'rgba(132,204,22,0.2)' : 'rgba(255,255,255,0.08)'}`, borderRadius: '0.625rem', cursor: 'pointer', transition: 'background 0.15s, border-color 0.15s' }}
            >
              {/* Toggle switch */}
              <div style={{ width: 36, height: 20, background: form.is_open ? '#84cc16' : 'rgba(255,255,255,0.12)', borderRadius: 99, position: 'relative', flexShrink: 0, transition: 'background 0.2s' }}>
                <div style={{ position: 'absolute', top: 3, left: form.is_open ? 19 : 3, width: 14, height: 14, background: '#fff', borderRadius: '50%', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }} />
              </div>
              <div>
                <p style={{ color: form.is_open ? '#84cc16' : 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: 600 }}>
                  {form.is_open ? 'Equipo abierto' : 'Equipo cerrado'}
                </p>
                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, marginTop: 2 }}>
                  {form.is_open ? 'Cualquier jugador puede unirse' : 'Solo por invitación del capitán'}
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || success}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', opacity: loading || success ? 0.7 : 1, marginTop: '0.5rem' }}
            >
              <Users size={15} />
              {loading ? 'Creando equipo…' : success ? '¡Creado!' : 'Crear equipo'}
            </button>
          </form>
        </div>
      </div>
    </AppLayout>
  )
}
