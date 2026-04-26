import Sidebar from './Sidebar'

export default function AppLayout({ children }) {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-content">
        <div className="max-w-6xl mx-auto fade-up">
          {children}
        </div>
      </main>
    </div>
  )
}
