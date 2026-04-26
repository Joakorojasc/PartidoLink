import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../components/AppLayout'
import api from '../api/client'

const communes = ['Providencia', 'Las Condes', 'Ñuñoa', 'Santiago Centro', 'Vitacura', 'La Florida', 'Macul', 'San Miguel', 'Peñalolén', 'Lo Barnechea']

export default function NuevoEquipo() {
  const [form, setForm] = useState({ name: '', sport_id: '', description: '', commune: '', is_open: true })
  const [sports, setSports] = useState([])
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState([])
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
      navigate(`/equipos/${res.data.id}`)
    } catch (err) {
      setErrors(err.response?.data?.errors || ['Error al crear el equipo'])
      setLoading(false)
    }
  }

  return (
    <AppLayout>
      <div className="max-w-xl">
        <h1 className="text-3xl font-bold text-white mb-2">Crear equipo</h1>
        <p className="text-white/40 mb-8">Tú serás el capitán y podrás invitar miembros.</p>

        <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-8">
          {errors.length > 0 && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg p-3 mb-5 text-sm space-y-1">
              {errors.map((e, i) => <div key={i}>{e}</div>)}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-white/70 text-sm mb-1.5">Nombre del equipo</label>
              <input value={form.name} onChange={e => set('name', e.target.value)} required
                placeholder="Los Cóndores FC"
                className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-3 text-sm placeholder-white/25 focus:outline-none focus:border-[#84cc16]/50"
              />
            </div>
            <div>
              <label className="block text-white/70 text-sm mb-1.5">Deporte</label>
              <select value={form.sport_id} onChange={e => set('sport_id', e.target.value)} required
                className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#84cc16]/50"
              >
                <option value="">Selecciona un deporte</option>
                {sports.map(s => <option key={s.id} value={s.id}>{s.icon} {s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-white/70 text-sm mb-1.5">Comuna</label>
              <select value={form.commune} onChange={e => set('commune', e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#84cc16]/50"
              >
                <option value="">Selecciona una comuna</option>
                {communes.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-white/70 text-sm mb-1.5">Descripción</label>
              <textarea value={form.description} onChange={e => set('description', e.target.value)}
                placeholder="Cuéntanos sobre tu equipo..."
                rows={3}
                className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-3 text-sm placeholder-white/25 focus:outline-none focus:border-[#84cc16]/50 resize-none"
              />
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="is_open" checked={form.is_open} onChange={e => set('is_open', e.target.checked)}
                className="w-4 h-4 accent-[#84cc16]"
              />
              <label htmlFor="is_open" className="text-white/70 text-sm">Equipo abierto (acepta nuevos miembros)</label>
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-[#84cc16] text-[#14532d] py-3 rounded-lg font-bold text-sm hover:bg-[#a3e635] transition-colors disabled:opacity-50"
            >
              {loading ? 'Creando equipo...' : 'Crear equipo'}
            </button>
          </form>
        </div>
      </div>
    </AppLayout>
  )
}
