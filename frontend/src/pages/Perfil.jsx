import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Edit2, Save, X } from 'lucide-react'
import AppLayout from '../components/AppLayout'
import useAuthStore from '../stores/authStore'
import api from '../api/client'

const skillLabels = { beginner: 'Principiante', intermediate: 'Intermedio', advanced: 'Avanzado', pro: 'Profesional' }
const skillColors = { beginner: 'bg-white/10 text-white/60', intermediate: 'bg-blue-900/30 text-blue-400', advanced: 'bg-[#14532d]/50 text-[#84cc16]', pro: 'bg-yellow-900/30 text-yellow-400' }

export default function Perfil() {
  const { user, fetchMe, updateProfile } = useAuthStore()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', bio: '' })
  const [sports, setSports] = useState([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchMe()
  }, [])

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

  if (!user) return <AppLayout><div className="text-white/40 text-center py-20">Cargando...</div></AppLayout>

  return (
    <AppLayout>
      <div className="max-w-2xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">Mi perfil</h1>
          {!editing ? (
            <button onClick={() => setEditing(true)}
              className="flex items-center gap-2 border border-white/15 text-white/70 px-4 py-2 rounded-lg text-sm hover:bg-white/5 transition-colors"
            >
              <Edit2 size={14} /> Editar
            </button>
          ) : (
            <div className="flex gap-2">
              <button onClick={() => setEditing(false)}
                className="flex items-center gap-2 border border-white/15 text-white/50 px-4 py-2 rounded-lg text-sm hover:bg-white/5 transition-colors"
              >
                <X size={14} /> Cancelar
              </button>
              <button onClick={handleSave} disabled={saving}
                className="flex items-center gap-2 bg-[#84cc16] text-[#14532d] px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#a3e635] transition-colors disabled:opacity-50"
              >
                <Save size={14} /> {saving ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          )}
        </div>

        {/* Profile card */}
        <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-8 mb-6">
          <div className="flex items-start gap-5 mb-6">
            <div className="w-20 h-20 bg-[#14532d] rounded-2xl flex items-center justify-center text-[#84cc16] font-bold text-3xl flex-shrink-0">
              {user.name?.charAt(0)}
            </div>
            <div className="flex-1">
              {editing ? (
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2 text-lg font-bold focus:outline-none focus:border-[#84cc16]/50 mb-2"
                />
              ) : (
                <h2 className="text-2xl font-bold text-white mb-1">{user.name}</h2>
              )}
              <p className="text-white/40 text-sm">{user.email}</p>
              <p className="text-white/30 text-sm mt-1">{user.rut}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-white/50 text-xs mb-1.5 uppercase tracking-wide">Teléfono</label>
              {editing ? (
                <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  placeholder="+56 9 12345678"
                  className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#84cc16]/50"
                />
              ) : (
                <p className="text-white text-sm">{user.phone || <span className="text-white/25">No especificado</span>}</p>
              )}
            </div>

            <div>
              <label className="block text-white/50 text-xs mb-1.5 uppercase tracking-wide">Bio</label>
              {editing ? (
                <textarea value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                  placeholder="Cuéntanos sobre ti..."
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#84cc16]/50 resize-none"
                />
              ) : (
                <p className="text-white/70 text-sm">{user.bio || <span className="text-white/25">Sin bio</span>}</p>
              )}
            </div>
          </div>
        </div>

        {/* Sports */}
        <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6 mb-6">
          <h2 className="text-white font-semibold mb-4">Deportes</h2>
          {sports.length === 0 ? (
            <p className="text-white/30 text-sm">Sin deportes registrados aún.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {sports.map(us => (
                <div key={us.sport?.id} className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2">
                  <span>{us.sport?.icon}</span>
                  <span className="text-white text-sm">{us.sport?.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${skillColors[us.skill_level]}`}>
                    {skillLabels[us.skill_level]}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Teams */}
        {user.teams?.length > 0 && (
          <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6">
            <h2 className="text-white font-semibold mb-4">Mis equipos</h2>
            <div className="space-y-3">
              {user.teams.map(t => (
                <Link key={t.id} to={`/equipos/${t.id}`}
                  className="flex items-center gap-3 p-3 bg-white/3 hover:bg-white/6 rounded-xl transition-colors"
                >
                  <div className="w-9 h-9 bg-[#14532d] rounded-lg flex items-center justify-center text-[#84cc16] font-bold text-sm">
                    {t.name?.charAt(0)}
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{t.name}</p>
                    {t.sport && <p className="text-white/40 text-xs">{t.sport}</p>}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
