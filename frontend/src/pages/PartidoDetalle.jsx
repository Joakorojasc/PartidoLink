import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { CheckCircle, AlertTriangle, Clock, Send } from 'lucide-react'
import AppLayout from '../components/AppLayout'
import useMatchStore from '../stores/matchStore'
import useAuthStore from '../stores/authStore'

function formatDate(dt) {
  if (!dt) return 'Por confirmar'
  return new Date(dt).toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })
}

export default function PartidoDetalle() {
  const { id } = useParams()
  const { currentMatch, fetchMatch, submitResult, acceptResult, rejectResult } = useMatchStore()
  const { user } = useAuthStore()
  const [form, setForm] = useState({ home_score: '', away_score: '', submitted_by_team_id: '' })
  const [submitting, setSubmitting] = useState(false)
  const [msg, setMsg] = useState(null)

  useEffect(() => {
    fetchMatch(id)
  }, [id])

  if (!currentMatch) return <AppLayout><div className="text-white/40 text-center py-20">Cargando partido...</div></AppLayout>

  const m = currentMatch
  const myTeamIds = user?.teams?.map(t => t.id) || []
  const myTeamInMatch = myTeamIds.find(tid => tid === m.home_team?.id || tid === m.away_team?.id)
  const myResult = m.results?.find(r => r.submitted_by_team_id === myTeamInMatch)
  const otherResult = m.results?.find(r => r.submitted_by_team_id !== myTeamInMatch)
  const bothValidated = m.results?.every(r => r.is_validated)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await submitResult(id, { ...form, submitted_by_team_id: myTeamInMatch })
      await fetchMatch(id)
      setMsg('Resultado enviado. Esperando confirmación del rival.')
    } catch (err) {
      setMsg(err.response?.data?.errors?.join(', ') || 'Error al enviar resultado')
    }
    setSubmitting(false)
  }

  const handleAccept = async (resultId) => {
    await acceptResult(id, resultId)
    await fetchMatch(id)
  }

  const handleReject = async (resultId) => {
    await rejectResult(id, resultId)
    await fetchMatch(id)
  }

  return (
    <AppLayout>
      {/* Match Card */}
      <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-8 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white/40 text-sm">{m.sport?.icon} {m.sport?.name}</span>
          <span className={`text-xs px-3 py-1 rounded-full font-medium ${
            m.status === 'played' ? 'bg-green-900/30 text-green-400' :
            m.status === 'disputed' ? 'bg-red-900/30 text-red-400' :
            m.status === 'cancelled' ? 'bg-gray-800 text-gray-400' :
            'bg-[#84cc16]/20 text-[#84cc16]'
          }`}>
            {m.status === 'played' ? '✓ Validado' : m.status === 'disputed' ? '⚠ Disputado' : m.status === 'cancelled' ? 'Cancelado' : 'Programado'}
          </span>
        </div>

        <div className="flex items-center justify-center gap-8 py-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-[#14532d] rounded-2xl flex items-center justify-center text-[#84cc16] font-bold text-2xl mx-auto mb-3">
              {m.home_team?.name?.charAt(0)}
            </div>
            <p className="text-white font-semibold">{m.home_team?.name}</p>
            <p className="text-white/30 text-xs">Local</p>
          </div>

          <div className="text-center">
            {bothValidated && m.results?.[0] ? (
              <div className="text-4xl font-extrabold text-white">
                {m.results[0].home_score} – {m.results[0].away_score}
              </div>
            ) : (
              <div className="text-white/20 text-2xl font-bold">VS</div>
            )}
            <p className="text-white/40 text-xs mt-2">{formatDate(m.scheduled_at)}</p>
            {m.venue && <p className="text-white/30 text-xs">{m.venue.name} · {m.commune}</p>}
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-3">
              {m.away_team?.name?.charAt(0)}
            </div>
            <p className="text-white font-semibold">{m.away_team?.name}</p>
            <p className="text-white/30 text-xs">Visitante</p>
          </div>
        </div>
      </div>

      {/* Result section */}
      {myTeamInMatch && m.status !== 'played' && m.status !== 'cancelled' && (
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Submit form */}
          {!myResult ? (
            <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6">
              <h2 className="text-white font-semibold mb-4">Enviar resultado</h2>
              {msg && <p className="text-[#84cc16] text-sm mb-4">{msg}</p>}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/60 text-xs mb-1.5">Goles local</label>
                    <input type="number" min="0" value={form.home_score}
                      onChange={e => setForm(f => ({ ...f, home_score: e.target.value }))}
                      required
                      className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-3 text-center text-lg font-bold focus:outline-none focus:border-[#84cc16]/50"
                    />
                  </div>
                  <div>
                    <label className="block text-white/60 text-xs mb-1.5">Goles visitante</label>
                    <input type="number" min="0" value={form.away_score}
                      onChange={e => setForm(f => ({ ...f, away_score: e.target.value }))}
                      required
                      className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-3 text-center text-lg font-bold focus:outline-none focus:border-[#84cc16]/50"
                    />
                  </div>
                </div>
                <button type="submit" disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 bg-[#84cc16] text-[#14532d] py-3 rounded-lg font-bold text-sm hover:bg-[#a3e635] transition-colors disabled:opacity-50"
                >
                  <Send size={15} />
                  {submitting ? 'Enviando...' : 'Enviar resultado'}
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6">
              <h2 className="text-white font-semibold mb-4">Tu resultado enviado</h2>
              <div className="flex items-center justify-center gap-4 py-4">
                <span className="text-4xl font-extrabold text-white">{myResult.home_score}</span>
                <span className="text-white/30">–</span>
                <span className="text-4xl font-extrabold text-white">{myResult.away_score}</span>
              </div>
              {myResult.suspicious && (
                <div className="flex items-center gap-2 text-yellow-400 text-xs bg-yellow-900/20 rounded-lg p-3 mt-2">
                  <AlertTriangle size={14} /> Resultado inusualmente alto — marcado para revisión
                </div>
              )}
              <div className="flex items-center gap-2 text-white/40 text-sm mt-4 justify-center">
                <Clock size={14} />
                Esperando respuesta del rival
              </div>
            </div>
          )}

          {/* Opponent result */}
          {otherResult && (
            <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6">
              <h2 className="text-white font-semibold mb-4">Resultado del rival</h2>
              <div className="flex items-center justify-center gap-4 py-4">
                <span className="text-4xl font-extrabold text-white">{otherResult.home_score}</span>
                <span className="text-white/30">–</span>
                <span className="text-4xl font-extrabold text-white">{otherResult.away_score}</span>
              </div>
              {myResult && !otherResult.is_validated && (
                <div className="flex gap-2 mt-4">
                  <button onClick={() => handleAccept(otherResult.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-green-900/30 text-green-400 border border-green-500/30 py-2.5 rounded-lg text-sm font-medium hover:bg-green-900/50 transition-colors"
                  >
                    <CheckCircle size={15} /> Aceptar
                  </button>
                  <button onClick={() => handleReject(otherResult.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-red-900/30 text-red-400 border border-red-500/30 py-2.5 rounded-lg text-sm font-medium hover:bg-red-900/50 transition-colors"
                  >
                    <AlertTriangle size={15} /> Rechazar
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Validated */}
      {m.status === 'played' && (
        <div className="bg-green-900/20 border border-green-500/20 rounded-2xl p-6 flex items-center gap-4">
          <CheckCircle size={32} className="text-green-400" />
          <div>
            <h2 className="text-green-400 font-semibold">Resultado validado</h2>
            <p className="text-white/50 text-sm">Ambos equipos confirmaron el mismo marcador. El resultado está en el historial.</p>
          </div>
        </div>
      )}

      {m.status === 'disputed' && (
        <div className="bg-red-900/20 border border-red-500/20 rounded-2xl p-6 flex items-center gap-4">
          <AlertTriangle size={32} className="text-red-400" />
          <div>
            <h2 className="text-red-400 font-semibold">Resultado disputado</h2>
            <p className="text-white/50 text-sm">Los equipos enviaron marcadores distintos. Contacta al equipo rival para resolverlo.</p>
          </div>
        </div>
      )}
    </AppLayout>
  )
}
