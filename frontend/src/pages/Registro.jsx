import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Zap } from 'lucide-react'
import useAuthStore from '../stores/authStore'

export default function Registro() {
  const [form, setForm] = useState({ name: '', email: '', rut: '', phone: '', password: '', password_confirmation: '' })
  const { signup, loading } = useAuthStore()
  const [errors, setErrors] = useState([])
  const navigate = useNavigate()

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors([])
    const result = await signup(form)
    if (result.success) {
      navigate('/login')
    } else {
      setErrors(result.errors || ['Error al crear cuenta'])
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-9 h-9 bg-[#84cc16] rounded-lg flex items-center justify-center">
              <Zap size={20} className="text-[#14532d]" />
            </div>
            <span className="text-white font-bold text-xl">PartidoLink</span>
          </Link>
          <h1 className="text-2xl font-bold text-white">Crear cuenta</h1>
          <p className="text-white/40 mt-2 text-sm">Únete a la comunidad deportiva</p>
        </div>

        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8">
          {errors.length > 0 && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg p-3 mb-5 text-sm space-y-1">
              {errors.map((e, i) => <div key={i}>{e}</div>)}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-white/70 text-sm mb-1.5">Nombre completo</label>
              <input
                value={form.name} onChange={e => set('name', e.target.value)}
                placeholder="Juan Pérez" required
                className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-3 text-sm placeholder-white/25 focus:outline-none focus:border-[#84cc16]/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-white/70 text-sm mb-1.5">RUT chileno</label>
              <input
                value={form.rut} onChange={e => set('rut', e.target.value)}
                placeholder="12.345.678-9" required
                className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-3 text-sm placeholder-white/25 focus:outline-none focus:border-[#84cc16]/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-white/70 text-sm mb-1.5">Correo electrónico</label>
              <input
                type="email" value={form.email} onChange={e => set('email', e.target.value)}
                placeholder="tu@correo.cl" required
                className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-3 text-sm placeholder-white/25 focus:outline-none focus:border-[#84cc16]/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-white/70 text-sm mb-1.5">Teléfono</label>
              <input
                value={form.phone} onChange={e => set('phone', e.target.value)}
                placeholder="+56 9 12345678"
                className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-3 text-sm placeholder-white/25 focus:outline-none focus:border-[#84cc16]/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-white/70 text-sm mb-1.5">Contraseña</label>
              <input
                type="password" value={form.password} onChange={e => set('password', e.target.value)}
                placeholder="Mínimo 6 caracteres" required
                className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-3 text-sm placeholder-white/25 focus:outline-none focus:border-[#84cc16]/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-white/70 text-sm mb-1.5">Confirmar contraseña</label>
              <input
                type="password" value={form.password_confirmation} onChange={e => set('password_confirmation', e.target.value)}
                placeholder="Repite tu contraseña" required
                className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-3 text-sm placeholder-white/25 focus:outline-none focus:border-[#84cc16]/50 transition-colors"
              />
            </div>
            <button
              type="submit" disabled={loading}
              className="w-full bg-[#84cc16] text-[#14532d] py-3 rounded-lg font-bold text-sm hover:bg-[#a3e635] transition-colors disabled:opacity-50 mt-2"
            >
              {loading ? 'Creando cuenta...' : 'Crear cuenta gratis'}
            </button>
          </form>
        </div>

        <p className="text-center text-white/40 text-sm mt-6">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-[#84cc16] hover:underline">Iniciar sesión</Link>
        </p>
      </div>
    </div>
  )
}
