import React, { useEffect } from 'react';
import { useDashboardStore } from '../store/dashboard.js';
import { FileCheck, FileX, FileQuestion, FileText } from 'lucide-react';
import { Loader } from 'lucide-react';

export default function Dashboard() {
  const { stats, isLoading, error, fetchStats } = useDashboardStore();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (isLoading && !stats) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  if (error && !stats) {
    return (
      <div className="mx-auto max-w-4xl p-8">
        <div className="rounded-lg bg-red-50 p-4 text-red-700">
          <p className="font-medium">Error loading dashboard</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      label: 'Total Papers',
      value: stats?.totalPapers || 0,
      icon: <FileText className="text-blue-600" size={32} />,
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Assigned',
      value: stats?.assignedPapers || 0,
      icon: <FileQuestion className="text-yellow-600" size={32} />,
      bgColor: 'bg-yellow-50',
    },
    {
      label: 'In Progress',
      value: stats?.inProgressPapers || 0,
      icon: <FileX className="text-orange-600" size={32} />,
      bgColor: 'bg-orange-50',
    },
    {
      label: 'Completed',
      value: stats?.completedPapers || 0,
      icon: <FileCheck className="text-green-600" size={32} />,
      bgColor: 'bg-green-50',
    },
  ];

  return (
    <div className="space-y-8 p-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="mt-1 text-gray-600">Welcome back! Here's your evaluation status.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card, index) => (
          <div key={index} className={`rounded-lg p-6 ${card.bgColor}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{card.label}</p>
                <p className="mt-2 text-3xl font-bold text-gray-800">{card.value}</p>
              </div>
              {card.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-800">Summary</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-gray-200 pb-4">
            <span className="text-gray-600">Pending Papers:</span>
            <span className="text-xl font-bold text-orange-600">{stats?.pendingPapers || 0}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Completion Rate:</span>
            <span className="text-xl font-bold text-green-600">
              {stats?.totalPapers ? Math.round((stats.completedPapers / stats.totalPapers) * 100) : 0}%
            </span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-800">Quick Actions</h2>
        <a
          href="/papers"
          className="inline-block rounded-lg bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700 transition-colors"
        >
          View All Papers
        </a>
      </div>
    </div>
  );
}
