import React, { useEffect, useState } from 'react';
import { Loader, Plus, Trash2, AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';
import { adminService } from '../../services/index.js';

const ROLES = ['admin', 'teacher', 'student'];
const ROLE_CLS = {
  admin:   'badge-red',
  teacher: 'badge-blue',
  student: 'badge-green',
};

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({ email: '', password: '', displayName: '', role: 'teacher' });
  const [creating, setCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const load = () => {
    setIsLoading(true);
    adminService.listUsers()
      .then((res) => setUsers(res.data?.users || []))
      .catch(() => setError('Failed to load users'))
      .finally(() => setIsLoading(false));
  };

  useEffect(load, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    setCreating(true);
    try {
      await adminService.createUser(form.email, form.password, form.displayName, form.role);
      setSuccess('User created successfully.');
      setForm({ email: '', password: '', displayName: '', role: 'teacher' });
      setShowForm(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create user.');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (uid, email) => {
    if (!window.confirm(`Delete user ${email}?`)) return;
    try {
      await adminService.deleteUser(uid);
      setUsers((u) => u.filter((x) => x.uid !== uid));
      setSuccess('User deleted.');
    } catch {
      setError('Failed to delete user.');
    }
  };

  const handleRoleChange = async (uid, role) => {
    try {
      await adminService.setUserRole(uid, role);
      setUsers((u) => u.map((x) => x.uid === uid ? { ...x, role } : x));
    } catch {
      setError('Failed to update role.');
    }
  };

  const handleSync = async (email, displayName) => {
    try {
      const res = await adminService.syncTeacher(email, displayName);
      setSuccess(`${displayName || email} synced to faculty list.`);
    } catch {
      setError('Failed to sync teacher.');
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title">Manage Users</h1>
          <p className="page-subtitle">Create and manage teacher / admin / student accounts.</p>
        </div>
        <button onClick={() => setShowForm((v) => !v)} className="btn-primary">
          <Plus size={15} /> New User
        </button>
      </div>

      {success && <div className="alert-success mb-4 flex items-center gap-2"><CheckCircle2 size={15} /> {success}</div>}
      {error   && <div className="alert-error mb-4 flex items-center gap-2"><AlertCircle size={15} /> {error}</div>}

      {/* Create form */}
      {showForm && (
        <form onSubmit={handleCreate} className="card p-5 mb-6 grid grid-cols-2 gap-4">
          <div>
            <label className="label">Display Name</label>
            <input className="input" placeholder="Dr. Smith" value={form.displayName} onChange={(e) => setForm((f) => ({ ...f, displayName: e.target.value }))} />
          </div>
          <div>
            <label className="label">Email</label>
            <input className="input" type="email" required placeholder="user@college.edu" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
          </div>
          <div>
            <label className="label">Password</label>
            <input className="input" type="password" required minLength={6} placeholder="Min 6 chars" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} />
          </div>
          <div>
            <label className="label">Role</label>
            <select className="input" value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}>
              {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div className="col-span-2 flex gap-3 justify-end">
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={creating} className="btn-primary">
              {creating ? <Loader size={14} className="animate-spin" /> : <Plus size={14} />} Create
            </button>
          </div>
        </form>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-24"><Loader className="animate-spin text-indigo-600" size={28} /></div>
      ) : (
        <div className="surface-raised rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-800">
                {['Name / Email', 'Role', 'Created', 'Actions'].map((h, i) => (
                  <th key={h} className={`px-5 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider ${i === 3 ? 'text-center' : 'text-left'}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {users.map((u) => (
                <tr key={u.uid} className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
                  <td className="px-5 py-4">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{u.displayName || '—'}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">{u.email}</p>
                  </td>
                  <td className="px-5 py-4">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.uid, e.target.value)}
                      className="text-xs border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                    >
                      {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </td>
                  <td className="px-5 py-4 text-xs text-gray-400 dark:text-gray-500">
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-5 py-4 text-center">
                    <div className="flex items-center justify-center gap-3">
                      {u.role === 'teacher' && (
                        <button
                          onClick={() => handleSync(u.email, u.displayName)}
                          title="Sync to faculty list"
                          className="text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors"
                        >
                          <RefreshCw size={14} />
                        </button>
                      )}
                      <button onClick={() => handleDelete(u.uid, u.email)} className="text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
