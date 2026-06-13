import { Menubar } from 'primereact/menubar'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

function Layout() {
  const navigate = useNavigate()
  const location = useLocation()

  const items = [
    {
      label: 'Home',
      icon: 'pi pi-home',
      command: () => navigate('/'),
      className: location.pathname === '/' ? 'is-active' : '',
    },
    {
      label: 'Playground',
      icon: 'pi pi-sparkles',
      command: () => navigate('/playground'),
      className: location.pathname === '/playground' ? 'is-active' : '',
    },
    {
      label: 'Log in',
      icon: 'pi pi-sign-in',
      command: () => navigate('/login'),
      className: location.pathname === '/login' ? 'is-active' : '',
    },
    {
      label: 'Sign up',
      icon: 'pi pi-user-plus',
      command: () => navigate('/signup'),
      className: location.pathname === '/signup' ? 'is-active' : '',
    },
  ]

  return (
    <div className="app-shell">
      <header className="app-header">
        <Menubar model={items} className="app-nav" />
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
