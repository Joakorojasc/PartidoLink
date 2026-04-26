import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Edit2, Save, X, User, Phone, FileText, Trophy } from 'lucide-react'
import AppLayout from '../components/AppLayout'
import useAuthStore from '../stores/authStore'
import api from '../api/client'

const skillLabels = { beginner: 'Principiante', intermediate: 'Intermedio', advanced: 'Avanzado', pro: 'Profesional' }
const skillColors = {
  beginner:     { bg: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.5)' },
  intermediate: { bg: 'rgba(59,130,246,0.12)', color: '#60a5fa' },
  advanced:     { bg: 'rgba(132,204,22,0.12)', color: '#84cc16' },
  pro:          { bg: 'rgba(234,179,8,0.12)',  color: '#facc15' },
}

const inputStyle = {
  width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '0.5rem', padding: '0.625rem 0.875rem', color: '#fff', fontSize: 14,
  outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.15s',
}

export default function Perfil() {
  const { user, fetchMe, updateProfile } = useAuthStore()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', bio: '' })
  const [sports, setSports] = useState([])
  const [saving, setSaving] = useState(false)

  useEffect(() => { fetchMe() }, [])

  useEffect(() => {
    if (user) {
      setForm({ name: user.name || '', phone: user.phone || '', bio: user.bio || '' })
      if (user.id) {
        api.get(`/users/${user.id}/sports`).then(r => setSports(r.data)).catch(() => {})
      }
    }
  }, [user?.id])

  const handleSave = async () => {
    setSaving(true)
    await updateProfile(form)
    setSaving(false)
    setEditing(false)
  }

  if (!user) return (
    <AppLayout>
      <div style={{ textAlign: 'center', padding: '5rem', color: 'rgba(255,255,255,0.3)' }}>Cargando perfil…</div>
    </AppLayout>
  )

  return (
    <AppLayout>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: '#fff', letterSpacing: '-0.5px', marginBottom: '0.25rem' }}>Mi perfil</h1>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14 }}>Gestiona tu información personal</p>
        </div>

        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '0.625rem', padding: '0.625rem 1rem', color: 'rgba(255,255,255,0.7)', fontSize: 13, cursor: 'pointer', transition: 'background 0.15s, border-color 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.09)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)' }}
          >
            <Edit2 size={14} /> Editar perfil
          </button>
        ) : (
          <div style={{ display: 'flex', gap: '0.625rem' }}>
            <button
              onClick={() => setEditing(false)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.625rem', padding: '0.625rem 1rem', color: 'rgba(255,255,255,0.5)', fontSize: 13, cursor: 'pointer', transition: 'background 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <X size={14} /> Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-primary"
              style={{ opacity: saving ? 0.6 : 1 }}
            >
              <Save size={14} /> {saving ? 'Guardando…' : 'Guardar'}
            </button>
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '1.25rem', alignItems: 'start', maxWidth: 860 }}>
        {/* Main profile card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="card" style={{ padding: '2rem' }}>
            {/* Avatar + name */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem', marginBottom: '1.75rem' }}>
              <div style={{ width: 72, height: 72, borderRadius: '1rem', background: 'linear-gradient(135deg,#14532d,#166534)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#84cc16', fontWeight: 800, fontSize: 28, flexShrink: 0 }}>
                {user.name?.charAt(0)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                {editing ? (
                  <input
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    style={{ ...inputStyle, fontSize: 18, fontWeight: 700, marginBottom: '0.5rem' }}
                    onFocus={e => e.target.style.borderColor = 'rgba(132,204,22,0.5)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                  />
                ) : (
                  <h2 style={{ color: '#fff', fontWeight: 700, fontSize: 20, marginBottom: '0.375rem' }}>{user.name}</h2>
                )}
                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13 }}>{user.email}</p>
                <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12, marginTop: '0.125rem' }}>{user.rut}</p>
              </div>
            </div>

            {/* Fields */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Phone */}
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  <Phone size={11} /> Teléfono
                </label>
                {editing ? (
                  <input
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    placeholder="+56 9 12345678"
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = 'rgba(132,204,22,0.5)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                  />
                ) : (
                  <p style={{ color: user.phone ? '#fff' : 'rgba(255,255,255,0.2)', fontSize: 14 }}>
                    {user.phone || 'No especificado'}
                  </p>
                )}
              </div>

              {/* Bio */}
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  <FileText size={11} /> Biografía
                </label>
                {editing ? (
                  <textarea
                    value={form.bio}
                    onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                    placeholder="Cuéntanos sobre ti, tu posición favorita, nivel de juego…"
                    rows={4}
                    style={{ ...inputStyle, resize: 'none', lineHeight: 1.6 }}
                    onFocus={e => e.target.style.borderColor = 'rgba(132,204,22,0.5)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                  />
                ) : (
                  <p style={{ color: user.bio ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.2)', fontSize: 14, lineHeight: 1.6 }}>
                    {user.bio || 'Sin bio aún'}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Sports */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h2 style={{ color: '#fff', fontWeight: 600, fontSize: 15, marginBottom: '1rem' }}>Deportes practicados</h2>
            {sports.length === 0 ? (
              <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 13 }}>Sin deportes registrados aún</p>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {sports.map(us => {
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
            )}
          </div>
        </div>

        {/* Sidebar: My teams */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h2 style={{ color: '#fff', fontWeight: 600, fontSize: 15, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Trophy size={14} color="#84cc16" /> Mis equipos
          </h2>

          {!user.teams?.length ? (
            <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
              <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 13, marginBottom: '0.875rem' }}>No perteneces a ningún equipo aún</p>
              <Link to="/equipos/nuevo" className="btn-primary" style={{ fontSize: 13, padding: '0.5rem 1rem', justifyContent: 'center' }}>
                Crear equipo
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              {user.teams.map(t => (
                <Link key={t.id} to={`/equipos/${t.id}`} style={{ textDecoration: 'none' }}>
                  <div
                    style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem 0.5rem', borderRadius: '0.5rem', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{ width: 34, height: 34, borderRadius: '0.5rem', background: 'linear-gradient(135deg,#14532d,#166534)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#84cc16', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>
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
          )}
        </div>
      </div>
    </AppLayout>
  )
}
