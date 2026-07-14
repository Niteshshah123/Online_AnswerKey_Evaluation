import React from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { ShieldCheck, Users, FileText, BarChart2, Upload, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';

const STAT_CARDS = [
  { label: 'Total Students',  value: '—', icon: Users,     color: 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400' },
  { label: 'Total Exams',     value: '—', icon: FileText,  color: 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400' },
  { label: 'Evaluations',     value: '—', icon: BarChart2, color: 'bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400' },
  { label: 'Pending Upload',  value: '—', icon: Upload,    color: 'bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400' },
];

export default function AdminDashboard() {
  const { user } = useAuth();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950 flex items-center justify-center">
          <ShieldCheck size={20} className="text-rose-600 dark:text-rose-400" />
        </div>
        <div>
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="page-subtitle">Welcome, {user?.displayName || user?.email}</p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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

      {/* Quick actions */}
      <div className="card p-6">
        <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link to="/admin/upload-sheets" className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-all group">
            <Upload size={18} className="text-indigo-500" />
            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Upload Answer Sheets</p>
              <p className="text-xs text-gray-400">Bulk upload student PDFs</p>
            </div>
          </Link>
          <Link to="/admin/students" className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-all group">
            <GraduationCap size={18} className="text-indigo-500" />
            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Manage Students</p>
              <p className="text-xs text-gray-400">Add & organise student records</p>
            </div>
          </Link>
          <Link to="/admin/users" className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-all group">
            <Users size={18} className="text-indigo-500" />
            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Manage Users</p>
              <p className="text-xs text-gray-400">Add teachers & students</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
