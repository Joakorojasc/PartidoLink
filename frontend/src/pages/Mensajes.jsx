import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { MessageCircle, Plus } from 'lucide-react'
import AppLayout from '../components/AppLayout'
import api from '../api/client'

function timeAgo(dt) {
  if (!dt) return ''
  const diff = Math.floor((Date.now() - new Date(dt)) / 1000)
  if (diff < 60) return 'hace un momento'
  if (diff < 3600) return `hace ${Math.floor(diff / 60)} min`
  if (diff < 86400) return `hace ${Math.floor(diff / 3600)} h`
  return new Date(dt).toLocaleDateString('es-CL', { day: 'numeric', month: 'short' })
}

export default function Mensajes() {
  const [conversations, setConversations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/conversations')
      .then(r => { setConversations(r.data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <AppLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-1">Mensajes</h1>
        <p className="text-white/40">Conversaciones con equipos rivales.</p>
      </div>

      {loading ? (
        <div className="text-white/40 text-center py-20">Cargando mensajes...</div>
      ) : conversations.length === 0 ? (
        <div className="text-center py-20">
          <MessageCircle size={48} className="text-white/10 mx-auto mb-4" />
          <p className="text-white/40 mb-2">No tienes conversaciones aún.</p>
          <p className="text-white/25 text-sm">Desafía a un equipo desde la sección de Partidos para comenzar.</p>
        </div>
      ) : (
        <div className="max-w-2xl space-y-2">
          {conversations.map(c => (
            <Link key={c.id} to={`/mensajes/${c.id}`}
              className="flex items-center gap-4 p-4 bg-white/[0.03] border border-white/8 rounded-xl hover:border-[#84cc16]/30 transition-colors"
            >
              <div className="w-11 h-11 bg-[#14532d]/50 rounded-xl flex items-center justify-center text-[#84cc16] text-lg flex-shrink-0">
                {c.conversation_type === 'match' ? '⚔️' : c.conversation_type === 'team' ? '👥' : '💬'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <p className="text-white font-medium text-sm truncate">{c.title || c.teams?.map(t => t.name).join(' vs ')}</p>
                  {c.last_message && (
                    <span className="text-white/30 text-xs flex-shrink-0 ml-2">{timeAgo(c.last_message.created_at)}</span>
                  )}
                </div>
                <p className="text-white/40 text-xs truncate">
                  {c.last_message ? c.last_message.content : 'Sin mensajes aún'}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  {c.teams?.map(t => (
                    <span key={t.id} className="text-white/25 text-xs">{t.name}</span>
                  ))}
                </div>
              </div>
              {c.message_count > 0 && (
                <span className="bg-[#84cc16]/20 text-[#84cc16] text-xs px-2 py-0.5 rounded-full flex-shrink-0">
                  {c.message_count}
                </span>
              )}
            </Link>
          ))}
        </div>
      )}
    </AppLayout>
  )
}
