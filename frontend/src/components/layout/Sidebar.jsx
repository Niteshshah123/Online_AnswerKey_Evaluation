import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import {
  LayoutDashboard, FileText, KeyRound,
  ShieldCheck, Users, Upload, UserCircle,
} from 'lucide-react';

const NAV_BY_ROLE = {
  teacher: [
    { label: 'Dashboard',   path: '/dashboard',   icon: LayoutDashboard },
    { label: 'Papers',      path: '/papers',       icon: FileText },
    { label: 'Answer Keys', path: '/answer-keys',  icon: KeyRound },
  ],
  admin: [
    { label: 'Dashboard',       path: '/admin/dashboard',      icon: ShieldCheck },
    { label: 'Upload Sheets',   path: '/admin/upload-sheets',  icon: Upload },
    { label: 'Manage Users',    path: '/admin/users',          icon: Users },
  ],
  student: [
    { label: 'Dashboard', path: '/student/dashboard', icon: UserCircle },
    { label: 'My Results', path: '/student/results',  icon: FileText },
  ],
};

const ROLE_BADGE = {
  admin:   { label: 'Admin',   cls: 'bg-rose-500/20 text-rose-400' },
  teacher: { label: 'Teacher', cls: 'bg-indigo-500/20 text-indigo-400' },
  student: { label: 'Student', cls: 'bg-emerald-500/20 text-emerald-400' },
};

export default function Sidebar() {
  const { pathname } = useLocation();
  const { role } = useAuth();
  const nav = NAV_BY_ROLE[role] || NAV_BY_ROLE.teacher;
  const badge = ROLE_BADGE[role];

  return (
    <aside className="w-56 shrink-0 h-full flex flex-col bg-gray-900 dark:bg-gray-950 border-r border-gray-800 transition-colors">
      {/* Logo area */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-gray-800">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Navigation</span>
        {badge && (
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${badge.cls}`}>
            {badge.label}
          </span>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {nav.map(({ label, path, icon: Icon }) => {
          const active = pathname.startsWith(path);
          return (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                active
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-gray-100'
              }`}
            >
              <Icon size={17} className={active ? 'text-white' : 'text-gray-500'} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800">
        <p className="text-xs text-gray-600 text-center">EvalPro v1.0</p>
      </div>
    </aside>
  );
}
