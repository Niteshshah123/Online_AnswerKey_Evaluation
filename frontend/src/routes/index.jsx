import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from '../App.jsx';
import Login from '../pages/Login.jsx';
import Dashboard from '../pages/Dashboard.jsx';
import Papers from '../pages/Papers.jsx';
import Evaluation from '../pages/Evaluation.jsx';
import NotFound from '../pages/NotFound.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import { useAuthStore } from '../store/auth.js';

const RootRedirect = () => {
  const { isAuthenticated } = useAuthStore();
  return <Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />;
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <RootRedirect />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: '/dashboard',
            element: <Dashboard />,
          },
          {
            path: '/papers',
            element: <Papers />,
          },
          {
            path: '/evaluation/:answerSheetId',
            element: <Evaluation />,
          },
        ],
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);
