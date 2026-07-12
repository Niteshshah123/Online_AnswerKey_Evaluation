import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

// allowedRoles: string[] — if omitted, any authenticated user passes
export default function ProtectedRoute({ allowedRoles }) {
  const { user, role, loading } = useAuth();

  if (loading) return null; // wait for Firebase to resolve

  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(role)) {
    // Redirect to their own home if they hit a route they can't access
    const home =
      role === 'admin' ? '/admin/dashboard'
      : role === 'student' ? '/student/dashboard'
      : '/dashboard';
    return <Navigate to={home} replace />;
  }

  return <Outlet />;
}
