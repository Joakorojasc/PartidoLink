import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Zap } from 'lucide-react'
import useAuthStore from '../stores/authStore'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login, loading, error } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await login(email, password)
    if (result.success) navigate('/dashboard')
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
          <h1 className="text-2xl font-bold text-white">Iniciar sesión</h1>
          <p className="text-white/40 mt-2 text-sm">Bienvenido de vuelta</p>
        </div>

        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg p-3 mb-5 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-white/70 text-sm mb-1.5">Correo electrónico</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="tu@correo.cl"
                required
                className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-3 text-sm placeholder-white/25 focus:outline-none focus:border-[#84cc16]/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-white/70 text-sm mb-1.5">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-3 text-sm placeholder-white/25 focus:outline-none focus:border-[#84cc16]/50 transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#84cc16] text-[#14532d] py-3 rounded-lg font-bold text-sm hover:bg-[#a3e635] transition-colors disabled:opacity-50"
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
          </form>
        </div>

        <p className="text-center text-white/40 text-sm mt-6">
          ¿No tienes cuenta?{' '}
          <Link to="/registro" className="text-[#84cc16] hover:underline">
            Crear cuenta gratis
          </Link>
        </p>
      </div>
    </div>
  )
}
