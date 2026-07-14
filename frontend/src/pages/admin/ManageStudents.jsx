import React, { useEffect, useState, useCallback } from 'react';
import { Plus, Pencil, Trash2, Loader, AlertCircle, CheckCircle2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { adminService } from '../../services/index.js';

const EMPTY_FORM = { rollNumber: '', firstName: '', lastName: '', email: '', phone: '', department: '', section: '', year: '', semester: '' };

export default function ManageStudents() {
  const [students, setStudents] = useState([]);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({ departments: [], sections: [], years: [], semesters: [] });
  const [query, setQuery] = useState({ department: '', section: '', year: '', semester: '' });
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = { page, pageSize, ...Object.fromEntries(Object.entries(query).filter(([, v]) => v)) };
      const res = await adminService.listStudents(params);
      setStudents(res.data?.data || []);
      setTotal(res.data?.total || 0);
    } catch { setError('Failed to load students.'); }
    finally { setIsLoading(false); }
  }, [page, query]);

  useEffect(() => {
    adminService.getStudentFilters()
      .then(res => setFilters(res.data || res))
      .catch(() => {});
  }, []);

  useEffect(() => { load(); }, [load]);

  const openAdd = () => { setEditId(null); setForm(EMPTY_FORM); setShowForm(true); };
  const openEdit = (s) => { setEditId(s.id); setForm({ rollNumber: s.rollNumber, firstName: s.firstName, lastName: s.lastName, email: s.email, phone: s.phone || '', department: s.department || '', section: s.section || '', year: s.year || '', semester: s.semester || '' }); setShowForm(true); };

  const handleSave = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    setSaving(true);
    try {
      if (editId) {
        await adminService.updateStudent(editId, form);
        setSuccess('Student updated.');
      } else {
        await adminService.createStudent(form);
        setSuccess('Student added.');
      }
      setShowForm(false);
      setEditId(null);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed.');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete ${name}?`)) return;
    try {
      await adminService.deleteStudent(id);
      setSuccess('Student deleted.');
      load();
    } catch { setError('Delete failed.'); }
  };

  const totalPages = Math.ceil(total / pageSize);

  // Group students by dept → section
  const grouped = students.reduce((acc, s) => {
    const dept = s.department || 'Unassigned';
    const sec  = s.section   || 'Unassigned';
    if (!acc[dept]) acc[dept] = {};
    if (!acc[dept][sec]) acc[dept][sec] = [];
    acc[dept][sec].push(s);
    return acc;
  }, {});

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title">Manage Students</h1>
          <p className="page-subtitle">Add, edit, and organise student records by department and section.</p>
        </div>
        <button onClick={openAdd} className="btn-primary"><Plus size={15} /> Add Student</button>
      </div>

      {success && <div className="alert-success mb-4 flex items-center gap-2"><CheckCircle2 size={15} /> {success}</div>}
      {error   && <div className="alert-error mb-4 flex items-center gap-2"><AlertCircle size={15} /> {error}</div>}

      {/* Filters */}
      <div className="card p-4 mb-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { key: 'department', label: 'Department', opts: filters.departments },
          { key: 'section',    label: 'Section',    opts: filters.sections },
          { key: 'year',       label: 'Year',       opts: filters.years },
          { key: 'semester',   label: 'Semester',   opts: filters.semesters },
        ].map(({ key, label, opts }) => (
          <div key={key}>
            <label className="label">{label}</label>
            <select className="input" value={query[key]} onChange={e => { setQuery(q => ({ ...q, [key]: e.target.value })); setPage(1); }}>
              <option value="">All</option>
              {opts.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        ))}
      </div>

      {/* Add / Edit Form */}
      {showForm && (
        <form onSubmit={handleSave} className="card p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-200">{editId ? 'Edit Student' : 'Add New Student'}</h2>
            <button type="button" onClick={() => setShowForm(false)}><X size={16} className="text-gray-400 hover:text-gray-600" /></button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { key: 'rollNumber',  label: 'Roll Number', required: true },
              { key: 'firstName',   label: 'First Name',  required: true },
              { key: 'lastName',    label: 'Last Name',   required: true },
              { key: 'email',       label: 'Email',       required: true, type: 'email' },
              { key: 'phone',       label: 'Phone' },
              { key: 'department',  label: 'Department' },
              { key: 'section',     label: 'Section' },
              { key: 'year',        label: 'Year' },
              { key: 'semester',    label: 'Semester' },
            ].map(({ key, label, required, type }) => (
              <div key={key}>
                <label className="label">{label}{required && ' *'}</label>
                <input
                  className="input"
                  type={type || 'text'}
                  required={required}
                  value={form[key]}
                  onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  disabled={editId && key === 'rollNumber'}
                />
              </div>
            ))}
          </div>
          <div className="flex gap-3 justify-end mt-4">
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? <Loader size={14} className="animate-spin" /> : <Plus size={14} />} {editId ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-24"><Loader className="animate-spin text-indigo-600" size={28} /></div>
      ) : students.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-16 text-center">
          <p className="font-semibold text-gray-500">No students found.</p>
          <p className="text-sm text-gray-400 mt-1">Try adjusting filters or add a new student.</p>
        </div>
      ) : (
        <>
          {Object.entries(grouped).map(([dept, sections]) => (
            <div key={dept} className="mb-6">
              <h2 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-3 px-1">
                {dept}
              </h2>
              {Object.entries(sections).map(([sec, rows]) => (
                <div key={sec} className="mb-4">
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 px-1">
                    Section: {sec}
                  </p>
                  <div className="surface-raised rounded-2xl overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-800">
                          {['Roll No.', 'Name', 'Email', 'Year', 'Semester', 'Actions'].map((h, i) => (
                            <th key={h} className={`px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider ${i === 5 ? 'text-center' : 'text-left'}`}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {rows.map(s => (
                          <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
                            <td className="px-4 py-3 text-sm font-mono text-gray-600 dark:text-gray-400">{s.rollNumber}</td>
                            <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">{s.firstName} {s.lastName}</td>
                            <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{s.email}</td>
                            <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{s.year || '—'}</td>
                            <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{s.semester || '—'}</td>
                            <td className="px-4 py-3 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <button onClick={() => openEdit(s)} className="text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors"><Pencil size={14} /></button>
                                <button onClick={() => handleDelete(s.id, `${s.firstName} ${s.lastName}`)} className="text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors"><Trash2 size={14} /></button>
                              </div>
                            </td>
                          </tr>
                        ))}
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
                {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} of {total} students
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
