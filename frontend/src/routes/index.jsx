import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from '../App.jsx';
import Login from '../pages/Login.jsx';
import Register from '../pages/Register.jsx';
import Dashboard from '../pages/Dashboard.jsx';
import Papers from '../pages/Papers.jsx';
import Evaluation from '../pages/Evaluation.jsx';
import AnswerKeys from '../pages/AnswerKeys.jsx';
import NotFound from '../pages/NotFound.jsx';
import AdminDashboard from '../pages/admin/AdminDashboard.jsx';
import UploadSheets from '../pages/admin/UploadSheets.jsx';
import ManageStudents from '../pages/admin/ManageStudents.jsx';
import ManageUsers from '../pages/admin/ManageUsers.jsx';
import StudentDashboard from '../pages/student/StudentDashboard.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Navigate to="/login" replace />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/register',
        element: <Register />,
      },

      // Teacher routes
      {
        element: <ProtectedRoute allowedRoles={['teacher']} />,
        children: [
          { path: '/dashboard',                      element: <Dashboard /> },
          { path: '/papers',                         element: <Papers /> },
          { path: '/evaluation/:answerSheetId',      element: <Evaluation /> },
          { path: '/answer-keys',                    element: <AnswerKeys /> },
        ],
      },

      // Admin routes
      {
        element: <ProtectedRoute allowedRoles={['admin']} />,
        children: [
          { path: '/admin/dashboard',      element: <AdminDashboard /> },
          { path: '/admin/upload-sheets',  element: <UploadSheets /> },
          { path: '/admin/students',       element: <ManageStudents /> },
          { path: '/admin/users',          element: <ManageUsers /> },
        ],
      },

      // Student routes
      {
        element: <ProtectedRoute allowedRoles={['student']} />,
        children: [
          { path: '/student/dashboard', element: <StudentDashboard /> },
          // Add more student pages here as you build them
        ],
      },

      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);
