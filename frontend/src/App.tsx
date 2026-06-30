import { Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import PropertyListPage from './pages/PropertyListPage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import PropertyManagementPage from './pages/PropertyManagementPage';
import FavoritesPage from './pages/FavoritesPage';
import AdminUsersPage from './pages/AdminUsersPage';
import Navbar from './components/Navbar';
import { AuthProvider, useAuth } from './store/auth';

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
}

function RoleRoute({ children, allowAdmin = false, allowAgent = false }: { children: JSX.Element; allowAdmin?: boolean; allowAgent?: boolean }) {
  const { token, isAdmin, isAgent } = useAuth();
  if (!token) return <Navigate to="/login" replace />;

  const allowed = (allowAdmin && isAdmin) || (allowAgent && isAgent);
  return allowed ? children : <Navigate to="/" replace />;
}

function AppContent() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<PropertyListPage />} />
        <Route path="/properties/:id" element={<PropertyDetailPage />} />
        <Route path="/manage" element={<RoleRoute allowAdmin allowAgent><PropertyManagementPage /></RoleRoute>} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/admin/users" element={<RoleRoute allowAdmin><AdminUsersPage /></RoleRoute>} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
