import { Link } from 'react-router-dom'
import { Zap, Shield, Users, Trophy, ArrowRight, CheckCircle, Star, TrendingUp } from 'lucide-react'

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
    desc: 'Pago anticipado asegura tu cancha. Sin no-shows. Las canchas saben que llegarás.',
    color: '#3b82f6',
  },
  {
    icon: Users,
    title: 'Matchmaking Real',
    desc: 'Encuentra rivales de tu nivel y comuna. Desafía equipos con un solo clic.',
    color: '#84cc16',
  },
  {
    icon: Trophy,
    title: 'Historial Verificado',
    desc: 'Ambos equipos confirman el marcador. Tu récord es auténtico e inapelable.',
    color: '#f59e0b',
  },
]

const steps = [
  { n: '01', title: 'Crea tu equipo', desc: 'Registra tu equipo y elige tu deporte.' },
  { n: '02', title: 'Encuentra rival', desc: 'Filtra por deporte, comuna y nivel.' },
  { n: '03', title: 'Reserva la cancha', desc: 'Reserva con pago garantizado.' },
  { n: '04', title: 'Valida el resultado', desc: 'Ambos equipos confirman el marcador.' },
]

export default function Landing() {
  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* ── Navbar ── */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '1.25rem 3rem',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(10,10,10,0.85)',
        backdropFilter: 'blur(12px)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <div style={{ width: 34, height: 34, background: '#84cc16', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(132,204,22,0.35)' }}>
            <Zap size={18} color="#14532d" />
          </div>
          <span style={{ fontWeight: 700, fontSize: 17, letterSpacing: '-0.3px' }}>PartidoLink</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <Link to="/partidos" style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14, textDecoration: 'none', transition: 'color 0.15s' }}
            onMouseEnter={e => e.target.style.color = '#fff'}
            onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.55)'}
          >Ver partidos</Link>
          <Link to="/equipos" style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14, textDecoration: 'none' }}
            onMouseEnter={e => e.target.style.color = '#fff'}
            onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.55)'}
          >Equipos</Link>
          <Link to="/login" style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14, textDecoration: 'none' }}
            onMouseEnter={e => e.target.style.color = '#fff'}
            onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.55)'}
          >Iniciar sesión</Link>
          <Link to="/registro" className="btn-primary" style={{ fontSize: 13 }}>
            Crear cuenta
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{ position: 'relative', padding: '6rem 3rem 5rem', textAlign: 'center', overflow: 'hidden' }}>
        {/* Glow */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-60%)', width: 700, height: 500, background: 'radial-gradient(ellipse, rgba(20,83,45,0.25) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative' }} className="fade-up">
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: 'rgba(20,83,45,0.3)', border: '1px solid rgba(132,204,22,0.2)',
            color: '#84cc16', padding: '0.375rem 1rem', borderRadius: 99,
            fontSize: 13, fontWeight: 500, marginBottom: '2rem',
          }}>
            <Zap size={12} /> La plataforma deportiva de Chile
          </div>

          <h1 style={{ fontSize: 'clamp(2.5rem,6vw,4.25rem)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-2px', marginBottom: '1.5rem', maxWidth: 760, margin: '0 auto 1.5rem' }}>
            Encuentra tu partido.<br />
            <span style={{ color: '#84cc16' }}>Reserva tu cancha.</span><br />
            Demuestra tu nivel.
          </h1>

          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.125rem', maxWidth: 520, margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
            Conecta equipos, reserva canchas con pago garantizado y valida
            resultados con el sistema de doble confirmación.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link to="/registro" className="btn-primary" style={{ fontSize: 15, padding: '0.875rem 2rem' }}>
              Crear cuenta gratis <ArrowRight size={16} />
            </Link>
            <Link to="/partidos" className="btn-ghost" style={{ fontSize: 15, padding: '0.875rem 2rem' }}>
              Ver partidos abiertos
            </Link>
          </div>

          {/* Social proof */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', marginTop: '3rem', flexWrap: 'wrap' }}>
            {[
              { icon: '⚽', text: '500+ equipos' },
              { icon: '🏟️', text: '10 canchas' },
              { icon: '✅', text: '1.200+ partidos' },
            ].map(s => (
              <div key={s.text} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'rgba(255,255,255,0.35)', fontSize: 13 }}>
                <span>{s.icon}</span> {s.text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Sports strip ── */}
      <section style={{ padding: '2rem 3rem', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3rem', flexWrap: 'wrap' }}>
          {sports.map(s => (
            <div key={s.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', cursor: 'default' }}
              onMouseEnter={e => { e.currentTarget.querySelector('div').style.transform = 'scale(1.15)'; e.currentTarget.querySelector('span').style.color = '#fff' }}
              onMouseLeave={e => { e.currentTarget.querySelector('div').style.transform = 'scale(1)'; e.currentTarget.querySelector('span').style.color = 'rgba(255,255,255,0.4)' }}
            >
              <div style={{ fontSize: 32, transition: 'transform 0.2s' }}>{s.icon}</div>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', transition: 'color 0.2s', fontWeight: 500 }}>{s.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section style={{ padding: '5rem 3rem' }}>
        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 12, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '1rem' }}>Funcionalidades</p>
        <h2 style={{ textAlign: 'center', fontSize: 'clamp(1.75rem,4vw,2.5rem)', fontWeight: 700, letterSpacing: '-0.5px', marginBottom: '1rem' }}>Todo en un solo lugar</h2>
        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', marginBottom: '3.5rem', fontSize: 16 }}>Sin WhatsApps. Sin confusiones. Todo registrado y verificado.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', maxWidth: 1000, margin: '0 auto' }}>
          {features.map(f => (
            <div key={f.title} className="card card-green" style={{ padding: '2rem' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ width: 46, height: 46, borderRadius: 12, background: `${f.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <f.icon size={20} color={f.color} />
              </div>
              <h3 style={{ fontWeight: 600, fontSize: 16, marginBottom: '0.625rem' }}>{f.title}</h3>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, lineHeight: 1.65 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section style={{ padding: '5rem 3rem', background: 'rgba(255,255,255,0.01)', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 12, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '1rem' }}>Cómo funciona</p>
        <h2 style={{ textAlign: 'center', fontSize: 'clamp(1.75rem,4vw,2.5rem)', fontWeight: 700, letterSpacing: '-0.5px', marginBottom: '3.5rem' }}>En 4 pasos simples</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', maxWidth: 900, margin: '0 auto' }}>
          {steps.map((s, i) => (
            <div key={s.n} style={{ textAlign: 'center', padding: '1.75rem 1.25rem' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#84cc16', letterSpacing: '2px', marginBottom: '0.75rem' }}>PASO {s.n}</div>
              <div style={{ width: 48, height: 48, border: '1px solid rgba(132,204,22,0.25)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: '#84cc16', fontWeight: 700, fontSize: 16 }}>
                {i + 1}
              </div>
              <h3 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>{s.title}</h3>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, lineHeight: 1.6 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Stats ── */}
      <section style={{ padding: '4rem 3rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          {[
            { num: '500+', label: 'Equipos registrados', icon: '👥' },
            { num: '1.200+', label: 'Partidos jugados', icon: '⚽' },
            { num: '25', label: 'Canchas disponibles', icon: '🏟️' },
          ].map(s => (
            <div key={s.label} className="card" style={{ padding: '2rem' }}>
              <div style={{ fontSize: 28, marginBottom: '0.5rem' }}>{s.icon}</div>
              <div style={{ fontSize: 38, fontWeight: 800, color: '#84cc16', letterSpacing: '-1px', marginBottom: '0.375rem' }}>{s.num}</div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '5rem 3rem', textAlign: 'center', background: 'radial-gradient(ellipse at center, rgba(20,83,45,0.15) 0%, transparent 70%)' }}>
        <h2 style={{ fontSize: 'clamp(2rem,5vw,3rem)', fontWeight: 800, letterSpacing: '-1px', marginBottom: '1rem' }}>¿Listo para jugar?</h2>
        <p style={{ color: 'rgba(255,255,255,0.45)', marginBottom: '2.5rem', fontSize: 16 }}>Crea tu cuenta gratis en 2 minutos.</p>
        <Link to="/registro" className="btn-primary" style={{ fontSize: 16, padding: '1rem 2.5rem' }}>
          Empezar ahora <ArrowRight size={18} />
        </Link>
      </section>

      {/* ── Footer ── */}
      <footer style={{ padding: '1.5rem 3rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: 22, height: 22, background: '#84cc16', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={12} color="#14532d" />
          </div>
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>PartidoLink</span>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 12 }}>© 2026 PartidoLink · Santiago, Chile</p>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          {['Términos', 'Privacidad', 'Contacto'].map(l => (
            <a key={l} href="#" style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, textDecoration: 'none' }}
              onMouseEnter={e => e.target.style.color = '#fff'}
              onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.3)'}
            >{l}</a>
          ))}
        </div>
      </footer>
    </div>
  )
}
