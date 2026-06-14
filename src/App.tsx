import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { AppLayout } from './components/shared/AppLayout';
import { ProtectedRoute } from './components/shared/ProtectedRoute';
import { LoginPage } from './features/auth/LoginPage';
import { SignupWizard } from './features/auth/signup/SignupWizard';
import { LandingPage } from './features/auth/LandingPage';
import { UserDashboard } from './features/user/UserDashboard';
import { ProfileSettings } from './features/user/ProfileSettings';
import { AdminDashboard } from './features/admin/AdminDashboard';
import { CatalogManager } from './features/admin/CatalogManager';
import { UserList } from './features/admin/UserList';

function RootRedirect() {
  const { user, isLoading } = useAuth();
  if (isLoading) return null;
  if (!user) return <LandingPage />;
  return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;
}

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupWizard />} />

      {/* Protected app shell */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        {/* User routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={['usuario']}>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={['usuario']}>
              <ProfileSettings />
            </ProtectedRoute>
          }
        />

        {/* Admin routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <UserList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/catalogs"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <CatalogManager />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Root redirect */}
      <Route path="/" element={<RootRedirect />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
