import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePapersStore } from '../store/papers.js';
import { useEvaluationStore } from '../store/evaluation.js';
import { Loader, ArrowLeft } from 'lucide-react';
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
    const loadData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const paperData = await fetchPaperDetails(parseInt(answerSheetId));
        if (paperData) {
          setPaper(paperData);
          await fetchEvaluation(parseInt(answerSheetId));
        } else {
          setError('Paper not found');
        }
      } catch (err) {
        setError('Failed to load evaluation data');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();

    return () => {
      resetEvaluation();
    };
  }, [answerSheetId, fetchPaperDetails, fetchEvaluation, resetEvaluation]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  if (error || !paper) {
    return (
      <div className="space-y-6 p-8">
        <button
          onClick={() => navigate('/papers')}
          className="flex items-center gap-2 rounded-lg bg-gray-200 px-4 py-2 font-medium text-gray-700 hover:bg-gray-300 transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Papers
        </button>
        <div className="rounded-lg bg-red-50 p-6 text-red-700">
          <p className="font-medium">{error || 'Paper not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => navigate('/papers')}
            className="mb-4 flex items-center gap-2 rounded-lg bg-gray-200 px-4 py-2 font-medium text-gray-700 hover:bg-gray-300 transition-colors"
          >
            <ArrowLeft size={18} />
            Back
          </button>
          <h1 className="text-2xl font-bold text-gray-800">
            {paper.student.rollNumber} - {paper.student.firstName} {paper.student.lastName}
          </h1>
          <p className="mt-1 text-gray-600">{paper.exam.name}</p>
        </div>
      </div>

      {/* Main Layout - Three Columns */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:h-[calc(100vh-200px)]">
        {/* Left Column - Student Answer Sheet */}
        <div className="lg:col-span-4 rounded-lg border border-gray-200 bg-white overflow-hidden">
          <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
            <h2 className="font-semibold text-gray-800">Student Answer Sheet</h2>
          </div>
          <div className="overflow-auto h-full">
            {paper.answerSheetUrl ? (
              <PDFViewer url={paper.answerSheetUrl} />
            ) : (
              <div className="flex items-center justify-center p-6 text-gray-500">
                <p>PDF not available</p>
              </div>
            )}
          </div>
        </div>

        {/* Center Column - Answer Key */}
        <div className="lg:col-span-4 rounded-lg border border-gray-200 bg-white overflow-hidden">
          <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
            <h2 className="font-semibold text-gray-800">Official Answer Key</h2>
          </div>
          <div className="overflow-auto h-full">
            {paper.answerKeyUrl ? (
              <PDFViewer url={paper.answerKeyUrl} />
            ) : (
              <div className="flex items-center justify-center p-6 text-gray-500">
                <p>PDF not available</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Evaluation Panel */}
        <div className="lg:col-span-4 rounded-lg border border-gray-200 bg-white overflow-hidden">
          <EvaluationPanel
            answerSheetId={parseInt(answerSheetId)}
            paper={paper}
          />
        </div>
      </div>
    </div>
  );
}
