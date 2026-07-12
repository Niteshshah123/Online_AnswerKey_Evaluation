import React, { useState, useEffect } from 'react';
import { useEvaluationStore } from '../../store/evaluation.js';
import { useNavigate } from 'react-router-dom';
import { Save, Send, Loader, AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';

export default function EvaluationPanel({ answerSheetId, paper }) {
  const navigate = useNavigate();
  const { evaluation, saveDraft, submitEvaluation, isSaving, error, clearError } = useEvaluationStore();

  const [localMarks, setLocalMarks] = useState({});
  const [localRemarks, setLocalRemarks] = useState('');
  const [targetMarks, setTargetMarks] = useState('');
  const [convertedResult, setConvertedResult] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState('');

  const isReadOnly = evaluation?.status === 'SUBMITTED';
  const maxTotal = paper.exam.totalMarks;
  const totalObtained = Object.values(localMarks).reduce((s, v) => s + (parseFloat(v) || 0), 0);

  useEffect(() => {
    if (evaluation?.marks) {
      const map = {};
      evaluation.marks.forEach((m) => { map[m.questionId] = m.obtainedMarks; });
      setLocalMarks(map);
    }
    if (evaluation?.remarks) setLocalRemarks(evaluation.remarks);
    if (evaluation?.targetMarks) setTargetMarks(String(evaluation.targetMarks));
  }, [evaluation]);

  const handleMarkChange = (qId, value) => {
    const num = parseFloat(value) || 0;
    const q = paper.questions.find((q) => q.id === qId);
    const errs = { ...validationErrors };
    if (num > q.maxMarks) errs[qId] = `Max ${q.maxMarks}`;
    else if (num < 0) errs[qId] = 'Cannot be negative';
    else delete errs[qId];
    setValidationErrors(errs);
    setLocalMarks((prev) => ({ ...prev, [qId]: num }));
    setConvertedResult(null);
    clearError();
  };

  const handleConvert = () => {
    const target = parseFloat(targetMarks);
    if (!target || target <= 0) return;
    const converted = ((totalObtained / maxTotal) * target).toFixed(2);
    setConvertedResult({ obtained: totalObtained, outOf: maxTotal, target, converted });
  };

  const getMarksArray = () =>
    Object.entries(localMarks).map(([questionId, obtainedMarks]) => ({ questionId, obtainedMarks }));

  const hasErrors = Object.keys(validationErrors).length > 0;

  const handleSaveDraft = async () => {
    if (hasErrors) return;
    const result = await saveDraft(answerSheetId, getMarksArray(), localRemarks, parseFloat(targetMarks) || 0);
    if (result) { setSuccessMsg('Draft saved!'); setTimeout(() => setSuccessMsg(''), 3000); }
  };

  const handleSubmit = async () => {
    if (hasErrors) return;
    if (Object.keys(localMarks).length === 0) { alert('Please enter marks for at least one question'); return; }
    if (!window.confirm('Submit this evaluation? It cannot be edited after submission.')) return;
    const result = await submitEvaluation(answerSheetId, getMarksArray(), localRemarks, parseFloat(targetMarks) || 0);
    if (result) { setSuccessMsg('Submitted!'); setTimeout(() => navigate('/papers'), 2000); }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="shrink-0 px-5 py-4 bg-gray-50 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-800">
        <h2 className="font-bold text-gray-900 dark:text-white text-sm">Evaluation Panel</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          {paper.student.rollNumber} · {paper.exam.name}
        </p>
        {isReadOnly && (
          <span className="badge-green mt-2 inline-flex">
            <CheckCircle2 size={11} /> Submitted — Read Only
          </span>
        )}
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {successMsg && (
          <div className="alert-success"><CheckCircle2 size={15} /> {successMsg}</div>
        )}
        {error && (
          <div className="alert-error"><AlertCircle size={15} /> {error}</div>
        )}

        {/* Total indicator */}
        <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-indigo-50 dark:bg-indigo-950 border border-indigo-100 dark:border-indigo-800">
          <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">Total Obtained</span>
          <span className="text-lg font-bold text-indigo-800 dark:text-indigo-200">{totalObtained} / {maxTotal}</span>
        </div>

        {/* Questions */}
        <div className="space-y-2">
          {paper.questions.map((q) => {
            const val = localMarks[q.id] ?? '';
            const hasErr = validationErrors[q.id];
            return (
              <div
                key={q.id}
                className={`rounded-xl border p-3.5 transition-colors ${
                  hasErr
                    ? 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-950/20'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-indigo-300 dark:hover:border-indigo-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                    Question {q.questionNumber}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                    Max: {q.maxMarks}
                  </span>
                </div>
                <input
                  type="number"
                  min="0"
                  max={q.maxMarks}
                  value={val}
                  onChange={(e) => handleMarkChange(q.id, e.target.value)}
                  disabled={isReadOnly}
                  placeholder="Enter marks"
                  className="input"
                />
                {hasErr && <p className="text-xs text-red-600 dark:text-red-400 mt-1.5">{hasErr}</p>}
              </div>
            );
          })}
        </div>

        {/* Remarks */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
            Remarks (Optional)
          </label>
          <textarea
            value={localRemarks}
            onChange={(e) => setLocalRemarks(e.target.value)}
            disabled={isReadOnly}
            placeholder="Add feedback or remarks..."
            rows={3}
            className="input resize-none"
          />
        </div>

        {/* Mark Conversion */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/40 p-4">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
            Mark Conversion
          </p>

          <div className="flex items-center gap-2 mb-3">
            <div className="flex-1 text-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5">
              <p className="text-xs text-gray-400 dark:text-gray-500">Obtained</p>
              <p className="text-base font-bold text-gray-900 dark:text-white">{totalObtained}/{maxTotal}</p>
            </div>
            <span className="text-gray-400 dark:text-gray-600 text-xl font-light">→</span>
            <div className="flex-1">
              <input
                type="number"
                min="1"
                value={targetMarks}
                onChange={(e) => { setTargetMarks(e.target.value); setConvertedResult(null); }}
                disabled={isReadOnly}
                placeholder="Out of?"
                className="input text-center"
              />
              <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-1">Target</p>
            </div>
          </div>

          {!isReadOnly && (
            <button
              onClick={handleConvert}
              disabled={!targetMarks || parseFloat(targetMarks) <= 0}
              className="btn-primary w-full"
            >
              <RefreshCw size={14} /> Convert Marks
            </button>
          )}

          {convertedResult && (
            <div className="mt-3 bg-indigo-600 rounded-xl p-4 text-center text-white">
              <p className="text-xs opacity-75 mb-1">
                {convertedResult.obtained}/{convertedResult.outOf} → /{convertedResult.target}
              </p>
              <p className="text-4xl font-bold">{convertedResult.converted}</p>
              <p className="text-xs opacity-60 mt-1">out of {convertedResult.target}</p>
            </div>
          )}

          {evaluation?.totalConvertedMarks > 0 && !convertedResult && (
            <div className="mt-3 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950 p-3 text-center">
              <p className="text-xs text-emerald-600 dark:text-emerald-400 mb-0.5">Previously converted</p>
              <p className="text-xl font-bold text-emerald-700 dark:text-emerald-300">
                {evaluation.totalConvertedMarks} / {evaluation.targetMarks}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      {!isReadOnly && (
        <div className="shrink-0 px-5 py-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 space-y-2">
          <button onClick={handleSaveDraft} disabled={isSaving || hasErrors} className="btn-secondary w-full">
            {isSaving ? <Loader size={14} className="animate-spin" /> : <Save size={14} />}
            Save Draft
          </button>
          <button onClick={handleSubmit} disabled={isSaving || hasErrors} className="btn-primary w-full">
            {isSaving ? <Loader size={14} className="animate-spin" /> : <Send size={14} />}
            Submit Evaluation
          </button>
        </div>
      )}
    </div>
  );
}
