import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Search, Loader, ClipboardList, ChevronLeft, ChevronRight, X, Filter } from 'lucide-react';
import { papersService } from '../services/index.js';

const STATUS = {
  ASSIGNED:    { label: 'Assigned',    cls: 'badge-blue' },
  IN_PROGRESS: { label: 'In Progress', cls: 'badge-amber' },
  COMPLETED:   { label: 'Completed',   cls: 'badge-green' },
};

export default function Papers() {
  const [papers, setPapers] = useState([]);
  const [total, setTotal] = useState(0);
  const [filterOpts, setFilterOpts] = useState({ departments: [], sections: [], years: [], statuses: [] });
  const [filters, setFilters] = useState({ department: '', section: '', year: '', status: '' });
  const [query, setQuery] = useState('');
  const [searchMode, setSearchMode] = useState(false);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const pageSize = 15;

  useEffect(() => {
    papersService.getPaperFilters()
      .then(res => setFilterOpts(res.data || res))
      .catch(() => {});
  }, []);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const params = { page, pageSize, ...Object.fromEntries(Object.entries(filters).filter(([, v]) => v)) };
      const res = await papersService.getAssignedPapers(page, pageSize, params);
      setPapers(res.data?.data || res.data || []);
      setTotal(res.data?.total || 0);
    } catch { setError('Failed to load papers.'); }
    finally { setIsLoading(false); }
  }, [page, filters]);

  useEffect(() => {
    if (!searchMode) load();
  }, [load, searchMode]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) { setSearchMode(false); load(); return; }
    setIsLoading(true);
    setSearchMode(true);
    try {
      const res = await papersService.searchPapers(query, 1, pageSize);
      setPapers(res.data || []);
      setTotal(res.data?.length || 0);
    } catch { setError('Search failed.'); }
    finally { setIsLoading(false); }
  };

  const handleClear = () => { setQuery(''); setSearchMode(false); setPage(1); };

  const totalPages = Math.ceil(total / pageSize);

  // Group by dept → section (only in non-search mode)
  const grouped = !searchMode
    ? papers.reduce((acc, p) => {
        const dept = p.department || 'Unassigned';
        const sec  = p.section   || 'Unassigned';
        if (!acc[dept]) acc[dept] = {};
        if (!acc[dept][sec]) acc[dept][sec] = [];
        acc[dept][sec].push(p);
        return acc;
      }, {})
    : null;

  const PaperRow = ({ p }) => {
    const s = STATUS[p.status] || { label: p.status, cls: 'badge-blue' };
    return (
      <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
        <td className="px-4 py-3 text-sm font-mono text-gray-600 dark:text-gray-400">{p.rollNumber}</td>
        <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">{p.studentName}</td>
        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{p.subject}</td>
        <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{p.year || '—'}</td>
        <td className="px-4 py-3"><span className={s.cls}>{s.label}</span></td>
        <td className="px-4 py-3 text-center">
          <Link to={`/evaluation/${p.id}`} className="btn-primary px-4 py-1.5 text-xs">Evaluate</Link>
        </td>
      </tr>
    );
  };

  const TableHead = () => (
    <thead>
      <tr className="bg-gray-50 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-800">
        {['Roll No.', 'Student', 'Subject', 'Year', 'Status', 'Action'].map((h, i) => (
          <th key={h} className={`px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider ${i === 5 ? 'text-center' : 'text-left'}`}>{h}</th>
        ))}
      </tr>
    </thead>
  );

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="page-title">Assigned Papers</h1>
        <p className="page-subtitle">Evaluate student answer sheets assigned to you, organised by department and section.</p>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <div className="flex-1 flex items-center gap-2.5 input px-3.5 py-0">
          <Search size={15} className="text-gray-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search by roll number or student name..."
            className="flex-1 py-2.5 outline-none text-sm bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400"
          />
          {query && (
            <button type="button" onClick={handleClear} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"><X size={15} /></button>
          )}
        </div>
        <button type="submit" className="btn-primary px-5">Search</button>
      </form>

      {/* Filters */}
      {!searchMode && (
        <div className="card p-4 mb-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { key: 'department', label: 'Department', opts: filterOpts.departments },
            { key: 'section',    label: 'Section',    opts: filterOpts.sections },
            { key: 'year',       label: 'Year',       opts: filterOpts.years },
            { key: 'status',     label: 'Status',     opts: filterOpts.statuses },
          ].map(({ key, label, opts }) => (
            <div key={key}>
              <label className="label">{label}</label>
              <select className="input" value={filters[key]} onChange={e => { setFilters(f => ({ ...f, [key]: e.target.value })); setPage(1); }}>
                <option value="">All</option>
                {opts.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          ))}
        </div>
      )}

      {error && <div className="alert-error mb-4">{error}</div>}

      {isLoading ? (
        <div className="flex items-center justify-center py-24"><Loader className="animate-spin text-indigo-600" size={28} /></div>
      ) : papers.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-16 text-center">
          <ClipboardList size={40} className="text-gray-300 dark:text-gray-700 mb-3" />
          <p className="font-semibold text-gray-600 dark:text-gray-400">No papers found</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">{query ? 'Try a different search.' : 'No papers assigned yet.'}</p>
        </div>
      ) : searchMode ? (
        // Flat table for search results
        <div className="surface-raised rounded-2xl overflow-hidden">
          <table className="w-full">
            <TableHead />
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {papers.map(p => <PaperRow key={p.id} p={p} />)}
            </tbody>
          </table>
        </div>
      ) : (
        // Grouped by dept → section
        <>
          {Object.entries(grouped).map(([dept, sections]) => (
            <div key={dept} className="mb-6">
              <h2 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-3 px-1">
                {dept}
              </h2>
              {Object.entries(sections).map(([sec, rows]) => (
                <div key={sec} className="mb-4">
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 px-1">
                    Section: {sec} <span className="text-gray-400 font-normal normal-case">({rows.length} papers)</span>
                  </p>
                  <div className="surface-raised rounded-2xl overflow-hidden">
                    <table className="w-full">
                      <TableHead />
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {rows.map(p => <PaperRow key={p.id} p={p} />)}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          ))}

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} of {total} papers
              </p>
              <div className="flex items-center gap-1.5">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-secondary w-9 h-9 p-0"><ChevronLeft size={16} /></button>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 px-2">{page} / {totalPages}</span>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="btn-secondary w-9 h-9 p-0"><ChevronRight size={16} /></button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
