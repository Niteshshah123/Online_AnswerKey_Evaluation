import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText } from 'lucide-react';

export default function Sidebar() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname.startsWith(path);
  };

  const navItems = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: <LayoutDashboard size={20} />,
    },
    {
      label: 'Assigned Papers',
      path: '/papers',
      icon: <FileText size={20} />,
    },
  ];

  return (
    <aside className="sticky top-0 h-screen w-64 overflow-y-auto border-r border-gray-200 bg-white">
      <div className="p-6">
        <h2 className="text-lg font-bold text-gray-800">Navigation</h2>
      </div>

      <nav className="space-y-2 px-4">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-all ${
              isActive(item.path)
                ? 'bg-blue-50 text-blue-600 font-medium'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
