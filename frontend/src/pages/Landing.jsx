import { Link } from 'react-router-dom'
import { Zap, Shield, Users, Trophy, ArrowRight, CheckCircle } from 'lucide-react'

const sports = [
  { icon: '⚽', name: 'Fútbol' },
  { icon: '🎾', name: 'Pádel' },
  { icon: '🎾', name: 'Tenis' },
  { icon: '⛳', name: 'Golf' },
  { icon: '🏀', name: 'Básquetbol' },
  { icon: '🏐', name: 'Volleyball' },
]

const features = [
  {
    icon: Shield,
    title: 'Reservas Garantizadas',
    desc: 'Reserva tu cancha con pago anticipado. Sin no-shows, sin sorpresas. Las canchas saben que llegarás.',
  },
  {
    icon: Users,
    title: 'Matchmaking Inteligente',
    desc: 'Encuentra rivales de tu nivel en tu comuna. Filtra por deporte, fecha y nivel. Desafía en un clic.',
  },
  {
    icon: Trophy,
    title: 'Historial Verificado',
    desc: 'Sistema dual de validación: ambos equipos confirman el resultado. Tu récord es real y confiable.',
  },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#84cc16] rounded-lg flex items-center justify-center">
            <Zap size={18} className="text-[#14532d]" />
          </div>
          <span className="font-bold text-lg tracking-tight">PartidoLink</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/partidos" className="text-white/60 hover:text-white text-sm transition-colors">
            Ver partidos
          </Link>
          <Link to="/login" className="text-white/60 hover:text-white text-sm transition-colors">
            Iniciar sesión
          </Link>
          <Link
            to="/registro"
            className="bg-[#84cc16] text-[#14532d] px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#a3e635] transition-colors"
          >
            Crear cuenta
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative px-8 pt-24 pb-20 text-center overflow-hidden">
        {/* Green glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[400px] bg-[#14532d]/20 rounded-full blur-3xl" />
        </div>

        <div className="relative">
          <div className="inline-flex items-center gap-2 bg-[#14532d]/30 border border-[#84cc16]/20 text-[#84cc16] px-4 py-1.5 rounded-full text-sm mb-8">
            <Zap size={13} />
            La plataforma deportiva de Chile
          </div>
          <h1 className="text-6xl font-extrabold tracking-tight leading-tight mb-6 max-w-3xl mx-auto">
            Encuentra tu partido.
            <br />
            <span className="text-[#84cc16]">Reserva tu cancha.</span>
            <br />
            Demuestra tu nivel.
          </h1>
          <p className="text-white/60 text-xl max-w-xl mx-auto mb-10 leading-relaxed">
            La plataforma que conecta deportistas, equipos y canchas en Santiago.
            Resultados verificados, matchmaking real, historial que importa.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              to="/registro"
              className="flex items-center gap-2 bg-[#84cc16] text-[#14532d] px-7 py-3.5 rounded-xl font-bold text-base hover:bg-[#a3e635] transition-colors"
            >
              Crear cuenta gratis
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/partidos"
              className="flex items-center gap-2 border border-white/15 text-white/80 px-7 py-3.5 rounded-xl font-medium text-base hover:bg-white/5 transition-colors"
            >
              Ver partidos abiertos
            </Link>
          </div>
        </div>
      </section>

      {/* Sports Grid */}
      <section className="px-8 py-16 border-y border-white/5">
        <p className="text-center text-white/40 text-sm uppercase tracking-widest mb-10">Deportes disponibles</p>
        <div className="flex items-center justify-center gap-8 flex-wrap">
          {sports.map(s => (
            <div key={s.name} className="flex flex-col items-center gap-2 group">
              <div className="text-4xl group-hover:scale-110 transition-transform">{s.icon}</div>
              <span className="text-white/50 text-sm">{s.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="px-8 py-24">
        <h2 className="text-4xl font-bold text-center mb-4">Todo en un solo lugar</h2>
        <p className="text-white/50 text-center mb-16 text-lg">Sin WhatsApps. Sin confusiones. Todo registrado.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {features.map(f => (
            <div
              key={f.title}
              className="bg-white/[0.03] border border-white/8 rounded-2xl p-8 hover:border-[#84cc16]/30 transition-colors"
            >
              <div className="w-12 h-12 bg-[#14532d]/50 rounded-xl flex items-center justify-center mb-6">
                <f.icon size={22} className="text-[#84cc16]" />
              </div>
              <h3 className="text-lg font-semibold mb-3">{f.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="px-8 py-16 bg-[#14532d]/10 border-y border-[#84cc16]/10">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-8 text-center">
          {[
            { num: '500+', label: 'Equipos registrados' },
            { num: '1.200+', label: 'Partidos jugados' },
            { num: '25', label: 'Canchas disponibles' },
          ].map(s => (
            <div key={s.label}>
              <div className="text-5xl font-extrabold text-[#84cc16] mb-2">{s.num}</div>
              <div className="text-white/50">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-8 py-24 text-center">
        <h2 className="text-4xl font-bold mb-6">¿Listo para jugar?</h2>
        <p className="text-white/50 mb-10 text-lg">Crea tu cuenta en 2 minutos y empieza a competir hoy.</p>
        <Link
          to="/registro"
          className="inline-flex items-center gap-2 bg-[#84cc16] text-[#14532d] px-10 py-4 rounded-xl font-bold text-lg hover:bg-[#a3e635] transition-colors"
        >
          Crear cuenta gratis
          <ArrowRight size={20} />
        </Link>
      </section>

      {/* Footer */}
      <footer className="px-8 py-8 border-t border-white/5 text-center text-white/30 text-sm">
        © 2026 PartidoLink · Santiago, Chile
      </footer>
    </div>
  )
}
