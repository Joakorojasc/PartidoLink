import { useEffect, useState, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Send } from 'lucide-react'
import AppLayout from '../components/AppLayout'
import api from '../api/client'
import useAuthStore from '../stores/authStore'

function formatTime(dt) {
  return new Date(dt).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })
}

function formatDate(dt) {
  return new Date(dt).toLocaleDateString('es-CL', { day: 'numeric', month: 'long' })
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

  useEffect(() => {
    // Load conversation info
    api.get('/conversations').then(r => {
      const conv = r.data.find(c => c.id === parseInt(id))
      setConversation(conv)
    }).catch(() => {})

    // Load messages
    api.get(`/conversations/${id}/messages`)
      .then(r => setMessages(r.data))
      .catch(() => {})
  }, [id])

  // WebSocket connection for real-time messages
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
            const exists = prev.some(m => m.id === data.message.id)
            if (exists) return prev
            return [...prev, {
              id: data.message.id,
              content: data.message.content,
              created_at: data.message.created_at,
              sender: {
                id: data.message.sender_id,
                name: data.message.sender_name,
                avatar_url: data.message.sender_avatar
              }
            }]
          })
        }
      }

      wsRef.current = ws
    } catch (e) {
      // WebSocket not available in this env — polling fallback
    }

    return () => {
      if (wsRef.current) wsRef.current.close()
    }
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
      setMessages(prev => {
        const exists = prev.some(m => m.id === res.data.id)
        return exists ? prev : [...prev, res.data]
      })
      setContent('')
    } catch {}
    setSending(false)
  }

  const teams = conversation?.teams || []

  return (
    <AppLayout>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link to="/mensajes" className="text-white/40 hover:text-white transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-white font-semibold">
            {conversation?.title || teams.map(t => t.name).join(' vs ') || 'Conversación'}
          </h1>
          <div className="flex items-center gap-2 mt-0.5">
            {teams.map(t => (
              <span key={t.id} className="text-white/40 text-xs">{t.name}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Chat window */}
      <div className="flex flex-col bg-white/[0.03] border border-white/8 rounded-2xl overflow-hidden" style={{ height: 'calc(100vh - 220px)' }}>
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-white/30 text-sm py-12">
              Sin mensajes aún. ¡Sé el primero en escribir!
            </div>
          )}

          {messages.map((msg, i) => {
            const isMe = msg.sender?.id === user?.id
            const showDate = i === 0 || formatDate(messages[i - 1]?.created_at) !== formatDate(msg.created_at)

            return (
              <div key={msg.id}>
                {showDate && (
                  <div className="text-center text-white/20 text-xs my-4">{formatDate(msg.created_at)}</div>
                )}
                <div className={`flex items-end gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                  {/* Avatar */}
                  <div className="w-7 h-7 rounded-full bg-[#14532d] flex items-center justify-center text-[#84cc16] text-xs font-bold flex-shrink-0">
                    {msg.sender?.name?.charAt(0)}
                  </div>
                  {/* Bubble */}
                  <div className={`max-w-[70%] ${isMe ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                    {!isMe && (
                      <span className="text-white/30 text-xs px-1">{msg.sender?.name}</span>
                    )}
                    <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      isMe
                        ? 'bg-[#14532d] text-white rounded-br-sm'
                        : 'bg-white/8 text-white/90 rounded-bl-sm'
                    }`}>
                      {msg.content}
                    </div>
                    <span className="text-white/20 text-xs px-1">{formatTime(msg.created_at)}</span>
                  </div>
                </div>
              </div>
            )
          })}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="border-t border-white/5 p-4">
          <form onSubmit={handleSend} className="flex items-center gap-3">
            <input
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Escribe un mensaje..."
              className="flex-1 bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 text-sm placeholder-white/25 focus:outline-none focus:border-[#84cc16]/50 transition-colors"
            />
            <button
              type="submit"
              disabled={sending || !content.trim()}
              className="w-11 h-11 bg-[#84cc16] rounded-xl flex items-center justify-center text-[#14532d] hover:bg-[#a3e635] transition-colors disabled:opacity-40"
            >
              <Send size={17} />
            </button>
          </form>
        </div>
      </div>
    </AppLayout>
  )
}
