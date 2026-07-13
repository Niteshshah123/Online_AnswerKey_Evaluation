import React, { useEffect } from 'react';
import { useDashboardStore } from '../store/dashboard.js';
import { useAuthStore } from '../store/auth.js';
import { Link } from 'react-router-dom';
import { FileCheck2, Clock, FileText, TrendingUp, ArrowRight, Loader } from 'lucide-react';

const CARDS = [
  { key: 'totalPapers',     label: 'Total Papers',     icon: FileText,    color: 'bg-blue-500',    ring: 'ring-blue-100 dark:ring-blue-900/30' },
  { key: 'pendingPapers',   label: 'Pending',          icon: Clock,       color: 'bg-amber-500',   ring: 'ring-amber-100 dark:ring-amber-900/30' },
  { key: 'completedPapers', label: 'Completed',        icon: FileCheck2,  color: 'bg-emerald-500', ring: 'ring-emerald-100 dark:ring-emerald-900/30' },
];

export default function Dashboard() {
  const { stats, isLoading, fetchStats } = useDashboardStore();
  const { user } = useAuthStore();

  useEffect(() => { fetchStats(); }, [fetchStats]);

  const rate = stats?.totalPapers ? Math.round((stats.completedPapers / stats.totalPapers) * 100) : 0;

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="page-title">Welcome back, {user?.firstName} 👋</h1>
        <p className="page-subtitle">Here's your evaluation overview.</p>
      </div>

      {isLoading && !stats ? (
        <div className="flex items-center justify-center py-24">
          <Loader className="animate-spin text-indigo-600" size={28} />
        </div>
      ) : (
        <>
          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {CARDS.map(({ key, label, icon: Icon, color, ring }) => (
              <div key={key} className={`card ring-1 ${ring}`}>
                <div className="flex items-center gap-4">
                  <div className={`w-11 h-11 rounded-xl ${color} flex items-center justify-center shrink-0`}>
                    <Icon size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.[key] ?? 0}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Completion rate card */}
          <div className="card mb-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <TrendingUp size={17} className="text-indigo-600" />
                <span className="font-semibold text-gray-800 dark:text-gray-200 text-sm">Overall Progress</span>
              </div>
              <span className="text-sm font-bold text-indigo-600">{rate}%</span>
            </div>
            <div className="w-full h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-600 rounded-full transition-all duration-700"
                style={{ width: `${rate}%` }}
              />
            </div>
            <div className="flex justify-between mt-2.5 text-xs text-gray-400 dark:text-gray-500">
              <span>{stats?.assignedPapers ?? 0} assigned</span>
              <span>{stats?.inProgressPapers ?? 0} in progress</span>
              <span>{stats?.completedPapers ?? 0} done</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { to: '/papers',      title: 'View Papers',        sub: 'Start evaluating assigned papers' },
              { to: '/answer-keys', title: 'Manage Answer Keys', sub: 'Upload answer keys for exams' },
            ].map(({ to, title, sub }) => (
              <Link
                key={to}
                to={to}
                className="card flex items-center justify-between hover:ring-1 hover:ring-indigo-300 dark:hover:ring-indigo-700 transition-all group"
              >
                <div>
                  <p className="font-semibold text-gray-800 dark:text-gray-200 text-sm">{title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{sub}</p>
                </div>
                <ArrowRight size={18} className="text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors shrink-0" />
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
