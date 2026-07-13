import React, { useEffect, useState } from 'react';
import { usePapersStore } from '../store/papers.js';
import { Link } from 'react-router-dom';
import { Search, Loader, ClipboardList, ChevronLeft, ChevronRight, X } from 'lucide-react';

const STATUS = {
  ASSIGNED:    { label: 'Assigned',    cls: 'badge-blue' },
  IN_PROGRESS: { label: 'In Progress', cls: 'badge-amber' },
  COMPLETED:   { label: 'Completed',   cls: 'badge-green' },
};

export default function Papers() {
  const { papers, total, isLoading, error, fetchPapers, searchPapers, clearError } = usePapersStore();
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(total / pageSize);

  useEffect(() => { fetchPapers(page, pageSize); }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    if (query.trim()) searchPapers(query, 1, pageSize);
    else fetchPapers(1, pageSize);
  };

  const handleClear = () => {
    setQuery('');
    setPage(1);
    clearError();
    fetchPapers(1, pageSize);
  };

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="page-title">Assigned Papers</h1>
        <p className="page-subtitle">Evaluate student answer sheets assigned to you.</p>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <div className="flex-1 flex items-center gap-2.5 input px-3.5 py-0">
          <Search size={15} className="text-gray-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by roll number or student name..."
            className="flex-1 py-2.5 outline-none text-sm bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400"
          />
          {query && (
            <button type="button" onClick={handleClear} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <X size={15} />
            </button>
          )}
        </div>
        <button type="submit" className="btn-primary px-5">Search</button>
      </form>

      {error && <div className="alert-error mb-4">{error}</div>}

      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <Loader className="animate-spin text-indigo-600" size={28} />
        </div>
      ) : papers.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-16 text-center">
          <ClipboardList size={40} className="text-gray-300 dark:text-gray-700 mb-3" />
          <p className="font-semibold text-gray-600 dark:text-gray-400">No papers found</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
            {query ? 'Try a different search.' : 'No papers assigned yet.'}
          </p>
        </div>
      ) : (
        <>
          <div className="surface-raised rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-800">
                  {['Roll No.', 'Student', 'Subject', 'Status', 'Action'].map((h, i) => (
                    <th
                      key={h}
                      className={`px-5 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider ${i === 4 ? 'text-center' : 'text-left'}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {papers.map((p) => {
                  const s = STATUS[p.status] || { label: p.status, cls: 'badge-blue' };
                  return (
                    <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
                      <td className="px-5 py-4 text-sm font-mono text-gray-600 dark:text-gray-400">{p.rollNumber}</td>
                      <td className="px-5 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">{p.studentName}</td>
                      <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">{p.subject}</td>
                      <td className="px-5 py-4">
                        <span className={s.cls}>{s.label}</span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <Link to={`/evaluation/${p.id}`} className="btn-primary px-4 py-2 text-xs">
                          Evaluate
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} of {total} papers
              </p>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="btn-secondary w-9 h-9 p-0"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 px-2">
                  {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="btn-secondary w-9 h-9 p-0"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
