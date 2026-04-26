import { useEffect, useState, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Send } from 'lucide-react'
import AppLayout from '../components/AppLayout'
import api from '../api/client'
import useAuthStore from '../stores/authStore'

function formatTime(dt) {
  return new Date(dt).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })
}

function formatDateLabel(dt) {
  const d = new Date(dt)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  if (d.toDateString() === today.toDateString()) return 'Hoy'
  if (d.toDateString() === yesterday.toDateString()) return 'Ayer'
  return d.toLocaleDateString('es-CL', { day: 'numeric', month: 'long' })
}

function Avatar({ name, size = 32, isMe = false }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      background: isMe ? 'linear-gradient(135deg,#14532d,#166534)' : 'rgba(255,255,255,0.08)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: isMe ? '#84cc16' : 'rgba(255,255,255,0.5)', fontWeight: 700, fontSize: size * 0.4,
    }}>
      {name?.charAt(0)?.toUpperCase()}
    </div>
  )
}

export default function MensajeDetalle() {
  const { id } = useParams()
  const { user } = useAuthStore()
  const [messages, setMessages] = useState([])
  const [content, setContent] = useState('')
  const [sending, setSending] = useState(false)
  const [conversation, setConversation] = useState(null)
  const bottomRef = useRef(null)
  const wsRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    api.get('/conversations')
      .then(r => { const c = r.data.find(x => x.id === parseInt(id)); setConversation(c) })
      .catch(() => {})

    api.get(`/conversations/${id}/messages`)
      .then(r => setMessages(r.data))
      .catch(() => {})
  }, [id])

  // WebSocket real-time
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return

    const wsUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1')
      .replace('/api/v1', '')
      .replace('http', 'ws')

    try {
      const ws = new WebSocket(`${wsUrl}/cable?token=${token}`)

      ws.onopen = () => {
        ws.send(JSON.stringify({
          command: 'subscribe',
          identifier: JSON.stringify({ channel: 'MessagesChannel', conversation_id: parseInt(id) })
        }))
      }

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data)
        if (data.type === 'ping' || data.type === 'welcome' || data.type === 'confirm_subscription') return
        if (data.message) {
          setMessages(prev => {
            if (prev.some(m => m.id === data.message.id)) return prev
            return [...prev, {
              id: data.message.id,
              content: data.message.content,
              created_at: data.message.created_at,
              sender: { id: data.message.sender_id, name: data.message.sender_name }
            }]
          })
        }
      }

      wsRef.current = ws
    } catch {}

    return () => { if (wsRef.current) wsRef.current.close() }
  }, [id])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (e) => {
    e.preventDefault()
    if (!content.trim()) return
    setSending(true)
    try {
      const res = await api.post(`/conversations/${id}/messages`, { message: { content } })
      setMessages(prev => prev.some(m => m.id === res.data.id) ? prev : [...prev, res.data])
      setContent('')
      inputRef.current?.focus()
    } catch {}
    setSending(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend(e)
    }
  }

  const teams = conversation?.teams || []
  const title = conversation?.title || teams.map(t => t.name).join(' vs ') || 'Conversación'

  return (
    <AppLayout>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '1.25rem' }}>
        <Link to="/mensajes"
          style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '0.5rem', color: 'rgba(255,255,255,0.5)', textDecoration: 'none', transition: 'background 0.15s, color 0.15s' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)' }}
        >
          <ArrowLeft size={16} />
        </Link>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 style={{ color: '#fff', fontWeight: 600, fontSize: 16, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</h1>
          {teams.length > 0 && (
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.125rem' }}>
              {teams.map(t => (
                <span key={t.id} style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>{t.name}</span>
              ))}
            </div>
          )}
        </div>
        {/* Online dot */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 6px rgba(74,222,128,0.6)' }} />
          En línea
        </div>
      </div>

      {/* Chat window */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 240px)', overflow: 'hidden' }}>
        {/* Messages area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {messages.length === 0 && (
            <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: 13, padding: '3rem 0' }}>
              Sin mensajes aún. ¡Sé el primero en escribir!
            </div>
          )}

          {messages.map((msg, i) => {
            const isMe = msg.sender?.id === user?.id
            const prevMsg = messages[i - 1]
            const showDateLabel = i === 0 || formatDateLabel(msg.created_at) !== formatDateLabel(prevMsg?.created_at)
            const showAvatar = !isMe && (i === 0 || messages[i - 1]?.sender?.id !== msg.sender?.id)
            const isConsecutive = i > 0 && messages[i - 1]?.sender?.id === msg.sender?.id

            return (
              <div key={msg.id}>
                {showDateLabel && (
                  <div style={{ textAlign: 'center', margin: '1rem 0' }}>
                    <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 11, background: 'rgba(255,255,255,0.04)', borderRadius: 99, padding: '0.25rem 0.875rem' }}>
                      {formatDateLabel(msg.created_at)}
                    </span>
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.625rem', flexDirection: isMe ? 'row-reverse' : 'row', marginTop: isConsecutive ? '0.125rem' : '0.75rem' }}>
                  {/* Avatar placeholder to keep alignment */}
                  <div style={{ width: 28, flexShrink: 0 }}>
                    {showAvatar && !isMe && <Avatar name={msg.sender?.name} size={28} />}
                  </div>

                  <div style={{ maxWidth: '68%', display: 'flex', flexDirection: 'column', gap: '0.25rem', alignItems: isMe ? 'flex-end' : 'flex-start' }}>
                    {showAvatar && !isMe && (
                      <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, paddingLeft: '0.5rem' }}>{msg.sender?.name}</span>
                    )}
                    <div style={{
                      background: isMe ? 'linear-gradient(135deg,#14532d,#166534)' : 'rgba(255,255,255,0.07)',
                      borderRadius: isMe ? '1.125rem 1.125rem 0.25rem 1.125rem' : '0.25rem 1.125rem 1.125rem 1.125rem',
                      padding: '0.625rem 1rem', fontSize: 14, color: isMe ? '#fff' : 'rgba(255,255,255,0.88)', lineHeight: 1.5,
                      boxShadow: isMe ? '0 2px 8px rgba(20,83,45,0.3)' : 'none',
                    }}>
                      {msg.content}
                    </div>
                    <span style={{ color: 'rgba(255,255,255,0.18)', fontSize: 10, paddingLeft: '0.5rem', paddingRight: '0.5rem' }}>
                      {formatTime(msg.created_at)}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
          <div ref={bottomRef} />
        </div>

        {/* Input bar */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '1rem 1.25rem' }}>
          <form onSubmit={handleSend} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <Avatar name={user?.name} size={32} isMe />
            <input
              ref={inputRef}
              value={content}
              onChange={e => setContent(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Escribe un mensaje… (Enter para enviar)"
              style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.75rem', padding: '0.75rem 1rem', color: '#fff', fontSize: 14, outline: 'none', transition: 'border-color 0.15s' }}
              onFocus={e => e.target.style.borderColor = 'rgba(132,204,22,0.4)'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
            />
            <button
              type="submit"
              disabled={sending || !content.trim()}
              style={{ width: 40, height: 40, background: content.trim() ? '#84cc16' : 'rgba(255,255,255,0.06)', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: content.trim() ? '#14532d' : 'rgba(255,255,255,0.2)', border: 'none', cursor: content.trim() ? 'pointer' : 'default', transition: 'background 0.15s, color 0.15s', flexShrink: 0 }}
              onMouseEnter={e => { if (content.trim()) e.currentTarget.style.background = '#a3e635' }}
              onMouseLeave={e => { if (content.trim()) e.currentTarget.style.background = '#84cc16' }}
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </AppLayout>
  )
}
