import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePapersStore } from '../store/papers.js';
import { useEvaluationStore } from '../store/evaluation.js';
import { Loader, ArrowLeft, AlertTriangle } from 'lucide-react';
import PDFViewer from '../components/pdf/PDFViewer.jsx';
import EvaluationPanel from '../components/evaluation/EvaluationPanel.jsx';

export default function Evaluation() {
  const { answerSheetId } = useParams();
  const navigate = useNavigate();
  const { fetchPaperDetails } = usePapersStore();
  const { fetchEvaluation, resetEvaluation } = useEvaluationStore();
  const [paper, setPaper] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const data = await fetchPaperDetails(answerSheetId);
        if (data) { setPaper(data); await fetchEvaluation(answerSheetId); }
        else setError('Paper not found');
      } catch { setError('Failed to load evaluation data'); }
      finally { setIsLoading(false); }
    };
    load();
    return () => resetEvaluation();
  }, [answerSheetId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader className="animate-spin text-indigo-600" size={28} />
      </div>
    );
  }

  if (error || !paper) {
    return (
      <div className="p-8">
        <button onClick={() => navigate('/papers')} className="btn-ghost mb-6 -ml-2">
          <ArrowLeft size={16} /> Back to Papers
        </button>
        <div className="alert-error">
          <AlertTriangle size={18} className="shrink-0" />
          <p className="font-medium">{error || 'Paper not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Top bar */}
      <div className="shrink-0 flex items-center gap-3 px-5 py-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <button onClick={() => navigate('/papers')} className="btn-ghost py-1.5 px-2 text-xs -ml-1">
          <ArrowLeft size={15} /> Back
        </button>
        <div className="w-px h-5 bg-gray-200 dark:bg-gray-700" />
        <div className="flex-1 min-w-0">
          <span className="font-semibold text-gray-900 dark:text-white text-sm">
            {paper.student.rollNumber} — {paper.student.firstName} {paper.student.lastName}
          </span>
          <span className="text-gray-400 dark:text-gray-500 text-sm ml-2">· {paper.exam.name}</span>
        </div>
        <span className="badge-blue shrink-0">Total: {paper.exam.totalMarks} marks</span>
      </div>

      {/* 3-column layout */}
      <div className="flex-1 grid grid-cols-12 overflow-hidden">
        {/* Student Answer Sheet */}
        <div className="col-span-4 flex flex-col border-r border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="shrink-0 px-4 py-2.5 bg-gray-50 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-800">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Student Answer Sheet
            </p>
          </div>
          <div className="flex-1 overflow-hidden bg-gray-100 dark:bg-gray-900">
            {paper.answerSheetUrl
              ? <PDFViewer url={paper.answerSheetUrl} />
              : <EmptyPDF label="No answer sheet available" />
            }
          </div>
        </div>

        {/* Answer Key */}
        <div className="col-span-4 flex flex-col border-r border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="shrink-0 px-4 py-2.5 bg-gray-50 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-800">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Answer Key
            </p>
          </div>
          <div className="flex-1 overflow-hidden bg-gray-100 dark:bg-gray-900">
            {paper.answerKeyUrl
              ? <PDFViewer url={paper.answerKeyUrl} />
              : (
                <EmptyPDF label="No answer key uploaded">
                  <a href="/answer-keys" className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline mt-1">
                    Upload one →
                  </a>
                </EmptyPDF>
              )
            }
          </div>
        </div>

        {/* Evaluation Panel */}
        <div className="col-span-4 flex flex-col overflow-hidden bg-white dark:bg-gray-900">
          <EvaluationPanel answerSheetId={answerSheetId} paper={paper} />
        </div>
      </div>
    </div>
  );
}

function EmptyPDF({ label, children }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-1 text-gray-400 dark:text-gray-600">
      <p className="text-sm">{label}</p>
      {children}
    </div>
  );
}
