import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import pugLogo from '../../assets/pug-logo.jpeg';

interface NavItem {
  to: string;
  label: string;
  icon: string;
}

const USER_NAV: NavItem[] = [
  { to: '/dashboard', label: 'Inicio', icon: 'pi pi-home' },
  { to: '/profile', label: 'Perfil de protección', icon: 'pi pi-shield' },
];

const ADMIN_NAV: NavItem[] = [
  { to: '/admin', label: 'Dashboard', icon: 'pi pi-chart-bar' },
  { to: '/admin/users', label: 'Usuarios', icon: 'pi pi-users' },
  { to: '/admin/catalogs', label: 'Catálogos', icon: 'pi pi-list' },
];

export function AppLayout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = user?.role === 'admin' ? ADMIN_NAV : USER_NAV;

  function handleSignOut() {
    signOut();
    navigate('/login');
  }

  const initials = user?.fullName
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <div className="flex h-screen bg-purple-50 overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-30
          w-64 bg-white border-r border-purple-100
          flex flex-col
          transform transition-transform duration-200
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Brand */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-purple-100">
          <img src={pugLogo} alt="PugGuardian" className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
          <div>
            <p className="font-bold text-slate-900 text-sm leading-tight">PugGuardian</p>
            <p className="text-xs text-purple-600 leading-tight">
              {user?.role === 'admin' ? 'Panel admin' : 'Mi protección'}
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/admin'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-purple-50 text-purple-700'
                    : 'text-slate-600 hover:bg-purple-50 hover:text-purple-700'
                }`
              }
              onClick={() => setSidebarOpen(false)}
            >
              <i className={`${item.icon} text-base w-5 text-center`} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User footer */}
        <div className="border-t border-purple-100 p-3">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1">
            <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
              {initials}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-slate-900 truncate">{user?.fullName}</p>
              <p className="text-xs text-slate-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <i className="pi pi-sign-out text-base w-5 text-center" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile topbar */}
        <header className="lg:hidden bg-white border-b border-purple-100 px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg text-slate-600 hover:bg-purple-50 transition-colors"
          >
            <i className="pi pi-bars" />
          </button>
          <div className="flex items-center gap-2">
            <img src={pugLogo} alt="PugGuardian" className="w-7 h-7 rounded-full object-cover" />
            <span className="font-bold text-slate-900 text-sm">PugGuardian</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
