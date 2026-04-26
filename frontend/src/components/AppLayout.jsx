import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, Zap } from 'lucide-react'
import Sidebar from './Sidebar'

export default function AppLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="app-shell">
      {/* Mobile overlay backdrop */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="main-content">
        {/* Mobile-only top bar */}
        <div className="mobile-topbar">
          <button className="hamburger-btn" onClick={() => setSidebarOpen(true)} aria-label="Abrir menú">
            <Menu size={20} />
          </button>
          <Link to="/dashboard" className="mobile-logo">
            <div style={{ width: 28, height: 28, background: '#84cc16', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 12px rgba(132,204,22,0.3)' }}>
              <Zap size={14} color="#14532d" />
            </div>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>PartidoLink</span>
          </Link>
        </div>

        {/* Page content */}
        <div className="page-content fade-up" style={{ maxWidth: '72rem', margin: '0 auto' }}>
          {children}
        </div>
      </main>
    </div>
  )
}
