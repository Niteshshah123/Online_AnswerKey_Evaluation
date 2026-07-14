import React, { useEffect, useState } from 'react';
import { Upload, Loader, CheckCircle2, AlertCircle, FileText, RefreshCw } from 'lucide-react';
import { adminService } from '../../services/index.js';

export default function UploadSheets() {
  const [students, setStudents] = useState([]);
  const [exams, setExams] = useState([]);
  const [teachers, setTeachers] = useState([]);  // Firebase users with role=teacher
  const [isLoadingData, setIsLoadingData] = useState(true);

  const [form, setForm] = useState({ studentId: '', examId: '', teacherEmail: '' });
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const loadData = () => {
    setIsLoadingData(true);
    Promise.all([
      adminService.listStudents({ pageSize: 200 }),
      adminService.listExams(),
      adminService.listUsers(),
    ])
      .then(([s, e, u]) => {
        setStudents(s.data?.data || s.data || []);
        setExams(e.data || []);
        // Filter only teachers from Firebase users
        const allUsers = u.data?.users || u.users || [];
        setTeachers(allUsers.filter(u => u.role === 'teacher'));
      })
      .catch(() => setError('Failed to load data'))
      .finally(() => setIsLoadingData(false));
  };

  useEffect(() => { loadData(); }, []);

  // Sync selected teacher to Faculty table, then submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!form.studentId || !form.examId || !form.teacherEmail) {
      setError('Please select student, exam, and teacher.');
      return;
    }
    if (!file) {
      setError('Please select a PDF file.');
      return;
    }
    setUploading(true);
    try {
      // Find selected teacher
      const teacher = teachers.find(t => t.email === form.teacherEmail);
      // Auto-sync teacher to Faculty table to get their MongoDB id
      const syncRes = await adminService.syncTeacher(teacher.email, teacher.displayName);
      const facultyId = (syncRes.data || syncRes).id;

      const fd = new FormData();
      fd.append('answerSheet', file);
      fd.append('studentId', form.studentId);
      fd.append('examId', form.examId);
      fd.append('facultyId', facultyId);
      await adminService.uploadSheet(fd);
      setSuccess('Answer sheet uploaded and assigned successfully!');
      setForm({ studentId: '', examId: '', teacherEmail: '' });
      setFile(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  if (isLoadingData) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader className="animate-spin text-indigo-600" size={28} />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="page-title">Upload Answer Sheets</h1>
        <p className="page-subtitle">Upload a student's answer sheet PDF and assign it to a teacher for evaluation.</p>
      </div>

      {success && (
        <div className="alert-success mb-5 flex items-center gap-2">
          <CheckCircle2 size={16} /> {success}
        </div>
      )}
      {error && (
        <div className="alert-error mb-5 flex items-center gap-2">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card p-6 space-y-5">
        {/* Student */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
            Student
          </label>
          <select
            value={form.studentId}
            onChange={(e) => setForm((f) => ({ ...f, studentId: e.target.value }))}
            className="input"
            required
          >
            <option value="">Select student...</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.rollNumber} — {s.firstName} {s.lastName}
                {s.department ? ` (${s.department}${s.section ? ', Sec ' + s.section : ''})` : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Exam */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
            Exam
          </label>
          <select
            value={form.examId}
            onChange={(e) => setForm((f) => ({ ...f, examId: e.target.value }))}
            className="input"
            required
          >
            <option value="">Select exam...</option>
            {exams.map((ex) => (
              <option key={ex.id} value={ex.id}>
                {ex.name} — {ex.subject?.name} ({ex.code})
              </option>
            ))}
          </select>
        </div>

        {/* Assign to Teacher */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
            Assign to Teacher
          </label>
          {teachers.length === 0 ? (
            <p className="text-sm text-amber-500">No teacher accounts found. Create a teacher in Manage Users first.</p>
          ) : (
            <select
              value={form.teacherEmail}
              onChange={(e) => setForm((f) => ({ ...f, teacherEmail: e.target.value }))}
              className="input"
              required
            >
              <option value="">Select teacher...</option>
              {teachers.map((t) => (
                <option key={t.uid} value={t.email}>
                  {t.displayName || t.email}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* PDF Upload */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
            Answer Sheet PDF
          </label>
          <label className="flex items-center gap-3 p-4 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-indigo-400 dark:hover:border-indigo-500 cursor-pointer transition-colors">
            <FileText size={20} className="text-gray-400 shrink-0" />
            <span className="text-sm text-gray-500 dark:text-gray-400 flex-1 truncate">
              {file ? file.name : 'Click to select PDF...'}
            </span>
            <input
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => setFile(e.target.files[0] || null)}
            />
          </label>
        </div>

        <button type="submit" disabled={uploading} className="btn-primary w-full">
          {uploading
            ? <><Loader size={15} className="animate-spin" /> Uploading...</>
            : <><Upload size={15} /> Upload & Assign</>
          }
        </button>
      </form>
    </div>
  );
}
