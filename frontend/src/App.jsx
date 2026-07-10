import React, { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from './store/auth.js';
import Navbar from './components/layout/Navbar.jsx';
import Sidebar from './components/layout/Sidebar.jsx';
import './styles/index.css';

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, []);

  // Redirect to login if not authenticated and trying to access protected routes
  useEffect(() => {
    const protectedRoutes = ['/dashboard', '/papers', '/evaluation'];
    const isProtectedRoute = protectedRoutes.some((route) => location.pathname.startsWith(route));

    if (!isAuthenticated && isProtectedRoute) {
      navigate('/login');
    }

    if (isAuthenticated && location.pathname === '/login') {
      navigate('/dashboard');
    }
  }, [isAuthenticated, location.pathname, navigate]);

  const showLayout = isAuthenticated && location.pathname !== '/login';

  return (
    <div className="min-h-screen bg-gray-50">
      {showLayout ? (
        <div className="flex h-screen">
          <Sidebar />
          <div className="flex flex-col flex-1">
            <Navbar />
            <main className="flex-1 overflow-auto">
              <Outlet />
            </main>
          </div>
        </div>
      ) : (
        <main>
          <Outlet />
        </main>
      )}
    </div>
  );
}

export default App;
