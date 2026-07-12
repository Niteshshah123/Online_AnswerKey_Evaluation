import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { LogOut, Sun, Moon, GraduationCap } from 'lucide-react';

const ROLE_BADGE = {
  admin:   'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300',
  teacher: 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300',
  student: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300',
};

export default function Navbar() {
  const navigate = useNavigate();
  const { user, role, logout } = useAuth();
  const { theme, toggle } = useTheme();

  const handleLogout = async () => { await logout(); navigate('/login'); };

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'User';
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <header className="h-16 shrink-0 flex items-center justify-between px-6 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 transition-colors">
      {/* Brand */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
          <GraduationCap size={17} className="text-white" />
        </div>
        <span className="font-bold text-gray-900 dark:text-white text-base tracking-tight">EvalPro</span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        <button
          onClick={toggle}
          className="btn-ghost w-9 h-9 p-0 rounded-xl"
          title={theme === 'dark' ? 'Switch to light' : 'Switch to dark'}
        >
          {theme === 'dark'
            ? <Sun size={17} className="text-amber-400" />
            : <Moon size={17} className="text-gray-500" />}
        </button>

        <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 leading-tight">{displayName}</p>
            {role && (
              <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full capitalize ${ROLE_BADGE[role] || ROLE_BADGE.teacher}`}>
                {role}
              </span>
            )}
          </div>
          <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center shrink-0">
            <span className="text-indigo-700 dark:text-indigo-300 font-bold text-xs">{initials}</span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="btn-ghost w-9 h-9 p-0 rounded-xl ml-1"
          title="Logout"
        >
          <LogOut size={17} />
        </button>
      </div>
    </header>
  );
}
