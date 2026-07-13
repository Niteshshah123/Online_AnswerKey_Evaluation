import React from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { UserCircle, FileText, CheckCircle, Clock } from 'lucide-react';

const STAT_CARDS = [
  { label: 'My Exams',      value: '—', icon: FileText,    color: 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400' },
  { label: 'Evaluated',     value: '—', icon: CheckCircle, color: 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400' },
  { label: 'Pending',       value: '—', icon: Clock,       color: 'bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400' },
];

export default function StudentDashboard() {
  const { user } = useAuth();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center">
          <UserCircle size={20} className="text-emerald-600 dark:text-emerald-400" />
        </div>
        <div>
          <h1 className="page-title">Student Dashboard</h1>
          <p className="page-subtitle">Welcome, {user?.displayName || user?.email}</p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {STAT_CARDS.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card p-5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
              <Icon size={18} />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Results placeholder */}
      <div className="card p-6">
        <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-3">My Results</h2>
        <div className="flex flex-col items-center justify-center py-10 text-gray-400 dark:text-gray-600">
          <FileText size={36} className="mb-3 opacity-40" />
          <p className="text-sm">No results available yet.</p>
          <p className="text-xs mt-1">Your evaluated answer sheets will appear here.</p>
        </div>
      </div>
    </div>
  );
}
