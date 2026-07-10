import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <h1 className="mb-2 text-6xl font-bold text-gray-800">404</h1>
        <p className="mb-6 text-xl text-gray-600">Page not found</p>
        <p className="mb-8 text-gray-500">The page you are looking for doesn't exist or has been moved.</p>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 transition-colors"
        >
          <Home size={18} />
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
