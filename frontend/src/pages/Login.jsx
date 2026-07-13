import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import {
  Mail, Lock, Loader, GraduationCap, Sun, Moon, AlertCircle,
  ShieldCheck, BookOpen, UserCircle,
} from 'lucide-react';

const ROLES = [
  { key: 'admin',   label: 'Admin',   icon: ShieldCheck,  color: 'text-rose-500'   },
  { key: 'teacher', label: 'Teacher', icon: BookOpen,     color: 'text-indigo-500' },
  { key: 'student', label: 'Student', icon: UserCircle,   color: 'text-emerald-500'},
];

const ROLE_HOME = {
  admin:   '/admin/dashboard',
  teacher: '/dashboard',
  student: '/student/dashboard',
};

export default function Login() {
  const navigate = useNavigate();
  const { login, error, clearError } = useAuth();
  const { theme, toggle } = useTheme();

  const [selectedRole, setSelectedRole] = useState('teacher');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const [isLoading, setIsLoading]   = useState(false);

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    setLocalError('');
    clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    clearError();
    if (!email || !password) { setLocalError('Please fill in all fields.'); return; }

    setIsLoading(true);
    const result = await login(email, password);
    setIsLoading(false);

    if (result.success) {
      navigate(ROLE_HOME[result.role] || '/dashboard');
    }
  };

  const activeRole = ROLES.find((r) => r.key === selectedRole);

  return (
    <div className="min-h-full flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4 transition-colors">
      {/* Theme toggle */}
      <button
        onClick={toggle}
        className="fixed top-4 right-4 btn-ghost w-10 h-10 p-0 rounded-xl"
      >
        {theme === 'dark'
          ? <Sun size={18} className="text-amber-400" />
          : <Moon size={18} className="text-gray-500" />}
      </button>

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-indigo-600 rounded-2xl mb-4 shadow-lg">
            <GraduationCap size={28} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">EvalPro</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">Answer Sheet Evaluation System</p>
        </div>

        <div className="surface-raised rounded-2xl p-8">
          {/* Role tabs */}
          <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl mb-6">
            {ROLES.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => handleRoleChange(key)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                  selectedRole === key
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
          </div>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
            {activeRole.label} Login
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
            Sign in to your {activeRole.label.toLowerCase()} account
          </p>

          {(error || localError) && (
            <div className="alert-error mb-5">
              <AlertCircle size={16} className="shrink-0" />
              {error || localError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Email Address
              </label>
              <div className="flex items-center gap-2.5 border border-gray-200 dark:border-gray-700 rounded-xl px-3.5 py-2.5 bg-white dark:bg-gray-800 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent transition-all">
                <Mail size={16} className="text-gray-400 shrink-0" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="flex-1 outline-none text-sm bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Password
              </label>
              <div className="flex items-center gap-2.5 border border-gray-200 dark:border-gray-700 rounded-xl px-3.5 py-2.5 bg-white dark:bg-gray-800 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent transition-all">
                <Lock size={16} className="text-gray-400 shrink-0" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="flex-1 outline-none text-sm bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400"
                />
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="btn-primary w-full mt-2 py-3">
              {isLoading && <Loader size={16} className="animate-spin" />}
              {isLoading ? 'Signing in...' : `Sign in as ${activeRole.label}`}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 dark:text-gray-600 mt-6">
          Role is determined by your account permissions.
        </p>
      </div>
    </div>
  );
}
