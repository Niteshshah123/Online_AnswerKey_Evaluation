import React, { useState, useEffect } from 'react';
import { useEvaluationStore } from '../../store/evaluation.js';
import { useNavigate } from 'react-router-dom';
import { convertMarks } from '../../utils/index.js';
import { Save, Send, Loader, AlertCircle } from 'lucide-react';

export default function EvaluationPanel({ answerSheetId, paper }) {
  const navigate = useNavigate();
  const {
    evaluation,
    marks,
    remarks,
    setMarks,
    setRemark,
    saveDraft,
    submitEvaluation,
    isSaving,
    error,
    clearError,
    totalObtained,
    totalConverted,
  } = useEvaluationStore();

  const [localMarks, setLocalMarks] = useState({});
  const [localRemarks, setLocalRemarks] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (evaluation && evaluation.marks) {
      const marksMap = {};
      evaluation.marks.forEach((mark) => {
        marksMap[mark.questionId] = mark.obtainedMarks;
      });
      setLocalMarks(marksMap);
    }
    if (evaluation && evaluation.remarks) {
      setLocalRemarks(evaluation.remarks);
    }
  }, [evaluation]);

  const handleMarkChange = (questionId, value) => {
    const numValue = parseFloat(value) || 0;
    const question = paper.questions.find((q) => q.id === questionId);

    // Validation
    const errors = { ...validationErrors };

    if (numValue > question.maxMarks) {
      errors[questionId] = `Cannot exceed maximum marks (${question.maxMarks})`;
    } else if (numValue < 0) {
      errors[questionId] = 'Marks cannot be negative';
    } else {
      delete errors[questionId];
    }

    setValidationErrors(errors);
    setLocalMarks({ ...localMarks, [questionId]: numValue });
    clearError();
  };

  const calculateTotals = () => {
    let totalObt = 0;
    let totalConv = 0;

    Object.entries(localMarks).forEach(([questionId, marks]) => {
      totalObt += marks;
      const converted = convertMarks(
        marks,
        paper.subject.maxMarks,
        paper.subject.targetMarks,
      );
      totalConv += converted;
    });

    return {
      obtained: Math.round(totalObt * 100) / 100,
      converted: Math.round(totalConv * 100) / 100,
    };
  };

  const totals = calculateTotals();

  const getMarksArray = () => {
    return Object.entries(localMarks).map(([questionId, obtainedMarks]) => ({
      questionId: parseInt(questionId),
      obtainedMarks,
    }));
  };

  const handleSaveDraft = async () => {
    if (Object.keys(validationErrors).length > 0) {
      alert('Please fix validation errors before saving');
      return;
    }

    const marksArray = getMarksArray();
    const result = await saveDraft(answerSheetId, marksArray, localRemarks);

    if (result) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const handleSubmit = async () => {
    if (Object.keys(validationErrors).length > 0) {
      alert('Please fix validation errors before submitting');
      return;
    }

    if (Object.keys(localMarks).length === 0) {
      alert('Please enter marks for at least one question');
      return;
    }

    if (window.confirm('Are you sure you want to submit this evaluation? It cannot be edited after submission.')) {
      const marksArray = getMarksArray();
      const result = await submitEvaluation(answerSheetId, marksArray, localRemarks);

      if (result) {
        setShowSuccess(true);
        setTimeout(() => {
          navigate('/papers');
        }, 2000);
      }
    }
  };

  const isReadOnly = evaluation?.status === 'SUBMITTED';

  return (
    <div className="flex h-full flex-col bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
        <h2 className="font-semibold text-gray-800">Evaluation Panel</h2>
        {isReadOnly && (
          <p className="mt-1 text-sm text-orange-600 font-medium">
            This evaluation is submitted and read-only
          </p>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Success Message */}
        {showSuccess && (
          <div className="rounded-lg bg-green-50 p-3 text-green-700 text-sm font-medium flex items-center gap-2">
            <span>✓</span>
            {evaluation?.status === 'SUBMITTED' ? 'Evaluation submitted successfully!' : 'Draft saved successfully!'}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-red-700 text-sm font-medium flex items-center gap-2">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {/* Questions */}
        <div className="space-y-3">
          {paper.questions.map((question) => {
            const currentMarks = localMarks[question.id] || 0;
            const convertedMarks = convertMarks(
              currentMarks,
              paper.subject.maxMarks,
              paper.subject.targetMarks,
            );
            const hasError = validationErrors[question.id];

            return (
              <div
                key={question.id}
                className={`rounded-lg border p-3 transition-colors ${
                  hasError
                    ? 'border-red-300 bg-red-50'
                    : 'border-gray-200 bg-white hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-gray-800">Q{question.questionNumber}</p>
                  <p className="text-sm text-gray-500">Max: {question.maxMarks}</p>
                </div>

                <div className="space-y-2">
                  <input
                    type="number"
                    min="0"
                    max={question.maxMarks}
                    value={currentMarks}
                    onChange={(e) => handleMarkChange(question.id, e.target.value)}
                    disabled={isReadOnly}
                    placeholder="Enter marks"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />

                  {hasError && (
                    <p className="text-xs text-red-600 font-medium">{hasError}</p>
                  )}

                  {currentMarks > 0 && !hasError && (
                    <div className="flex justify-between text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">
                      <span>Obtained: {currentMarks}</span>
                      <span>Converted: {convertedMarks}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Remarks */}
        <div className="border-t border-gray-200 pt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Remarks (Optional)
          </label>
          <textarea
            value={localRemarks}
            onChange={(e) => setLocalRemarks(e.target.value)}
            disabled={isReadOnly}
            placeholder="Add any remarks or feedback..."
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed h-20 resize-none"
          />
        </div>
      </div>

      {/* Totals */}
      <div className="border-t border-gray-200 bg-gray-50 p-4 space-y-3">
        <div className="rounded-lg bg-blue-50 p-3 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-700">Original Marks:</span>
            <span className="font-bold text-gray-800">{totals.obtained}/{paper.subject.maxMarks}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-700">Converted Marks:</span>
            <span className="font-bold text-blue-600">{totals.converted}/{paper.subject.targetMarks}</span>
          </div>
        </div>

        {/* Buttons */}
        {!isReadOnly && (
          <div className="space-y-2">
            <button
              onClick={handleSaveDraft}
              disabled={isSaving}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-100 px-4 py-2 font-medium text-blue-700 hover:bg-blue-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? <Loader size={16} className="animate-spin" /> : <Save size={16} />}
              Save Draft
            </button>

            <button
              onClick={handleSubmit}
              disabled={isSaving}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? <Loader size={16} className="animate-spin" /> : <Send size={16} />}
              Submit Evaluation
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
