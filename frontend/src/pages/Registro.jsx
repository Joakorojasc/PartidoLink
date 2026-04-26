import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Zap, ArrowRight, CheckCircle } from 'lucide-react'
import useAuthStore from '../stores/authStore'

const Field = ({ label, type = 'text', value, onChange, placeholder, required }) => (
  <div style={{ marginBottom: '1rem' }}>
    <label style={{ display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: 500, marginBottom: '0.5rem' }}>{label}</label>
    <input type={type} value={value} onChange={onChange} placeholder={placeholder} required={required} className="input" />
  </div>
)

export default function Registro() {
  const [form, setForm] = useState({ name: '', email: '', rut: '', phone: '', password: '', password_confirmation: '' })
  const { signup, loading } = useAuthStore()
  const [errors, setErrors] = useState([])
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors([])
    const result = await signup(form)
    if (result.success) {
      setSuccess(true)
      setTimeout(() => navigate('/login'), 1800)
    } else {
      setErrors(result.errors || ['Error al crear cuenta'])
    }
  }

  if (success) return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }} className="fade-up">
        <div style={{ width: 64, height: 64, background: 'rgba(132,204,22,0.15)', border: '1px solid rgba(132,204,22,0.3)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
          <CheckCircle size={30} color="#84cc16" />
        </div>
        <h2 style={{ color: '#fff', fontSize: 22, fontWeight: 700, marginBottom: '0.5rem' }}>¡Cuenta creada!</h2>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14 }}>Redirigiendo al login…</p>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1.5rem', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ width: '100%', maxWidth: 440 }} className="fade-up">
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.625rem', textDecoration: 'none', marginBottom: '1.5rem' }}>
            <div style={{ width: 38, height: 38, background: '#84cc16', borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 24px rgba(132,204,22,0.3)' }}>
              <Zap size={20} color="#14532d" />
            </div>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 18 }}>PartidoLink</span>
          </Link>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#fff', letterSpacing: '-0.5px', marginBottom: '0.375rem' }}>Crear cuenta</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>Únete a la comunidad deportiva de Chile</p>
        </div>

        <div className="card" style={{ padding: '2rem' }}>
          {errors.length > 0 && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '0.625rem', padding: '0.875rem 1rem', marginBottom: '1.25rem' }}>
              {errors.map((e, i) => <p key={i} style={{ color: '#f87171', fontSize: 13, lineHeight: 1.5 }}>{e}</p>)}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
              <div style={{ gridColumn: '1/-1' }}>
                <Field label="Nombre completo" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Juan Pérez" required />
              </div>
              <Field label="RUT chileno" value={form.rut} onChange={e => set('rut', e.target.value)} placeholder="12.345.678-9" required />
              <Field label="Teléfono" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+56 9 12345678" />
              <div style={{ gridColumn: '1/-1' }}>
                <Field label="Correo electrónico" type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="tu@correo.cl" required />
              </div>
              <Field label="Contraseña" type="password" value={form.password} onChange={e => set('password', e.target.value)} placeholder="Mínimo 6 caracteres" required />
              <Field label="Confirmar contraseña" type="password" value={form.password_confirmation} onChange={e => set('password_confirmation', e.target.value)} placeholder="Repite tu contraseña" required />
            </div>

            <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem', opacity: loading ? 0.6 : 1 }}>
              {loading ? 'Creando cuenta...' : (<>Crear cuenta gratis <ArrowRight size={15} /></>)}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13 }}>
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" style={{ color: '#84cc16', textDecoration: 'none', fontWeight: 500 }}>Iniciar sesión</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
