import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { MessageCircle, ChevronRight } from 'lucide-react'
import AppLayout from '../components/AppLayout'
import api from '../api/client'

function timeAgo(dt) {
  if (!dt) return ''
  const diff = Math.floor((Date.now() - new Date(dt)) / 1000)
  if (diff < 60) return 'Ahora'
  if (diff < 3600) return `${Math.floor(diff / 60)}m`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`
  return new Date(dt).toLocaleDateString('es-CL', { day: 'numeric', month: 'short' })
}

function ConvIcon({ type }) {
  const map = { match: '⚔️', team: '👥', general: '💬' }
  const icon = map[type] || '💬'
  return (
    <div style={{ width: 44, height: 44, background: 'rgba(20,83,45,0.4)', border: '1px solid rgba(132,204,22,0.15)', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
      {icon}
    </div>
  )
}

function ConvRow({ c }) {
  const [hovered, setHovered] = useState(false)
  const title = c.title || c.teams?.map(t => t.name).join(' vs ') || 'Conversación'
  const lastMsg = c.last_message

  return (
    <Link to={`/mensajes/${c.id}`} style={{ textDecoration: 'none' }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: 'flex', alignItems: 'center', gap: '0.875rem', padding: '0.875rem 1rem',
          background: hovered ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.02)',
          border: `1px solid ${hovered ? 'rgba(132,204,22,0.2)' : 'rgba(255,255,255,0.07)'}`,
          borderRadius: '0.875rem', transition: 'background 0.15s, border-color 0.15s',
        }}
      >
        <ConvIcon type={c.conversation_type} />

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
            <p style={{ color: hovered ? '#84cc16' : '#fff', fontWeight: 600, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', transition: 'color 0.15s' }}>
              {title}
            </p>
            {lastMsg && (
              <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11, flexShrink: 0, marginLeft: '0.5rem' }}>
                {timeAgo(lastMsg.created_at)}
              </span>
            )}
          </div>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {lastMsg ? lastMsg.content : 'Sin mensajes aún'}
          </p>
          {c.teams?.length > 0 && (
            <div style={{ display: 'flex', gap: '0.375rem', marginTop: '0.25rem' }}>
              {c.teams.map(t => (
                <span key={t.id} style={{ color: 'rgba(255,255,255,0.2)', fontSize: 11 }}>{t.name}</span>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
          {c.message_count > 0 && (
            <span style={{ background: 'rgba(132,204,22,0.15)', color: '#84cc16', fontSize: 11, fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: 99 }}>
              {c.message_count}
            </span>
          )}
          <ChevronRight size={14} color={hovered ? '#84cc16' : 'rgba(255,255,255,0.2)'} style={{ transition: 'color 0.15s' }} />
        </div>
      </div>
    </Link>
  )
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
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: '#fff', letterSpacing: '-0.5px', marginBottom: '0.25rem' }}>Mensajes</h1>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14 }}>Conversaciones con equipos rivales</p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {[1,2,3,4].map(i => (
            <div key={i} style={{ height: 72, background: 'rgba(255,255,255,0.03)', borderRadius: '0.875rem', border: '1px solid rgba(255,255,255,0.06)' }} />
          ))}
        </div>
      ) : conversations.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem 0' }}>
          <div style={{ width: 72, height: 72, background: 'rgba(255,255,255,0.03)', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
            <MessageCircle size={32} color="rgba(255,255,255,0.1)" />
          </div>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 15, marginBottom: '0.375rem' }}>No tienes conversaciones aún</p>
          <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 13 }}>Desafía a un equipo desde la sección de Partidos para comenzar</p>
        </div>
      ) : (
        <div style={{ maxWidth: 680, display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
          {conversations.map(c => <ConvRow key={c.id} c={c} />)}
        </div>
      )}
    </AppLayout>
  )
}
