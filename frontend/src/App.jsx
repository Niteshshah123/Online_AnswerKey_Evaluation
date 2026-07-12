import React, { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { useAuthStore } from './store/auth.js';
import Navbar from './components/layout/Navbar.jsx';
import Sidebar from './components/layout/Sidebar.jsx';
import './styles/index.css';

const TEACHER_ROUTES  = ['/dashboard', '/papers', '/evaluation', '/answer-keys'];
const ADMIN_ROUTES    = ['/admin'];
const STUDENT_ROUTES  = ['/student'];
const ALL_PROTECTED   = [...TEACHER_ROUTES, ...ADMIN_ROUTES, ...STUDENT_ROUTES];

// Bridges Firebase AuthContext → useAuthStore for legacy components
function AuthSync() {
  const { user, role, loading } = useAuth();
  const { setAuth, setLoading } = useAuthStore();

  useEffect(() => {
    if (loading) { setLoading(true); return; }
    setAuth(user ? { ...user, displayName: user.displayName, email: user.email } : null, role);
  }, [user, role, loading]);

  return null;
}

function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, role, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    const isProtected = ALL_PROTECTED.some((r) => location.pathname.startsWith(r));
    if (!user && isProtected) { navigate('/login'); return; }
    if (user && (location.pathname === '/login' || location.pathname === '/register')) {
      navigate(role === 'admin' ? '/admin/dashboard' : role === 'student' ? '/student/dashboard' : '/dashboard');
    }
  }, [user, role, loading, location.pathname]);

  const showLayout = !!user && location.pathname !== '/login';

  return (
    <div className="h-full bg-gray-50 dark:bg-gray-950 transition-colors duration-200">
      {showLayout ? (
        <div className="flex h-full">
          <Sidebar />
          <div className="flex flex-col flex-1 min-w-0">
            <Navbar />
            <main className="flex-1 overflow-auto">
              <Outlet />
            </main>
          </div>
        </div>
      ) : (
        <Outlet />
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AuthSync />
      <AppLayout />
    </AuthProvider>
  );
}

export default App;
