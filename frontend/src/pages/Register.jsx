import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader, Mail, Lock, UserPlus, ShieldCheck, BookOpen, UserCircle, GraduationCap, AlertCircle } from 'lucide-react';
import { authService } from '../services/index.js';
import { useAuth } from '../context/AuthContext.jsx';

const ROLES = [
  { key: 'admin', label: 'Admin', description: 'Full control over users and system settings.', icon: ShieldCheck },
  { key: 'teacher', label: 'Teacher', description: 'Evaluate papers and manage answer keys.', icon: BookOpen },
  { key: 'student', label: 'Student', description: 'View your dashboard and results.', icon: UserCircle },
];

const ROLE_HOME = {
  admin: '/admin/dashboard',
  teacher: '/dashboard',
  student: '/student/dashboard',
};

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [selectedRole, setSelectedRole] = useState('teacher');
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const activeRole = useMemo(
    () => ROLES.find((role) => role.key === selectedRole) || ROLES[1],
    [selectedRole],
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!email || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    try {
      await authService.register(email, password, displayName, selectedRole);
      const result = await login(email, password);

      if (result.success) {
        navigate(ROLE_HOME[result.role] || '/dashboard');
        return;
      }

      setSuccess('Account created. Please sign in from the login page.');
      navigate('/login');
    } catch (err) {
      const message = err.response?.data?.message || 'Unable to create account. Please try again.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-full flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4 py-10 transition-colors">
      <div className="w-full max-w-5xl grid lg:grid-cols-[1.1fr_0.9fr] gap-8 items-start">
        <div className="hidden lg:flex flex-col justify-between rounded-[2rem] p-8 bg-gradient-to-br from-indigo-600 via-slate-900 to-rose-600 text-white shadow-2xl min-h-[640px] relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.35),_transparent_40%),radial-gradient(circle_at_bottom_right,_rgba(255,255,255,0.18),_transparent_35%)]" />
          <div className="relative">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-white/15 rounded-2xl mb-6 backdrop-blur">
              <GraduationCap size={28} />
            </div>
            <h1 className="text-4xl font-bold leading-tight max-w-md">Create the right account type from one screen.</h1>
            <p className="mt-4 text-white/80 max-w-lg">
              Use this page to create an admin, teacher, or student account, then sign in immediately with the same credentials.
            </p>
          </div>

          <div className="relative grid gap-3">
            {ROLES.map(({ key, label, description, icon: Icon }) => (
              <div key={key} className={`rounded-2xl border border-white/15 bg-white/10 backdrop-blur px-4 py-4 transition-all ${selectedRole === key ? 'ring-2 ring-white/40' : ''}`}>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
                    <Icon size={18} />
                  </div>
                  <div>
                    <p className="font-semibold">{label}</p>
                    <p className="text-sm text-white/75 mt-0.5">{description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full max-w-xl mx-auto lg:mx-0">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-indigo-600 rounded-2xl mb-4 shadow-lg">
              <UserPlus size={24} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create account</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">Pick a role, set credentials, then sign in right away.</p>
          </div>

          <div className="surface-raised rounded-2xl p-8 shadow-xl">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl mb-6">
              {ROLES.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedRole(key)}
                  className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
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

            <div className="mb-5 rounded-xl border border-indigo-100 dark:border-indigo-900/60 bg-indigo-50 dark:bg-indigo-950/30 px-4 py-3">
              <p className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">Selected role: {activeRole.label}</p>
              <p className="text-xs text-indigo-600/80 dark:text-indigo-200/70 mt-1">{activeRole.description}</p>
            </div>

            {(error || success) && (
              <div className={`mb-5 rounded-xl px-4 py-3 flex items-start gap-2 text-sm ${error ? 'bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300' : 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300'}`}>
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                <span>{error || success}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Display Name</label>
                <div className="flex items-center gap-2.5 border border-gray-200 dark:border-gray-700 rounded-xl px-3.5 py-2.5 bg-white dark:bg-gray-800 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent transition-all">
                  <UserPlus size={16} className="text-gray-400 shrink-0" />
                  <input
                    type="text"
                    value={displayName}
                    onChange={(event) => setDisplayName(event.target.value)}
                    placeholder="Optional full name"
                    className="flex-1 outline-none text-sm bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email Address</label>
                <div className="flex items-center gap-2.5 border border-gray-200 dark:border-gray-700 rounded-xl px-3.5 py-2.5 bg-white dark:bg-gray-800 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent transition-all">
                  <Mail size={16} className="text-gray-400 shrink-0" />
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    className="flex-1 outline-none text-sm bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
                <div className="flex items-center gap-2.5 border border-gray-200 dark:border-gray-700 rounded-xl px-3.5 py-2.5 bg-white dark:bg-gray-800 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent transition-all">
                  <Lock size={16} className="text-gray-400 shrink-0" />
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="••••••••"
                    className="flex-1 outline-none text-sm bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Confirm Password</label>
                <div className="flex items-center gap-2.5 border border-gray-200 dark:border-gray-700 rounded-xl px-3.5 py-2.5 bg-white dark:bg-gray-800 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent transition-all">
                  <Lock size={16} className="text-gray-400 shrink-0" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    placeholder="••••••••"
                    className="flex-1 outline-none text-sm bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400"
                  />
                </div>
              </div>

              <button type="submit" disabled={isLoading} className="btn-primary w-full mt-2 py-3 inline-flex items-center justify-center gap-2">
                {isLoading && <Loader size={16} className="animate-spin" />}
                {isLoading ? 'Creating account...' : `Create ${activeRole.label} account`}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
              Already have an account? <Link to="/login" className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">Go to login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}