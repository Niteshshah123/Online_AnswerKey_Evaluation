import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth.js';
import { Mail, Lock, Loader } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuthStore();
  const [email, setEmail] = useState('faculty@college.edu');
  const [password, setPassword] = useState('password123');
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    clearError();

    if (!email || !password) {
      setLocalError('Please fill in all fields');
      return;
    }

    const success = await login(email, password);

    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-800">MarkSheet Evaluation</h1>
          <p className="text-gray-600">Faculty Login Portal</p>
        </div>

        {(error || localError) && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-700">
            <p className="text-sm font-medium">{error || localError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Email Address</label>
            <div className="flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 focus-within:ring-2 focus-within:ring-blue-500">
              <Mail size={18} className="text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="faculty@college.edu"
                className="ml-2 w-full border-none bg-transparent outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Password</label>
            <div className="flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 focus-within:ring-2 focus-within:ring-blue-500">
              <Lock size={18} className="text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="ml-2 w-full border-none bg-transparent outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 font-medium text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading && <Loader size={18} className="animate-spin" />}
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-6 rounded-lg bg-blue-50 p-4">
          <p className="text-xs text-gray-600">
            <strong>Demo Credentials:</strong>
            <br />
            Email: faculty@college.edu
            <br />
            Password: password123
          </p>
        </div>
      </div>
    </div>
  );
}
