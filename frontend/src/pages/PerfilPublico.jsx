import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import AppLayout from '../components/AppLayout'
import api from '../api/client'

const skillLabels = { beginner: 'Principiante', intermediate: 'Intermedio', advanced: 'Avanzado', pro: 'Profesional' }
const skillColors = { beginner: 'bg-white/10 text-white/60', intermediate: 'bg-blue-900/30 text-blue-400', advanced: 'bg-[#14532d]/50 text-[#84cc16]', pro: 'bg-yellow-900/30 text-yellow-400' }

export default function PerfilPublico() {
  const { id } = useParams()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/users/${id}`)
      .then(r => { setUser(r.data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [id])

  if (loading) return <AppLayout><div className="text-white/40 text-center py-20">Cargando perfil...</div></AppLayout>
  if (!user) return <AppLayout><div className="text-white/40 text-center py-20">Usuario no encontrado.</div></AppLayout>

  return (
    <AppLayout>
      <div className="max-w-xl">
        {/* Profile card */}
        <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-8 mb-6">
          <div className="flex items-center gap-5 mb-6">
            <div className="w-20 h-20 bg-[#14532d] rounded-2xl flex items-center justify-center text-[#84cc16] font-bold text-3xl">
              {user.name?.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">{user.name}</h1>
              {user.bio && <p className="text-white/50 text-sm">{user.bio}</p>}
            </div>
          </div>

          {/* Sports */}
          {user.sports?.length > 0 && (
            <div>
              <p className="text-white/40 text-xs uppercase tracking-wide mb-3">Deportes</p>
              <div className="flex flex-wrap gap-2">
                {user.sports.map(us => (
                  <div key={us.sport?.id} className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2">
                    <span>{us.sport?.icon}</span>
                    <span className="text-white text-sm">{us.sport?.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${skillColors[us.skill_level] || 'bg-white/10 text-white/50'}`}>
                      {skillLabels[us.skill_level] || us.skill_level}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Teams */}
        {user.teams?.length > 0 && (
          <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6">
            <h2 className="text-white font-semibold mb-4">Equipos</h2>
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
