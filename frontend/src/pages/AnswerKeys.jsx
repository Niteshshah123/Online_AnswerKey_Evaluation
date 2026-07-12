import React, { useEffect, useState } from 'react';
import { Upload, CheckCircle2, Loader, KeyRound, FileText, AlertCircle } from 'lucide-react';
import apiClient from '../services/api.js';

export default function AnswerKeys() {
  const [exams, setExams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploading, setUploading] = useState(null);
  const [successId, setSuccessId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    apiClient.get('/answer-keys')
      .then((res) => setExams(res.data.data || []))
      .catch(() => setError('Failed to load exams'))
      .finally(() => setIsLoading(false));
  }, []);

  const handleUpload = async (examId, file) => {
    if (!file) return;
    if (file.type !== 'application/pdf') { setError('Only PDF files are allowed'); return; }
    setUploading(examId);
    setError('');
    const form = new FormData();
    form.append('answerKey', file);
    try {
      const res = await apiClient.post(`/answer-keys/${examId}/upload`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setExams((prev) => prev.map((e) => e.id === examId ? { ...e, answerKeyUrl: res.data.data.answerKeyUrl } : e));
      setSuccessId(examId);
      setTimeout(() => setSuccessId(null), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(null);
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="page-title">Answer Keys</h1>
        <p className="page-subtitle">Upload the official answer key PDF for each exam.</p>
      </div>

      {error && (
        <div className="alert-error mb-5">
          <AlertCircle size={16} className="shrink-0" /> {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <Loader className="animate-spin text-indigo-600" size={28} />
        </div>
      ) : exams.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-16 text-center">
          <KeyRound size={40} className="text-gray-300 dark:text-gray-700 mb-3" />
          <p className="font-semibold text-gray-600 dark:text-gray-400">No exams found</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Exams will appear here once created by admin.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {exams.map((exam) => (
            <div key={exam.id} className="card flex items-center gap-4">
              {/* Icon */}
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center shrink-0">
                <FileText size={18} className="text-indigo-600 dark:text-indigo-400" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm truncate">{exam.name}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                  {exam.code} · {exam.subject?.name}
                </p>
              </div>

              {/* Status + success */}
              <div className="flex items-center gap-3 shrink-0">
                {successId === exam.id && (
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">✓ Saved!</span>
                )}
                {exam.answerKeyUrl
                  ? <span className="badge-green"><CheckCircle2 size={12} /> Uploaded</span>
                  : <span className="badge-amber">No Key</span>
                }

                {/* Upload button */}
                <label className={`btn text-xs px-4 py-2 cursor-pointer ${
                  uploading === exam.id
                    ? 'btn-secondary opacity-60 cursor-not-allowed'
                    : exam.answerKeyUrl
                    ? 'btn-secondary'
                    : 'btn-primary'
                }`}>
                  {uploading === exam.id
                    ? <><Loader size={13} className="animate-spin" /> Uploading...</>
                    : <><Upload size={13} /> {exam.answerKeyUrl ? 'Replace' : 'Upload PDF'}</>
                  }
                  <input
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    disabled={uploading === exam.id}
                    onChange={(e) => handleUpload(exam.id, e.target.files[0])}
                  />
                </label>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
